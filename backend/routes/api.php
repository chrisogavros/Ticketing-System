<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\ScreeningController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\SocialAuthController;
use App\Http\Controllers\Api\AdminUserController;

// ─── Native Auth ─────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/admin/register', [AuthController::class, 'registerAdmin']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'loginAdmin']);

// ─── Social OAuth (stateless — redirect URL returned as JSON) ────────────────
Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback']);

// ─── Public Resources ─────────────────────────────────────────────────────────
Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{id}', [MovieController::class, 'show']);

Route::get('/screenings', [ScreeningController::class, 'index']);
Route::get('/screenings/{id}', [ScreeningController::class, 'show']);

// ─── Protected Routes (Sanctum) ───────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::get('/my-bookings', [BookingController::class, 'index']);

    // ─── Admin — General ─────────────────────────────────────────────────────
    Route::middleware(App\Http\Middleware\AdminMiddleware::class)->prefix('admin')->group(function () {
        // Entry Verification & Scanner
        Route::get('/entry/verify', [\App\Http\Controllers\Api\EntryController::class, 'verify']);

        // Bookings / Attendance
        Route::get('/bookings', [App\Http\Controllers\Api\AdminController::class, 'index']);
        Route::get('/calendar', [App\Http\Controllers\Api\AdminController::class, 'calendar']);
        Route::post('/bookings/{id}/attend', [App\Http\Controllers\Api\AdminController::class, 'markAttended']);
        Route::post('/scan', [App\Http\Controllers\Api\AdminController::class, 'scanTicket']);

        // Halls & Screenings
        Route::get('/halls', [App\Http\Controllers\Api\AdminSpaceController::class, 'indexHalls']);
        Route::post('/halls', [App\Http\Controllers\Api\AdminSpaceController::class, 'storeHall']);
        Route::put('/halls/{id}', [App\Http\Controllers\Api\AdminSpaceController::class, 'updateHall']);
        Route::delete('/halls/{id}', [App\Http\Controllers\Api\AdminSpaceController::class, 'destroyHall']);

        Route::get('/screenings', [App\Http\Controllers\Api\AdminSpaceController::class, 'indexScreenings']);
        Route::post('/screenings', [App\Http\Controllers\Api\AdminSpaceController::class, 'storeScreening']);
        Route::put('/screenings/{id}', [App\Http\Controllers\Api\AdminSpaceController::class, 'updateScreening']);
        Route::delete('/screenings/{id}', [App\Http\Controllers\Api\AdminSpaceController::class, 'destroyScreening']);

        // ─── User Management ─────────────────────────────────────────────────
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{id}', [AdminUserController::class, 'show']);
        Route::put('/users/{id}/roles', [AdminUserController::class, 'updateRoles']);
        Route::put('/users/{id}/toggle-admin', [AdminUserController::class, 'toggleAdmin']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

        // Role CRUD
        Route::get('/roles', [AdminUserController::class, 'roles']);
        Route::post('/roles', [AdminUserController::class, 'createRole']);
        Route::delete('/roles/{id}', [AdminUserController::class, 'deleteRole']);
    });
});
