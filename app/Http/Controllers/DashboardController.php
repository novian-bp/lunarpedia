<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $services = $user->services()->with('serviceType')->latest()->get();
        $serviceTypes = ServiceType::published()->get();
        
        $stats = [
            'active_services' => $services->where('status', 'running')->count(),
            'total_services' => $services->count(),
            'monthly_usage' => $services->sum('credits_per_month'),
            'custom_domains' => $services->where('has_custom_domain', true)->count(),
        ];

        return view('dashboard.index', compact('user', 'services', 'serviceTypes', 'stats'));
    }

    public function createService(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'service_type_id' => 'required|exists:service_types,id',
            'environment_variables' => 'array',
        ]);

        $user = Auth::user();
        $serviceType = ServiceType::findOrFail($request->service_type_id);

        // Check if user has enough credits
        if (!$user->hasEnoughCredits($serviceType->credits_per_month)) {
            return back()->withErrors(['credits' => 'Kredit tidak mencukupi untuk membuat layanan ini.']);
        }

        // Generate environment variables with auto-generated values
        $environment = $serviceType->default_environment ?? [];
        foreach ($environment as $key => $value) {
            if (empty($value) && isset($request->environment_variables[$key])) {
                $environment[$key] = $request->environment_variables[$key];
            } elseif (empty($value)) {
                // Auto-generate secure values
                if (str_contains(strtolower($key), 'password')) {
                    $environment[$key] = $this->generatePassword();
                } elseif (str_contains(strtolower($key), 'secret')) {
                    $environment[$key] = $this->generateSecretKey();
                }
            }
        }

        $service = Service::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'type' => $serviceType->type,
            'docker_image' => $serviceType->docker_image,
            'status' => 'pending',
            'credits_per_month' => $serviceType->credits_per_month,
            'url' => Service::generateUrl($request->name, $user->id),
            'environment_variables' => $environment,
            'ports' => $serviceType->default_ports,
        ]);

        // Deduct credits
        $user->updateCredits(
            -$serviceType->credits_per_month,
            "Langganan bulanan untuk {$request->name}",
            $service->id
        );

        return redirect()->back()->with('success', 'Layanan berhasil dibuat!');
    }

    public function deleteService(Service $service)
    {
        $this->authorize('delete', $service);

        $refundInfo = $service->calculateRefund();
        
        // Add refund to user credits
        if ($refundInfo['total_refund'] > 0) {
            $service->user->updateCredits(
                $refundInfo['total_refund'],
                "Refund pro-rata untuk {$service->name}",
                $service->id
            );
        }

        $service->delete();

        return redirect()->back()->with('success', "Layanan berhasil dihapus. Refund {$refundInfo['total_refund']} kredit telah ditambahkan ke akun Anda.");
    }

    public function updateServiceStatus(Service $service, Request $request)
    {
        $this->authorize('update', $service);

        $request->validate([
            'status' => 'required|in:running,stopped,pending,error',
        ]);

        $service->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status layanan berhasil diperbarui!');
    }

    private function generatePassword(int $length = 16): string
    {
        $charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= $charset[random_int(0, strlen($charset) - 1)];
        }
        return $password;
    }

    private function generateSecretKey(int $length = 32): string
    {
        return bin2hex(random_bytes($length / 2));
    }
}