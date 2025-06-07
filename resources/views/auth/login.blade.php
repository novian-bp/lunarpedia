@extends('layouts.app')

@section('content')
<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div class="text-center">
            <div class="flex items-center justify-center space-x-2 mb-6">
                <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.4 4.4 0 003 15z"></path>
                </svg>
                <span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Lunarpedia
                </span>
            </div>
            <h2 class="text-3xl font-bold text-white">Selamat Datang Kembali</h2>
            <p class="mt-2 text-white/60">Masuk ke akun Lunarpedia Anda</p>
        </div>

        <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            @if ($errors->any())
                <div class="mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-red-400 text-sm">{{ $errors->first() }}</p>
                    </div>
                </div>
            @endif

            <form method="POST" action="{{ route('login') }}" class="space-y-6">
                @csrf
                
                <div>
                    <label for="email" class="block text-white/80 text-sm font-medium mb-2">Email</label>
                    <input id="email" name="email" type="email" required 
                           class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                           placeholder="Masukkan email Anda" value="{{ old('email') }}">
                </div>

                <div>
                    <label for="password" class="block text-white/80 text-sm font-medium mb-2">Password</label>
                    <input id="password" name="password" type="password" required 
                           class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                           placeholder="Masukkan password Anda">
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember" name="remember" type="checkbox" 
                               class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/20 rounded bg-white/5">
                        <label for="remember" class="ml-2 block text-sm text-white/60">
                            Ingat saya
                        </label>
                    </div>
                </div>

                <button type="submit" 
                        class="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-semibold">
                    Masuk
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-white/60">
                    Belum punya akun?
                    <a href="{{ route('register') }}" class="text-purple-400 hover:text-purple-300 ml-1 font-semibold">
                        Daftar sekarang
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>
@endsection