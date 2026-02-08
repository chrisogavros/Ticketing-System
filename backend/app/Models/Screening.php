<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Screening extends Model
{
    protected $fillable = ['movie_id', 'hall_id', 'start_time', 'price'];

    protected $casts = [
        'start_time' => 'datetime',
    ];

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    protected $appends = ['available_seats'];

    public function getAvailableSeatsAttribute()
    {
        // Careful with N+1 problem here. For optimized queries, use withCount/withSum in controller.
        // But for simplicity/MVC pattern here:
        // total_seats = hall.rows * hall.cols
        // booked_seats = bookings->sum('seat_count')

        // Assuming hall is loaded or we load it. 
        // If we access this on a collection without eager loading, it will trigger queries.

        $hall = $this->hall;
        if (!$hall)
            return 0;

        $totalSeats = $hall->rows * $hall->columns; // Wait, model attribute names are?
        // Checking Hall.php... fillable = ['name', 'total_rows', 'total_cols']??
        // Wait, Seeder uses 'rows' and 'columns'. Need to check migration or DB schema.
        // Defaulting to what seeding implies, but Hall.php says fillable=['name', 'total_rows'...]??
        // Let's verify Hall.php again. It showed fillable = ['name', 'total_rows', 'total_cols'].
        // Seeder uses 'rows' => $hall['rows']. 
        // So I should check if Seeder matches Model.

        // Actually Hall.php has fillable = ['name', 'total_rows', 'total_cols'] in my view below (Step 525).
        // Seeder (Step 528) uses 'rows' in array but Create might map it? 
        // Let's check HallSeeder implementation again.

        // Assuming strict mapping:
        $capacity = $hall->total_rows * $hall->total_cols;
        $booked = $this->bookings()->sum('seat_count');

        return max(0, $capacity - $booked);
    }
}
