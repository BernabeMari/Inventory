<?php

namespace App\Http\Controllers\Head;

use App\Http\Controllers\Controller;
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
        

        $quantityChartData = [
            'Fulfilled' => $requests->sum('fulfilled_quantity'),
            'Unfulfilled' => $requests->sum('unfulfilled_quantity'),
        ];
        

        $departmentCounts = ModelsRequest::with('user')
            ->get()
            ->groupBy(function ($request) {
                return $request->user->department ?? 'Unknown';
            })
            ->map(function ($group) {
                return count($group);
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
}
