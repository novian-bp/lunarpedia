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
  Ambulance as Cancel, 
  Package, 
  Play, 
  Pause, 
  Eye, 
  EyeOff, 
  Pocket as Docker,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Globe,
  Shield,
  RefreshCw,
  ExternalLink,
  Zap
} from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'services' | 'domains' | 'settings'>('users');
  
  // Mock data for users
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', credits: 250, status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', credits: 180, status: 'active', joinDate: '2024-01-20' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', credits: 50, status: 'suspended', joinDate: '2024-01-25' }
  ]);

  // Domain settings
  const [domainSettings, setDomainSettings] = useState({
    baseDomain: 'lunarpedia.app',
    wildcardDomain: '*.user.lunarpedia.app',
    sslEnabled: true,
    autoSSL: true,
    customDomainPrice: 25
  });

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
      icon: 'Zap',
      testStatus: 'passed',
      testUrl: 'https://n8n-test.admin.lunarpedia.app',
      lastTested: '2024-01-20'
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
        { key: 'SECRET_KEY_BASE', value: '', required: true, secret: true, autoGenerate: true }
      ],
      volumes: [
        { host: '/data/chatwoot', container: '/app/storage', type: 'persistent' }
      ],
      status: 'draft',
      icon: 'MessageSquare',
      testStatus: 'testing',
      testUrl: 'https://chatwoot-test.admin.lunarpedia.app',
      lastTested: null
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
      icon: 'Database',
      testStatus: 'failed',
      testUrl: 'https://postgres-test.admin.lunarpedia.app',
      lastTested: '2024-01-19'
    }
  ]);

  // Modal states
  const [showEditUser, setShowEditUser] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showDomainSettings, setShowDomainSettings] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [testingService, setTestingService] = useState<any>(null);

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

  // Auto-generation functions
  const generatePassword = (length: number = 16) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const generateSecretKey = (length: number = 32) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return key;
  };

  const generateTestDomain = (serviceName: string) => {
    const cleanName = serviceName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `https://${cleanName}-test.admin.${domainSettings.baseDomain}`;
  };

  const generateUserDomain = (serviceName: string, userId: number) => {
    const cleanName = serviceName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `https://${cleanName}-${userId}.user.${domainSettings.baseDomain}`;
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
        service.id === editingService.id ? { 
          ...service, 
          ...serviceForm,
          testStatus: 'pending',
          testUrl: generateTestDomain(serviceForm.name),
          lastTested: null
        } : service
      ));
      setShowEditService(false);
      setEditingService(null);
    } else {
      // Add new service
      const newService = {
        ...serviceForm,
        id: Date.now(),
        icon: 'Package',
        testStatus: 'pending',
        testUrl: generateTestDomain(serviceForm.name),
        lastTested: null
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
    const service = availableServices.find(s => s.id === serviceId);
    if (service && service.testStatus !== 'passed') {
      alert('Service must pass testing before it can be published!');
      return;
    }
    
    setAvailableServices(availableServices.map(service =>
      service.id === serviceId
        ? { ...service, status: service.status === 'published' ? 'draft' : 'published' }
        : service
    ));
  };

  // Testing functions
  const handleTestService = (service: any) => {
    setTestingService(service);
    setShowTestModal(true);
  };

  const runServiceTest = async () => {
    if (!testingService) return;

    // Update service status to testing
    setAvailableServices(availableServices.map(service =>
      service.id === testingService.id
        ? { ...service, testStatus: 'testing' }
        : service
    ));

    setShowTestModal(false);

    // Simulate testing process
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setAvailableServices(availableServices.map(service =>
        service.id === testingService.id
          ? { 
              ...service, 
              testStatus: success ? 'passed' : 'failed',
              lastTested: new Date().toISOString().split('T')[0]
            }
          : service
      ));

      if (success) {
        alert(`✅ Test passed! ${testingService.name} is ready to be published.`);
      } else {
        alert(`❌ Test failed! Please check the configuration for ${testingService.name}.`);
      }
    }, 3000);
  };

  // Domain settings functions
  const saveDomainSettings = () => {
    setShowDomainSettings(false);
    alert('Domain settings saved successfully!');
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

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400 bg-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      case 'testing': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'testing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      default: return <TestTube className="w-4 h-4" />;
    }
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

                  {/* Test Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Test Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getTestStatusColor(service.testStatus)}`}>
                        {getTestStatusIcon(service.testStatus)}
                        <span className="ml-1">{service.testStatus}</span>
                      </span>
                    </div>
                    {service.lastTested && (
                      <p className="text-white/40 text-xs">Last tested: {service.lastTested}</p>
                    )}
                    {service.testUrl && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Globe className="w-3 h-3 text-blue-400" />
                        <a 
                          href={service.testUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 text-xs hover:text-blue-300 flex items-center"
                        >
                          Test URL
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Test Button */}
                  <button
                    onClick={() => handleTestService(service)}
                    disabled={service.testStatus === 'testing'}
                    className="w-full mb-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {service.testStatus === 'testing' ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-2" />
                        Run Test
                      </>
                    )}
                  </button>

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
                Domain Settings
              </button>
            </div>

            {/* Current Domain Configuration */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Current Configuration</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Base Domain</label>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-mono">{domainSettings.baseDomain}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Wildcard Domain</label>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-mono">{domainSettings.wildcardDomain}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">SSL Configuration</label>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">
                        {domainSettings.sslEnabled ? 'SSL Enabled' : 'SSL Disabled'}
                      </span>
                    </div>
                    {domainSettings.autoSSL && (
                      <p className="text-white/60 text-sm mt-1">Auto SSL provisioning enabled</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Custom Domain Pricing</label>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">{domainSettings.customDomainPrice} credits/month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Examples */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Domain Examples</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white/80 font-medium mb-2">User Service Domains</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-mono">my-workflow-123.user.{domainSettings.baseDomain}</span>
                      <span className="text-white/60 text-sm">- User service subdomain</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-mono">workflow.mycompany.com</span>
                      <span className="text-white/60 text-sm">- Custom domain (premium)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white/80 font-medium mb-2">Admin Test Domains</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-mono">n8n-test.admin.{domainSettings.baseDomain}</span>
                      <span className="text-white/60 text-sm">- Admin testing subdomain</span>
                    </div>
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

      {/* Test Service Modal */}
      {showTestModal && testingService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <div className="flex items-center mb-6">
              <TestTube className="w-8 h-8 text-blue-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Test Docker Service</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-white/80 mb-4">
                Ready to test <span className="font-semibold text-white">"{testingService.name}"</span>?
              </p>
              
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20 mb-4">
                <h4 className="text-blue-400 font-semibold mb-2">Test Process</h4>
                <ul className="text-blue-400/80 text-sm space-y-1">
                  <li>• Deploy service to test environment</li>
                  <li>• Verify Docker container startup</li>
                  <li>• Check port accessibility</li>
                  <li>• Test SSL certificate provisioning</li>
                  <li>• Validate environment variables</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-white/80 text-sm">Test URL:</span>
                </div>
                <p className="text-purple-400 font-mono text-sm">{testingService.testUrl}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowTestModal(false);
                  setTestingService(null);
                }}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={runServiceTest}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Settings Modal */}
      {showDomainSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Domain Settings</h3>
              <button
                onClick={() => setShowDomainSettings(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Base Domain</label>
                  <input
                    type="text"
                    value={domainSettings.baseDomain}
                    onChange={(e) => setDomainSettings({...domainSettings, baseDomain: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Wildcard Domain</label>
                  <input
                    type="text"
                    value={domainSettings.wildcardDomain}
                    onChange={(e) => setDomainSettings({...domainSettings, wildcardDomain: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={domainSettings.sslEnabled}
                      onChange={(e) => setDomainSettings({...domainSettings, sslEnabled: e.target.checked})}
                      className="text-purple-500"
                    />
                    <span className="text-white/80">Enable SSL</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={domainSettings.autoSSL}
                      onChange={(e) => setDomainSettings({...domainSettings, autoSSL: e.target.checked})}
                      className="text-purple-500"
                    />
                    <span className="text-white/80">Auto SSL Provisioning</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Custom Domain Price (credits/month)</label>
                <input
                  type="number"
                  value={domainSettings.customDomainPrice}
                  onChange={(e) => setDomainSettings({...domainSettings, customDomainPrice: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
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
    </div>
  );
};

export default AdminDashboard;