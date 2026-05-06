<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\History;
use App\Models\Issuance;
use App\Models\Item;
use App\Models\Request as ModelsRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class HeadController extends Controller
{
    private function buildReportItems(Request $request)
    {
        $items = Item::with(['issuances', 'quantities', 'history' => function ($query) use ($request){
            if($request->start_date && $request->end_date){
                $query->whereBetween('created_at', [
                    $request->start_date . ' 00:00:00',
                    $request->end_date . ' 23:59:59',
                ]);
            }
        }]);

        if($request->start_date && $request->end_date){
            $items->whereHas('history', function ($query) use ($request) {
                $query->whereBetween('created_at', [
                    $request->start_date . ' 00:00:00',
                    $request->end_date . ' 23:59:59',
                ]);
            });
        }

        if(filled($request->search)){
            $items->where(function($q) use ($request) {
                $q->where('description', 'like', '%' . $request->search . '%')
                  ->orWhere('unit_of_measure', 'like', '%' . $request->search . '%');
            });
        }

        return $items->get();
    }

    public function headPage(){
        $requests = ModelsRequest::all();
        $issuances = Issuance::all();

        $statusChartData = [
            'Pending' => $requests->where('status', 'pending')->count(),
            'Approved' => $requests->where('status', 'approved')->count(),
            'Rejected' => $requests->where('status', 'rejected')->count(),
        ];
        

        $fulfilledQuantity = $issuances->sum('fulfilled_quantity');
        $unfulfilledQuantity = $issuances->sum('unfulfilled_quantity');

        $quantityChartData = [
            'Fulfilled' => $fulfilledQuantity,
            'Unfulfilled' => $unfulfilledQuantity,
        ];
        

        $departmentCounts = ModelsRequest::with('user')
            ->get()
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
                'requests' => $count
            ];
        }

        return inertia('Head/Graphs', [
            'statusChartData' => $statusChartData,
            'quantityChartData' => $quantityChartData,
            'departmentChartData' => $departmentChartData,
        ]);
    }

    public function dashboard(){
        $requests = ModelsRequest::all();

        $chartData = $requests->groupBy('status')->map(function ($items, $key) {
            return [
                'name' => $key,
                'value' => count($items)
            ];
        })->values();

        return inertia('Dashboard', [
            'chartData' => $chartData
        ]);
    }

    public function headReportPage(Request $request){
        $items = $this->buildReportItems($request);
            
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
