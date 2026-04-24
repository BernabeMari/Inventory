<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\EndorserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReceiverController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::controller(LoginController::class)->group(function (){
    Route::get('/login', 'loginPage');
    Route::post('/login', 'authenticateUser')->name('login');
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
});

Route::middleware('role:department')->controller(RequestController::class)->group(function(){
    Route::get('/department-dashboard', 'departmentPage')->name('department_page');
    Route::post('/request-item', 'requestItem')->name('request_item');
});