<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReceiverController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::controller(LoginController::class)->group(function (){
    Route::get('/', 'loginPage');
    Route::post('/login', 'authenticateUser');
});

Route::controller(AdminController::class)->group(function(){
    Route::get('/admin-dashboard', 'adminPage');
    Route::post('/create-user', 'createUser')->name('create_user');
    Route::post('/edit-user', 'editUser')->name('edit_user');
    Route::post('/delete-user', 'deleteUser')->name('delete_user');
});

Route::controller(ReceiverController::class)->group(function(){
    Route::get('/receiver-dashboard', 'receiverPage');
    Route::post('/create-item', 'createItem')->name('create_item');
    Route::post('/add-receipt', 'addReceipt')->name('add_receipt');
});