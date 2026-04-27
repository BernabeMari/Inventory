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
        'unfulfilled_quantity',
        'user_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
