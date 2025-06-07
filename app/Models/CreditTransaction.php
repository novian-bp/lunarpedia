<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreditTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'description',
        'service_id',
    ];

    protected $casts = [
        'amount' => 'integer',
    ];

    /**
     * Get the user that owns the transaction
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the service associated with the transaction
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Scope for purchase transactions
     */
    public function scopePurchases($query)
    {
        return $query->where('type', 'purchase');
    }

    /**
     * Scope for usage transactions
     */
    public function scopeUsage($query)
    {
        return $query->where('type', 'usage');
    }

    /**
     * Scope for refund transactions
     */
    public function scopeRefunds($query)
    {
        return $query->where('type', 'refund');
    }
}