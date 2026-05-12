<?php

namespace App\Http\Controllers\Requests;

use App\Http\Controllers\Controller;
use App\Models\Request as ModelsRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
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

    public function cancelRequest(Request $request){
        $findRequest = ModelsRequest::findOrFail($request->request_id);
        $findRequest->update([
            'status' => 'cancelled',
        ]);
    }

    public function attachFile(Request $request)
    {
        $validated = $request->validate([
            'request_id' => ['required', 'exists:requests,id'],
            'clearance' => ['required', 'array', 'min:1'],
            'clearance.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $findRequest = ModelsRequest::findOrFail($validated['request_id']);

        $paths = [];
        foreach ($request->file('clearance', []) as $file) {
            $paths[] = $file->store('clearance', 'public');
        }

        $findRequest->update([
            'clearance' => $paths,
        ]);

        return back()->with('success', 'Clearance files uploaded successfully.');
    }
}
