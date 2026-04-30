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

            if (Auth::user()->role === 'receiver' && Auth::user()->is_active) {
                return redirect()->route('receiver_page');
            }elseif(Auth::user()->role === 'admin' && Auth::user()->is_active){
                return redirect()->route('admin_page');
            }elseif(Auth::user()->role === 'department' && Auth::user()->is_active){
                return redirect()->route('department_page');
            }elseif(Auth::user()->role === 'endorser' && Auth::user()->is_active){
                return redirect()->route('endorser_page');
            }elseif(Auth::user()->role === 'head' && Auth::user()->is_active){
                return redirect()->route('head_page');
            }

            return back()->with('error', 'Your account is inactive. Please contact the administrator.');
        }

        return back()->with('error', 'Invalid username or password');
    }

    public function logout(Request $request){
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('login');
    }
}
