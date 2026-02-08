<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\ScreeningController;
use App\Http\Controllers\Api\BookingController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{id}', [MovieController::class, 'show']);

Route::get('/screenings', [ScreeningController::class, 'index']);
Route::get('/screenings/{id}', [ScreeningController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::get('/my-bookings', [BookingController::class, 'index']);

    // Admin Routes (Protected by same auth for now, in real app add 'admin' middleware)
    Route::get('/admin/bookings', [App\Http\Controllers\Api\AdminController::class, 'index']);
});
