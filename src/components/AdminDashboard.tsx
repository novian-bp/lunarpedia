import React, { useState, useEffect } from 'react';
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
  Package,
  Activity,
  DollarSign,
  TrendingUp,
  Eye,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'services' | 'service-types'>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    activeServices: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });

  // Modal states
  const [showCreateServiceType, setShowCreateServiceType] = useState(false);
  const [showEditServiceType, setShowEditServiceType] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<any>(null);
  const [showUserCreditsModal, setShowUserCreditsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, servicesRes, serviceTypesRes, transactionsRes] = await Promise.all([
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*, users(name, email)').order('created_at', { ascending: false }),
        supabase.from('service_types').select('*').order('created_at', { ascending: false }),
        supabase.from('credit_transactions').select('*, users(name, email), services(name)').order('created_at', { ascending: false }).limit(100)
      ]);

      if (usersRes.data) setUsers(usersRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (serviceTypesRes.data) setServiceTypes(serviceTypesRes.data);
      if (transactionsRes.data) setCreditTransactions(transactionsRes.data);

      // Calculate stats
      const totalUsers = usersRes.data?.length || 0;
      const totalServices = servicesRes.data?.length || 0;
      const activeServices = servicesRes.data?.filter(s => s.status === 'running').length || 0;
      const totalRevenue = transactionsRes.data?.filter(t => t.type === 'purchase').reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
      
      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = transactionsRes.data?.filter(t => {
        const transactionDate = new Date(t.created_at);
        return t.type === 'purchase' && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      }).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

      setStats({
        totalUsers,
        totalServices,
        activeServices,
        totalRevenue,
        monthlyRevenue
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createServiceType = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('service_types')
        .insert([{
          name: formData.name,
          type: formData.type,
          docker_image: formData.docker_image,
          description: formData.description,
          credits_per_month: parseInt(formData.credits_per_month),
          status: formData.status,
          default_environment: formData.default_environment ? JSON.parse(formData.default_environment) : {},
          default_ports: formData.default_ports ? JSON.parse(formData.default_ports) : []
        }]);

      if (error) throw error;
      
      await fetchData();
      setShowCreateServiceType(false);
      alert('Service type created successfully!');
    } catch (error: any) {
      console.error('Error creating service type:', error);
      alert('Error creating service type: ' + error.message);
    }
  };

  const updateServiceType = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('service_types')
        .update({
          name: formData.name,
          type: formData.type,
          docker_image: formData.docker_image,
          description: formData.description,
          credits_per_month: parseInt(formData.credits_per_month),
          status: formData.status,
          default_environment: formData.default_environment ? JSON.parse(formData.default_environment) : {},
          default_ports: formData.default_ports ? JSON.parse(formData.default_ports) : [],
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedServiceType.id);

      if (error) throw error;
      
      await fetchData();
      setShowEditServiceType(false);
      setSelectedServiceType(null);
      alert('Service type updated successfully!');
    } catch (error: any) {
      console.error('Error updating service type:', error);
      alert('Error updating service type: ' + error.message);
    }
  };

  const deleteServiceType = async (serviceTypeId: string) => {
    if (!confirm('Are you sure you want to delete this service type?')) return;

    try {
      const { error } = await supabase
        .from('service_types')
        .delete()
        .eq('id', serviceTypeId);

      if (error) throw error;
      
      await fetchData();
      alert('Service type deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting service type:', error);
      alert('Error deleting service type: ' + error.message);
    }
  };

  const updateUserCredits = async (userId: string, newCredits: number, description: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const creditChange = newCredits - user.credits;
      
      // Update user credits
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          credits: newCredits,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert([{
          user_id: userId,
          type: creditChange > 0 ? 'purchase' : 'usage',
          amount: creditChange,
          description: description
        }]);

      if (transactionError) throw transactionError;
      
      await fetchData();
      setShowUserCreditsModal(false);
      setSelectedUser(null);
      alert('User credits updated successfully!');
    } catch (error: any) {
      console.error('Error updating user credits:', error);
      alert('Error updating user credits: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': case 'active': case 'published': return 'text-green-400 bg-green-400/20';
      case 'stopped': case 'cancelled': case 'archived': return 'text-red-400 bg-red-400/20';
      case 'pending': case 'draft': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading admin dashboard...</p>
        </div>
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
              {currentView !== 'dashboard' && (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <Cloud className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Lunarpedia
              </span>
              <span className="text-white/60">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold">{user.name}</span>
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
        {currentView === 'dashboard' && (
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
                    <p className="text-white/60 text-sm">Total Services</p>
                    <p className="text-2xl font-bold text-white">{stats.totalServices}</p>
                  </div>
                  <Server className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Active Services</p>
                    <p className="text-2xl font-bold text-white">{stats.activeServices}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">{stats.totalRevenue} Credits</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => setCurrentView('users')}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                  <span className="text-white/60 group-hover:text-white transition-colors">→</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
                <p className="text-white/60">View and manage user accounts, credits, and permissions</p>
              </button>

              <button
                onClick={() => setCurrentView('services')}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Server className="w-8 h-8 text-green-400" />
                  <span className="text-white/60 group-hover:text-white transition-colors">→</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Manage Services</h3>
                <p className="text-white/60">Monitor and manage all deployed Docker services</p>
              </button>

              <button
                onClick={() => setCurrentView('service-types')}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-purple-400" />
                  <span className="text-white/60 group-hover:text-white transition-colors">→</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Service Types</h3>
                <p className="text-white/60">Configure available Docker service templates</p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Recent Credit Transactions</h2>
              </div>
              <div className="divide-y divide-white/10">
                {creditTransactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'purchase' ? 'bg-green-400/20 text-green-400' :
                          transaction.type === 'refund' ? 'bg-blue-400/20 text-blue-400' :
                          'bg-red-400/20 text-red-400'
                        }`}>
                          {transaction.type === 'purchase' ? <TrendingUp className="w-4 h-4" /> :
                           transaction.type === 'refund' ? <CreditCard className="w-4 h-4" /> :
                           <Activity className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-white/60 text-sm">
                            {transaction.users?.name || 'Unknown User'} • {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                        </p>
                        <p className="text-white/60 text-sm capitalize">{transaction.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {currentView === 'users' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">User Management</h2>
            </div>
            <div className="divide-y divide-white/10">
              {users.map((user) => (
                <div key={user.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                        <p className="text-white/60">{user.email}</p>
                        <p className="text-white/40 text-sm">
                          Joined: {formatDate(user.created_at)} • ID: {user.id.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'text-purple-400 bg-purple-400/20' : 'text-blue-400 bg-blue-400/20'
                      }`}>
                        {user.role}
                      </span>
                      <span className="text-white/60 text-sm">{user.credits} credits</span>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserCreditsModal(true);
                        }}
                        className="p-2 text-white/60 hover:text-purple-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'services' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Service Management</h2>
            </div>
            <div className="divide-y divide-white/10">
              {services.map((service) => (
                <div key={service.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Server className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                        <p className="text-white/60">{service.users?.name} ({service.users?.email})</p>
                        <p className="text-blue-400 text-sm font-mono">{service.docker_image}</p>
                        <p className="text-white/40 text-sm">
                          Created: {formatDate(service.created_at)} • {service.credits_per_month} credits/month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'service-types' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Service Types Management</h2>
                <button
                  onClick={() => setShowCreateServiceType(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service Type
                </button>
              </div>
            </div>
            <div className="divide-y divide-white/10">
              {serviceTypes.map((serviceType) => (
                <div key={serviceType.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Package className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{serviceType.name}</h3>
                        <p className="text-blue-400 text-sm font-mono">{serviceType.docker_image}</p>
                        <p className="text-white/60 text-sm">{serviceType.description}</p>
                        <p className="text-white/40 text-sm">
                          {serviceType.credits_per_month} credits/month • Type: {serviceType.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(serviceType.status)}`}>
                        {serviceType.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedServiceType(serviceType);
                          setShowEditServiceType(true);
                        }}
                        className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteServiceType(serviceType.id)}
                        className="p-2 text-white/60 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Service Type Modal */}
      {showCreateServiceType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Create Service Type</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = Object.fromEntries(formData.entries());
              createServiceType(data);
            }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., n8n Workflow"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Type</label>
                  <input
                    type="text"
                    name="type"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., n8n"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Docker Image</label>
                <input
                  type="text"
                  name="docker_image"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., n8nio/n8n:latest"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  placeholder="Service description..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Credits per Month</label>
                  <input
                    type="number"
                    name="credits_per_month"
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Default Environment (JSON)</label>
                <textarea
                  name="default_environment"
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none font-mono text-sm"
                  placeholder='{"ENV_VAR": "value"}'
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Default Ports (JSON)</label>
                <textarea
                  name="default_ports"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none font-mono text-sm"
                  placeholder='[{"internal": 5678, "external": 5678, "protocol": "HTTP"}]'
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateServiceType(false)}
                  className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                >
                  Create Service Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Type Modal */}
      {showEditServiceType && selectedServiceType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Service Type</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = Object.fromEntries(formData.entries());
              updateServiceType(data);
            }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedServiceType.name}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Type</label>
                  <input
                    type="text"
                    name="type"
                    required
                    defaultValue={selectedServiceType.type}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Docker Image</label>
                <input
                  type="text"
                  name="docker_image"
                  required
                  defaultValue={selectedServiceType.docker_image}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={selectedServiceType.description}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Credits per Month</label>
                  <input
                    type="number"
                    name="credits_per_month"
                    required
                    min="1"
                    defaultValue={selectedServiceType.credits_per_month}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    required
                    defaultValue={selectedServiceType.status}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Default Environment (JSON)</label>
                <textarea
                  name="default_environment"
                  rows={4}
                  defaultValue={JSON.stringify(selectedServiceType.default_environment, null, 2)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Default Ports (JSON)</label>
                <textarea
                  name="default_ports"
                  rows={3}
                  defaultValue={JSON.stringify(selectedServiceType.default_ports, null, 2)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none font-mono text-sm"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditServiceType(false);
                    setSelectedServiceType(null);
                  }}
                  className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                >
                  Update Service Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Credits Modal */}
      {showUserCreditsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Update User Credits</h3>
            
            <div className="mb-6">
              <p className="text-white/80 mb-2">User: <span className="font-semibold text-white">{selectedUser.name}</span></p>
              <p className="text-white/60 mb-4">Current Credits: <span className="font-semibold text-white">{selectedUser.credits}</span></p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const newCredits = parseInt(formData.get('credits') as string);
              const description = formData.get('description') as string;
              updateUserCredits(selectedUser.id, newCredits, description);
            }} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">New Credit Amount</label>
                <input
                  type="number"
                  name="credits"
                  required
                  defaultValue={selectedUser.credits}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="e.g., Admin credit adjustment"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserCreditsModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
                >
                  Update Credits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;