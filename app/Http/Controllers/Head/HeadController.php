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
        $items = Item::with(['issuances', 'quantities', 'history' => function ($query) use ($request){
            if($request->start_date && $request->end_date){
                $query->whereBetween('created_at', [
                    $request->start_date . ' 00:00:00',
                    $request->end_date . ' 23:59:59',
                ]);
            }
        }]);

        // Filter items to only those with history in the date range
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

        
        $items = $items->get();
            
        return inertia('Head/Report', ['items' => $items]);
        
    }


    public function downloadReportPdf(Request $httpRequest){
        $items = Item::with(['issuances', 'quantities', 'history' => function ($query) use ($httpRequest){
            if($httpRequest->start_date && $httpRequest->end_date){
                $query->whereBetween('created_at', [
                    $httpRequest->start_date . ' 00:00:00',
                    $httpRequest->end_date . ' 23:59:59',
                ]);
            }
        }]);

        // Filter items to only those with history in the date range
        if($httpRequest->start_date && $httpRequest->end_date){
            $items->whereHas('history', function ($query) use ($httpRequest) {
                $query->whereBetween('created_at', [
                    $httpRequest->start_date . ' 00:00:00',
                    $httpRequest->end_date . ' 23:59:59',
                ]);
            });
        }

        if(filled($httpRequest->search)){
            $items->where(function($q) use ($httpRequest) {
                $q->where('description', 'like', '%' . $httpRequest->search . '%')
                  ->orWhere('unit_of_measure', 'like', '%' . $httpRequest->search . '%');
            });
        }

        $items = $items->get();
        
        $pdf = Pdf::loadView('pdf.report', compact('items'));

        return $pdf->stream('report_' . now()->format('Y-m-d_H-i-s') . '.pdf');
    }
}
