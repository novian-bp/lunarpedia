<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddon extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_id',
        'addon_type',
        'addon_name',
        'credits_per_month',
        'status',
        'activated_at',
        'next_billing',
    ];

    protected $casts = [
        'credits_per_month' => 'integer',
        'activated_at' => 'datetime',
        'next_billing' => 'datetime',
    ];

    /**
     * Get the user that owns the addon
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the service associated with the addon
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Scope for active addons
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Calculate pro-rated refund for addon
     */
    public function calculateRefund(): int
    {
        $now = now();
        $billingStart = $this->activated_at->copy()->startOfMonth();
        $billingEnd = $this->next_billing;
        
        $totalDays = $billingStart->diffInDays($billingEnd);
        $usedDays = $billingStart->diffInDays($now);
        $remainingDays = max(0, $totalDays - $usedDays);
        
        return floor(($remainingDays / $totalDays) * $this->credits_per_month);
    }
}