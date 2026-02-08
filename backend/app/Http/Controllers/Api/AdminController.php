<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


use App\Models\Booking;

class AdminController extends Controller
{
    public function index()
    {
        // Add auth check or middleware in route definition
        // Eager load relationships for performance
        return Booking::with(['user', 'screening.movie', 'screening.hall'])->latest()->get();
    }
}
