<?php

namespace App\Http\Controllers\Endorser;

use App\Http\Controllers\Controller;
use App\Models\Request as ModelsRequest;
use Illuminate\Http\Request;

class EndorserController extends Controller
{
    public function endorserPage(){
        $requests = ModelsRequest::with('user')->get();
        return inertia('Endorser/Requests', ['requests' => $requests]);
    }

    public function actionReject(Request $request){
        $findItem = ModelsRequest::findOrFail($request->item_id);

        $findItem->update([
            'status' => 'rejected'
        ]);
    }

    public function actionApprove(Request $request){
        $findItem = ModelsRequest::findOrFail($request->item_id);

        if ($findItem->quantity < $request->issue_quantity) {
            return back()->with('error', 'Insufficient stock available');
        }

        $findItem->update([
            'status' => 'approved',
            'endorser_message' => $request->endorser_message,
            'unfulfilled_quantity' => $request->unfulfilled_quantity
        ]);

        $findItem->decrement('quantity', $request->issue_quantity);

        return back()->with('success', 'Request approved successfully');
    }
}
