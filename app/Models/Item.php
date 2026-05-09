<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'description',
        'unit_of_measure',
        'total',
        'less',
        'added_receipt'
    ];

    protected $casts = [
        'added_receipt' => 'array',
    ];

    public function requests(){
        return $this->belongsTo(Request::class, 'id');
    }

    public function quantities(){
        return $this->hasMany(Quantity::class);
    }

    public function issuances(){
        return $this->hasMany(Issuance::class);
    }

    public function history(){
        return $this->hasMany(History::class);
    }
}
