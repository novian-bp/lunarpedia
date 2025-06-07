import React, { useState } from 'react';
import { X, CreditCard, Banknote, Zap, Gift } from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
  user: any;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, user }) => {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Updated credit packages with IDR pricing and bonus system
  const creditPackages = [
    { 
      id: 'starter', 
      name: 'Starter Pack',
      credits: 100, 
      bonus: 10,
      priceIDR: 150000,
      popular: false 
    },
    { 
      id: 'professional', 
      name: 'Professional Pack',
      credits: 300, 
      bonus: 50,
      priceIDR: 400000,
      popular: true 
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise Pack',
      credits: 1000, 
      bonus: 200,
      priceIDR: 1200000,
      popular: false 
    },
    { 
      id: 'mega', 
      name: 'Mega Pack',
      credits: 2500, 
      bonus: 600,
      priceIDR: 2800000,
      popular: false 
    }
  ];

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePurchase = () => {
    const selectedPkg = creditPackages.find(p => p.id === selectedPackage);
    if (selectedPkg) {
      const totalCredits = selectedPkg.credits + selectedPkg.bonus;
      alert(`Purchase successful! ${totalCredits} credits (${selectedPkg.credits} + ${selectedPkg.bonus} bonus) added to your account for ${formatIDR(selectedPkg.priceIDR)}.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Buy Credits</h2>
          <p className="text-white/60">Choose a credit package to power your services</p>
        </div>

        {/* Credit Packages */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {creditPackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`p-6 rounded-xl border transition-all duration-200 text-left relative ${
                selectedPackage === pkg.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-4">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                <p className="text-2xl font-bold text-white mt-2">{formatIDR(pkg.priceIDR)}</p>
              </div>

              {/* Credits Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-white/80 text-sm">Base Credits</span>
                  </div>
                  <span className="text-white font-semibold">{pkg.credits}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Gift className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-white/80 text-sm">Bonus Credits</span>
                  </div>
                  <span className="text-yellow-400 font-semibold">+{pkg.bonus}</span>
                </div>
                
                <div className="border-t border-white/20 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Total Credits</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {pkg.credits + pkg.bonus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Value Information */}
              <div className="mt-4 pt-3 border-t border-white/20">
                <div className="flex justify-between text-xs text-white/60">
                  <span>Per Credit:</span>
                  <span>{formatIDR(Math.round(pkg.priceIDR / (pkg.credits + pkg.bonus)))}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">Bonus Value:</span>
                  <span className="text-green-400">{((pkg.bonus / pkg.credits) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Payment Method</h3>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center ${
                paymentMethod === 'card'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <CreditCard className="w-5 h-5 text-purple-400 mr-3" />
              <span className="text-white">Credit/Debit Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('bank')}
              className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center ${
                paymentMethod === 'bank'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <Banknote className="w-5 h-5 text-purple-400 mr-3" />
              <span className="text-white">Bank Transfer</span>
            </button>
            <button
              onClick={() => setPaymentMethod('ewallet')}
              className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center ${
                paymentMethod === 'ewallet'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <Zap className="w-5 h-5 text-purple-400 mr-3" />
              <span className="text-white">E-Wallet (GoPay, OVO, DANA)</span>
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Selected Package Summary */}
        {selectedPackage && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-semibold mb-2">Order Summary</h4>
            {(() => {
              const pkg = creditPackages.find(p => p.id === selectedPackage);
              if (!pkg) return null;
              return (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Package:</span>
                    <span className="text-white">{pkg.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Base Credits:</span>
                    <span className="text-white">{pkg.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Bonus Credits:</span>
                    <span className="text-yellow-400">+{pkg.bonus}</span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total Credits:</span>
                      <span className="text-white">{pkg.credits + pkg.bonus}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total Price:</span>
                      <span className="text-white">{formatIDR(pkg.priceIDR)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={!selectedPackage}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Purchase Credits
          </button>
        </div>

        <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <p className="text-yellow-400 text-sm text-center">
            Demo mode: No actual payment will be processed
          </p>
        </div>
      </div>
    </div>
  );
};