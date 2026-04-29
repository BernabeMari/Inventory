<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = [
        'item',
        'quantity',
        'status',
        'message',
        'endorser_message',
        'fulfilled_quantity',
        'unfulfilled_quantity',
        'user_id',
        'issued_item',
    ];

    protected $casts = [
        'item' => 'array',
        'quantity' => 'array',
        'issued_item' => 'array',
        'fulfilled_quantity' => 'array',
        'unfulfilled_quantity' => 'array',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function receiver(){
        return $this->belongsTo(Receiver::class, 'id');
    }
}
