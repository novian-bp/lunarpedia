import React, { useState } from 'react';
import { 
  Server, 
  Plus, 
  CreditCard, 
  LogOut, 
  Settings, 
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
  Pocket as Docker,
  Package
} from 'lucide-react';
import { UserAddonsPage } from './UserAddonsPage';

interface UserDashboardProps {
  user: any;
  onLogout: () => void;
  onBuyCredits: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, onBuyCredits }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'addons'>('dashboard');
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
        { key: 'N8N_BASIC_AUTH_USER', value: 'admin' }
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
        { key: 'POSTGRES_PASSWORD', value: '***' },
        { key: 'REDIS_PASSWORD', value: '***' }
      ],
      ports: [{ internal: 3000, external: 3000, protocol: 'HTTP' }]
    }
  ]);

  // Available Docker services (would be fetched from API - only published ones)
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
        { key: 'N8N_BASIC_AUTH_ACTIVE', value: 'true', required: true },
        { key: 'N8N_BASIC_AUTH_USER', value: 'admin', required: true },
        { key: 'N8N_BASIC_AUTH_PASSWORD', value: '', required: true, secret: true }
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
        { key: 'POSTGRES_PASSWORD', value: '', required: true, secret: true },
        { key: 'REDIS_PASSWORD', value: '', required: true, secret: true }
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
        { key: 'POSTGRES_DB', value: 'myapp', required: true },
        { key: 'POSTGRES_USER', value: 'admin', required: true },
        { key: 'POSTGRES_PASSWORD', value: '', required: true, secret: true }
      ],
      ports: [{ internal: 5432, external: 5432, protocol: 'TCP' }]
    }
  ].filter(service => service.status === 'published'); // Only show published services

  const [showCreateService, setShowCreateService] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<any>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceEnvironment, setServiceEnvironment] = useState<any[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [serviceToCancel, setServiceToCancel] = useState<any>(null);
  const [showRefundSuccess, setShowRefundSuccess] = useState(false);
  const [refundInfo, setRefundInfo] = useState<any>(null);
  const [showCustomDomainModal, setShowCustomDomainModal] = useState(false);
  const [selectedServiceForDomain, setSelectedServiceForDomain] = useState<any>(null);

  // Custom domain pricing (could be fetched from admin settings)
  const customDomainPrice = 25; // credits per month

  // Function to generate unique domain
  const generateDomain = (name: string, serviceId?: number) => {
    const cleanName = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    const id = serviceId || Date.now();
    return `https://${cleanName}-${id}.user.lunarpedia.app`;
  };

  // Generate preview domain as user types
  const getPreviewDomain = () => {
    if (!serviceName.trim()) return '';
    return generateDomain(serviceName);
  };

  const calculateProRatedRefund = (service: any) => {
    const now = new Date();
    const createdDate = new Date(service.createdAt);
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get the start of current billing period
    const billingStart = new Date(currentYear, currentMonth, createdDate.getDate());
    if (billingStart > now) {
      billingStart.setMonth(billingStart.getMonth() - 1);
    }
    
    // Get the end of current billing period
    const billingEnd = new Date(billingStart);
    billingEnd.setMonth(billingEnd.getMonth() + 1);
    
    // Calculate days
    const totalDays = Math.ceil((billingEnd.getTime() - billingStart.getTime()) / (1000 * 60 * 60 * 24));
    const usedDays = Math.ceil((now.getTime() - billingStart.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - usedDays);
    
    // Calculate refund (including custom domain if applicable)
    const baseRefund = Math.floor((remainingDays / totalDays) * service.credits);
    const customDomainRefund = service.hasCustomDomain ? Math.floor((remainingDays / totalDays) * customDomainPrice) : 0;
    const totalRefund = baseRefund + customDomainRefund;
    
    return {
      totalDays,
      usedDays,
      remainingDays,
      refundAmount: totalRefund,
      baseRefund,
      customDomainRefund,
      billingStart: billingStart.toLocaleDateString(),
      billingEnd: billingEnd.toLocaleDateString()
    };
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
      default: return <Docker className="w-5 h-5" />;
    }
  };

  const handleServiceTypeSelect = (serviceType: any) => {
    setSelectedServiceType(serviceType);
    // Initialize environment variables with default values
    setServiceEnvironment(serviceType.environment.map((env: any) => ({
      ...env,
      value: env.value || ''
    })));
  };

  const updateEnvironmentValue = (index: number, value: string) => {
    const newEnv = [...serviceEnvironment];
    newEnv[index] = { ...newEnv[index], value };
    setServiceEnvironment(newEnv);
  };

  const createService = () => {
    if (!selectedServiceType || !serviceName.trim()) return;

    // Validate required environment variables
    const missingRequired = serviceEnvironment.filter(env => env.required && !env.value.trim());
    if (missingRequired.length > 0) {
      alert(`Please fill in all required environment variables: ${missingRequired.map(env => env.key).join(', ')}`);
      return;
    }

    const serviceId = Date.now();
    const domain = generateDomain(serviceName, serviceId);

    const newService = {
      id: serviceId,
      name: serviceName.trim(),
      type: selectedServiceType.type,
      dockerImage: selectedServiceType.dockerImage,
      status: 'running',
      credits: selectedServiceType.credits,
      url: domain,
      customDomain: null,
      hasCustomDomain: false,
      createdAt: new Date().toISOString().split('T')[0],
      billingCycle: 'monthly',
      environment: serviceEnvironment,
      ports: selectedServiceType.ports
    };

    setServices([...services, newService]);
    setShowCreateService(false);
    setSelectedServiceType(null);
    setServiceName('');
    setServiceEnvironment([]);
  };

  const handleCancelService = (service: any) => {
    setServiceToCancel(service);
    setShowCancelConfirm(true);
  };

  const confirmCancelService = () => {
    if (!serviceToCancel) return;
    
    const calculatedRefund = calculateProRatedRefund(serviceToCancel);
    
    // Remove service from list
    setServices(services.filter(s => s.id !== serviceToCancel.id));
    
    // Set refund info for success modal
    setRefundInfo({
      serviceName: serviceToCancel.name,
      refundAmount: calculatedRefund.refundAmount,
      baseRefund: calculatedRefund.baseRefund,
      customDomainRefund: calculatedRefund.customDomainRefund,
      hasCustomDomain: serviceToCancel.hasCustomDomain
    });
    
    // Close cancel modal and show success modal
    setShowCancelConfirm(false);
    setServiceToCancel(null);
    setShowRefundSuccess(true);
  };

  const handleCustomDomainSetup = (service: any) => {
    setSelectedServiceForDomain(service);
    setShowCustomDomainModal(true);
  };

  const setupCustomDomain = (customDomain: string) => {
    if (!selectedServiceForDomain || !customDomain.trim()) return;

    // Update service with custom domain
    setServices(services.map(service => 
      service.id === selectedServiceForDomain.id 
        ? { 
            ...service, 
            customDomain: customDomain.trim(),
            hasCustomDomain: true,
            credits: service.credits + customDomainPrice // Add custom domain cost
          }
        : service
    ));

    setShowCustomDomainModal(false);
    setSelectedServiceForDomain(null);
  };

  const removeCustomDomain = (service: any) => {
    setServices(services.map(s => 
      s.id === service.id 
        ? { 
            ...s, 
            customDomain: null,
            hasCustomDomain: false,
            credits: s.credits - customDomainPrice // Remove custom domain cost
          }
        : s
    ));
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
                <p className="text-2xl font-bold text-white">{services.filter(s => s.status === 'running').length}</p>
              </div>
              <Server className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Services</p>
                <p className="text-2xl font-bold text-white">{services.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Monthly Usage</p>
                <p className="text-2xl font-bold text-white">{services.reduce((acc, s) => acc + s.credits, 0)} Credits</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Custom Domains</p>
                <p className="text-2xl font-bold text-white">{services.filter(s => s.hasCustomDomain).length}</p>
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
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Deploy Service
              </button>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {services.map((service) => (
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
                      
                      {/* Docker Image Info */}
                      <div className="flex items-center space-x-2 mb-1">
                        <Docker className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-mono">{service.dockerImage}</span>
                      </div>
                      
                      {/* Domain Display */}
                      <div className="space-y-1">
                        {service.hasCustomDomain && service.customDomain ? (
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-yellow-400" />
                            <p className="text-yellow-400 text-sm font-medium">{service.customDomain}</p>
                            <ExternalLink className="w-3 h-3 text-yellow-400" />
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-white/40" />
                            <p className="text-white/60 text-sm">{service.url}</p>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-white/40 text-xs">
                        Created: {service.createdAt} • ID: {service.id}
                        {service.hasCustomDomain && (
                          <span className="text-yellow-400"> • Custom Domain: +{customDomainPrice} credits/month</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                    <span className="text-white/60 text-sm">{service.credits} credits/month</span>
                    <div className="flex items-center space-x-2">
                      {/* Custom Domain Button */}
                      {!service.hasCustomDomain ? (
                        <button 
                          onClick={() => handleCustomDomainSetup(service)}
                          className="p-2 text-white/60 hover:text-yellow-400 transition-colors"
                          title="Setup Custom Domain"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => removeCustomDomain(service)}
                          className="p-2 text-yellow-400 hover:text-white/60 transition-colors"
                          title="Remove Custom Domain"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button className="p-2 text-white/60 hover:text-green-400 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-white/60 hover:text-yellow-400 transition-colors">
                        <Pause className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleCancelService(service)}
                        className="p-2 text-white/60 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                      onClick={() => handleServiceTypeSelect(service)}
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
                        <Docker className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-mono">{service.dockerImage}</span>
                      </div>
                      <p className="text-white/70 text-sm">{service.description}</p>
                    </button>
                  ))}
                </div>
                
                {availableServiceTypes.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No Docker services available at the moment</p>
                    <p className="text-white/40 text-sm">Please check back later</p>
                  </div>
                )}
              </div>
              
              {selectedServiceType && (
                <>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Service Name</label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="Enter service name (e.g., My Workflow Hub)"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    />
                    
                    {/* Domain Preview */}
                    {serviceName.trim() && (
                      <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-sm font-medium">Your service will be available at:</span>
                        </div>
                        <p className="text-blue-300 text-sm mt-1 font-mono break-all">
                          {getPreviewDomain()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Environment Variables */}
                  {serviceEnvironment.length > 0 && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Environment Configuration</label>
                      <div className="space-y-3">
                        {serviceEnvironment.map((env, index) => (
                          <div key={index}>
                            <label className="block text-white/70 text-xs font-medium mb-1">
                              {env.key}
                              {env.required && <span className="text-red-400 ml-1">*</span>}
                              {env.secret && <span className="text-yellow-400 ml-1">(Secret)</span>}
                            </label>
                            <input
                              type={env.secret ? "password" : "text"}
                              value={env.value}
                              onChange={(e) => updateEnvironmentValue(index, e.target.value)}
                              placeholder={`Enter ${env.key}`}
                              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none text-sm"
                              required={env.required}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Port Information */}
                  {selectedServiceType.ports && selectedServiceType.ports.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white/80 text-sm font-medium mb-2">Port Configuration</h4>
                      <div className="space-y-1">
                        {selectedServiceType.ports.map((port: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-white/60">Port {port.internal} ({port.protocol}):</span>
                            <span className="text-white">Accessible via port {port.external}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateService(false);
                  setSelectedServiceType(null);
                  setServiceName('');
                  setServiceEnvironment([]);
                }}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createService}
                disabled={!selectedServiceType || !serviceName.trim() || availableServiceTypes.length === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deploy Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Domain Setup Modal */}
      {showCustomDomainModal && selectedServiceForDomain && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-lg w-full">
            <div className="flex items-center mb-6">
              <Crown className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Setup Custom Domain</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-white/80 mb-4">
                Setup a custom domain for <span className="font-semibold text-white">"{selectedServiceForDomain.name}"</span>
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Custom Domain</label>
                  <input
                    type="text"
                    placeholder="e.g., workflow.yourcompany.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    id="customDomainInput"
                  />
                  <p className="text-white/60 text-xs mt-1">
                    Enter your domain without http:// or https://
                  </p>
                </div>
                
                {/* Pricing Info */}
                <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                  <h4 className="text-yellow-400 font-semibold mb-2">Custom Domain Pricing</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Monthly Cost:</span>
                      <span className="text-yellow-400 font-semibold">{customDomainPrice} credits/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Current Service Cost:</span>
                      <span className="text-white">{selectedServiceForDomain.credits} credits/month</span>
                    </div>
                    <div className="border-t border-yellow-500/20 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">New Total Cost:</span>
                        <span className="text-white">{selectedServiceForDomain.credits + customDomainPrice} credits/month</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Setup Instructions */}
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <h4 className="text-blue-400 font-semibold mb-2">DNS Setup Instructions</h4>
                  <div className="text-sm text-blue-400/80 space-y-1">
                    <p>1. Add a CNAME record in your DNS settings:</p>
                    <p className="font-mono text-xs bg-blue-500/20 p-2 rounded">
                      CNAME: your-subdomain → {selectedServiceForDomain.url.replace('https://', '')}
                    </p>
                    <p>2. Wait for DNS propagation (up to 24 hours)</p>
                    <p>3. Your custom domain will be automatically activated</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCustomDomainModal(false);
                  setSelectedServiceForDomain(null);
                }}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('customDomainInput') as HTMLInputElement;
                  if (input?.value.trim()) {
                    setupCustomDomain(input.value.trim());
                  }
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
              >
                Setup Domain ({customDomainPrice} credits/month)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Service Confirmation Modal */}
      {showCancelConfirm && serviceToCancel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Cancel Service</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-white/80 mb-4">
                Are you sure you want to cancel <span className="font-semibold text-white">"{serviceToCancel.name}"</span>?
              </p>
              
              {(() => {
                const refundInfo = calculateProRatedRefund(serviceToCancel);
                return (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3">Automatic Refund Calculation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Billing Period:</span>
                        <span className="text-white">{refundInfo.billingStart} - {refundInfo.billingEnd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Total Days:</span>
                        <span className="text-white">{refundInfo.totalDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Days Used:</span>
                        <span className="text-white">{refundInfo.usedDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Remaining Days:</span>
                        <span className="text-white">{refundInfo.remainingDays} days</span>
                      </div>
                      <div className="border-t border-white/20 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-white/60">Service Cost:</span>
                          <span className="text-white">{serviceToCancel.credits - (serviceToCancel.hasCustomDomain ? customDomainPrice : 0)} credits</span>
                        </div>
                        {serviceToCancel.hasCustomDomain && (
                          <div className="flex justify-between">
                            <span className="text-white/60">Custom Domain:</span>
                            <span className="text-white">{customDomainPrice} credits</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-white/60">Base Refund:</span>
                          <span className="text-green-400">{refundInfo.baseRefund} credits</span>
                        </div>
                        {serviceToCancel.hasCustomDomain && refundInfo.customDomainRefund > 0 && (
                          <div className="flex justify-between">
                            <span className="text-white/60">Domain Refund:</span>
                            <span className="text-green-400">{refundInfo.customDomainRefund} credits</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold">
                          <span className="text-green-400">Total Refund:</span>
                          <span className="text-green-400">{refundInfo.refundAmount} credits</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-green-400 text-sm">
                  ✓ Credits will be automatically added to your account immediately
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setServiceToCancel(null);
                }}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Keep Service
              </button>
              <button
                onClick={confirmCancelService}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                Cancel Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Success Modal */}
      {showRefundSuccess && refundInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Service Cancelled Successfully!</h3>
              
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20 mb-6">
                <p className="text-white mb-2">
                  <span className="font-semibold">"{refundInfo.serviceName}"</span> has been cancelled.
                </p>
                
                <div className="space-y-1 text-sm">
                  {refundInfo.baseRefund > 0 && (
                    <p className="text-green-400">
                      Service refund: {refundInfo.baseRefund} credits
                    </p>
                  )}
                  {refundInfo.hasCustomDomain && refundInfo.customDomainRefund > 0 && (
                    <p className="text-green-400">
                      Custom domain refund: {refundInfo.customDomainRefund} credits
                    </p>
                  )}
                  <p className="text-green-400 font-semibold text-lg border-t border-green-500/20 pt-2">
                    Total: {refundInfo.refundAmount} credits added to your account!
                  </p>
                </div>
              </div>
              
              <p className="text-white/60 text-sm mb-6">
                Your refund has been processed automatically based on the unused portion of your billing period.
              </p>
              
              <button
                onClick={() => setShowRefundSuccess(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};