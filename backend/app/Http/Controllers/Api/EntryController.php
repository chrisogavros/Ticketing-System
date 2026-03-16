<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking;

class EntryController extends Controller
{
    /**
     * Verify entry by finding user via email or phone
     * Returns their active/future bookings.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
        ]);

        $identifier = $request->identifier;

        // 1. Check if the identifier is exactly a booking_reference (from QR Code)
        $bookingByRef = Booking::with(['screening.movie', 'screening.hall', 'user'])
            ->where('booking_reference', $identifier)
            ->first();

        if ($bookingByRef && $bookingByRef->user) {
            return response()->json([
                'status'   => 'success',
                'message'  => 'Η κράτηση βρέθηκε μέσω QR Code!',
                'user'     => $bookingByRef->user->only(['name', 'surname', 'email', 'phone', 'avatar']),
                'bookings' => [$bookingByRef] // Return as array to keep frontend format consistent
            ]);
        }

        // 2. Fallback: Find user by email or phone
        $user = User::where('email', $identifier)
                    ->orWhere('phone', $identifier)
                    ->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Δεν βρέθηκε χρήστης ή Κωδικός Κράτησης με αυτό το στοιχείο.',
            ], 404);
        }

        // Fetch user's bookings (we can filter for future ones if needed, 
        // but for now let's return all their bookings loaded with relations)
        $bookings = Booking::with(['screening.movie', 'screening.hall'])
            ->where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->get();

        if ($bookings->isEmpty()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Ο χρήστης βρέθηκε, αλλά δεν έχει καμία κράτηση.',
                'user'    => $user->only(['name', 'surname', 'email', 'phone', 'avatar'])
            ], 404);
        }

        return response()->json([
            'status'   => 'success',
            'message'  => 'Η κράτηση βρέθηκε επιτυχώς!',
            'user'     => $user->only(['name', 'surname', 'email', 'phone', 'avatar']),
            'bookings' => $bookings
        ]);
    }
}
