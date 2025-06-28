import './bootstrap';
import Alpine from 'alpinejs';

// Theme Switcher Component
Alpine.data('themeSwitcher', () => ({
    theme: 'system',
    
    init() {
        this.theme = this.getTheme();
        this.updateTheme();
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.theme === 'system') {
                this.updateTheme();
            }
        });
    },
    
    getTheme() {
        return localStorage.getItem('theme') || 'system';
    },
    
    setTheme(newTheme) {
        this.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        this.updateTheme();
        
        // Send to server
        fetch('/theme/switch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ theme: newTheme })
        });
    },
    
    updateTheme() {
        const html = document.documentElement;
        
        if (this.theme === 'dark' || (this.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }
}));

// Service Management Component
Alpine.data('serviceManager', () => ({
    services: [],
    serviceTypes: [],
    showCreateModal: false,
    selectedServiceType: null,
    serviceName: '',
    loading: false,
    
    async init() {
        await this.fetchServices();
        await this.fetchServiceTypes();
    },
    
    async fetchServices() {
        try {
            const response = await fetch('/api/services');
            this.services = await response.json();
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    },
    
    async fetchServiceTypes() {
        try {
            const response = await fetch('/api/service-types');
            this.serviceTypes = await response.json();
        } catch (error) {
            console.error('Error fetching service types:', error);
        }
    },
    
    openCreateModal() {
        this.showCreateModal = true;
        this.selectedServiceType = null;
        this.serviceName = '';
    },
    
    closeCreateModal() {
        this.showCreateModal = false;
        this.selectedServiceType = null;
        this.serviceName = '';
    },
    
    selectServiceType(serviceType) {
        this.selectedServiceType = serviceType;
    },
    
    async createService() {
        if (!this.selectedServiceType || !this.serviceName.trim()) {
            alert('Please select a service type and enter a name');
            return;
        }
        
        this.loading = true;
        
        try {
            const response = await fetch('/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    name: this.serviceName,
                    service_type_id: this.selectedServiceType.id
                })
            });
            
            if (response.ok) {
                await this.fetchServices();
                this.closeCreateModal();
                alert('Service created successfully!');
            } else {
                const error = await response.json();
                alert('Error: ' + (error.message || 'Failed to create service'));
            }
        } catch (error) {
            console.error('Error creating service:', error);
            alert('Error creating service');
        } finally {
            this.loading = false;
        }
    },
    
    async deleteService(serviceId) {
        if (!confirm('Are you sure you want to delete this service? You will receive a pro-rated refund.')) {
            return;
        }
        
        try {
            const response = await fetch(`/services/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            if (response.ok) {
                await this.fetchServices();
                alert('Service deleted successfully!');
            } else {
                alert('Error deleting service');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Error deleting service');
        }
    }
}));

window.Alpine = Alpine;
Alpine.start();