<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;
use App\Models\Hall;
use App\Models\Screening;
use Carbon\Carbon;

class ScreeningSeeder extends Seeder
{
    public function run()
    {
        $movies = Movie::all();
        $halls = Hall::all();

        // Ensure we have halls and movies
        if ($movies->isEmpty() || $halls->isEmpty()) {
            return;
        }

        // Disable foreign key checks to allow truncation
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Screening::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        foreach ($movies as $movie) {
            foreach ($halls as $hall) {
                // Generate screenings for the next 4 months (approx 120 days)
                // We'll create a screening every few days per hall to avoid too much data, 
                // or maybe 1 per day per hall. Let's do 1 screening every day for 4 months.
                $startDate = Carbon::today();

                for ($day = 0; $day < 120; $day++) {
                    // Random start times between 14:00 and 23:00
                    // This gives us some before 18:00 (to test filtering) and some after.
                    $hour = rand(14, 23);
                    $minute = rand(0, 1) * 30; // 00 or 30

                    $screeningTime = $startDate->copy()->addDays($day)->setTime($hour, $minute);

                    Screening::create([
                        'movie_id' => $movie->id,
                        'hall_id' => $hall->id,
                        'start_time' => $screeningTime,
                        'price' => $hall->name === 'VIP Lounge' ? 25.00 : ($hall->name === 'IMAX Experience' ? 18.00 : 12.00)
                    ]);
                }
            }
        }
    }
}
