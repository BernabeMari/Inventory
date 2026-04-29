<?php

namespace App\Http\Controllers\Endorser;

use App\Http\Controllers\Controller;
use App\Models\Receiver;
use App\Models\Request as ModelsRequest;
use Illuminate\Http\Request;

class EndorserController extends Controller
{
    public function endorserPage(){
        $requests = ModelsRequest::with('user', 'receiver')->get();
        $items = Receiver::get();
        return inertia('Endorser/Requests', ['requests' => $requests, 'items' => $items]);
    }

    public function endorserDoneRequestPage(){
        $requests = ModelsRequest::with('user')->get();
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
        $itemIds = is_array($request->item_id) ? $request->item_id : [$request->item_id];
        $fulfilledQuantities = array_map('intval', (array) $request->fulfilled_quantity);
        $unfulfilledQuantities = array_map('intval', (array) $request->unfulfilled_quantity);
        $requestedQuantities = (array) $findRequest->quantity;

        if (
            count($itemIds) !== count($requestedQuantities) ||
            count($fulfilledQuantities) !== count($requestedQuantities) ||
            count($unfulfilledQuantities) !== count($requestedQuantities)
        ) {
            return back()->with('error', 'Approval data does not match the request.');
        }

        $issuedItems = [];

        foreach ($itemIds as $index => $itemId) {
            $findItem = Receiver::findOrFail($itemId);
            $fulfilled = $fulfilledQuantities[$index];
            $unfulfilled = $unfulfilledQuantities[$index];
            $requested = $requestedQuantities[$index];

            if ($findItem->total < $fulfilled) {
                return back()->with('error', 'Insufficient stock available for selected item.');
            }

            if ($fulfilled + $unfulfilled != $requested) {
                return back()->with('error', 'The fulfilled and unfulfilled items do not match the department’s request.');
            }

            $issuedItems[] = $findItem->description;
            $findItem->increment('less', $fulfilled);
            $findItem->decrement('total', $fulfilled);
        }

        $findRequest->update([
            'status' => 'approved',
            'endorser_message' => $request->endorser_message,
            'fulfilled_quantity' => $fulfilledQuantities,
            'unfulfilled_quantity' => $unfulfilledQuantities,
            'issued_item' => $issuedItems,
        ]);

        return back()->with('success', 'Request approved successfully');
    }
}
