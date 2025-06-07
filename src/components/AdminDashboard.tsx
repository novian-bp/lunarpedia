import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Server, 
  Activity, 
  DollarSign, 
  Settings, 
  Shield, 
  Database, 
  Monitor,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  TestTube
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin: string;
}

interface Service {
  id: string;
  name: string;
  type: 'web' | 'api' | 'database';
  status: 'running' | 'stopped' | 'error' | 'testing';
  uptime: string;
  memory: string;
  cpu: string;
  url?: string;
  testResults?: {
    status: 'passed' | 'failed' | 'running';
    lastRun: string;
    details: string;
  };
}

interface DeploymentLog {
  id: string;
  serviceId: string;
  timestamp: string;
  status: 'success' | 'failed' | 'in-progress';
  message: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'services' | 'deployments' | 'settings'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [deploymentLogs, setDeploymentLogs] = useState<DeploymentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'user1@example.com',
        plan: 'pro',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: '2024-01-20'
      },
      {
        id: '2',
        email: 'user2@example.com',
        plan: 'free',
        status: 'active',
        createdAt: '2024-01-10',
        lastLogin: '2024-01-19'
      }
    ];

    const mockServices: Service[] = [
      {
        id: '1',
        name: 'Main Website',
        type: 'web',
        status: 'running',
        uptime: '99.9%',
        memory: '256MB',
        cpu: '15%',
        url: 'https://example.com',
        testResults: {
          status: 'passed',
          lastRun: '2024-01-20 10:30',
          details: 'All tests passed successfully'
        }
      },
      {
        id: '2',
        name: 'API Server',
        type: 'api',
        status: 'running',
        uptime: '99.5%',
        memory: '512MB',
        cpu: '25%',
        url: 'https://api.example.com'
      }
    ];

    const mockLogs: DeploymentLog[] = [
      {
        id: '1',
        serviceId: '1',
        timestamp: '2024-01-20 10:30:00',
        status: 'success',
        message: 'Deployment completed successfully'
      },
      {
        id: '2',
        serviceId: '2',
        timestamp: '2024-01-20 09:15:00',
        status: 'success',
        message: 'API server updated'
      }
    ];

    setUsers(mockUsers);
    setServices(mockServices);
    setDeploymentLogs(mockLogs);
    setIsLoading(false);
  }, []);

  const handleServiceAction = (serviceId: string, action: 'start' | 'stop' | 'restart' | 'test') => {
    setServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        switch (action) {
          case 'start':
            return { ...service, status: 'running' };
          case 'stop':
            return { ...service, status: 'stopped' };
          case 'restart':
            return { ...service, status: 'running' };
          case 'test':
            return { 
              ...service, 
              status: 'testing',
              testResults: {
                status: 'running',
                lastRun: new Date().toLocaleString(),
                details: 'Running tests...'
              }
            };
          default:
            return service;
        }
      }
      return service;
    }));

    // Simulate test completion
    if (action === 'test') {
      setTimeout(() => {
        setServices(prev => prev.map(service => {
          if (service.id === serviceId) {
            return {
              ...service,
              status: 'running',
              testResults: {
                status: 'passed',
                lastRun: new Date().toLocaleString(),
                details: 'All tests passed successfully'
              }
            };
          }
          return service;
        }));
      }, 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'active':
      case 'passed':
        return 'text-green-600 bg-green-100';
      case 'stopped':
      case 'suspended':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'testing':
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'error':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'active':
      case 'passed':
        return <CheckCircle className="w-4 h-4" />;
      case 'stopped':
      case 'suspended':
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      case 'testing':
        return <Clock className="w-4 h-4 animate-spin" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Service
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Monitor },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'services', label: 'Services', icon: Server },
              { id: 'deployments', label: 'Deployments', icon: Activity },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="px-4 py-6 sm:px-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Server className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Services</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {services.filter(s => s.status === 'running').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Uptime</dt>
                        <dd className="text-lg font-medium text-gray-900">99.9%</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                        <dd className="text-lg font-medium text-gray-900">$12,345</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {deploymentLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-400' : 
                        log.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{log.message}</p>
                        <p className="text-sm text-gray-500">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                              user.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                              {getStatusIcon(user.status)}
                              <span className="ml-1">{user.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        <span className="ml-1">{service.status}</span>
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Type:</span>
                        <span className="text-gray-900">{service.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Uptime:</span>
                        <span className="text-gray-900">{service.uptime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Memory:</span>
                        <span className="text-gray-900">{service.memory}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">CPU:</span>
                        <span className="text-gray-900">{service.cpu}</span>
                      </div>
                    </div>

                    {service.testResults && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Test Results</span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.testResults.status)}`}>
                            {getStatusIcon(service.testResults.status)}
                            <span className="ml-1">{service.testResults.status}</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{service.testResults.details}</p>
                        <p className="text-xs text-gray-500 mt-1">Last run: {service.testResults.lastRun}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleServiceAction(service.id, service.status === 'running' ? 'stop' : 'start')}
                        className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md ${
                          service.status === 'running'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {service.status === 'running' ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                        {service.status === 'running' ? 'Stop' : 'Start'}
                      </button>
                      
                      <button
                        onClick={() => handleServiceAction(service.id, 'restart')}
                        className="flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleServiceAction(service.id, 'test')}
                        className="flex items-center justify-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200"
                        disabled={service.status === 'testing'}
                      >
                        <TestTube className="w-4 h-4" />
                      </button>

                      {service.url && (
                        <button
                          onClick={() => window.open(service.url, '_blank')}
                          className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deployments' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Deployment Logs</h3>
                <div className="space-y-4">
                  {deploymentLogs.map((log) => (
                    <div key={log.id} className="border-l-4 border-gray-200 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                            {getStatusIcon(log.status)}
                            <span className="ml-1">{log.status}</span>
                          </span>
                          <span className="text-sm font-medium text-gray-900">{log.message}</span>
                        </div>
                        <span className="text-sm text-gray-500">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">System Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">System Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="Production System"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Maintenance Mode</label>
                    <div className="mt-1">
                      <label className="inline-flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                        <span className="ml-2 text-sm text-gray-600">Enable maintenance mode</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;