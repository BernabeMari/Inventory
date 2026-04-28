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
        'less'
    ];

    protected $casts = [
        'quantity' => 'array'
    ];

    public function requests(){
        return $this->belongsTo(Request::class, 'id');
    }
}
