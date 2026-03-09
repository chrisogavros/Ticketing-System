<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hall;
use App\Models\Screening;
use App\Models\Booking;
use Illuminate\Support\Facades\Mail;
use App\Mail\ScreeningChangedMail;
use Illuminate\Support\Facades\DB;

class AdminSpaceController extends Controller
{
    // --- HALLS CRUD ---

    public function indexHalls()
    {
        return response()->json(Hall::withCount('screenings')->orderBy('id', 'desc')->get());
    }

    public function storeHall(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'total_rows' => 'required|integer|min:1',
            'total_cols' => 'required|integer|min:1',
        ]);

        $hall = Hall::create($validated);
        return response()->json($hall, 201);
    }

    public function updateHall(Request $request, $id)
    {
        $hall = Hall::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'total_rows' => 'sometimes|required|integer|min:1',
            'total_cols' => 'sometimes|required|integer|min:1',
        ]);

        $hall->update($validated);
        return response()->json($hall);
    }

    public function destroyHall($id)
    {
        $hall = Hall::findOrFail($id);

        try {
            DB::beginTransaction();
            // Check for affected bookings in all screenings of this hall
            $screenings = $hall->screenings()->with('bookings.user')->get();
            
            foreach ($screenings as $screening) {
                foreach ($screening->bookings as $booking) {
                    if ($booking->status !== 'cancelled') {
                        try {
                            Mail::to($booking->user->email)->send(new ScreeningChangedMail($booking->user, $screening, 'deleted'));
                        } catch (\Exception $e) {}
                    }
                }
                $screening->bookings()->delete();
                $screening->delete();
            }

            $hall->delete();
            DB::commit();
            return response()->json(['message' => 'Hall and all associated screenings deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete hall', 'error' => $e->getMessage()], 500);
        }
    }

    // --- SCREENINGS CRUD ---

    public function indexScreenings()
    {
        return response()->json(Screening::with(['movie', 'hall'])->orderBy('start_time', 'desc')->get());
    }

    public function storeScreening(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => 'required|exists:movies,id',
            'hall_id' => 'required|exists:halls,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'price' => 'required|numeric|min:0',
        ]);

        $overlap = Screening::where('hall_id', $validated['hall_id'])
            ->where('start_time', '<', $validated['end_time'])
            ->where('end_time', '>', $validated['start_time'])
            ->exists();

        if ($overlap) {
            return response()->json(['message' => 'OVERLAP_ERROR: The selected time slot overlaps with an existing screening in this hall.'], 422);
        }

        $screening = Screening::create($validated);
        return response()->json($screening->load(['movie', 'hall']), 201);
    }

    public function updateScreening(Request $request, $id)
    {
        $screening = Screening::findOrFail($id);
        
        $validated = $request->validate([
            'movie_id' => 'sometimes|required|exists:movies,id',
            'hall_id' => 'sometimes|required|exists:halls,id',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'price' => 'sometimes|required|numeric|min:0',
        ]);

        $hall_id = $validated['hall_id'] ?? $screening->hall_id;
        $start_time = $validated['start_time'] ?? $screening->start_time;
        $end_time = $validated['end_time'] ?? $screening->end_time;

        $overlap = Screening::where('id', '!=', $id)
            ->where('hall_id', $hall_id)
            ->where('start_time', '<', $end_time)
            ->where('end_time', '>', $start_time)
            ->exists();

        if ($overlap) {
            return response()->json(['message' => 'OVERLAP_ERROR: The selected time slot overlaps with an existing screening in this hall.'], 422);
        }

        // Check if time or hall changed, which might affect bookings
        $timeChanged = isset($validated['start_time']) && $validated['start_time'] !== $screening->start_time;
        
        $screening->update($validated);

        if ($timeChanged) {
            $screening->load(['bookings.user', 'movie', 'hall']);
            foreach ($screening->bookings as $booking) {
                if ($booking->status !== 'cancelled') {
                    try {
                        Mail::to($booking->user->email)->send(new ScreeningChangedMail($booking->user, $screening, 'updated'));
                    } catch (\Exception $e) {}
                }
            }
        }

        return response()->json($screening->load(['movie', 'hall']));
    }

    public function destroyScreening($id)
    {
        $screening = Screening::findOrFail($id);

        try {
            DB::beginTransaction();
            $screening->load(['bookings.user', 'movie', 'hall']);
            
            // Notify booked users
            foreach ($screening->bookings as $booking) {
                if ($booking->status !== 'cancelled') {
                    try {
                        Mail::to($booking->user->email)->send(new ScreeningChangedMail($booking->user, $screening, 'deleted'));
                    } catch (\Exception $e) {}
                }
            }

            // Delete bookings and screening
            $screening->bookings()->delete();
            $screening->delete();

            DB::commit();
            return response()->json(['message' => 'Screening deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete screening', 'error' => $e->getMessage()], 500);
        }
    }
}
