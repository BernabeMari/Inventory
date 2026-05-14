<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Audit extends Model
{
    protected $table = 'audit';

    protected $fillable = [
        'user_id',
        'username',
        'role',
        'action',
        'method',
        'route_name',
        'url',
        'ip_address',
        'user_agent',
        'status_code',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
