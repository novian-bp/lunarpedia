import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'admin'>('landing');
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

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

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          user={user}
        />
      )}
    </div>
  );
}

export default App;