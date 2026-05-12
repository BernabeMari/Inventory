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
    $items = Item::with(['quantities', 'issuances', 'history'])->get();

    // Skip filtering if start_date > end_date
    $shouldFilterByDate = $request->start_date && $request->end_date && $request->start_date <= $request->end_date;
    $startDateTime = $request->start_date ? $request->start_date . ' 00:00:00' : null;
    $endDateTime = $request->end_date ? $request->end_date . ' 23:59:59' : null;

    // Calculate beginning inventory from history and filter movements within the range
    if ($shouldFilterByDate) {
        $items = $items->map(function ($item) use ($startDateTime, $endDateTime) {
            // Beginning inventory: the latest history record at or before the start date
            $historyBeforeOrAtStart = $item->history
                ->where('created_at', '<=', $startDateTime)
                ->sortByDesc('created_at')
                ->sortByDesc('id')
                ->first();

            $beginningInventory = (int) ($historyBeforeOrAtStart?->beginning_inventory ?? 0);
            $item->setAttribute('beginning_inventory', $beginningInventory);

            // History records within the selected range (ascending)
            $historyInRange = $item->history
                ->where('created_at', '>=', $startDateTime)
                ->where('created_at', '<=', $endDateTime)
                ->sortBy('created_at')
                ->values();

            // Quantities (receipts) and Issuances within the selected range
            $receiptsInRange = $item->quantities
                ->where('created_at', '>=', $startDateTime)
                ->where('created_at', '<=', $endDateTime)
                ->values();

            $issuancesInRange = $item->issuances
                ->where('created_at', '>=', $startDateTime)
                ->where('created_at', '<=', $endDateTime)
                ->values();

            $receiptsSum = $receiptsInRange->sum('quantity');
            $issuancesSum = $issuancesInRange->sum('fulfilled_quantity');

            // Total calculation:
            // - If there is a history record inside the range, start from the first recorded total
            //   within the range, then add receipts that happened after that history record (but still within range).
            // - Otherwise, start from beginning inventory and add all receipts within the range.
            $firstHistoryInRange = $historyInRange->first();

            if ($firstHistoryInRange) {
                $baseTotal = (int) ($firstHistoryInRange->total ?? 0);

                // receipts after the first history record within the range
                $receiptsAfterFirstHistory = $receiptsInRange->where('created_at', '>', $firstHistoryInRange->created_at)->sum('quantity');
                $total = $baseTotal + $receiptsAfterFirstHistory;
            } else {
                $total = $beginningInventory + $receiptsSum;
            }

            $endingBalance = max($total - $issuancesSum, 0);

            // Set filtered lists and computed attributes for downstream use (PDF/CSV/UI)
            $item->quantities = $receiptsInRange;
            $item->issuances = $issuancesInRange;

            $item->setAttribute('added_receipt', $receiptsSum);
            $item->setAttribute('total', $total);
            $item->setAttribute('less', $issuancesSum);
            $item->setAttribute('ending_balance', $endingBalance);

            return $item;
        });
    } else {
        // No date filter: use most recent history and all movements
        $items = $items->map(function ($item) {
            $history = $item->history->sortByDesc('created_at')->sortByDesc('id')->first();

            $beginningInventory = (int) ($history?->beginning_inventory ?? 0);
            $receiptsSum = $item->quantities->sum('quantity');
            $issuancesSum = $item->issuances->sum('fulfilled_quantity');
            $total = $beginningInventory + $receiptsSum;

            $item->setAttribute('beginning_inventory', $beginningInventory);
            $item->setAttribute('added_receipt', $receiptsSum);
            $item->setAttribute('total', $total);
            $item->setAttribute('less', $issuancesSum);
            $item->setAttribute('ending_balance', max($total - $issuancesSum, 0));

            $item->quantities = $item->quantities->sortByDesc('created_at')->values();
            $item->issuances = $item->issuances->sortByDesc('created_at')->values();

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
       // Set dates to today if not provided
       if (!$request->start_date) {
           $request->merge(['start_date' => now()->toDateString()]);
       }
       if (!$request->end_date) {
           $request->merge(['end_date' => now()->toDateString()]);
       }

       // Validate dates
       if ($request->start_date > $request->end_date) {
           return back()->with('error', 'Start date cannot be greater than end date.');
       }

       $items = $this->buildReportItems($request)->map(function ($item) {
            // Prefer computed attributes from buildReportItems when available
            $receipts = $item->added_receipt ?? $item->quantities->sum('quantity');
            $issuances = $item->less ?? $item->issuances->sum('fulfilled_quantity');
            $total = $item->total ?? (($item->beginning_inventory ?? 0) + $receipts);

            $item->setAttribute('added_receipt', $receipts);
            $item->setAttribute('total', $total);
            $item->setAttribute('less', $issuances);
            $item->setAttribute('ending_balance', max($total - $issuances, 0));

            return $item;
        });

       // Filter by description if search term provided
       if (filled($request->search)) {
           $items = $items->filter(function ($item) use ($request) {
               return stripos($item->description, $request->search) !== false;
           })->values();
       }

       return inertia('Head/Report', [
           'items' => $items,
           'start_date' => $request->start_date,
           'end_date' => $request->end_date,
       ]);
    }


    public function downloadReportPdf(Request $httpRequest){
        // Set dates to today if not provided
        if (!$httpRequest->start_date) {
            $httpRequest->merge(['start_date' => now()->toDateString()]);
        }
        if (!$httpRequest->end_date) {
            $httpRequest->merge(['end_date' => now()->toDateString()]);
        }

        // Validate dates
        if ($httpRequest->start_date > $httpRequest->end_date) {
            return back()->with('error', 'Start date cannot be greater than end date.');
        }

        $items = $this->buildReportItems($httpRequest);
        
        $pdf = Pdf::loadView('pdf.report', [
            'items' => $items,
            'startDate' => $httpRequest->start_date,
            'endDate' => $httpRequest->end_date,
        ]);

        return $pdf->stream('report_' . now()->format('Y-m-d_H-i-s') . '.pdf');
    }

    public function downloadReportSpreadsheet(Request $request)
    {
        // Set dates to today if not provided
        if (!$request->start_date) {
            $request->merge(['start_date' => now()->toDateString()]);
        }
        if (!$request->end_date) {
            $request->merge(['end_date' => now()->toDateString()]);
        }

        // Validate dates
        if ($request->start_date > $request->end_date) {
            return back()->with('error', 'Start date cannot be greater than end date.');
        }

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
                $receipts = $item->added_receipt ?? $item->quantities->sum('quantity') ?? 0;
                $issuances = $item->less ?? $item->issuances->sum('fulfilled_quantity') ?? 0;
                $total = $item->total ?? ($beginningInventory + $receipts);
                $endingBalance = $item->ending_balance ?? ($total - $issuances);

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
