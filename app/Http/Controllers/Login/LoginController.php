<?php

namespace App\Http\Controllers\Login;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function loginPage(){
        return inertia('Login/Index');
    }

    public function authenticateUser(Request $request)
    {
        if (Auth::attempt([
            'username' => $request->username,
            'password' => $request->password,
        ])) {

            $request->session()->regenerate();

            if (Auth::user()->role === 'receiver') {
                return redirect()->route('receiver_page');
            }elseif(Auth::user()->role === 'admin'){
                return redirect()->route('admin_page');
            }elseif(Auth::user()->role === 'department'){
                return redirect()->route('department_page');
            }elseif(Auth::user()->role === 'endorser'){
                return redirect()->route('endorser_page');
            }elseif(Auth::user()->role === 'head'){
                return redirect()->route('head_page');
            }

            return redirect('/');
        }

        return back()->withErrors([
            'username' => 'Invalid credentials',
        ]);
    }

    public function logout(Request $request){
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('login');
    }
}
