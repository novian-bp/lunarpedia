import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { useAuth } from './hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'admin'>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      console.log('User loaded:', user);
      setCurrentPage(user.role === 'admin' ? 'admin' : 'dashboard');
      setShowAuthModal(false);
      setError(null);
    } else if (!loading) {
      console.log('No user, showing landing page');
      setCurrentPage('landing');
    }
  }, [user, loading]);

  const handleLogin = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentPage('landing');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Gagal logout. Silakan coba lagi.');
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-lg mb-2">Memuat Lunarpedia...</p>
          <p className="text-white/60 text-sm">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Terjadi Kesalahan</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
          >
            Muat Ulang
          </button>
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