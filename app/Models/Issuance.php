<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Issuance extends Model
{
    protected $fillable = [
        'user_id',
        'request_id',
        'item_id',
        'issued_item',
        'fulfilled_quantity',
        'unfulfilled_quantity',
    ];
    protected $casts = [
        'issued_item' => 'array',
        'fulfilled_quantity' => 'array',
        'unfulfilled_quantity' => 'array',
    ];
    public function requests(){
        return $this->belongsTo(Request::class);
    }
}
