<?php

namespace App\Http\Controllers\Department;

use App\Http\Controllers\Controller;
use App\Models\User;
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
}
