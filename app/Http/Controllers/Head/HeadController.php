<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Request as ModelsRequest;
use Illuminate\Http\Request;

class HeadController extends Controller
{
    public function headPage(){
        $requests = ModelsRequest::all();

        $statusChartData = [
            'Pending' => $requests->where('status', 'pending')->count(),
            'Approved' => $requests->where('status', 'approved')->count(),
            'Rejected' => $requests->where('status', 'rejected')->count(),
        ];
        

        $fulfilledQuantity = $requests
            ->flatMap(function ($request) {
                return is_array($request->fulfilled_quantity) ? $request->fulfilled_quantity : [];
            })
            ->map(function ($value) {
                return intval($value);
            })
            ->sum();

        $unfulfilledQuantity = $requests
            ->flatMap(function ($request) {
                return is_array($request->unfulfilled_quantity) ? $request->unfulfilled_quantity : [];
            })
            ->map(function ($value) {
                return intval($value);
            })
            ->sum();

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

    public function headReportPage(){
        $items = Item::get();

        $snapshotPath = storage_path('app/ending_balances.json');
        $beginnings = file_exists($snapshotPath) 
            ? json_decode(file_get_contents($snapshotPath), true) 
            : [];
            
        return inertia('Head/Report', ['items' => $items, 'beginnings' => $beginnings]);
        
    }
}
