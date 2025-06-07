<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// User dashboard routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/services', [DashboardController::class, 'createService'])->name('services.create');
    Route::delete('/services/{service}', [DashboardController::class, 'deleteService'])->name('services.delete');
    Route::patch('/services/{service}/status', [DashboardController::class, 'updateServiceStatus'])->name('services.status');
});

// Admin routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('index');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/services', [AdminController::class, 'services'])->name('services');
    Route::get('/service-types', [AdminController::class, 'serviceTypes'])->name('service-types');
    
    Route::post('/service-types', [AdminController::class, 'createServiceType'])->name('service-types.create');
    Route::put('/service-types/{serviceType}', [AdminController::class, 'updateServiceType'])->name('service-types.update');
    Route::delete('/service-types/{serviceType}', [AdminController::class, 'deleteServiceType'])->name('service-types.delete');
    
    Route::patch('/users/{user}/credits', [AdminController::class, 'updateUserCredits'])->name('users.credits');
});