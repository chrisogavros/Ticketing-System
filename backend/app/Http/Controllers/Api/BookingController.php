<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Screening;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\GuestBookingMail;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $request->user()->bookings()->with('screening.movie', 'screening.hall', 'tickets')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'screening_id' => 'required|exists:screenings,id',
            'guest_email' => 'nullable|email'
        ]);

        $screening = Screening::findOrFail($validated['screening_id']);
        $user = $request->user();

        // Calculate price (1 ticket for now)
        $pricePerTicket = $screening->price;
        $totalPrice = $pricePerTicket; // * 1

        // Check capacity
        if ($screening->available_seats <= 0) {
            return response()->json(['message' => 'Screening is sold out'], 400);
        }

        try {
            DB::beginTransaction();

            // Create Booking
            $booking = Booking::create([
                'user_id' => $user->id,
                'screening_id' => $screening->id,
                'booking_reference' => Str::upper(Str::random(10)),
                'seat_count' => 1,
                'total_price' => $totalPrice,
                'status' => 'confirmed'
            ]);

            // Create 1 Ticket (Auto-assign dummy seat for MVP)
            // In a real app, we would select seats. Here we just assign Row 1, Seat 1 (or random)
            $booking->tickets()->create([
                'row_number' => rand(1, 10),
                'seat_number' => rand(1, 15),
                'price' => $pricePerTicket,
            ]);

            DB::commit();

            // Send Email if guest_email is provided
            if (!empty($validated['guest_email'])) {
                $booking->load(['screening.movie', 'screening.hall', 'user', 'tickets']);
                try {
                    Mail::to($validated['guest_email'])->send(new GuestBookingMail($booking));
                } catch (\Exception $mailEx) {
                    \Log::error('Failed to send GuestBookingMail: ' . $mailEx->getMessage());
                    // We do not fail the booking if email fails (often config issues locally)
                }
            }

            return response()->json($booking->load('tickets'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Booking failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Booking::with('tickets')->findOrFail($id);
    }
}
