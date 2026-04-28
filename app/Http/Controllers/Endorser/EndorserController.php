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
        $findItem = Receiver::findOrFail($request->item_id);

        if ($findItem->total < $request->fulfilled_quantity) {
            return back()->with('error', 'Insufficient stock available');
        }

        if($request->fulfilled_quantity + $request->unfulfilled_quantity != $findRequest->quantity){
            return back()->with('error', 'The fulfilled and unfulfilled items do not match the department’s request.');
        }


        $findRequest->update([
            'status' => 'approved',
            'endorser_message' => $request->endorser_message,
            'fulfilled_quantity' => $request->fulfilled_quantity,
            'unfulfilled_quantity' => $request->unfulfilled_quantity,
            'issued_item' => $findItem->description,
            'receiver_id' => $request->request_id,
        ]);

        $findItem->update([
            'less' => $findItem->less + $request->fulfilled_quantity
        ]);
        
        $findItem->decrement('total', $request->fulfilled_quantity);

        return back()->with('success', 'Request approved successfully');
    }
}
