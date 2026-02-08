<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hall;

class HallSeeder extends Seeder
{
    public function run()
    {
        $halls = [
            ['name' => 'Hall 1 (Standard)', 'total_rows' => 10, 'total_cols' => 15],
            ['name' => 'Hall 2 (Standard)', 'total_rows' => 10, 'total_cols' => 15],
            ['name' => 'Hall 3 (Standard)', 'total_rows' => 10, 'total_cols' => 15],
            ['name' => 'IMAX Experience', 'total_rows' => 15, 'total_cols' => 20],
            ['name' => '3D Experience', 'total_rows' => 12, 'total_cols' => 18],
            ['name' => 'VIP Lounge', 'total_rows' => 5, 'total_cols' => 10],
        ];

        foreach ($halls as $hall) {
            Hall::firstOrCreate(['name' => $hall['name']], $hall);
        }
    }
}
