import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { useAuth } from './hooks/useAuth';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'admin'>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const { user, loading, error, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      setCurrentPage(user.role === 'admin' ? 'admin' : 'dashboard');
      setShowAuthModal(false);
    } else {
      setCurrentPage('landing');
    }
  }, [user]);

  const handleLogin = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentPage('landing');
  };

  const handleReload = () => {
    window.location.reload();
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Terjadi Kesalahan</h2>
          <p className="text-white/70 mb-6">
            {error === 'Failed to get session' && 'Gagal memuat sesi. Silakan coba lagi.'}
            {error === 'Failed to initialize auth' && 'Gagal menginisialisasi autentikasi.'}
            {error === 'Failed to create user profile' && 'Gagal membuat profil pengguna.'}
            {error === 'Failed to fetch user profile' && 'Gagal memuat profil pengguna.'}
            {error === 'User profile not found' && 'Profil pengguna tidak ditemukan.'}
            {!['Failed to get session', 'Failed to initialize auth', 'Failed to create user profile', 'Failed to fetch user profile', 'User profile not found'].includes(error) && error}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleReload}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Muat Ulang Halaman
            </button>
            <button
              onClick={() => setCurrentPage('landing')}
              className="w-full px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Memuat Lunarpedia</h2>
          <p className="text-white/60 mb-4">Sedang menginisialisasi platform...</p>
          <div className="flex items-center justify-center space-x-2 text-white/40 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {currentPage === 'landing' && (
        <LandingPage
          onLoginClick={() => setShowAuthModal(true)}
          onGetStarted={() => setShowAuthModal(true)}
        />
      )}
      
      {currentPage === 'dashboard' && user && (
        <UserDashboard
          user={user}
          onLogout={handleLogout}
          onBuyCredits={() => setShowPaymentModal(true)}
        />
      )}
      
      {currentPage === 'admin' && user?.role === 'admin' && (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}

      {showPaymentModal && user && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          user={user}
        />
      )}
    </div>
  );
}

export default App;