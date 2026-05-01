<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'description',
        'unit_of_measure',
        'total',
    ];

    public function requests(){
        return $this->belongsTo(Request::class, 'id');
    }

    public function quantities(){
        return $this->hasMany(Quantity::class, 'item_id');
    }

    public function issuances(){
        return $this->hasMany(Issuance::class, 'id');
    }
}
