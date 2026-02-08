<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Screening;

class ScreeningController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Screening::with('movie', 'hall')->get();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Return screening with Hall info and existing bookings/tickets (to know occupied seats)
        return Screening::with(['hall', 'bookings.tickets'])->findOrFail($id);
    }
}
