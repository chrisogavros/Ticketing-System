<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;
use App\Models\Hall;
use App\Models\Screening;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Roles
        $roleAdmin = Role::create(['name' => 'admin', 'description' => 'Administrator']);
        $roleUser = Role::create(['name' => 'user', 'description' => 'Regular User']);

        // Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $admin->roles()->attach($roleAdmin);

        // Halls
        $hall1 = Hall::create(['name' => 'Hall A (Dolby Atmos)', 'total_rows' => 8, 'total_cols' => 10]);
        $hall2 = Hall::create(['name' => 'Hall B (IMAX)', 'total_rows' => 10, 'total_cols' => 15]);

        // Movies
        $movie1 = Movie::create([
            'title' => 'Inception',
            'description' => 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            'duration_minutes' => 148,
            'genre' => 'Sci-Fi',
            'director' => 'Christopher Nolan',
            'release_date' => '2010-07-16',
            'poster_url' => 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' // Public placeholder
        ]);

        $movie2 = Movie::create([
            'title' => 'The Dark Knight',
            'description' => 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
            'duration_minutes' => 152,
            'genre' => 'Action',
            'director' => 'Christopher Nolan',
            'release_date' => '2008-07-18',
            'poster_url' => 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
        ]);

        $movie3 = Movie::create([
            'title' => 'Interstellar',
            'description' => 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            'duration_minutes' => 169,
            'genre' => 'Sci-Fi',
            'director' => 'Christopher Nolan',
            'release_date' => '2014-11-07',
            'poster_url' => 'https://image.tmdb.org/t/p/w500/gEU2QniL6E8ahMcafCUyGdI9no8.jpg'
        ]);

        // Screenings (Next 7 days)
        Screening::create([
            'movie_id' => $movie1->id,
            'hall_id' => $hall1->id,
            'start_time' => now()->addDays(1)->setHour(18)->setMinute(0),
            'price' => 12.00
        ]);

        Screening::create([
            'movie_id' => $movie1->id,
            'hall_id' => $hall1->id,
            'start_time' => now()->addDays(1)->setHour(21)->setMinute(0),
            'price' => 12.00
        ]);

        Screening::create([
            'movie_id' => $movie2->id,
            'hall_id' => $hall2->id,
            'start_time' => now()->addDays(2)->setHour(19)->setMinute(30),
            'price' => 15.00
        ]);

        Screening::create([
            'movie_id' => $movie3->id,
            'hall_id' => $hall2->id,
            'start_time' => now()->addDays(3)->setHour(20)->setMinute(00),
            'price' => 14.00
        ]);
    }
}
