<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'external_rx_id',
        'patient_name',
        'status',
        'total_cents',
        'placed_at',
    ];


    protected $casts = [
        'placed_at' => 'datetime'
    ];

    public function items(): HasMany{
        return $this->hasMany( OrderItem::class );
    }

}
