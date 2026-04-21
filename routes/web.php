<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
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
});