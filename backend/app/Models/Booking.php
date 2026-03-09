<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'screening_id',
        'booking_reference',
        'seat_count',
        'total_price',
        'status',
        'is_attended'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function screening()
    {
        return $this->belongsTo(Screening::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
