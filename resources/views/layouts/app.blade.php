<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="theme-system">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Lunarpedia PaaS Platform') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Theme Script (must be inline to prevent flash) -->
    <script>
        (function() {
            const theme = document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1] || 'system';
            const html = document.documentElement;
            
            html.className = `theme-${theme}`;
            
            if (theme === 'system') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    html.classList.add('dark');
                } else {
                    html.classList.remove('dark');
                }
            } else if (theme === 'dark') {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        })();
    </script>
</head>
<body class="font-sans antialiased bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 min-h-screen transition-colors duration-300">
    <div class="min-h-screen">
        @yield('content')
    </div>

    <!-- Theme Switcher Component -->
    <div id="theme-switcher" class="fixed bottom-6 right-6 z-50">
        <div class="relative">
            <button 
                id="theme-button" 
                class="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                title="Switch Theme"
            >
                <!-- System Icon -->
                <svg id="system-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                
                <!-- Light Icon -->
                <svg id="light-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                
                <!-- Dark Icon -->
                <svg id="dark-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
            </button>
            
            <!-- Theme Options Dropdown -->
            <div id="theme-dropdown" class="absolute bottom-full right-0 mb-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 min-w-[140px] hidden">
                <button 
                    data-theme="system" 
                    class="theme-option w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    System
                    <svg class="w-4 h-4 ml-auto text-purple-600 dark:text-purple-400 hidden check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </button>
                
                <button 
                    data-theme="light" 
                    class="theme-option w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Light
                    <svg class="w-4 h-4 ml-auto text-purple-600 dark:text-purple-400 hidden check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </button>
                
                <button 
                    data-theme="dark" 
                    class="theme-option w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                    Dark
                    <svg class="w-4 h-4 ml-auto text-purple-600 dark:text-purple-400 hidden check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Theme Switcher JavaScript -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const themeButton = document.getElementById('theme-button');
            const themeDropdown = document.getElementById('theme-dropdown');
            const themeOptions = document.querySelectorAll('.theme-option');
            const html = document.documentElement;
            
            // Icons
            const systemIcon = document.getElementById('system-icon');
            const lightIcon = document.getElementById('light-icon');
            const darkIcon = document.getElementById('dark-icon');
            
            // Get current theme
            let currentTheme = document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1] || 'system';
            
            // Update UI based on current theme
            function updateThemeUI() {
                // Hide all icons
                systemIcon.classList.add('hidden');
                lightIcon.classList.add('hidden');
                darkIcon.classList.add('hidden');
                
                // Show current theme icon
                if (currentTheme === 'system') {
                    systemIcon.classList.remove('hidden');
                } else if (currentTheme === 'light') {
                    lightIcon.classList.remove('hidden');
                } else {
                    darkIcon.classList.remove('hidden');
                }
                
                // Update check marks
                themeOptions.forEach(option => {
                    const checkIcon = option.querySelector('.check-icon');
                    if (option.dataset.theme === currentTheme) {
                        checkIcon.classList.remove('hidden');
                    } else {
                        checkIcon.classList.add('hidden');
                    }
                });
                
                // Update HTML class
                html.className = `theme-${currentTheme}`;
                
                // Apply dark mode based on theme
                if (currentTheme === 'system') {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        html.classList.add('dark');
                    } else {
                        html.classList.remove('dark');
                    }
                } else if (currentTheme === 'dark') {
                    html.classList.add('dark');
                } else {
                    html.classList.remove('dark');
                }
            }
            
            // Initialize UI
            updateThemeUI();
            
            // Toggle dropdown
            themeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                themeDropdown.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function() {
                themeDropdown.classList.add('hidden');
            });
            
            // Prevent dropdown from closing when clicking inside
            themeDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // Handle theme selection
            themeOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const newTheme = this.dataset.theme;
                    
                    // Update current theme
                    currentTheme = newTheme;
                    
                    // Send request to server
                    fetch('/theme/switch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({ theme: newTheme })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Update UI
                            updateThemeUI();
                            
                            // Close dropdown
                            themeDropdown.classList.add('hidden');
                            
                            // Show success message (optional)
                            console.log(data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error switching theme:', error);
                    });
                });
            });
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
                if (currentTheme === 'system') {
                    updateThemeUI();
                }
            });
        });
    </script>

    <!-- Alpine.js -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</body>
</html>