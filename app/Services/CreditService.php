<?php

namespace App\Services;

use App\Models\User;
use App\Models\Service;
use App\Models\CreditTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreditService
{
    /**
     * Add credits to user account
     */
    public function addCredits(User $user, int $amount, string $description, ?Service $service = null): CreditTransaction
    {
        return DB::transaction(function () use ($user, $amount, $description, $service) {
            // Update user credits
            $user->increment('credits', $amount);

            // Create transaction record
            $transaction = CreditTransaction::create([
                'user_id' => $user->id,
                'type' => 'purchase',
                'amount' => $amount,
                'description' => $description,
                'service_id' => $service?->id,
            ]);

            Log::info("Credits added to user", [
                'user_id' => $user->id,
                'amount' => $amount,
                'new_balance' => $user->fresh()->credits,
                'description' => $description
            ]);

            return $transaction;
        });
    }

    /**
     * Deduct credits from user account
     */
    public function deductCredits(User $user, int $amount, string $description, ?Service $service = null): CreditTransaction
    {
        return DB::transaction(function () use ($user, $amount, $description, $service) {
            // Check if user has enough credits
            if ($user->credits < $amount) {
                throw new \Exception("Insufficient credits. Required: {$amount}, Available: {$user->credits}");
            }

            // Update user credits
            $user->decrement('credits', $amount);

            // Create transaction record
            $transaction = CreditTransaction::create([
                'user_id' => $user->id,
                'type' => 'usage',
                'amount' => -$amount, // Negative for deduction
                'description' => $description,
                'service_id' => $service?->id,
            ]);

            Log::info("Credits deducted from user", [
                'user_id' => $user->id,
                'amount' => $amount,
                'new_balance' => $user->fresh()->credits,
                'description' => $description
            ]);

            return $transaction;
        });
    }

    /**
     * Process refund for user
     */
    public function processRefund(User $user, int $amount, string $description, ?Service $service = null): CreditTransaction
    {
        return DB::transaction(function () use ($user, $amount, $description, $service) {
            // Update user credits
            $user->increment('credits', $amount);

            // Create transaction record
            $transaction = CreditTransaction::create([
                'user_id' => $user->id,
                'type' => 'refund',
                'amount' => $amount,
                'description' => $description,
                'service_id' => $service?->id,
            ]);

            Log::info("Refund processed for user", [
                'user_id' => $user->id,
                'amount' => $amount,
                'new_balance' => $user->fresh()->credits,
                'description' => $description
            ]);

            return $transaction;
        });
    }

    /**
     * Calculate pro-rated refund for a service
     */
    public function calculateProRatedRefund(Service $service): array
    {
        $now = now();
        $createdDate = $service->created_at;
        
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
        $baseRefund = floor(($remainingDays / $totalDays) * $service->credits_per_month);
        $customDomainRefund = $service->has_custom_domain ? 
            floor(($remainingDays / $totalDays) * config('services.lunarpedia.custom_domain_price', 25)) : 0;
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

    /**
     * Check if user has enough credits for a service
     */
    public function hasEnoughCredits(User $user, int $requiredCredits): bool
    {
        return $user->credits >= $requiredCredits;
    }

    /**
     * Get user's credit usage for current month
     */
    public function getMonthlyUsage(User $user): int
    {
        $startOfMonth = now()->startOfMonth();
        
        return CreditTransaction::where('user_id', $user->id)
            ->where('type', 'usage')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('amount') * -1; // Convert negative to positive
    }

    /**
     * Get user's total purchases
     */
    public function getTotalPurchases(User $user): int
    {
        return CreditTransaction::where('user_id', $user->id)
            ->where('type', 'purchase')
            ->sum('amount');
    }

    /**
     * Get user's total refunds
     */
    public function getTotalRefunds(User $user): int
    {
        return CreditTransaction::where('user_id', $user->id)
            ->where('type', 'refund')
            ->sum('amount');
    }

    /**
     * Process monthly billing for all active services
     */
    public function processMonthlyBilling(): void
    {
        Log::info("Starting monthly billing process");

        $activeServices = Service::where('status', 'running')->with('user')->get();

        foreach ($activeServices as $service) {
            try {
                $totalCost = $service->credits_per_month;
                
                // Add custom domain cost if applicable
                if ($service->has_custom_domain) {
                    $totalCost += config('services.lunarpedia.custom_domain_price', 25);
                }

                // Check if user has enough credits
                if ($service->user->credits >= $totalCost) {
                    $this->deductCredits(
                        $service->user,
                        $totalCost,
                        "Monthly billing for {$service->name}",
                        $service
                    );
                } else {
                    // Insufficient credits - stop the service
                    $service->update(['status' => 'stopped']);
                    
                    Log::warning("Service stopped due to insufficient credits", [
                        'service_id' => $service->id,
                        'user_id' => $service->user_id,
                        'required_credits' => $totalCost,
                        'available_credits' => $service->user->credits
                    ]);
                }
            } catch (\Exception $e) {
                Log::error("Failed to process monthly billing for service", [
                    'service_id' => $service->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        Log::info("Monthly billing process completed");
    }
}