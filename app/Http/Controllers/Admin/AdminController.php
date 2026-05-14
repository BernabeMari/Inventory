<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Audit;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{ 
    // admin page
    public function adminPage(){
        $users = User::get();
        return inertia('Admin/CreateUser', ['users' => $users]);
    }

    public function auditLogsPage(Request $request)
    {
        $audits = Audit::query()
            ->latest()
            ->when(filled($request->search), function ($query) use ($request) {
                $search = $request->search;

                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('username', 'like', '%' . $search . '%')
                        ->orWhere('role', 'like', '%' . $search . '%')
                        ->orWhere('action', 'like', '%' . $search . '%')
                        ->orWhere('method', 'like', '%' . $search . '%')
                        ->orWhere('route_name', 'like', '%' . $search . '%')
                        ->orWhere('url', 'like', '%' . $search . '%')
                        ->orWhere('ip_address', 'like', '%' . $search . '%');
                });
            })
            ->paginate(20)
            ->withQueryString();

        return inertia('Admin/AuditLogs', [
            'audits' => $audits,
            'filters' => [
                'search' => $request->search ?? '',
            ],
        ]);
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
