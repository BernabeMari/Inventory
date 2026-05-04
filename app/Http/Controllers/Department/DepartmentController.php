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

        return $pdf->stream('requests' . $request->id . '.pdf');
    }
}
