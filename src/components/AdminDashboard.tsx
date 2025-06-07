import React, { useState } from 'react';
import { Users, Server, CreditCard, Settings, LogOut, Plus, Edit, Trash2, Cloud, X, Save, Ambulance as Cancel, Package, Play, Pause, Eye, EyeOff, Pocket as Docker, Crown, Gift, Zap } from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'services' | 'topup' | 'addons' | 'settings'>('users');
  
  // Mock data for users
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', credits: 250, status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', credits: 180, status: 'active', joinDate: '2024-01-20' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', credits: 50, status: 'suspended', joinDate: '2024-01-25' }
  ]);

  // Credit topup packages management
  const [creditPackages, setCreditPackages] = useState([
    { 
      id: 1, 
      name: 'Starter Pack',
      credits: 100, 
      bonus: 10,
      priceIDR: 150000,
      popular: false,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Professional Pack',
      credits: 300, 
      bonus: 50,
      priceIDR: 400000,
      popular: true,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Enterprise Pack',
      credits: 1000, 
      bonus: 200,
      priceIDR: 1200000,
      popular: false,
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Mega Pack',
      credits: 2500, 
      bonus: 600,
      priceIDR: 2800000,
      popular: false,
      status: 'active'
    }
  ]);

  // Premium add-ons management
  const [premiumAddons, setPremiumAddons] = useState([
    {
      id: 1,
      name: 'Custom Domain',
      description: 'Use your own domain for services',
      category: 'Domain & SSL',
      priceCredits: 25,
      billingCycle: 'monthly',
      status: 'active',
      features: ['Custom domain setup', 'SSL certificate', 'DNS management', 'CNAME configuration'],
      popular: true
    },
    {
      id: 2,
      name: 'SSL Certificate',
      description: 'Premium SSL certificates for enhanced security',
      category: 'Security',
      priceCredits: 15,
      billingCycle: 'monthly',
      status: 'active',
      features: ['Wildcard SSL', 'Extended validation', 'Multi-domain support', '24/7 monitoring'],
      popular: false
    },
    {
      id: 3,
      name: 'Priority Support',
      description: '24/7 priority technical support',
      category: 'Support',
      priceCredits: 20,
      billingCycle: 'monthly',
      status: 'active',
      features: ['24/7 live chat', 'Phone support', 'Dedicated account manager', 'SLA guarantee'],
      popular: false
    },
    {
      id: 4,
      name: 'Advanced Analytics',
      description: 'Detailed analytics and monitoring',
      category: 'Analytics',
      priceCredits: 30,
      billingCycle: 'monthly',
      status: 'active',
      features: ['Real-time monitoring', 'Custom dashboards', 'API analytics', 'Performance insights'],
      popular: false
    }
  ]);

  // Mock data for available Docker services
  const [availableServices, setAvailableServices] = useState([
    {
      id: 1,
      name: 'n8n Workflow Automation',
      dockerImage: 'n8nio/n8n:latest',
      description: 'Powerful workflow automation platform with visual editor',
      category: 'Automation',
      credits: 50,
      ports: [{ internal: 5678, external: 5678, protocol: 'HTTP' }],
      environment: [
        { key: 'N8N_BASIC_AUTH_ACTIVE', value: 'true', required: true, autoGenerate: false },
        { key: 'N8N_BASIC_AUTH_USER', value: 'admin', required: true, autoGenerate: false },
        { key: 'N8N_BASIC_AUTH_PASSWORD', value: '', required: true, secret: true, autoGenerate: true }
      ],
      volumes: [
        { host: '/data/n8n', container: '/home/node/.n8n', type: 'persistent' }
      ],
      status: 'published',
      icon: 'Zap'
    },
    {
      id: 2,
      name: 'Chatwoot Customer Support',
      dockerImage: 'chatwoot/chatwoot:latest',
      description: 'Open-source customer engagement platform',
      category: 'Communication',
      credits: 40,
      ports: [{ internal: 3000, external: 3000, protocol: 'HTTP' }],
      environment: [
        { key: 'POSTGRES_PASSWORD', value: '', required: true, secret: true, autoGenerate: true },
        { key: 'REDIS_PASSWORD', value: '', required: true, secret: true, autoGenerate: true },
        { key: 'SECRET_KEY_BASE', value: '', required: true, secret: true, autoGenerate: true },
        { key: 'POSTGRES_USER', value: 'chatwoot', required: true, autoGenerate: false },
        { key: 'POSTGRES_DB', value: 'chatwoot_production', required: true, autoGenerate: false }
      ],
      volumes: [
        { host: '/data/chatwoot', container: '/app/storage', type: 'persistent' }
      ],
      status: 'published',
      icon: 'MessageSquare'
    },
    {
      id: 3,
      name: 'PostgreSQL Database',
      dockerImage: 'postgres:15-alpine',
      description: 'Reliable PostgreSQL database server',
      category: 'Database',
      credits: 30,
      ports: [{ internal: 5432, external: 5432, protocol: 'TCP' }],
      environment: [
        { key: 'POSTGRES_DB', value: 'myapp', required: true, autoGenerate: false },
        { key: 'POSTGRES_USER', value: 'admin', required: true, autoGenerate: false },
        { key: 'POSTGRES_PASSWORD', value: '', required: true, secret: true, autoGenerate: true }
      ],
      volumes: [
        { host: '/data/postgres', container: '/var/lib/postgresql/data', type: 'persistent' }
      ],
      status: 'draft',
      icon: 'Database'
    }
  ]);

  // Modal states
  const [showEditUser, setShowEditUser] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [showAddTopupPackage, setShowAddTopupPackage] = useState(false);
  const [showEditTopupPackage, setShowEditTopupPackage] = useState(false);
  const [showAddAddon, setShowAddAddon] = useState(false);
  const [showEditAddon, setShowEditAddon] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingTopupPackage, setEditingTopupPackage] = useState<any>(null);
  const [editingAddon, setEditingAddon] = useState<any>(null);

  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', credits: 0, status: 'active' });
  const [serviceForm, setServiceForm] = useState({
    name: '',
    dockerImage: '',
    description: '',
    category: '',
    credits: 0,
    ports: [{ internal: 80, external: 80, protocol: 'HTTP' }],
    environment: [{ key: '', value: '', required: false, secret: false, autoGenerate: false }],
    volumes: [{ host: '', container: '', type: 'persistent' }],
    status: 'draft'
  });
  const [topupForm, setTopupForm] = useState({
    name: '',
    credits: 0,
    bonus: 0,
    priceIDR: 0,
    popular: false,
    status: 'active'
  });
  const [addonForm, setAddonForm] = useState({
    name: '',
    description: '',
    category: '',
    priceCredits: 0,
    billingCycle: 'monthly',
    status: 'active',
    features: [''],
    popular: false
  });

  // Utility functions
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const generatePassword = (length: number = 16) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const generateUsername = (serviceName: string) => {
    return serviceName.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Math.random().toString(36).substring(2, 8);
  };

  // Edit user functions
  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      credits: user.credits,
      status: user.status
    });
    setShowEditUser(true);
  };

  const saveUserChanges = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userForm }
          : user
      ));
      setShowEditUser(false);
      setEditingUser(null);
    }
  };

  const deleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Service management functions
  const handleAddService = () => {
    setServiceForm({
      name: '',
      dockerImage: '',
      description: '',
      category: '',
      credits: 0,
      ports: [{ internal: 80, external: 80, protocol: 'HTTP' }],
      environment: [{ key: '', value: '', required: false, secret: false, autoGenerate: false }],
      volumes: [{ host: '', container: '', type: 'persistent' }],
      status: 'draft'
    });
    setShowAddService(true);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setServiceForm({ ...service });
    setShowEditService(true);
  };

  const saveService = () => {
    if (editingService) {
      // Update existing service
      setAvailableServices(availableServices.map(service =>
        service.id === editingService.id ? { ...service, ...serviceForm } : service
      ));
      setShowEditService(false);
      setEditingService(null);
    } else {
      // Add new service
      const newService = {
        ...serviceForm,
        id: Date.now(),
        icon: 'Package'
      };
      setAvailableServices([...availableServices, newService]);
      setShowAddService(false);
    }
  };

  const deleteService = (serviceId: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setAvailableServices(availableServices.filter(service => service.id !== serviceId));
    }
  };

  const toggleServiceStatus = (serviceId: number) => {
    setAvailableServices(availableServices.map(service =>
      service.id === serviceId
        ? { ...service, status: service.status === 'published' ? 'draft' : 'published' }
        : service
    ));
  };

  // Topup package management functions
  const handleAddTopupPackage = () => {
    setTopupForm({
      name: '',
      credits: 0,
      bonus: 0,
      priceIDR: 0,
      popular: false,
      status: 'active'
    });
    setShowAddTopupPackage(true);
  };

  const handleEditTopupPackage = (pkg: any) => {
    setEditingTopupPackage(pkg);
    setTopupForm({ ...pkg });
    setShowEditTopupPackage(true);
  };

  const saveTopupPackage = () => {
    if (editingTopupPackage) {
      setCreditPackages(creditPackages.map(pkg =>
        pkg.id === editingTopupPackage.id ? { ...pkg, ...topupForm } : pkg
      ));
      setShowEditTopupPackage(false);
      setEditingTopupPackage(null);
    } else {
      const newPackage = {
        ...topupForm,
        id: Date.now()
      };
      setCreditPackages([...creditPackages, newPackage]);
      setShowAddTopupPackage(false);
    }
  };

  const deleteTopupPackage = (packageId: number) => {
    if (confirm('Are you sure you want to delete this topup package?')) {
      setCreditPackages(creditPackages.filter(pkg => pkg.id !== packageId));
    }
  };

  const toggleTopupPackageStatus = (packageId: number) => {
    setCreditPackages(creditPackages.map(pkg =>
      pkg.id === packageId
        ? { ...pkg, status: pkg.status === 'active' ? 'inactive' : 'active' }
        : pkg
    ));
  };

  // Premium addon management functions
  const handleAddAddon = () => {
    setAddonForm({
      name: '',
      description: '',
      category: '',
      priceCredits: 0,
      billingCycle: 'monthly',
      status: 'active',
      features: [''],
      popular: false
    });
    setShowAddAddon(true);
  };

  const handleEditAddon = (addon: any) => {
    setEditingAddon(addon);
    setAddonForm({ ...addon });
    setShowEditAddon(true);
  };

  const saveAddon = () => {
    if (editingAddon) {
      setPremiumAddons(premiumAddons.map(addon =>
        addon.id === editingAddon.id ? { ...addon, ...addonForm } : addon
      ));
      setShowEditAddon(false);
      setEditingAddon(null);
    } else {
      const newAddon = {
        ...addonForm,
        id: Date.now()
      };
      setPremiumAddons([...premiumAddons, newAddon]);
      setShowAddAddon(false);
    }
  };

  const deleteAddon = (addonId: number) => {
    if (confirm('Are you sure you want to delete this premium addon?')) {
      setPremiumAddons(premiumAddons.filter(addon => addon.id !== addonId));
    }
  };

  const toggleAddonStatus = (addonId: number) => {
    setPremiumAddons(premiumAddons.map(addon =>
      addon.id === addonId
        ? { ...addon, status: addon.status === 'active' ? 'inactive' : 'active' }
        : addon
    ));
  };

  // Helper functions for service form
  const addPort = () => {
    setServiceForm({
      ...serviceForm,
      ports: [...serviceForm.ports, { internal: 80, external: 80, protocol: 'HTTP' }]
    });
  };

  const removePort = (index: number) => {
    setServiceForm({
      ...serviceForm,
      ports: serviceForm.ports.filter((_, i) => i !== index)
    });
  };

  const updatePort = (index: number, field: string, value: any) => {
    const newPorts = [...serviceForm.ports];
    newPorts[index] = { ...newPorts[index], [field]: value };
    setServiceForm({ ...serviceForm, ports: newPorts });
  };

  const addEnvironment = () => {
    setServiceForm({
      ...serviceForm,
      environment: [...serviceForm.environment, { key: '', value: '', required: false, secret: false, autoGenerate: false }]
    });
  };

  const removeEnvironment = (index: number) => {
    setServiceForm({
      ...serviceForm,
      environment: serviceForm.environment.filter((_, i) => i !== index)
    });
  };

  const updateEnvironment = (index: number, field: string, value: any) => {
    const newEnv = [...serviceForm.environment];
    newEnv[index] = { ...newEnv[index], [field]: value };
    setServiceForm({ ...serviceForm, environment: newEnv });
  };

  const addVolume = () => {
    setServiceForm({
      ...serviceForm,
      volumes: [...serviceForm.volumes, { host: '', container: '', type: 'persistent' }]
    });
  };

  const removeVolume = (index: number) => {
    setServiceForm({
      ...serviceForm,
      volumes: serviceForm.volumes.filter((_, i) => i !== index)
    });
  };

  const updateVolume = (index: number, field: string, value: any) => {
    const newVolumes = [...serviceForm.volumes];
    newVolumes[index] = { ...newVolumes[index], [field]: value };
    setServiceForm({ ...serviceForm, volumes: newVolumes });
  };

  // Helper functions for addon form
  const addFeature = () => {
    setAddonForm({
      ...addonForm,
      features: [...addonForm.features, '']
    });
  };

  const removeFeature = (index: number) => {
    setAddonForm({
      ...addonForm,
      features: addonForm.features.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...addonForm.features];
    newFeatures[index] = value;
    setAddonForm({ ...addonForm, features: newFeatures });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Cloud className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Lunarpedia Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/60">Welcome, {user.name}</span>
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
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/5 backdrop-blur-xl rounded-xl p-1 mb-8 border border-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Server className="w-5 h-5 mr-2" />
            Docker Services
          </button>
          <button
            onClick={() => setActiveTab('topup')}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'topup'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Credit Packages
          </button>
          <button
            onClick={() => setActiveTab('addons')}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'addons'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Crown className="w-5 h-5 mr-2" />
            Premium Add-ons
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-white/60">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{user.credits}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-red-400/20 text-red-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-white/60 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Docker Services Management</h2>
              <button
                onClick={handleAddService}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Docker Service
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableServices.map((service) => (
                <div key={service.id} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg text-purple-400">
                        <Docker className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{service.name}</h3>
                        <p className="text-purple-400 text-sm">{service.credits} credits/month</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleServiceStatus(service.id)}
                        className={`p-2 transition-colors ${
                          service.status === 'published'
                            ? 'text-green-400 hover:text-green-300'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        title={service.status === 'published' ? 'Published' : 'Draft'}
                      >
                        {service.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditService(service)}
                        className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-2 text-white/60 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-4">{service.description}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Docker Image:</span>
                      <span className="text-white font-mono">{service.dockerImage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Category:</span>
                      <span className="text-white">{service.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Auto-Gen Vars:</span>
                      <span className="text-white">{service.environment.filter(env => env.autoGenerate).length} variables</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Status:</span>
                      <span className={`font-medium ${
                        service.status === 'published' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credit Packages Tab */}
        {activeTab === 'topup' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Credit Topup Packages</h2>
              <button
                onClick={handleAddTopupPackage}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creditPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 relative">
                  {pkg.popular && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg text-purple-400">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                        <p className="text-purple-400 text-sm">{formatIDR(pkg.priceIDR)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleTopupPackageStatus(pkg.id)}
                        className={`p-2 transition-colors ${
                          pkg.status === 'active'
                            ? 'text-green-400 hover:text-green-300'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        title={pkg.status === 'active' ? 'Active' : 'Inactive'}
                      >
                        {pkg.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditTopupPackage(pkg)}
                        className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTopupPackage(pkg.id)}
                        className="p-2 text-white/60 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-white/80 text-sm">Base Credits</span>
                      </div>
                      <span className="text-white font-semibold">{pkg.credits}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Gift className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-white/80 text-sm">Bonus Credits</span>
                      </div>
                      <span className="text-yellow-400 font-semibold">+{pkg.bonus}</span>
                    </div>
                    
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">Total Credits</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          {pkg.credits + pkg.bonus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Per Credit:</span>
                      <span>{formatIDR(Math.round(pkg.priceIDR / (pkg.credits + pkg.bonus)))}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400">Bonus Value:</span>
                      <span className="text-green-400">{((pkg.bonus / pkg.credits) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={`${pkg.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>Status:</span>
                      <span className={`${pkg.status === 'active' ? 'text-green-400' : 'text-red-400'} capitalize`}>{pkg.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Add-ons Tab */}
        {activeTab === 'addons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Premium Add-ons Management</h2>
              <button
                onClick={handleAddAddon}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Premium Add-on
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumAddons.map((addon) => (
                <div key={addon.id} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 relative">
                  {addon.popular && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg text-yellow-400">
                        <Crown className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{addon.name}</h3>
                        <p className="text-yellow-400 text-sm">{addon.priceCredits} credits/{addon.billingCycle}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAddonStatus(addon.id)}
                        className={`p-2 transition-colors ${
                          addon.status === 'active'
                            ? 'text-green-400 hover:text-green-300'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        title={addon.status === 'active' ? 'Active' : 'Inactive'}
                      >
                        {addon.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditAddon(addon)}
                        className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAddon(addon.id)}
                        className="p-2 text-white/60 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-4">{addon.description}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Category:</span>
                      <span className="text-white">{addon.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Billing:</span>
                      <span className="text-white capitalize">{addon.billingCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Features:</span>
                      <span className="text-white">{addon.features.length} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Status:</span>
                      <span className={`font-medium capitalize ${
                        addon.status === 'active' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {addon.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20">
                    <h4 className="text-white/80 text-xs font-medium mb-2">Features Preview:</h4>
                    <ul className="space-y-1">
                      {addon.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="text-white/60 text-xs">
                          • {feature}
                        </li>
                      ))}
                      {addon.features.length > 2 && (
                        <li className="text-white/40 text-xs">
                          ... and {addon.features.length - 2} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Platform Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Platform Name</label>
                    <input
                      type="text"
                      defaultValue="Lunarpedia"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Default Credits for New Users</label>
                    <input
                      type="number"
                      defaultValue="250"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Edit User</h3>
              <button
                onClick={() => setShowEditUser(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Credits</label>
                <input
                  type="number"
                  value={userForm.credits}
                  onChange={(e) => setUserForm({ ...userForm, credits: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditUser(false)}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveUserChanges}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {(showAddService || showEditService) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {showAddService ? 'Add Docker Service' : 'Edit Docker Service'}
              </h3>
              <button
                onClick={() => {
                  setShowAddService(false);
                  setShowEditService(false);
                  setEditingService(null);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Basic Information</h4>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Service Name</label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    placeholder="e.g., n8n Workflow Automation"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Docker Image</label>
                  <input
                    type="text"
                    value={serviceForm.dockerImage}
                    onChange={(e) => setServiceForm({ ...serviceForm, dockerImage: e.target.value })}
                    placeholder="e.g., n8nio/n8n:latest"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Brief description of the service"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      placeholder="e.g., Automation"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Credits/Month</label>
                    <input
                      type="number"
                      value={serviceForm.credits}
                      onChange={(e) => setServiceForm({ ...serviceForm, credits: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
                  <select
                    value={serviceForm.status}
                    onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Docker Configuration */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Docker Configuration</h4>
                
                {/* Ports */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/80 text-sm font-medium">Port Mappings</label>
                    <button
                      onClick={addPort}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      + Add Port
                    </button>
                  </div>
                  <div className="space-y-2">
                    {serviceForm.ports.map((port, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={port.internal}
                          onChange={(e) => updatePort(index, 'internal', parseInt(e.target.value) || 80)}
                          placeholder="Internal"
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                        />
                        <span className="text-white/60">:</span>
                        <input
                          type="number"
                          value={port.external}
                          onChange={(e) => updatePort(index, 'external', parseInt(e.target.value) || 80)}
                          placeholder="External"
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                        />
                        <select
                          value={port.protocol}
                          onChange={(e) => updatePort(index, 'protocol', e.target.value)}
                          className="px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                        >
                          <option value="HTTP">HTTP</option>
                          <option value="TCP">TCP</option>
                          <option value="UDP">UDP</option>
                        </select>
                        <button
                          onClick={() => removePort(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Environment Variables */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/80 text-sm font-medium">Environment Variables</label>
                    <button
                      onClick={addEnvironment}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      + Add Variable
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {serviceForm.environment.map((env, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={env.key}
                          onChange={(e) => updateEnvironment(index, 'key', e.target.value)}
                          placeholder="KEY"
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                        />
                        <input
                          type={env.secret ? "password" : "text"}
                          value={env.value}
                          onChange={(e) => updateEnvironment(index, 'value', e.target.value)}
                          placeholder="value"
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                        />
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={env.required}
                            onChange={(e) => updateEnvironment(index, 'required', e.target.checked)}
                            className="text-purple-500"
                          />
                          <span className="text-xs text-white/60">Req</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={env.secret}
                            onChange={(e) => updateEnvironment(index, 'secret', e.target.checked)}
                            className="text-purple-500"
                          />
                          <span className="text-xs text-white/60">Secret</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={env.autoGenerate}
                            onChange={(e) => updateEnvironment(index, 'autoGenerate', e.target.checked)}
                            className="text-purple-500"
                          />
                          <span className="text-xs text-white/60">Auto</span>
                        </label>
                        <button
                          onClick={() => removeEnvironment(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                    <p className="text-blue-400 text-xs">
                      ✓ Auto-generate: Automatically creates secure passwords/tokens for users during deployment
                    </p>
                  </div>
                </div>

                {/* Volumes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/80 text-sm font-medium">Volume Mounts</label>
                    <button
                      onClick={addVolume}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      + Add Volume
                    </button>
                  </div>
                  <div className="space-y-2">
                    {serviceForm.volumes.map((volume, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={volume.host}
                          onChange={(e) => updateVolume(index, 'host', e.target.value)}
                          placeholder="Host path"
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                        />
                        <span className="text-white/60">:</span>
                        <input
                          type="text"
                          value={volume.container}
                          onChange={(e) => updateVolume(index, 'container', e.target.value)}
                          placeholder="Container path"
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                        />
                        <select
                          value={volume.type}
                          onChange={(e) => updateVolume(index, 'type', e.target.value)}
                          className="px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                        >
                          <option value="persistent">Persistent</option>
                          <option value="temporary">Temporary</option>
                        </select>
                        <button
                          onClick={() => removeVolume(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddService(false);
                  setShowEditService(false);
                  setEditingService(null);
                }}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                {showAddService ? 'Add Service' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Topup Package Modal */}
      {(showAddTopupPackage || showEditTopupPackage) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {showAddTopupPackage ? 'Add Credit Package' : 'Edit Credit Package'}
              </h3>
              <button
                onClick={() => {
                  setShowAddTopupPackage(false);
                  setShowEditTopupPackage(false);
                  setEditingTopupPackage(null);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Package Name</label>
                <input
                  type="text"
                  value={topupForm.name}
                  onChange={(e) => setTopupForm({ ...topupForm, name: e.target.value })}
                  placeholder="e.g., Professional Pack"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Base Credits</label>
                  <input
                    type="number"
                    value={topupForm.credits}
                    onChange={(e) => setTopupForm({ ...topupForm, credits: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Bonus Credits</label>
                  <input
                    type="number"
                    value={topupForm.bonus}
                    onChange={(e) => setTopupForm({ ...topupForm, bonus: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Price (IDR)</label>
                <input
                  type="number"
                  value={topupForm.priceIDR}
                  onChange={(e) => setTopupForm({ ...topupForm, priceIDR: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={topupForm.popular}
                    onChange={(e) => setTopupForm({ ...topupForm, popular: e.target.checked })}
                    className="text-purple-500"
                  />
                  <span className="text-white/80 text-sm">Mark as Popular</span>
                </label>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
                  <select
                    value={topupForm.status}
                    onChange={(e) => setTopupForm({ ...topupForm, status: e.target.value })}
                    className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              {topupForm.credits > 0 && (
                <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="text-blue-400 font-semibold mb-2">Package Preview</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Credits:</span>
                      <span className="text-white font-semibold">{topupForm.credits + topupForm.bonus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Price:</span>
                      <span className="text-white">{formatIDR(topupForm.priceIDR)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Per Credit:</span>
                      <span className="text-white">{formatIDR(Math.round(topupForm.priceIDR / (topupForm.credits + topupForm.bonus)))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-400">Bonus Value:</span>
                      <span className="text-green-400">{topupForm.credits > 0 ? ((topupForm.bonus / topupForm.credits) * 100).toFixed(0) : 0}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddTopupPackage(false);
                  setShowEditTopupPackage(false);
                  setEditingTopupPackage(null);
                }}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveTopupPackage}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                {showAddTopupPackage ? 'Add Package' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Premium Addon Modal */}
      {(showAddAddon || showEditAddon) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {showAddAddon ? 'Add Premium Add-on' : 'Edit Premium Add-on'}
              </h3>
              <button
                onClick={() => {
                  setShowAddAddon(false);
                  setShowEditAddon(false);
                  setEditingAddon(null);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Add-on Name</label>
                <input
                  type="text"
                  value={addonForm.name}
                  onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                  placeholder="e.g., Custom Domain"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={addonForm.description}
                  onChange={(e) => setAddonForm({ ...addonForm, description: e.target.value })}
                  placeholder="Brief description of the add-on"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={addonForm.category}
                    onChange={(e) => setAddonForm({ ...addonForm, category: e.target.value })}
                    placeholder="e.g., Domain & SSL"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Price (Credits)</label>
                  <input
                    type="number"
                    value={addonForm.priceCredits}
                    onChange={(e) => setAddonForm({ ...addonForm, priceCredits: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Billing Cycle</label>
                  <select
                    value={addonForm.billingCycle}
                    onChange={(e) => setAddonForm({ ...addonForm, billingCycle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
                  <select
                    value={addonForm.status}
                    onChange={(e) => setAddonForm({ ...addonForm, status: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/80 text-sm font-medium">Features</label>
                  <button
                    onClick={addFeature}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {addonForm.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Feature description"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={addonForm.popular}
                  onChange={(e) => setAddonForm({ ...addonForm, popular: e.target.checked })}
                  className="text-purple-500"
                />
                <span className="text-white/80 text-sm">Mark as Popular</span>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddAddon(false);
                  setShowEditAddon(false);
                  setEditingAddon(null);
                }}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveAddon}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
              >
                {showAddAddon ? 'Add Add-on' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;