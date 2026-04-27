<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receiver extends Model
{
    protected $fillable = [
        'description',
        'unit_of_measure',
        'quantity',
        'total',
    ];

    protected $casts = [
        'quantity' => 'array'
    ];
}
