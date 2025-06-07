@extends('layouts.app')

@section('content')
<div class="min-h-screen">
    <!-- Header -->
    <header class="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-4">
                    <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.4 4.4 0 003 15z"></path>
                    </svg>
                    <span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Lunarpedia
                    </span>
                    <span class="text-white/60">Dashboard</span>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                        <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        <span class="text-white font-semibold">{{ $user->credits }} Kredit</span>
                    </div>
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button type="submit" class="p-2 text-white/60 hover:text-white transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Success/Error Messages -->
        @if(session('success'))
            <div class="mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div class="flex items-center">
                    <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-green-400">{{ session('success') }}</p>
                </div>
            </div>
        @endif

        @if($errors->any())
            <div class="mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                @foreach($errors->all() as $error)
                    <div class="flex items-center mb-1 last:mb-0">
                        <svg class="w-4 h-4 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-red-400 text-sm">{{ $error }}</p>
                    </div>
                @endforeach
            </div>
        @endif

        <!-- Stats Cards -->
        <div class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white/60 text-sm">Layanan Aktif</p>
                        <p class="text-2xl font-bold text-white">{{ $stats['active_services'] }}</p>
                    </div>
                    <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                    </svg>
                </div>
            </div>
            <div class="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white/60 text-sm">Total Layanan</p>
                        <p class="text-2xl font-bold text-white">{{ $stats['total_services'] }}</p>
                    </div>
                    <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                </div>
            </div>
            <div class="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white/60 text-sm">Penggunaan Bulanan</p>
                        <p class="text-2xl font-bold text-white">{{ $stats['monthly_usage'] }} Kredit</p>
                    </div>
                    <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                </div>
            </div>
            <div class="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white/60 text-sm">Domain Kustom</p>
                        <p class="text-2xl font-bold text-white">{{ $stats['custom_domains'] }}</p>
                    </div>
                    <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Services Section -->
        <div class="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div class="p-6 border-b border-white/10">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold text-white">Layanan Docker Anda</h2>
                    <button onclick="openCreateModal()" class="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Deploy Layanan
                    </button>
                </div>
            </div>

            <div class="divide-y divide-white/10">
                @forelse($services as $service)
                    <div class="p-6 hover:bg-white/5 transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="p-2 bg-white/10 rounded-lg text-purple-400">
                                    @if($service->type === 'n8n')
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    @elseif($service->type === 'chatwoot')
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                    @else
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                                        </svg>
                                    @endif
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-white">{{ $service->name }}</h3>
                                    <div class="flex items-center space-x-2 mb-1">
                                        <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                        <span class="text-blue-400 text-sm font-mono">{{ $service->docker_image }}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <svg class="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                                        </svg>
                                        <a href="{{ $service->url }}" target="_blank" class="text-white/60 text-sm hover:text-white transition-colors">{{ $service->url }}</a>
                                    </div>
                                    <p class="text-white/40 text-xs">
                                        Dibuat: {{ $service->created_at->format('d M Y') }} • ID: {{ $service->id }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <span class="px-3 py-1 rounded-full text-xs font-medium 
                                    @if($service->status === 'running') text-green-400 bg-green-400/20
                                    @elseif($service->status === 'stopped') text-red-400 bg-red-400/20
                                    @else text-yellow-400 bg-yellow-400/20 @endif">
                                    {{ ucfirst($service->status) }}
                                </span>
                                <span class="text-white/60 text-sm">{{ $service->credits_per_month }} kredit/bulan</span>
                                <div class="flex items-center space-x-2">
                                    <form method="POST" action="{{ route('services.status', $service) }}" class="inline">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="status" value="running">
                                        <button type="submit" class="p-2 text-white/60 hover:text-green-400 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                            </svg>
                                        </button>
                                    </form>
                                    <form method="POST" action="{{ route('services.status', $service) }}" class="inline">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="status" value="stopped">
                                        <button type="submit" class="p-2 text-white/60 hover:text-yellow-400 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </button>
                                    </form>
                                    <form method="POST" action="{{ route('services.delete', $service) }}" class="inline" 
                                          onsubmit="return confirm('Apakah Anda yakin ingin menghapus layanan ini? Anda akan mendapat refund pro-rata.')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-2 text-white/60 hover:text-red-400 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="p-12 text-center">
                        <svg class="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                        </svg>
                        <h3 class="text-xl font-semibold text-white mb-2">Belum Ada Layanan</h3>
                        <p class="text-white/60 mb-6">Deploy layanan Docker pertama Anda untuk memulai</p>
                        <button onclick="openCreateModal()" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                            Deploy Layanan Pertama
                        </button>
                    </div>
                @endforelse
            </div>
        </div>
    </div>

    <!-- Create Service Modal -->
    <div id="createModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-white">Deploy Layanan Docker</h3>
                <button onclick="closeCreateModal()" class="text-white/60 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <form method="POST" action="{{ route('services.create') }}" class="space-y-6">
                @csrf
                
                <div>
                    <label class="block text-white/80 text-sm font-medium mb-2">Pilih Layanan Docker</label>
                    <div class="grid gap-3">
                        @foreach($serviceTypes as $serviceType)
                            <label class="cursor-pointer">
                                <input type="radio" name="service_type_id" value="{{ $serviceType->id }}" class="sr-only peer" required>
                                <div class="p-4 rounded-lg border border-white/20 peer-checked:border-purple-500 peer-checked:bg-purple-500/20 hover:border-white/40 transition-all duration-200">
                                    <div class="flex items-center space-x-3 mb-2">
                                        <div class="text-purple-400">
                                            @if($serviceType->type === 'n8n')
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                </svg>
                                            @elseif($serviceType->type === 'chatwoot')
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                                </svg>
                                            @else
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                                                </svg>
                                            @endif
                                        </div>
                                        <div>
                                            <p class="text-white font-medium">{{ $serviceType->name }}</p>
                                            <p class="text-white/60 text-sm">{{ $serviceType->credits_per_month }} kredit/bulan</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-2 mb-2">
                                        <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                        <span class="text-blue-400 text-sm font-mono">{{ $serviceType->docker_image }}</span>
                                    </div>
                                    <p class="text-white/70 text-sm">{{ $serviceType->description }}</p>
                                </div>
                            </label>
                        @endforeach
                    </div>
                </div>
                
                <div>
                    <label for="name" class="block text-white/80 text-sm font-medium mb-2">Nama Layanan</label>
                    <input type="text" name="name" id="name" required 
                           class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                           placeholder="Masukkan nama layanan (contoh: My Workflow Hub)">
                </div>

                <div class="flex space-x-3">
                    <button type="button" onclick="closeCreateModal()" 
                            class="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">
                        Batal
                    </button>
                    <button type="submit" 
                            class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                        Deploy Layanan
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function openCreateModal() {
    document.getElementById('createModal').classList.remove('hidden');
}

function closeCreateModal() {
    document.getElementById('createModal').classList.add('hidden');
}

// Close modal when clicking outside
document.getElementById('createModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCreateModal();
    }
});
</script>
@endsection