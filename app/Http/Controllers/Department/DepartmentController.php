<?php

namespace App\Http\Controllers\Department;

use App\Http\Controllers\Controller;
use App\Models\Issuance;
use App\Models\Request as ModelsRequest;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DepartmentController extends Controller
{
    public function departmentPage(Request $request){
        $requests = ModelsRequest::query();
        
        if(filled($request->search)){
            $requests->where('item', 'like', '%' . $request->search . '%')
            ->orWhere('status', 'like', '%' . $request->search . '%')
            ->orWhere('message', 'like', '%' . $request->search . '%')
            ->orWhere('quantity', 'like', '%' . $request->search . '%')
            ->orWhere('endorser_message', 'like', '%' . $request->search . '%');
        }
        
        $requests = $requests->get();

        return inertia('Department/CreateRequest', ['requests' => $requests]);
    }

    public function profilePage(){
        $profile = User::get();   
        return inertia('Department/Profile', ['profile' => $profile]);
    }

    public function profilePicture(Request $request){
        $findUser = User::findOrFail(Auth::user()->id);

        $findUser->update([
            'image' => $request->file('image')->store('profile', 'public'),
        ]);
    }

    public function downloadPdf($id){
        $request = ModelsRequest::with('issuances')->findOrFail($id);
        $issuances = $request->issuances;
        
        $pdf = Pdf::loadView('pdf.issuance', compact('request', 'issuances'));

        return $pdf->download('requests' . $request->id . '.pdf');
    }
}
