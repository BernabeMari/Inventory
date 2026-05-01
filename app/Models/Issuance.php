<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Issuance extends Model
{
    protected $fillable = [
        'user_id',
        'item_id',
        'less',
    ];
}
