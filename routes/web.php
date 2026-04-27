<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Department\DepartmentController;
use App\Http\Controllers\Endorser\EndorserController;
use App\Http\Controllers\Login\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Receiver\ReceiverController;
use App\Http\Controllers\Requests\RequestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::controller(LoginController::class)->group(function (){
    Route::get('/login', 'loginPage')->name('login_page');
    Route::post('/login', 'authenticateUser')->name('login');
    Route::post('/logout', 'logout')->name('logout');
});

Route::middleware('role:admin')->controller(AdminController::class)->group(function(){
    Route::get('/admin-dashboard', 'adminPage')->name('admin_page');
    Route::post('/create-user', 'createUser')->name('create_user');
    Route::post('/edit-user', 'editUser')->name('edit_user');
    Route::post('/delete-user', 'deleteUser')->name('delete_user');
});

Route::middleware('role:receiver')->controller(ReceiverController::class)->group(function(){
    Route::get('/receiver-dashboard', 'receiverPage')->name('receiver_page');
    Route::post('/create-item', 'createItem')->name('create_item');
    Route::post('/add-receipt', 'addReceipt')->name('add_receipt');
});

Route::middleware('role:endorser')->controller(EndorserController::class)->group(function(){
    Route::get('/endorser-dashboard', 'endorserPage')->name('endorser_page');
    Route::post('/action-reject', 'actionReject')->name('action_reject');
    Route::post('/action-approve', 'actionApprove')->name('action_approve');
});

Route::middleware('role:department')->controller(RequestController::class)->group(function(){
    Route::post('/request-item', 'requestItem')->name('request_item');
    Route::get('/department-dashboard', 'departmentPage')->name('department_page');
});

Route::middleware('role:department')->controller(DepartmentController::class)->group(function(){
    Route::get('/profile-department-dashboard', 'profilePage')->name('profile_department_page');
    Route::post('/update-department-profile', 'profilePicture')->name('profile_picture');
});