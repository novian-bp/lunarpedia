<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'docker_image',
        'status',
        'credits_per_month',
        'url',
        'custom_domain',
        'has_custom_domain',
        'environment_variables',
        'ports',
    ];

    protected $casts = [
        'environment_variables' => 'array',
        'ports' => 'array',
        'has_custom_domain' => 'boolean',
        'credits_per_month' => 'integer',
    ];

    /**
     * Get the user that owns the service
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get service type
     */
    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class, 'type', 'type');
    }

    /**
     * Get credit transactions for this service
     */
    public function creditTransactions()
    {
        return $this->hasMany(CreditTransaction::class);
    }

    /**
     * Get addons for this service
     */
    public function addons()
    {
        return $this->hasMany(UserAddon::class);
    }

    /**
     * Generate unique URL for service
     */
    public static function generateUrl(string $name, int $userId): string
    {
        $cleanName = strtolower(preg_replace('/[^a-z0-9\s-]/', '', $name));
        $cleanName = preg_replace('/\s+/', '-', $cleanName);
        $cleanName = preg_replace('/-+/', '-', $cleanName);
        $cleanName = trim($cleanName, '-');
        
        $uniqueId = substr(md5($name . $userId . time()), 0, 8);
        
        return "https://{$cleanName}-{$uniqueId}.user.lunarpedia.app";
    }

    /**
     * Calculate pro-rated refund
     */
    public function calculateRefund(): array
    {
        $now = now();
        $createdDate = $this->created_at;
        
        // Calculate days in current billing period
        $billingStart = $createdDate->copy()->startOfMonth();
        $billingEnd = $billingStart->copy()->addMonth();
        
        if ($billingStart->gt($now)) {
            $billingStart->subMonth();
            $billingEnd->subMonth();
        }
        
        $totalDays = $billingStart->diffInDays($billingEnd);
        $usedDays = $billingStart->diffInDays($now);
        $remainingDays = max(0, $totalDays - $usedDays);
        
        // Calculate refund amount
        $baseRefund = floor(($remainingDays / $totalDays) * $this->credits_per_month);
        $customDomainRefund = $this->has_custom_domain ? floor(($remainingDays / $totalDays) * 25) : 0;
        $totalRefund = $baseRefund + $customDomainRefund;
        
        return [
            'total_days' => $totalDays,
            'used_days' => $usedDays,
            'remaining_days' => $remainingDays,
            'base_refund' => $baseRefund,
            'custom_domain_refund' => $customDomainRefund,
            'total_refund' => $totalRefund,
            'billing_start' => $billingStart->format('Y-m-d'),
            'billing_end' => $billingEnd->format('Y-m-d'),
        ];
    }
}