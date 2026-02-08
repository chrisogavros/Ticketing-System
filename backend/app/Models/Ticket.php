<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'booking_id',
        'row_number',
        'seat_number',
        'price',
        'checked_in'
    ];

    protected $casts = [
        'checked_in' => 'boolean',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
