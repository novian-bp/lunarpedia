<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Service;
use App\Models\ServiceType;
use App\Models\CreditTransaction;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!auth()->user()->isAdmin()) {
                abort(403, 'Akses ditolak. Hanya admin yang dapat mengakses halaman ini.');
            }
            return $next($request);
        });
    }

    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_services' => Service::count(),
            'active_services' => Service::where('status', 'running')->count(),
            'total_revenue' => CreditTransaction::where('type', 'purchase')->sum('amount'),
        ];

        $recentUsers = User::latest()->take(5)->get();
        $recentServices = Service::with('user')->latest()->take(5)->get();

        return view('admin.index', compact('stats', 'recentUsers', 'recentServices'));
    }

    public function users()
    {
        $users = User::withCount('services')->latest()->paginate(20);
        return view('admin.users', compact('users'));
    }

    public function services()
    {
        $services = Service::with('user')->latest()->paginate(20);
        return view('admin.services', compact('services'));
    }

    public function serviceTypes()
    {
        $serviceTypes = ServiceType::latest()->paginate(20);
        return view('admin.service-types', compact('serviceTypes'));
    }

    public function createServiceType(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'docker_image' => 'required|string|max:255',
            'description' => 'required|string',
            'credits_per_month' => 'required|integer|min:1',
            'status' => 'required|in:published,draft,archived',
            'default_environment' => 'nullable|json',
            'default_ports' => 'nullable|json',
        ]);

        ServiceType::create([
            'name' => $request->name,
            'type' => $request->type,
            'docker_image' => $request->docker_image,
            'description' => $request->description,
            'credits_per_month' => $request->credits_per_month,
            'status' => $request->status,
            'default_environment' => $request->default_environment ? json_decode($request->default_environment, true) : [],
            'default_ports' => $request->default_ports ? json_decode($request->default_ports, true) : [],
        ]);

        return redirect()->back()->with('success', 'Service type berhasil dibuat!');
    }

    public function updateServiceType(ServiceType $serviceType, Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'docker_image' => 'required|string|max:255',
            'description' => 'required|string',
            'credits_per_month' => 'required|integer|min:1',
            'status' => 'required|in:published,draft,archived',
            'default_environment' => 'nullable|json',
            'default_ports' => 'nullable|json',
        ]);

        $serviceType->update([
            'name' => $request->name,
            'type' => $request->type,
            'docker_image' => $request->docker_image,
            'description' => $request->description,
            'credits_per_month' => $request->credits_per_month,
            'status' => $request->status,
            'default_environment' => $request->default_environment ? json_decode($request->default_environment, true) : [],
            'default_ports' => $request->default_ports ? json_decode($request->default_ports, true) : [],
        ]);

        return redirect()->back()->with('success', 'Service type berhasil diperbarui!');
    }

    public function deleteServiceType(ServiceType $serviceType)
    {
        $serviceType->delete();
        return redirect()->back()->with('success', 'Service type berhasil dihapus!');
    }

    public function updateUserCredits(User $user, Request $request)
    {
        $request->validate([
            'credits' => 'required|integer',
            'description' => 'required|string|max:255',
        ]);

        $creditChange = $request->credits - $user->credits;
        
        $user->updateCredits($creditChange, $request->description);

        return redirect()->back()->with('success', 'Kredit pengguna berhasil diperbarui!');
    }
}