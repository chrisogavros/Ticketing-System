<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;
use App\Models\Hall;
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
        $roleAdmin = Role::firstOrCreate(['name' => 'admin'], ['description' => 'Administrator']);
        $roleUser = Role::firstOrCreate(['name' => 'user'], ['description' => 'Regular User']);

        // Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'is_admin' => true,
            ]
        );
        $admin->roles()->syncWithoutDetaching([$roleAdmin->id]);

        // ── 6 Halls ──────────────────────────────────────────────────────────
        $hallsData = [
            ['name' => 'Hall 1 (Standard)', 'total_rows' => 10, 'total_cols' => 15],
            ['name' => 'Hall 2 (Standard)', 'total_rows' => 10, 'total_cols' => 15],
            ['name' => 'Hall 3 (Standard)', 'total_rows' => 10, 'total_cols' => 15],
            ['name' => 'IMAX Experience', 'total_rows' => 15, 'total_cols' => 20],
            ['name' => '3D Experience', 'total_rows' => 12, 'total_cols' => 18],
            ['name' => 'VIP Lounge', 'total_rows' => 5, 'total_cols' => 10],
        ];

        $halls = [];
        foreach ($hallsData as $hd) {
            $halls[] = Hall::firstOrCreate(['name' => $hd['name']], $hd);
        }

        // ── 6 Movies (with TMDB posters) ─────────────────────────────────────
        $moviesData = [
            [
                'title' => 'Inception',
                'description' => 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a CEO.',
                'duration_minutes' => 148,
                'genre' => 'Sci-Fi',
                'director' => 'Christopher Nolan',
                'release_date' => '2010-07-16',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            ],
            [
                'title' => 'The Dark Knight',
                'description' => 'Batman faces the Joker, who plunges Gotham City into anarchy, forcing him to question his own ideals to stop him.',
                'duration_minutes' => 152,
                'genre' => 'Action',
                'director' => 'Christopher Nolan',
                'release_date' => '2008-07-18',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            ],
            [
                'title' => 'Interstellar',
                'description' => 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                'duration_minutes' => 169,
                'genre' => 'Sci-Fi',
                'director' => 'Christopher Nolan',
                'release_date' => '2014-11-07',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg',
            ],
            [
                'title' => 'Dunkirk',
                'description' => 'Allied soldiers are surrounded and evacuated from the beaches of Dunkirk during a fierce battle in World War II.',
                'duration_minutes' => 106,
                'genre' => 'War/Action',
                'director' => 'Christopher Nolan',
                'release_date' => '2017-07-21',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg',
            ],
            [
                'title' => 'Tenet',
                'description' => 'A secret agent embarks on a dangerous, time-bending mission to prevent World War III, armed with only one word: Tenet.',
                'duration_minutes' => 150,
                'genre' => 'Sci-Fi/Action',
                'director' => 'Christopher Nolan',
                'release_date' => '2020-08-26',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg',
            ],
            [
                'title' => 'Oppenheimer',
                'description' => 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II.',
                'duration_minutes' => 180,
                'genre' => 'Biography/Drama',
                'director' => 'Christopher Nolan',
                'release_date' => '2023-07-21',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
            ],
        ];

        $movies = [];
        foreach ($moviesData as $md) {
            $movies[] = Movie::firstOrCreate(['title' => $md['title']], $md);
        }

        // ── Screenings (delegate to ScreeningSeeder) ──────────────────────────
        $this->call(ScreeningSeeder::class);
    }
}
