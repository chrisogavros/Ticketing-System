<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    protected $fillable = ['name', 'total_rows', 'total_cols'];

    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }
}
