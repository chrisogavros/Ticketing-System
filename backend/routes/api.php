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
Route::post('/admin/login', [AuthController::class, 'loginAdmin']);

Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{id}', [MovieController::class, 'show']);

Route::get('/screenings', [ScreeningController::class, 'index']);
Route::get('/screenings/{id}', [ScreeningController::class, 'show']);

// Admin Routes (Protected by same auth for now, in real app add 'admin' middleware)
Route::get('/admin/bookings', [App\Http\Controllers\Api\AdminController::class, 'index']);
Route::get('/admin/calendar', [App\Http\Controllers\Api\AdminController::class, 'calendar']);
Route::post('/admin/bookings/{id}/attend', [App\Http\Controllers\Api\AdminController::class, 'markAttended']);
Route::post('/admin/scan', [App\Http\Controllers\Api\AdminController::class, 'scanTicket']);

Route::get('/admin/halls', [App\Http\Controllers\Api\AdminSpaceController::class, 'indexHalls']);
Route::post('/admin/halls', [App\Http\Controllers\Api\AdminSpaceController::class, 'storeHall']);
Route::put('/admin/halls/{id}', [App\Http\Controllers\Api\AdminSpaceController::class, 'updateHall']);
Route::delete('/admin/halls/{id}', [App\Http\Controllers\Api\AdminSpaceController::class, 'destroyHall']);

Route::get('/admin/screenings', [App\Http\Controllers\Api\AdminSpaceController::class, 'indexScreenings']);
Route::post('/admin/screenings', [App\Http\Controllers\Api\AdminSpaceController::class, 'storeScreening']);
Route::put('/admin/screenings/{id}', [App\Http\Controllers\Api\AdminSpaceController::class, 'updateScreening']);
Route::delete('/admin/screenings/{id}', [App\Http\Controllers\Api\AdminSpaceController::class, 'destroyScreening']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::get('/my-bookings', [BookingController::class, 'index']);
});
