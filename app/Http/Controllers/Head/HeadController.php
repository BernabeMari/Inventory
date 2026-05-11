<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\History;
use App\Models\Issuance;
use App\Models\Item;
use App\Models\Quantity;
use App\Models\Request as ModelsRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class HeadController extends Controller
{
    private function buildGraphData(Request $request): array
    {
        $requestQuery = ModelsRequest::query();
        $issuanceQuery = Issuance::query();

        if ($request->start_date && $request->end_date) {
            $startDateTime = $request->start_date . ' 00:00:00';
            $endDateTime = $request->end_date . ' 23:59:59';

            $requestQuery->where('created_at', '>=', $startDateTime)->where('created_at', '<=', $endDateTime);
            $issuanceQuery->where('created_at', '>=', $startDateTime)->where('created_at', '<=', $endDateTime);
        }

        $requests = $requestQuery->get();
        $issuances = $issuanceQuery->get();
        $items = Item::all();

        $statusChartData = [
            'Pending' => $requests->where('status', 'pending')->count(),
            'Accepted' => $requests->where('status', 'approved')->count(),
            'Rejected' => $requests->where('status', 'rejected')->count(),
            'Cancelled' => $requests->where('status', 'cancelled')->count(),
            'On-Hold' => $requests->where('status', 'on-hold')->count(),
            'for-pickup' => $requests->where('status', 'for-pickup')->count(),
        ];

        $fulfilledQuantity = $issuances->sum('fulfilled_quantity');
        $unfulfilledQuantity = $issuances->sum('unfulfilled_quantity');

        $quantityChartData = [
            'Fulfilled' => $fulfilledQuantity,
            'Unfulfilled' => $unfulfilledQuantity,
        ];

        $departmentCounts = $requests
            ->loadMissing('user')
            ->groupBy(function ($request) {
                return $request->user->department ?? 'Unknown';
            })
            ->map(function ($group) {
                return $group->sum(function ($request) {
                    return is_array($request->item) ? count($request->item) : 0;
                });
            })
            ->sortDesc()
            ->toArray();

        $departmentChartData = [];
        foreach ($departmentCounts as $department => $count) {
            $departmentChartData[] = [
                'name' => $department,
                'requests' => $count,
            ];
        }

        $itemsChartData = [];
        foreach ($items as $item) {
            $itemsChartData[] = [
                'name' => $item->description,
                'value' =>  $item->quantities()->sum('quantity') -
                            $item->issuances()->sum('fulfilled_quantity'),
            ];
        }

        return [
            'statusChartData' => $statusChartData,
            'quantityChartData' => $quantityChartData,
            'departmentChartData' => $departmentChartData,
            'itemsChartData' => $itemsChartData,
        ];
    }

    private function buildReportItems(Request $request)
{
   $items = Item::with(['quantities', 'issuances'])->get();

    // Calculate beginning inventory and filter receipts/issuances by date
    if ($request->start_date && $request->end_date) {
        $startDateTime = $request->start_date . ' 00:00:00';
        $endDateTime = $request->end_date . ' 23:59:59';

        $items = $items->map(function ($item) use ($startDateTime, $endDateTime) {
            // Beginning inventory: all quantities and issuances before the start date
            $beginningQuantities = $item->quantities
                ->where('created_at', '<', $startDateTime)
                ->sum('quantity');
            
            $beginningIssuances = $item->issuances
                ->where('created_at', '<', $startDateTime)
                ->sum('fulfilled_quantity');

            $item->beginning_inventory = max($beginningQuantities - $beginningIssuances, 0);

            // Filter quantities within the date range
            $item->quantities = $item->quantities->whereBetween('created_at', [$startDateTime, $endDateTime])->values();

            // Filter issuances within the date range
            $item->issuances = $item->issuances->whereBetween('created_at', [$startDateTime, $endDateTime])->values();

            return $item;
        });
    } else {
        $items = $items->map(function ($item) {
            $item->beginning_inventory = $item->quantities->sum('quantity') - $item->issuances->sum('fulfilled_quantity');
            return $item;
        });
    }

    return $items;
}

    public function headPage(Request $request){
        $graphData = $this->buildGraphData($request);

        return inertia('Head/Graphs', $graphData);
    }

    public function dashboard(Request $request){
        $graphData = $this->buildGraphData($request);

        return inertia('Head/Graphs', $graphData);
    }

    public function headReportPage(Request $request){
       $items = $this->buildReportItems($request)->map(function ($item) {
            $receipts = $item->quantities->sum('quantity');
            $issuances = $item->issuances->sum('fulfilled_quantity');
            $total = $item->beginning_inventory + $receipts;

            $item->setAttribute('added_receipt', $receipts);
            $item->setAttribute('total', $total);
            $item->setAttribute('less', $issuances);
            $item->setAttribute('ending_balance', max($total - $issuances, 0));

            return $item;
        });

       return inertia('Head/Report', ['items' => $items]);
    }


    public function downloadReportPdf(Request $httpRequest){
        $items = $this->buildReportItems($httpRequest);
        
        $pdf = Pdf::loadView('pdf.report', compact('items'));

        return $pdf->stream('report_' . now()->format('Y-m-d_H-i-s') . '.pdf');
    }

    public function downloadReportSpreadsheet(Request $request)
    {
        $items = $this->buildReportItems($request);
        $filename = 'report_' . now()->format('Y-m-d_H-i-s') . '.csv';

        return response()->streamDownload(function () use ($items) {
            $output = fopen('php://output', 'w');

            fputcsv($output, [
                'ITEM NO.',
                'DESCRIPTION',
                'UNIT OF MEASURE',
                'BEGINNING INVENTORY',
                'ADD: RECEIPTS',
                'TOTAL',
                'LESS: ISSUANCE',
                'ENDING BALANCE',
            ]);

            foreach ($items as $item) {
                $beginningInventory = $item->beginning_inventory ?? 0;
                $receipts = $item->quantities->sum('quantity') ?? 0;
                $issuances = $item->issuances->sum('fulfilled_quantity') ?? 0;
                $total = $beginningInventory + $receipts;
                $endingBalance = $total - $issuances;

                fputcsv($output, [
                    $item->id,
                    $item->description,
                    $item->unit_of_measure,
                    $beginningInventory,
                    $receipts ?: '0',
                    $total,
                    $issuances,
                    max($endingBalance, 0),
                ]);
            }

            fclose($output);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
