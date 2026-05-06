<?php

namespace App\Http\Controllers\Endorser;

use App\Http\Controllers\Controller;
use App\Models\Issuance;
use App\Models\Item;
use App\Models\Request as ModelsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EndorserController extends Controller
{
    public function endorserPage(Request $request){
        $requests = ModelsRequest::with('user', 'items', 'issuances')->where('status', '=', 'pending');
        $items = Item::all();

        if (filled($request->search)) {
        $requests->where(function ($query) use ($request) {
            $query->where('item', 'like', '%' . $request->search . '%')
                ->orWhere('quantity', 'like', '%' . $request->search . '%')
                ->orWhere('message', 'like', '%' . $request->search . '%');
        })
        ->orWhereHas('user', function ($query) use ($request) {
            $query->where('department', 'like', '%' . $request->search . '%')->where('status', '=', 'pending');
        });
    }


        $requests = $requests->get();

        return inertia('Endorser/Requests', ['requests' => $requests, 'items' => $items]);
    }

    public function endorserDoneRequestPage(Request $request){
        $requests = ModelsRequest::with('user', 'issuances')->where('status', '!=', 'pending');

        if (filled($request->search)) {
        $requests->where(function ($query) use ($request) {
            $query->where('item', 'like', '%' . $request->search . '%')
                ->orWhere('quantity', 'like', '%' . $request->search . '%')
                ->orWhere('status', 'like', '%' . $request->search . '%')
                ->orWhere('message', 'like', '%' . $request->search . '%');
        })
        ->orWhereHas('user', function ($query) use ($request) {
            $query->where('department', 'like', '%' . $request->search . '%')->where('status', '!=', 'pending');
        })
        ->orWhereHas('issuances', function ($query) use ($request) {
            $query->where('fulfilled_quantity', 'like', '%' . $request->search . '%')->where('status', '!=', 'pending')
            ->orWhere('unfulfilled_quantity', 'like', '%' . $request->search . '%')->where('status', '!=', 'pending');
        });
    }


        $requests = $requests->get();

        return inertia('Endorser/DoneRequests', ['requests' => $requests]);
    }

    public function actionReject(Request $request){
        $findItem = ModelsRequest::findOrFail($request->request_id);

        $findItem->update([
            'status' => 'rejected',
            'endorser_message' => $request->endorser_message
        ]);
    }

    public function actionApprove(Request $request){
        $findRequest = ModelsRequest::findOrFail($request->request_id);
        $itemIds = array_values(array_map('intval', (array) $request->item_id));
        $fulfilledQuantities = array_values(array_map('intval', (array) $request->fulfilled_quantity));
        $unfulfilledQuantities = array_values(array_map('intval', (array) $request->unfulfilled_quantity));
        $requestedQuantities = array_values((array) $findRequest->quantity);

        if($findRequest->status === 'cancelled'){
            return back()->with('error', 'Request is Cancelled by Department');
        }

        if (
            count($itemIds) !== count($requestedQuantities) ||
            count($fulfilledQuantities) !== count($requestedQuantities) ||
            count($unfulfilledQuantities) !== count($requestedQuantities)
        ) {
            return back()->with('error', 'Approval data does not match the request.');
        }

        // First validate all items and quantities before making any DB changes
        foreach ($itemIds as $index => $itemId) {
            $findItem = Item::findOrFail($itemId);
            $fulfilled = $fulfilledQuantities[$index];
            $unfulfilled = $unfulfilledQuantities[$index];
            $requested = $requestedQuantities[$index];

            if ($fulfilled + $unfulfilled != $requested) {
                return back()->with('error', 'The fulfilled and unfulfilled items do not match the department’s request.');
            }

            if ($findItem->total < $fulfilled) {
                return back()->with('error', 'Insufficient stock available for selected item: ' . $findItem->description);
            }
        }

        try {
            // Lock each item row before checking stock so the total cannot change mid-approval
            DB::transaction(function () use ($itemIds, $fulfilledQuantities, $unfulfilledQuantities, $findRequest, $request) {
                $issuedItems = [];

                foreach ($itemIds as $index => $itemId) {
                    $findItem = Item::whereKey($itemId)->lockForUpdate()->firstOrFail();
                    $fulfilled = $fulfilledQuantities[$index];

                    if ($fulfilled < 0) {
                        throw new \RuntimeException('Invalid fulfilled quantity for selected item: ' . $findItem->description);
                    }

                    if ($findItem->total - $fulfilled < 0) {
                        throw new \RuntimeException('Insufficient stock available for selected item: ' . $findItem->description);
                    }

                    $issuedItems[] = $findItem->description;
                    $findItem->decrement('total', $fulfilled);
                    $findItem->increment('less', $fulfilled);
                }

                $findRequest->update([
                    'status' => 'approved',
                    'endorser_message' => $request->endorser_message,
                ]);

                foreach ($itemIds as $index => $itemId) {
                    Issuance::create([
                        'user_id' => $findRequest->user_id,
                        'request_id' => $findRequest->id,
                        'item_id' => $itemId,
                        'issued_item' => $issuedItems[$index],
                        'fulfilled_quantity' => $fulfilledQuantities[$index],
                        'unfulfilled_quantity' => $unfulfilledQuantities[$index],
                    ]);
                }
            });
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Request approved successfully');
    }
}
