<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $fillable = [
        'title',
        'description',
        'duration_minutes',
        'genre',
        'director',
        'release_date',
        'poster_url'
    ];

    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }
}
