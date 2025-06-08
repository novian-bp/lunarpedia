import React, { useState, useEffect } from 'react';
import { Users, Server, CreditCard, LogOut, Plus, Edit, Trash2, Eye, Settings, Activity, Package, Pocket as Docker, Play, Pause, CheckCircle, XCircle, AlertTriangle, TestTube, Upload, Download, Globe, Database, Zap, MessageSquare, Shield, Monitor, Code, Layers, Terminal, RefreshCw, ExternalLink, Copy, Save, X } from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<'overview' | 'users' | 'services' | 'docker-management' | 'transactions'>('overview');
  
  // Mock data - in real app, this would come from API
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', credits: 150, role: 'user', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', credits: 300, role: 'user', status: 'active', joinDate: '2024-01-20' },
    { id: 3, name: 'Admin User', email: 'admin@lunarpedia.com', credits: 10000, role: 'admin', status: 'active', joinDate: '2024-01-01' }
  ]);

  const [services, setServices] = useState([
    { id: 1, name: 'My Workflow Hub', type: 'n8n', user: 'John Doe', status: 'running', credits: 50, created: '2024-01-15' },
    { id: 2, name: 'Support Chat', type: 'chatwoot', user: 'Jane Smith', status: 'stopped', credits: 40, created: '2024-01-20' }
  ]);

  // Docker Management State
  const [dockerImages, setDockerImages] = useState([
    {
      id: 1,
      name: 'WordPress',
      type: 'cms',
      dockerImage: 'wordpress:latest',
      description: 'Popular content management system for blogs and websites',
      creditsPerMonth: 50,
      status: 'published',
      version: 'latest',
      size: '1.2GB',
      lastUpdated: '2024-01-15',
      testStatus: 'passed',
      downloads: 1250,
      category: 'CMS',
      environment: {
        'WORDPRESS_DB_HOST': 'db',
        'WORDPRESS_DB_NAME': 'wordpress',
        'WORDPRESS_DB_USER': 'wordpress',
        'WORDPRESS_DB_PASSWORD': ''
      },
      ports: [
        { internal: 80, external: 8080, protocol: 'HTTP' }
      ],
      healthCheck: {
        enabled: true,
        endpoint: '/wp-admin/install.php',
        interval: 30,
        timeout: 10,
        retries: 3
      }
    },
    {
      id: 2,
      name: 'Node.js App',
      type: 'application',
      dockerImage: 'node:18-alpine',
      description: 'Runtime environment for JavaScript applications',
      creditsPerMonth: 30,
      status: 'published',
      version: '18-alpine',
      size: '180MB',
      lastUpdated: '2024-01-20',
      testStatus: 'passed',
      downloads: 890,
      category: 'Runtime',
      environment: {
        'NODE_ENV': 'production',
        'PORT': '3000'
      },
      ports: [
        { internal: 3000, external: 3000, protocol: 'HTTP' }
      ],
      healthCheck: {
        enabled: true,
        endpoint: '/health',
        interval: 30,
        timeout: 5,
        retries: 3
      }
    },
    {
      id: 3,
      name: 'PostgreSQL Database',
      type: 'database',
      dockerImage: 'postgres:15',
      description: 'Powerful open-source relational database',
      creditsPerMonth: 40,
      status: 'draft',
      version: '15',
      size: '420MB',
      lastUpdated: '2024-01-25',
      testStatus: 'testing',
      downloads: 0,
      category: 'Database',
      environment: {
        'POSTGRES_DB': 'myapp',
        'POSTGRES_USER': 'admin',
        'POSTGRES_PASSWORD': ''
      },
      ports: [
        { internal: 5432, external: 5432, protocol: 'TCP' }
      ],
      healthCheck: {
        enabled: true,
        endpoint: 'pg_isready',
        interval: 30,
        timeout: 5,
        retries: 3
      }
    }
  ]);

  const [showAddDockerModal, setShowAddDockerModal] = useState(false);
  const [showEditDockerModal, setShowEditDockerModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedDockerImage, setSelectedDockerImage] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);

  // New Docker Image Form State
  const [newDockerImage, setNewDockerImage] = useState({
    name: '',
    type: '',
    dockerImage: '',
    description: '',
    creditsPerMonth: 30,
    category: '',
    version: 'latest',
    environment: {},
    ports: [{ internal: 80, external: 8080, protocol: 'HTTP' }],
    healthCheck: {
      enabled: true,
      endpoint: '/health',
      interval: 30,
      timeout: 10,
      retries: 3
    }
  });

  const categories = ['CMS', 'Database', 'Runtime', 'Web Server', 'Cache', 'Monitoring', 'Security', 'Development'];
  const protocols = ['HTTP', 'HTTPS', 'TCP', 'UDP'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-400/20';
      case 'draft': return 'text-yellow-400 bg-yellow-400/20';
      case 'archived': return 'text-gray-400 bg-gray-400/20';
      case 'testing': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'testing': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'testing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CMS': return <Globe className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Runtime': return <Code className="w-5 h-5" />;
      case 'Web Server': return <Server className="w-5 h-5" />;
      case 'Cache': return <Zap className="w-5 h-5" />;
      case 'Monitoring': return <Monitor className="w-5 h-5" />;
      case 'Security': return <Shield className="w-5 h-5" />;
      case 'Development': return <Terminal className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const handleTestDockerImage = async (dockerImage: any) => {
    setSelectedDockerImage(dockerImage);
    setShowTestModal(true);
    
    // Update status to testing
    setDockerImages(prev => prev.map(img => 
      img.id === dockerImage.id 
        ? { ...img, testStatus: 'testing' }
        : img
    ));

    // Simulate testing process
    setTimeout(() => {
      const mockTestResults = {
        pullTest: { status: 'passed', message: 'Image pulled successfully', duration: '2.3s' },
        startTest: { status: 'passed', message: 'Container started successfully', duration: '1.8s' },
        healthTest: { status: 'passed', message: 'Health check passed', duration: '0.5s' },
        portTest: { status: 'passed', message: 'All ports accessible', duration: '0.3s' },
        envTest: { status: 'passed', message: 'Environment variables set correctly', duration: '0.1s' },
        overall: 'passed'
      };

      setTestResults(mockTestResults);
      
      // Update docker image test status
      setDockerImages(prev => prev.map(img => 
        img.id === dockerImage.id 
          ? { ...img, testStatus: 'passed' }
          : img
      ));
    }, 5000);
  };

  const handlePublishDockerImage = (dockerImage: any) => {
    setDockerImages(prev => prev.map(img => 
      img.id === dockerImage.id 
        ? { ...img, status: 'published' }
        : img
    ));
  };

  const handleArchiveDockerImage = (dockerImage: any) => {
    setDockerImages(prev => prev.map(img => 
      img.id === dockerImage.id 
        ? { ...img, status: 'archived' }
        : img
    ));
  };

  const handleAddEnvironmentVar = () => {
    const key = prompt('Environment Variable Key:');
    const value = prompt('Environment Variable Value (leave empty for auto-generation):');
    if (key) {
      setNewDockerImage(prev => ({
        ...prev,
        environment: {
          ...prev.environment,
          [key]: value || ''
        }
      }));
    }
  };

  const handleAddPort = () => {
    setNewDockerImage(prev => ({
      ...prev,
      ports: [
        ...prev.ports,
        { internal: 80, external: 8080, protocol: 'HTTP' }
      ]
    }));
  };

  const handleSaveDockerImage = () => {
    const newImage = {
      id: Date.now(),
      ...newDockerImage,
      status: 'draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      testStatus: 'pending',
      downloads: 0,
      size: 'Unknown'
    };

    setDockerImages(prev => [...prev, newImage]);
    setShowAddDockerModal(false);
    setNewDockerImage({
      name: '',
      type: '',
      dockerImage: '',
      description: '',
      creditsPerMonth: 30,
      category: '',
      version: 'latest',
      environment: {},
      ports: [{ internal: 80, external: 8080, protocol: 'HTTP' }],
      healthCheck: {
        enabled: true,
        endpoint: '/health',
        interval: 30,
        timeout: 10,
        retries: 3
      }
    });
  };

  const stats = {
    totalUsers: users.length,
    activeServices: services.filter(s => s.status === 'running').length,
    totalRevenue: 15750,
    dockerImages: dockerImages.length,
    publishedImages: dockerImages.filter(img => img.status === 'published').length,
    draftImages: dockerImages.filter(img => img.status === 'draft').length
  };

  if (currentView === 'docker-management') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('overview')}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <Docker className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Docker Services Management</h1>
                  <p className="text-white/60">Manage, test, and publish Docker images</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddDockerModal(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Docker Image
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
                  <p className="text-white/60 text-sm">Total Images</p>
                  <p className="text-2xl font-bold text-white">{stats.dockerImages}</p>
                </div>
                <Docker className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Published</p>
                  <p className="text-2xl font-bold text-white">{stats.publishedImages}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Draft</p>
                  <p className="text-2xl font-bold text-white">{stats.draftImages}</p>
                </div>
                <Edit className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Downloads</p>
                  <p className="text-2xl font-bold text-white">{dockerImages.reduce((acc, img) => acc + img.downloads, 0)}</p>
                </div>
                <Download className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Docker Images Table */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Docker Images</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Test Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Downloads</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {dockerImages.map((image) => (
                    <tr key={image.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/10 rounded-lg text-blue-400">
                            {getCategoryIcon(image.category)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{image.name}</p>
                            <p className="text-white/60 text-sm font-mono">{image.dockerImage}</p>
                            <p className="text-white/40 text-xs">Size: {image.size} • Version: {image.version}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                          {image.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(image.status)}`}>
                          {image.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center space-x-2 ${getTestStatusColor(image.testStatus)}`}>
                          {getTestStatusIcon(image.testStatus)}
                          <span className="text-sm capitalize">{image.testStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{image.creditsPerMonth}/month</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/60">{image.downloads.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleTestDockerImage(image)}
                            className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                            title="Test Image"
                          >
                            <TestTube className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDockerImage(image);
                              setShowEditDockerModal(true);
                            }}
                            className="p-2 text-white/60 hover:text-yellow-400 transition-colors"
                            title="Edit Image"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {image.status === 'draft' && image.testStatus === 'passed' && (
                            <button
                              onClick={() => handlePublishDockerImage(image)}
                              className="p-2 text-white/60 hover:text-green-400 transition-colors"
                              title="Publish Image"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                          {image.status === 'published' && (
                            <button
                              onClick={() => handleArchiveDockerImage(image)}
                              className="p-2 text-white/60 hover:text-gray-400 transition-colors"
                              title="Archive Image"
                            >
                              <Package className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-2 text-white/60 hover:text-red-400 transition-colors"
                            title="Delete Image"
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

        {/* Add Docker Image Modal */}
        {showAddDockerModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Add New Docker Image</h3>
                <button
                  onClick={() => setShowAddDockerModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Service Name</label>
                    <input
                      type="text"
                      value={newDockerImage.name}
                      onChange={(e) => setNewDockerImage(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., WordPress"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Docker Image</label>
                    <input
                      type="text"
                      value={newDockerImage.dockerImage}
                      onChange={(e) => setNewDockerImage(prev => ({ ...prev, dockerImage: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., wordpress:latest"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                      <select
                        value={newDockerImage.category}
                        onChange={(e) => setNewDockerImage(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Credits/Month</label>
                      <input
                        type="number"
                        value={newDockerImage.creditsPerMonth}
                        onChange={(e) => setNewDockerImage(prev => ({ ...prev, creditsPerMonth: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newDockerImage.description}
                      onChange={(e) => setNewDockerImage(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                      rows={3}
                      placeholder="Describe what this Docker image does..."
                    />
                  </div>
                </div>

                {/* Configuration */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Configuration</h4>
                  
                  {/* Environment Variables */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-white/80 text-sm font-medium">Environment Variables</label>
                      <button
                        onClick={handleAddEnvironmentVar}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        + Add Variable
                      </button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Object.entries(newDockerImage.environment).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={key}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                          />
                          <span className="text-white/60">=</span>
                          <input
                            type="text"
                            value={value as string}
                            onChange={(e) => setNewDockerImage(prev => ({
                              ...prev,
                              environment: { ...prev.environment, [key]: e.target.value }
                            }))}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                            placeholder="Value"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ports */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-white/80 text-sm font-medium">Port Configuration</label>
                      <button
                        onClick={handleAddPort}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        + Add Port
                      </button>
                    </div>
                    <div className="space-y-2">
                      {newDockerImage.ports.map((port, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            value={port.internal}
                            onChange={(e) => {
                              const newPorts = [...newDockerImage.ports];
                              newPorts[index].internal = parseInt(e.target.value);
                              setNewDockerImage(prev => ({ ...prev, ports: newPorts }));
                            }}
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                            placeholder="Internal"
                          />
                          <input
                            type="number"
                            value={port.external}
                            onChange={(e) => {
                              const newPorts = [...newDockerImage.ports];
                              newPorts[index].external = parseInt(e.target.value);
                              setNewDockerImage(prev => ({ ...prev, ports: newPorts }));
                            }}
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                            placeholder="External"
                          />
                          <select
                            value={port.protocol}
                            onChange={(e) => {
                              const newPorts = [...newDockerImage.ports];
                              newPorts[index].protocol = e.target.value;
                              setNewDockerImage(prev => ({ ...prev, ports: newPorts }));
                            }}
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                          >
                            {protocols.map(protocol => (
                              <option key={protocol} value={protocol}>{protocol}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Health Check */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Health Check</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newDockerImage.healthCheck.enabled}
                          onChange={(e) => setNewDockerImage(prev => ({
                            ...prev,
                            healthCheck: { ...prev.healthCheck, enabled: e.target.checked }
                          }))}
                          className="rounded"
                        />
                        <span className="text-white/80 text-sm">Enable Health Check</span>
                      </div>
                      {newDockerImage.healthCheck.enabled && (
                        <input
                          type="text"
                          value={newDockerImage.healthCheck.endpoint}
                          onChange={(e) => setNewDockerImage(prev => ({
                            ...prev,
                            healthCheck: { ...prev.healthCheck, endpoint: e.target.value }
                          }))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm"
                          placeholder="Health check endpoint"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setShowAddDockerModal(false)}
                  className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDockerImage}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Test Modal */}
        {showTestModal && selectedDockerImage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Testing: {selectedDockerImage.name}</h3>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {testResults ? (
                  <>
                    <div className="space-y-3">
                      {Object.entries(testResults).filter(([key]) => key !== 'overall').map(([test, result]: [string, any]) => (
                        <div key={test} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`${getTestStatusColor(result.status)}`}>
                              {getTestStatusIcon(result.status)}
                            </div>
                            <span className="text-white capitalize">{test.replace('Test', ' Test')}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-white/60 text-sm">{result.message}</p>
                            <p className="text-white/40 text-xs">{result.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${
                      testResults.overall === 'passed' 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : 'bg-red-500/10 border-red-500/20'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <div className={getTestStatusColor(testResults.overall)}>
                          {getTestStatusIcon(testResults.overall)}
                        </div>
                        <span className={`font-semibold ${getTestStatusColor(testResults.overall)}`}>
                          {testResults.overall === 'passed' ? 'All Tests Passed!' : 'Tests Failed'}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mt-1">
                        {testResults.overall === 'passed' 
                          ? 'Docker image is ready for deployment and can be published.'
                          : 'Please fix the issues before publishing this image.'
                        }
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">Running Tests...</h4>
                    <p className="text-white/60">Testing Docker image functionality and configuration</p>
                    
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-white/80">Pulling Docker image...</span>
                        <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded opacity-50">
                        <span className="text-white/60">Starting container...</span>
                        <div className="w-4 h-4"></div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded opacity-30">
                        <span className="text-white/40">Running health checks...</span>
                        <div className="w-4 h-4"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {testResults && (
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowTestModal(false)}
                    className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Close
                  </button>
                  {testResults.overall === 'passed' && selectedDockerImage.status === 'draft' && (
                    <button
                      onClick={() => {
                        handlePublishDockerImage(selectedDockerImage);
                        setShowTestModal(false);
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                    >
                      Publish Image
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-white/60">Manage platform and users</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold">{user.credits || 10000} Credits</span>
              </div>
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
        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'services', label: 'Services', icon: Server },
            { id: 'docker-management', label: 'Docker Management', icon: Docker },
            { id: 'transactions', label: 'Transactions', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {currentView === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>
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
                    <p className="text-white/60 text-sm">Docker Images</p>
                    <p className="text-2xl font-bold text-white">{stats.dockerImages}</p>
                  </div>
                  <Docker className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Revenue</p>
                    <p className="text-2xl font-bold text-white">${stats.totalRevenue}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => setCurrentView('docker-management')}
                className="group p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 text-left"
              >
                <Docker className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Docker Management</h3>
                <p className="text-white/60 text-sm">Add, test, and publish Docker images</p>
              </button>
              
              <button
                onClick={() => setCurrentView('users')}
                className="group p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 text-left"
              >
                <Users className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
                <p className="text-white/60 text-sm">Manage users and their credits</p>
              </button>
              
              <button
                onClick={() => setCurrentView('services')}
                className="group p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 text-left"
              >
                <Server className="w-8 h-8 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Service Monitoring</h3>
                <p className="text-white/60 text-sm">Monitor all deployed services</p>
              </button>
              
              <button
                onClick={() => setCurrentView('transactions')}
                className="group p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 text-left"
              >
                <CreditCard className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Transactions</h3>
                <p className="text-white/60 text-sm">View credit transactions and revenue</p>
              </button>
            </div>
          </>
        )}

        {/* Users Management */}
        {currentView === 'users' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-white/60 text-sm">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'text-purple-400 bg-purple-400/20' : 'text-blue-400 bg-blue-400/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{user.credits}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium text-green-400 bg-green-400/20">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/60">{user.joinDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-white/60 hover:text-blue-400 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-white/60 hover:text-red-400 transition-colors">
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

        {/* Services Management */}
        {currentView === 'services' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Service Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{service.name}</p>
                          <p className="text-white/60 text-sm">{service.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{service.user}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{service.credits}/month</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/60">{service.created}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-white/60 hover:text-green-400 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-white/60 hover:text-yellow-400 transition-colors">
                            <Pause className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-white/60 hover:text-red-400 transition-colors">
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

        {/* Transactions */}
        {currentView === 'transactions' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Credit Transactions</h2>
            </div>
            <div className="p-6">
              <p className="text-white/60">Transaction management coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;