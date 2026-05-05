<?php

namespace App\Http\Controllers\Endorser;

use App\Http\Controllers\Controller;
use App\Models\Issuance;
use App\Models\Item;
use App\Models\Request as ModelsRequest;
use Illuminate\Http\Request;

class EndorserController extends Controller
{
    public function endorserPage(Request $request){
        $requests = ModelsRequest::with('user', 'items', 'issuances')->where('status', '=', 'pending');
        $items = Item::get();

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
        $itemIds = is_array($request->item_id) ? $request->item_id : [$request->item_id];
        $fulfilledQuantities = array_map('intval', (array) $request->fulfilled_quantity);
        $unfulfilledQuantities = array_map('intval', (array) $request->unfulfilled_quantity);
        $requestedQuantities = (array) $findRequest->quantity;

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

        $issuedItems = [];

        foreach ($itemIds as $index => $itemId) {
            $findItem = Item::findOrFail($itemId);
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
            $findItem->decrement('total', $fulfilled);
            $findItem->increment('less', $fulfilled);
        }

        $findRequest->update([
            'status' => 'approved',
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

        $findRequest->update([
            'endorser_message' => $request->endorser_message
        ]);

        return back()->with('success', 'Request approved successfully');
    }
}
