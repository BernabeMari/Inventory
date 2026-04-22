<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receiver extends Model
{
    protected $fillable = [
        'description',
        'unit_of_measure',
        'quantity'
    ];

    protected $casts = [
        'quantity' => 'array'
    ];
}
