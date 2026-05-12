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
        'user_id',
        'endorser_message',
        'clearance',
    ];

    protected $casts = [
        'item' => 'array',
        'quantity' => 'array',
        'clearance' => 'array',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function items(){
        return $this->belongsTo(Item::class, 'id');
    }

    public function issuances(){
        return $this->hasMany(Issuance::class);
    }
}
