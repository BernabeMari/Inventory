<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{ 
    // admin page
    public function adminPage(){
        $users = User::get();
        return inertia('Admin/CreateUser', ['users' => $users]);
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
    public function editUser(Request $request){
        $findUser = User::findOrFail($request->user_id);

        $data = [];

        if($request->filled('username')){
            $data['username'] = $request->username;
        }

        if($request->filled('password')){
            $data['password'] = bcrypt($request->password);
        }

        if($request->filled('role')){
            $data['role'] = $request->role;
        }

        if($request->role === 'department'){
            if($request->filled('role_department')){
                $data['department'] = $request->role_department;
            }
        }else{
            $data['department'] = $request->department;
        }

        $findUser->update($data);
    }
    

    // Delete User
    public function deleteUser(Request $request){
        $find = User::findOrFail($request->user_id);
        $find->update([
            'is_active' => false
        ]);
    }


    // Restore User
    public function restoreUser(Request $request){
        $find = User::findOrFail($request->user_id);
        $find->update([
            'is_active' => true
        ]);
    }
}
