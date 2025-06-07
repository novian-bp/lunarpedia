import React, { useState } from 'react';
import { 
  Users, 
  Server, 
  CreditCard, 
  Settings, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Cloud, 
  X, 
  Save, 
  Package, 
  Play, 
  Pause, 
  Eye, 
  EyeOff, 
  Pocket as Docker,
  Globe,
  Crown,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
  MessageSquare,
  Database,
  User,
  Mail,
  Lock,
  Calendar,
  Activity,
  Monitor,
  Shield,
  TestTube,
  Wifi,
  WifiOff
} from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'services' | 'domains' | 'settings'>('users');
  
  // Mock data for users with their services
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      credits: 250, 
      status: 'active', 
      joinDate: '2024-01-15',
      lastLogin: '2024-01-28',
      totalSpent: 500,
      services: [
        {
          id: 101,
          name: 'My Workflow Hub',
          type: 'n8n',
          dockerImage: 'n8nio/n8n:latest',
          status: 'running',
          credits: 50,
          url: 'https://my-workflow-hub-101.user.lunarpedia.app',
          customDomain: 'workflow.johndoe.com',
          hasCustomDomain: true,
          createdAt: '2024-01-16',
          lastAccessed: '2024-01-28'
        },
        {
          id: 102,
          name: 'Support Chat',
          type: 'chatwoot',
          dockerImage: 'chatwoot/chatwoot:latest',
          status: 'stopped',
          credits: 40,
          url: 'https://support-chat-102.user.lunarpedia.app',
          customDomain: null,
          hasCustomDomain: false,
          createdAt: '2024-01-20',
          lastAccessed: '2024-01-25'
        }
      ]
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      credits: 180, 
      status: 'active', 
      joinDate: '2024-01-20',
      lastLogin: '2024-01-27',
      totalSpent: 320,
      services: [
        {
          id: 201,
          name: 'Database Server',
          type: 'database',
          dockerImage: 'postgres:15-alpine',
          status: 'running',
          credits: 30,
          url: 'https://database-server-201.user.lunarpedia.app',
          customDomain: null,
          hasCustomDomain: false,
          createdAt: '2024-01-22',
          lastAccessed: '2024-01-27'
        }
      ]
    },
    { 
      id: 3, 
      name: 'Bob Wilson', 
      email: 'bob@example.com', 
      credits: 50, 
      status: 'suspended', 
      joinDate: '2024-01-25',
      lastLogin: '2024-01-26',
      totalSpent: 150,
      services: []
    }
  ]);

  // Available Docker services for admin to add to users
  const [availableServices] = useState([
    {
      id: 1,
      name: 'n8n Workflow Automation',
      dockerImage: 'n8nio/n8n:latest',
      description: 'Powerful workflow automation platform with visual editor',
      category: 'Automation',
      credits: 50,
      ports: [{ internal: 5678, external: 5678, protocol: 'HTTP' }],
      environment: [
        { key: 'N8N_BASIC_AUTH_ACTIVE', value: 'true', required: true },
        { key: 'N8N_BASIC_AUTH_USER', value: 'admin', required: true },
        { key: 'N8N_BASIC_AUTH_PASSWORD', value: '', required: true, secret: true }
      ],
      volumes: [
        { host: '/data/n8n', container: '/home/node/.n8n', type: 'persistent' }
      ],
      status: 'published',
      testStatus: 'passed',
      testUrl: 'https://n8n-test.admin.lunarpedia.app',
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
        { key: 'POSTGRES_PASSWORD', value: '', required: true, secret: true },
        { key: 'REDIS_PASSWORD', value: '', required: true, secret: true },
        { key: 'SECRET_KEY_BASE', value: '', required: true, secret: true }
      ],
      volumes: [
        { host: '/data/chatwoot', container: '/app/storage', type: 'persistent' }
      ],
      status: 'published',
      testStatus: 'passed',
      testUrl: 'https://chatwoot-test.admin.lunarpedia.app',
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
        { key: 'POSTGRES_DB', value: 'myapp', required: true },
        { key: 'POSTGRES_USER', value: 'admin', required: true },
        { key: 'POSTGRES_PASSWORD', value: '', required: true, secret: true }
      ],
      volumes: [
        { host: '/data/postgres', container: '/var/lib/postgresql/data', type: 'persistent' }
      ],
      status: 'published',
      testStatus: 'passed',
      testUrl: 'https://postgres-test.admin.lunarpedia.app',
      icon: 'Database'
    }
  ]);

  // Domain settings
  const [domainSettings, setDomainSettings] = useState({
    baseDomain: 'lunarpedia.app',
    userSubdomain: 'user.lunarpedia.app',
    adminSubdomain: 'admin.lunarpedia.app',
    wildcardEnabled: true,
    sslEnabled: true,
    customDomainPrice: 25
  });

  // Modal states
  const [showEditUser, setShowEditUser] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserServices, setShowUserServices] = useState(false);
  const [showAddServiceToUser, setShowAddServiceToUser] = useState(false);
  const [showDomainSettings, setShowDomainSettings] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedServiceForUser, setSelectedServiceForUser] = useState<any>(null);

  // Form states
  const [userForm, setUserForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    credits: 250, 
    status: 'active' 
  });

  const [serviceForm, setServiceForm] = useState({
    name: '',
    selectedServiceType: null,
    environment: []
  });

  // Helper functions
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'n8n': return <Zap className="w-5 h-5" />;
      case 'chatwoot': return <MessageSquare className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      default: return <Docker className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-400/20';
      case 'stopped': return 'text-red-400 bg-red-400/20';
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'suspended': return 'text-red-400 bg-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/20';
    }
  };

  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const generateDomain = (serviceName: string, userId: number, serviceId: number) => {
    const cleanName = serviceName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `https://${cleanName}-${serviceId}.user.${domainSettings.baseDomain}`;
  };

  // User management functions
  const handleAddUser = () => {
    setUserForm({ 
      name: '', 
      email: '', 
      password: generatePassword(),
      credits: 250, 
      status: 'active' 
    });
    setShowAddUser(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      credits: user.credits,
      status: user.status
    });
    setShowEditUser(true);
  };

  const saveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userForm, password: userForm.password || user.password }
          : user
      ));
      setShowEditUser(false);
      setEditingUser(null);
    } else {
      // Add new user
      const newUser = {
        ...userForm,
        id: Date.now(),
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
        totalSpent: 0,
        services: []
      };
      setUsers([...users, newUser]);
      setShowAddUser(false);
    }
    setUserForm({ name: '', email: '', password: '', credits: 250, status: 'active' });
  };

  const deleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user? All their services will also be deleted.')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const viewUserServices = (user: any) => {
    setSelectedUser(user);
    setShowUserServices(true);
  };

  // Service management for users
  const handleAddServiceToUser = (user: any) => {
    setSelectedUser(user);
    setServiceForm({
      name: '',
      selectedServiceType: null,
      environment: []
    });
    setShowAddServiceToUser(true);
  };

  const selectServiceTypeForUser = (serviceType: any) => {
    setServiceForm({
      ...serviceForm,
      selectedServiceType: serviceType,
      environment: serviceType.environment.map((env: any) => ({
        ...env,
        value: env.secret ? generatePassword() : env.value
      }))
    });
  };

  const addServiceToUser = () => {
    if (!selectedUser || !serviceForm.selectedServiceType || !serviceForm.name.trim()) return;

    const serviceId = Date.now();
    const newService = {
      id: serviceId,
      name: serviceForm.name.trim(),
      type: serviceForm.selectedServiceType.name.toLowerCase().includes('n8n') ? 'n8n' :
            serviceForm.selectedServiceType.name.toLowerCase().includes('chatwoot') ? 'chatwoot' : 'database',
      dockerImage: serviceForm.selectedServiceType.dockerImage,
      status: 'running',
      credits: serviceForm.selectedServiceType.credits,
      url: generateDomain(serviceForm.name, selectedUser.id, serviceId),
      customDomain: null,
      hasCustomDomain: false,
      createdAt: new Date().toISOString().split('T')[0],
      lastAccessed: new Date().toISOString().split('T')[0]
    };

    // Update user's services
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, services: [...user.services, newService] }
        : user
    ));

    setShowAddServiceToUser(false);
    setSelectedUser(null);
    setServiceForm({ name: '', selectedServiceType: null, environment: [] });
  };

  const toggleUserService = (userId: number, serviceId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? {
            ...user,
            services: user.services.map(service =>
              service.id === serviceId
                ? { ...service, status: service.status === 'running' ? 'stopped' : 'running' }
                : service
            )
          }
        : user
    ));
  };

  const deleteUserService = (userId: number, serviceId: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, services: user.services.filter(service => service.id !== serviceId) }
          : user
      ));
    }
  };

  const saveDomainSettings = () => {
    // In real app, this would save to backend
    setShowDomainSettings(false);
    alert('Domain settings saved successfully!');
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
            onClick={() => setActiveTab('domains')}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'domains'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-5 h-5 mr-2" />
            Domain Management
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <button
                onClick={handleAddUser}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Credits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Services</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Last Login</th>
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
                            <div className="text-xs text-white/40">ID: {user.id} • Joined: {user.joinDate}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white">{user.credits}</div>
                          <div className="text-xs text-white/60">Spent: {user.totalSpent}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-white">{user.services.length}</span>
                            <button
                              onClick={() => viewUserServices(user)}
                              className="text-blue-400 hover:text-blue-300 text-xs underline"
                            >
                              View
                            </button>
                          </div>
                          <div className="text-xs text-white/60">
                            Running: {user.services.filter(s => s.status === 'running').length}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60">{user.lastLogin}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddServiceToUser(user)}
                              className="p-2 text-white/60 hover:text-green-400 transition-colors"
                              title="Add Service"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => viewUserServices(user)}
                              className="p-2 text-white/60 hover:text-purple-400 transition-colors"
                              title="Manage Services"
                            >
                              <Server className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-white/60 hover:text-red-400 transition-colors"
                              title="Delete User"
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
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Docker Services Management</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableServices.map((service) => (
                <div key={service.id} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg text-purple-400">
                        {getServiceIcon(service.name.toLowerCase())}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{service.name}</h3>
                        <p className="text-purple-400 text-sm">{service.credits} credits/month</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        service.testStatus === 'passed' ? 'bg-green-400/20 text-green-400' :
                        service.testStatus === 'failed' ? 'bg-red-400/20 text-red-400' :
                        'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {service.testStatus}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        service.status === 'published' ? 'bg-green-400/20 text-green-400' : 'bg-gray-400/20 text-gray-400'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-4">{service.description}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Docker Image:</span>
                      <span className="text-white font-mono text-xs">{service.dockerImage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Test URL:</span>
                      <a href={service.testUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-400 hover:text-blue-300 flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Test
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domain Management Tab */}
        {activeTab === 'domains' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Domain Management</h2>
              <button
                onClick={() => setShowDomainSettings(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure Domains
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Current Domain Configuration</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Base Domain:</span>
                    <span className="text-white font-mono">{domainSettings.baseDomain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">User Subdomain:</span>
                    <span className="text-white font-mono">{domainSettings.userSubdomain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Admin Subdomain:</span>
                    <span className="text-white font-mono">{domainSettings.adminSubdomain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Wildcard SSL:</span>
                    <span className={`${domainSettings.wildcardEnabled ? 'text-green-400' : 'text-red-400'}`}>
                      {domainSettings.wildcardEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Custom Domain Price:</span>
                    <span className="text-white">{domainSettings.customDomainPrice} credits/month</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Domain Examples</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-white/60 mb-1">User Services:</p>
                    <p className="text-blue-400 font-mono">my-workflow-123.user.{domainSettings.baseDomain}</p>
                    <p className="text-blue-400 font-mono">support-chat-456.user.{domainSettings.baseDomain}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Admin Testing:</p>
                    <p className="text-purple-400 font-mono">n8n-test.admin.{domainSettings.baseDomain}</p>
                    <p className="text-purple-400 font-mono">chatwoot-test.admin.{domainSettings.baseDomain}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Custom Domains (Premium):</p>
                    <p className="text-yellow-400 font-mono">workflow.mycompany.com</p>
                    <p className="text-yellow-400 font-mono">chat.mybusiness.com</p>
                  </div>
                </div>
              </div>
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

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    placeholder="Auto-generated password"
                  />
                  <button
                    onClick={() => setUserForm({ ...userForm, password: generatePassword() })}
                    className="px-3 py-3 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors"
                    title="Generate new password"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Initial Credits</label>
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
                onClick={() => setShowAddUser(false)}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={saveUser}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Services Modal */}
      {showUserServices && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedUser.name}'s Services</h3>
                <p className="text-white/60">{selectedUser.email} • {selectedUser.services.length} services</p>
              </div>
              <button
                onClick={() => setShowUserServices(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedUser.services.length === 0 ? (
                <div className="text-center py-8">
                  <Server className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No services deployed yet</p>
                  <button
                    onClick={() => {
                      setShowUserServices(false);
                      handleAddServiceToUser(selectedUser);
                    }}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                  >
                    Add First Service
                  </button>
                </div>
              ) : (
                selectedUser.services.map((service: any) => (
                  <div key={service.id} className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white/10 rounded-lg text-purple-400">
                          {getServiceIcon(service.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{service.name}</h4>
                          <p className="text-white/60 text-sm">{service.dockerImage}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-white/40 text-xs">Created: {service.createdAt}</span>
                            <span className="text-white/40 text-xs">Last accessed: {service.lastAccessed}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                        <span className="text-white/60 text-sm">{service.credits} credits/month</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleUserService(selectedUser.id, service.id)}
                            className={`p-2 transition-colors ${
                              service.status === 'running' 
                                ? 'text-yellow-400 hover:text-yellow-300' 
                                : 'text-green-400 hover:text-green-300'
                            }`}
                            title={service.status === 'running' ? 'Stop Service' : 'Start Service'}
                          >
                            {service.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <a
                            href={service.customDomain ? `https://${service.customDomain}` : service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                            title="Open Service"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => deleteUserService(selectedUser.id, service.id)}
                            className="p-2 text-white/60 hover:text-red-400 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60 mb-1">Service URL:</p>
                        <p className="text-blue-400 font-mono text-xs break-all">{service.url}</p>
                      </div>
                      {service.hasCustomDomain && service.customDomain && (
                        <div>
                          <p className="text-white/60 mb-1">Custom Domain:</p>
                          <p className="text-yellow-400 font-mono text-xs">{service.customDomain}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowUserServices(false)}
                className="px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowUserServices(false);
                  handleAddServiceToUser(selectedUser);
                }}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Add New Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service to User Modal */}
      {showAddServiceToUser && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add Service to {selectedUser.name}</h3>
              <button
                onClick={() => setShowAddServiceToUser(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Service Name</label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="Enter service name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Select Service Type</label>
                <div className="grid gap-3">
                  {availableServices.filter(s => s.status === 'published').map((service) => (
                    <button
                      key={service.id}
                      onClick={() => selectServiceTypeForUser(service)}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        serviceForm.selectedServiceType?.id === service.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-purple-400">{getServiceIcon(service.name.toLowerCase())}</div>
                        <div>
                          <p className="text-white font-medium">{service.name}</p>
                          <p className="text-white/60 text-sm">{service.credits} credits/month</p>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm">{service.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {serviceForm.name.trim() && serviceForm.selectedServiceType && (
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <h4 className="text-blue-400 font-semibold mb-2">Service Preview</h4>
                  <p className="text-blue-300 text-sm font-mono">
                    {generateDomain(serviceForm.name, selectedUser.id, Date.now())}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddServiceToUser(false)}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addServiceToUser}
                disabled={!serviceForm.name.trim() || !serviceForm.selectedServiceType}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Settings Modal */}
      {showDomainSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Domain Settings</h3>
              <button
                onClick={() => setShowDomainSettings(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Base Domain</label>
                <input
                  type="text"
                  value={domainSettings.baseDomain}
                  onChange={(e) => setDomainSettings({ ...domainSettings, baseDomain: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">User Subdomain</label>
                <input
                  type="text"
                  value={domainSettings.userSubdomain}
                  onChange={(e) => setDomainSettings({ ...domainSettings, userSubdomain: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Admin Subdomain</label>
                <input
                  type="text"
                  value={domainSettings.adminSubdomain}
                  onChange={(e) => setDomainSettings({ ...domainSettings, adminSubdomain: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Custom Domain Price (credits/month)</label>
                <input
                  type="number"
                  value={domainSettings.customDomainPrice}
                  onChange={(e) => setDomainSettings({ ...domainSettings, customDomainPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="wildcardEnabled"
                  checked={domainSettings.wildcardEnabled}
                  onChange={(e) => setDomainSettings({ ...domainSettings, wildcardEnabled: e.target.checked })}
                  className="w-4 h-4 text-purple-500"
                />
                <label htmlFor="wildcardEnabled" className="text-white/80 text-sm">Enable Wildcard SSL</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sslEnabled"
                  checked={domainSettings.sslEnabled}
                  onChange={(e) => setDomainSettings({ ...domainSettings, sslEnabled: e.target.checked })}
                  className="w-4 h-4 text-purple-500"
                />
                <label htmlFor="sslEnabled" className="text-white/80 text-sm">Auto SSL Provisioning</label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDomainSettings(false)}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveDomainSettings}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;