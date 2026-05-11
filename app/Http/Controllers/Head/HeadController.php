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
   $history = Item::with(['quantities' => function ($query) use ($request) {

    if ($request->start_date && $request->end_date) {
        $query->whereBetween('created_at', [
            $request->start_date,
            $request->end_date
        ]);
    }

}]);

    return $history->get();
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
       $items = Item::withSum(['quantities as total_quantity' => function ($q) use ($request) {
        if ($request->start_date && $request->end_date) {
            $q->whereDate('created_at', '<', $request->end_date);
        }
    }], 'quantity')
    ->withSum(['issuances as total_issued' => function ($q) use ($request) {
        if ($request->start_date && $request->end_date) {
            $q->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }
    }], 'fulfilled_quantity')
    ->get();

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
                $histories = collect($item->history ?? []);
                if ($histories->isEmpty()) {
                    continue;
                }

                $grouped = $histories->reduce(function ($acc, $history) {
                    if (! isset($acc[$history->item_id])) {
                        $acc[$history->item_id] = [
                            'item_id' => $history->item_id,
                            'unit_of_measure' => $history->unit_of_measure,
                            'total' => 0,
                            'less' => 0,
                            'add_receipts' => [],
                        ];
                    }

                    $acc[$history->item_id]['total'] += $history->total ?? 0;
                    $acc[$history->item_id]['less'] += $history->less ?? 0;
                    $receipts = is_array($history->add_receipts) ? $history->add_receipts : [];
                    $acc[$history->item_id]['add_receipts'] = array_merge($acc[$history->item_id]['add_receipts'], $receipts);

                    return $acc;
                }, []);

                $firstHistory = $histories->first();
                $beginningInventory = $firstHistory?->beginning_inventory ?? 0;

                foreach ($grouped as $history) {
                    fputcsv($output, [
                        $history['item_id'],
                        $item->description,
                        $history['unit_of_measure'],
                        $beginningInventory,
                        implode(' + ', $history['add_receipts']) ?: '0',
                        $history['total'],
                        $history['less'],
                        $history['total'] - $history['less'],
                    ]);
                }
            }

            fclose($output);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
