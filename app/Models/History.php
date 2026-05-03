<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $table = 'item_history';

    protected $fillable = [
        'item_id',
        'unit_of_measure',
        'beginning_inventory',
        'add_receipts',
        'total',
        'less',
        'ending_balance',
    ];

    protected $casts = [
        'add_receipts' => 'array'
    ];

    public function item(){
        return $this->belongsTo(Item::class);
    }
}
