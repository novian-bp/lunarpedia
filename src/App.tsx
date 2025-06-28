import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { useAuth } from './hooks/useAuth';

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          text="Memuat Lunarpedia Platform..." 
          className="text-center"
        />
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Koneksi Bermasalah</h2>
          <p className="text-white/70 mb-6">
            Tidak dapat terhubung ke server. Pastikan koneksi internet Anda stabil dan coba lagi.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
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
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;