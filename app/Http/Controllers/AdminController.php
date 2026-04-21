<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{ 
    // admin page
    public function adminPage(){
        $users = User::get();
        return inertia('Admin/Index', ['users' => $users]);
    }

    // create user
    public function createUser(Request $request){
        User::create([
        'username' => $request->username,
        'password' => $request->password,
        'role' => $request->role,
        'department' => $request->role === 'department'
        ? $request->role_department : $request->department
    ]);
    }

    // edit user
    public function editUser(Request $request)
{
    $findUser = User::findOrFail($request->user_id);

    $data = [];

    if ($request->filled('username')) {
        $data['username'] = $request->username;
    }

    if ($request->filled('role')) {
        $data['role'] = $request->role;
    }

    if ($request->role === 'department') {
        if ($request->filled('role_department')) {
            $data['department'] = $request->role_department;
        }
    } else {
        if ($request->filled('department')) {
            $data['department'] = $request->department;
        }
    }

    if ($request->filled('password')) {
        $data['password'] = bcrypt($request->password);
    }

    $findUser->update($data);
}
}
