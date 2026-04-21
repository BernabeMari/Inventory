<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function loginPage(){
        return inertia('Login/Index');
    }

    public function authenticateUser(Request $request){
        $username = $request->username;
        $password = $request->password;

        if($username === auth('username') && $password === auth('password')){
            if(auth('role') === 'admin'){
                return inertia('Admin/Index');
            }
        }
    }
}
