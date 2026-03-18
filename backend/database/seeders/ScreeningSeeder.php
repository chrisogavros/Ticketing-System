<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;
use App\Models\Hall;
use App\Models\Screening;
use Carbon\Carbon;

class ScreeningSeeder extends Seeder
{
    public function run(): void
    {
        $movies = Movie::all()->values();
        $halls = Hall::all()->values();

        if ($movies->isEmpty() || $halls->isEmpty()) {
            return;
        }

        // Truncate screenings table cleanly
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Screening::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $movieCount = $movies->count(); // 6
        $hallCount = $halls->count();  // 6

        // 3 evening time slots: 18:00, 20:00, 22:00
        // For each slot, each hall gets exactly ONE different movie → zero conflicts.
        // Assignment formula: movieIdx = (hallIdx + slotIdx * 2 + day) % movieCount
        // Because hallIdx is unique per slot, no two halls get the same movie at the same time.
        $timeSlots = [
            ['hour' => 18, 'minute' => 0],
            ['hour' => 20, 'minute' => 0],
            ['hour' => 22, 'minute' => 0],
        ];

        // Pricing per hall type
        $priceMap = [
            'VIP Lounge' => 25.00,
            'IMAX Experience' => 18.00,
            '3D Experience' => 15.00,
        ];

        $startDate = Carbon::today();
        $endDate = Carbon::create(2026, 7, 31)->endOfDay();
        $totalDays = (int) $startDate->diffInDays($endDate) + 1;

        $toInsert = [];
        $now = now()->format('Y-m-d H:i:s');

        for ($day = 0; $day < $totalDays; $day++) {
            $date = $startDate->copy()->addDays($day);

            foreach ($timeSlots as $slotIdx => $slot) {
                foreach ($halls as $hallIdx => $hall) {
                    // Rotate which movie plays in this hall at this slot each day
                    $movieIdx = ($hallIdx + $slotIdx * 2 + $day) % $movieCount;
                    $movie = $movies[$movieIdx];

                    $price = $priceMap[$hall->name] ?? 12.00;

                    $toInsert[] = [
                        'movie_id' => $movie->id,
                        'hall_id' => $hall->id,
                        'start_time' => $date->copy()->setHour($slot['hour'])->setMinute($slot['minute'])->setSecond(0)->format('Y-m-d H:i:s'),
                        'price' => $price,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        // Bulk-insert in chunks for performance
        foreach (array_chunk($toInsert, 500) as $chunk) {
            Screening::insert($chunk);
        }
    }
}
