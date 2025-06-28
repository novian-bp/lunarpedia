import React, { useState } from 'react';
import { 
  Server, 
  Plus, 
  CreditCard, 
  LogOut, 
  Activity,
  Zap,
  MessageSquare,
  Database,
  Play,
  Pause,
  Trash2,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Globe,
  Crown,
  ExternalLink,
  Package,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
import { UserAddonsPage } from './UserAddonsPage';
import { LoadingSpinner } from './LoadingSpinner';
import { useToast } from './Toast';

interface UserDashboardProps {
  user: any;
  onLogout: () => void;
  onBuyCredits: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, onBuyCredits }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'addons'>('dashboard');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  
  // Mock data - in real app this would come from Supabase
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'My Workflow Hub',
      type: 'n8n',
      dockerImage: 'n8nio/n8n:latest',
      status: 'running',
      credits: 50,
      url: 'https://my-workflow-hub-1.user.lunarpedia.app',
      customDomain: 'workflow.mycompany.com',
      hasCustomDomain: true,
      createdAt: '2024-01-15',
      billingCycle: 'monthly',
      environment: [
        { key: 'N8N_BASIC_AUTH_ACTIVE', value: 'true' },
        { key: 'N8N_BASIC_AUTH_USER', value: 'admin' },
        { key: 'N8N_BASIC_AUTH_PASSWORD', value: 'SecurePass123!' }
      ],
      ports: [{ internal: 5678, external: 5678, protocol: 'HTTP' }]
    },
    {
      id: 2,
      name: 'Support Chat',
      type: 'chatwoot',
      dockerImage: 'chatwoot/chatwoot:latest',
      status: 'stopped',
      credits: 40,
      url: 'https://support-chat-2.user.lunarpedia.app',
      customDomain: null,
      hasCustomDomain: false,
      createdAt: '2024-01-20',
      billingCycle: 'monthly',
      environment: [
        { key: 'POSTGRES_PASSWORD', value: 'DbPass456!' },
        { key: 'REDIS_PASSWORD', value: 'RedisPass789!' },
        { key: 'SECRET_KEY_BASE', value: 'SecretKey123456789!' }
      ],
      ports: [{ internal: 3000, external: 3000, protocol: 'HTTP' }]
    }
  ]);

  // Available Docker services
  const availableServiceTypes = [
    { 
      id: 1,
      type: 'n8n', 
      name: 'n8n Workflow', 
      dockerImage: 'n8nio/n8n:latest',
      icon: <Zap className="w-6 h-6" />, 
      credits: 50, 
      status: 'published',
      description: 'Powerful workflow automation platform',
      environment: [
        { key: 'N8N_BASIC_AUTH_ACTIVE', value: 'true', required: true, autoGenerate: false },
        { key: 'N8N_BASIC_AUTH_USER', value: 'admin', required: true, autoGenerate: false },
        { key: 'N8N_BASIC_AUTH_PASSWORD', value: '', required: true, secret: true, autoGenerate: true }
      ],
      ports: [{ internal: 5678, external: 5678, protocol: 'HTTP' }]
    },
    { 
      id: 2,
      type: 'chatwoot', 
      name: 'Chatwoot', 
      dockerImage: 'chatwoot/chatwoot:latest',
      icon: <MessageSquare className="w-6 h-6" />, 
      credits: 40, 
      status: 'published',
      description: 'Customer engagement platform',
      environment: [
        { key: 'POSTGRES_PASSWORD', value: '', required: true, secret: true, autoGenerate: true },
        { key: 'REDIS_PASSWORD', value: '', required: true, secret: true, autoGenerate: true },
        { key: 'SECRET_KEY_BASE', value: '', required: true, secret: true, autoGenerate: true }
      ],
      ports: [{ internal: 3000, external: 3000, protocol: 'HTTP' }]
    },
    { 
      id: 3,
      type: 'database', 
      name: 'PostgreSQL Database', 
      dockerImage: 'postgres:15-alpine',
      icon: <Database className="w-6 h-6" />, 
      credits: 30, 
      status: 'published',
      description: 'Reliable PostgreSQL database',
      environment: [
        { key: 'POSTGRES_DB', value: 'myapp', required: true, autoGenerate: false },
        { key: 'POSTGRES_USER', value: 'admin', required: true, autoGenerate: false },
        { key: 'POSTGRES_PASSWORD', value: '', required: true, secret: true, autoGenerate: true }
      ],
      ports: [{ internal: 5432, external: 5432, protocol: 'TCP' }]
    }
  ];

  const [showCreateService, setShowCreateService] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<any>(null);
  const [serviceName, setServiceName] = useState('');

  const stats = {
    activeServices: services.filter(s => s.status === 'running').length,
    totalServices: services.length,
    monthlyUsage: services.reduce((acc, s) => acc + s.credits, 0),
    customDomains: services.filter(s => s.hasCustomDomain).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-400/20';
      case 'stopped': return 'text-red-400 bg-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/20';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'n8n': return <Zap className="w-5 h-5" />;
      case 'chatwoot': return <MessageSquare className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const handleCreateService = async () => {
    if (!selectedServiceType || !serviceName.trim()) {
      showToast('error', 'Silakan pilih jenis layanan dan masukkan nama');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newService = {
        id: Date.now(),
        name: serviceName.trim(),
        type: selectedServiceType.type,
        dockerImage: selectedServiceType.dockerImage,
        status: 'running',
        credits: selectedServiceType.credits,
        url: `https://${serviceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.user.lunarpedia.app`,
        customDomain: null,
        hasCustomDomain: false,
        createdAt: new Date().toISOString().split('T')[0],
        billingCycle: 'monthly',
        environment: selectedServiceType.environment,
        ports: selectedServiceType.ports
      };

      setServices([...services, newService]);
      setShowCreateService(false);
      setSelectedServiceType(null);
      setServiceName('');
      
      showToast('success', `Layanan "${serviceName}" berhasil dibuat!`);
    } catch (error) {
      showToast('error', 'Gagal membuat layanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (service: any) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${service.name}"?`)) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setServices(services.filter(s => s.id !== service.id));
      showToast('success', `Layanan "${service.name}" berhasil dihapus`);
    } catch (error) {
      showToast('error', 'Gagal menghapus layanan');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAction = async (service: any, action: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatus = action === 'start' ? 'running' : 'stopped';
      setServices(services.map(s => 
        s.id === service.id ? { ...s, status: newStatus } : s
      ));
      
      showToast('success', `Layanan "${service.name}" berhasil ${action === 'start' ? 'dimulai' : 'dihentikan'}`);
    } catch (error) {
      showToast('error', `Gagal ${action === 'start' ? 'memulai' : 'menghentikan'} layanan`);
    } finally {
      setLoading(false);
    }
  };

  // If viewing add-ons page, render that component
  if (currentView === 'addons') {
    return (
      <UserAddonsPage
        user={user}
        onBack={() => setCurrentView('dashboard')}
        onBuyCredits={onBuyCredits}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Cloud className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Lunarpedia
              </span>
              <span className="text-white/60">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold">{user.credits || 250} Credits</span>
              </div>
              <button
                onClick={() => setCurrentView('addons')}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
              >
                <Crown className="w-4 h-4 mr-2" />
                Premium Add-ons
              </button>
              <button
                onClick={onBuyCredits}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Buy Credits
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Active Services</p>
                <p className="text-2xl font-bold text-white">{stats.activeServices}</p>
              </div>
              <Server className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Services</p>
                <p className="text-2xl font-bold text-white">{stats.totalServices}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Monthly Usage</p>
                <p className="text-2xl font-bold text-white">{stats.monthlyUsage} Credits</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Custom Domains</p>
                <p className="text-2xl font-bold text-white">{stats.customDomains}</p>
              </div>
              <Globe className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Your Docker Services</h2>
              <button
                onClick={() => setShowCreateService(true)}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Deploy Service
              </button>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg text-purple-400">
                        {getServiceIcon(service.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                          {service.hasCustomDomain && (
                            <Crown className="w-4 h-4 text-yellow-400" title="Custom Domain Active" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-1">
                          <Package className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-sm font-mono">{service.dockerImage}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-white/40" />
                          <a 
                            href={service.hasCustomDomain ? `https://${service.customDomain}` : service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 text-sm hover:text-white transition-colors"
                          >
                            {service.hasCustomDomain ? service.customDomain : service.url}
                          </a>
                          <ExternalLink className="w-3 h-3 text-white/40" />
                        </div>
                        
                        <p className="text-white/40 text-xs">
                          Created: {service.createdAt} • {service.credits} credits/month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleServiceAction(service, service.status === 'running' ? 'stop' : 'start')}
                          disabled={loading}
                          className="p-2 text-white/60 hover:text-green-400 transition-colors disabled:opacity-50"
                        >
                          {service.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service)}
                          disabled={loading}
                          className="p-2 text-white/60 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Server className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Layanan</h3>
                <p className="text-white/60 mb-6">Deploy layanan Docker pertama Anda untuk memulai</p>
                <button 
                  onClick={() => setShowCreateService(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Deploy Layanan Pertama
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Service Modal */}
      {showCreateService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Deploy Docker Service</h3>
            
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Select Docker Service</label>
                <div className="grid gap-3">
                  {availableServiceTypes.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedServiceType(service)}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        selectedServiceType?.id === service.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-purple-400">{service.icon}</div>
                        <div>
                          <p className="text-white font-medium">{service.name}</p>
                          <p className="text-white/60 text-sm">{service.credits} credits/month</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-mono">{service.dockerImage}</span>
                      </div>
                      <p className="text-white/70 text-sm">{service.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedServiceType && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Service Name</label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="Enter service name (e.g., My Workflow Hub)"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateService(false);
                  setSelectedServiceType(null);
                  setServiceName('');
                }}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateService}
                disabled={!selectedServiceType || !serviceName.trim() || loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Deploy Service'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};