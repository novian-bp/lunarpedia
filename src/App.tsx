import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'admin'>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      setCurrentPage(user.role === 'admin' ? 'admin' : 'dashboard');
      setShowAuthModal(false);
    } else {
      setCurrentPage('landing');
    }
  }, [user]);

  const handleLogin = () => {
    // This is handled by the useAuth hook now
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentPage('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
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