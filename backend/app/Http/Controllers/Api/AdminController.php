<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


use App\Models\Booking;
use App\Models\Screening;

class AdminController extends Controller
{
    public function index()
    {
        // Add auth check or middleware in route definition
        // Eager load relationships for performance
        return Booking::with(['user', 'screening.movie', 'screening.hall'])->latest()->get();
    }

    public function calendar()
    {
        // Fetch all screenings with related data
        $screenings = Screening::with(['movie', 'hall', 'bookings.user'])->get();

        // Map data to calculate fullness and attendance
        $calendarData = $screenings->map(function ($screening) {
            $totalCapacity = $screening->hall->total_rows * $screening->hall->total_cols;
            
            // Calculate total booked seats for this screening (excluding cancelled)
            $bookedSeats = $screening->bookings->where('status', '!=', 'cancelled')->sum('seat_count');
            
            // Calculate attended seats (only from non-cancelled bookings where is_attended is true)
            $attendedSeats = $screening->bookings->where('status', '!=', 'cancelled')->where('is_attended', true)->sum('seat_count');

            return [
                'id' => $screening->id,
                'movie_title' => $screening->movie->title,
                'hall_name' => $screening->hall->name,
                'hall_code' => 'H' . str_pad($screening->hall->id, 3, '0', STR_PAD_LEFT),
                'start_time' => $screening->start_time,
                'end_time' => $screening->end_time,
                'total_capacity' => $totalCapacity,
                'booked_seats' => $bookedSeats,
                'attended_seats' => $attendedSeats,
                // Include full booking objects with users to show the list in the UI
                'bookings' => $screening->bookings
            ];
        });

        return response()->json($calendarData);
    }

    public function markAttended(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        
        // Toggle the attendance status
        $booking->is_attended = !$booking->is_attended;
        $booking->save();

        return response()->json([
            'message' => 'Attendance status updated successfully.',
            'is_attended' => $booking->is_attended
        ]);
    }

    public function scanTicket(Request $request)
    {
        $request->validate([
            'reference' => 'required|string',
        ]);

        $booking = Booking::with(['screening.movie', 'screening.hall', 'user'])->where('booking_reference', $request->reference)->first();

        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Invalid Ticket! Booking not found.'], 404);
        }

        if ($booking->status === 'cancelled') {
            return response()->json(['success' => false, 'message' => 'This booking was CANCELLED.'], 400);
        }

        if ($booking->is_attended) {
            return response()->json([
                'success' => false, 
                'message' => 'TICKET ALREADY SCANNED!',
                'booking' => $booking
            ], 400);
        }

        // Mark as attended
        $booking->is_attended = true;
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Access Granted.',
            'booking' => $booking
        ], 200);
    }
}
