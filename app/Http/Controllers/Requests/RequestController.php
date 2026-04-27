<?php

namespace App\Http\Controllers\Requests;

use App\Http\Controllers\Controller;
use App\Models\Request as ModelsRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    public function departmentPage(){
        $requests = ModelsRequest::get();
        return inertia('Department/CreateRequest', ['requests' => $requests]);
    }

    public function requestItem(Request $request){
    ModelsRequest::create([
        'item' => $request->item,
        'quantity' => $request->quantity,
        'status' => 'pending',
        'message' => $request->message,
        'user_id' => Auth::id()
    ]);

    return back()->with('success', 'Request Created Successfully');
}
}
