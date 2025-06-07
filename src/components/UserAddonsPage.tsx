import React, { useState } from 'react';
import { 
  Crown, 
  Globe, 
  Shield, 
  Star, 
  Activity, 
  Package,
  CheckCircle,
  X,
  CreditCard,
  ArrowLeft,
  Zap,
  Database
} from 'lucide-react';

interface UserAddonsPageProps {
  user: any;
  onBack: () => void;
  onBuyCredits: () => void;
}

export const UserAddonsPage: React.FC<UserAddonsPageProps> = ({ user, onBack, onBuyCredits }) => {
  // Available premium add-ons (would be fetched from API)
  const [availableAddons] = useState([
    {
      id: 1,
      name: 'Custom Domain',
      description: 'Use your own domain for services',
      icon: 'Globe',
      category: 'Domain & SSL',
      priceCredits: 25,
      billingCycle: 'monthly',
      status: 'active',
      features: ['Custom domain setup', 'SSL certificate', 'DNS management', 'CNAME configuration'],
      popular: true
    },
    {
      id: 2,
      name: 'SSL Certificate',
      description: 'Premium SSL certificates for enhanced security',
      icon: 'Shield',
      category: 'Security',
      priceCredits: 15,
      billingCycle: 'monthly',
      status: 'active',
      features: ['Wildcard SSL', 'Extended validation', 'Multi-domain support', '24/7 monitoring'],
      popular: false
    },
    {
      id: 3,
      name: 'Priority Support',
      description: '24/7 priority technical support',
      icon: 'Star',
      category: 'Support',
      priceCredits: 20,
      billingCycle: 'monthly',
      status: 'active',
      features: ['24/7 live chat', 'Phone support', 'Dedicated account manager', 'SLA guarantee'],
      popular: false
    },
    {
      id: 4,
      name: 'Advanced Analytics',
      description: 'Detailed analytics and monitoring',
      icon: 'Activity',
      category: 'Analytics',
      priceCredits: 30,
      billingCycle: 'monthly',
      status: 'active',
      features: ['Real-time monitoring', 'Custom dashboards', 'API analytics', 'Performance insights'],
      popular: false
    }
  ]);

  // User's active add-ons (would be fetched from API)
  const [userAddons, setUserAddons] = useState([
    {
      id: 1,
      addonId: 1,
      name: 'Custom Domain',
      serviceId: 1,
      serviceName: 'My Workflow Hub',
      priceCredits: 25,
      activatedAt: '2024-01-15',
      nextBilling: '2024-02-15',
      status: 'active'
    }
  ]);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Mock user services
  const userServices = [
    { id: 1, name: 'My Workflow Hub', type: 'n8n' },
    { id: 2, name: 'Support Chat', type: 'chatwoot' }
  ];

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Globe: <Globe className="w-6 h-6" />,
      Shield: <Shield className="w-6 h-6" />,
      Star: <Star className="w-6 h-6" />,
      Activity: <Activity className="w-6 h-6" />,
      Crown: <Crown className="w-6 h-6" />,
      Zap: <Zap className="w-6 h-6" />,
      Database: <Database className="w-6 h-6" />,
      Package: <Package className="w-6 h-6" />
    };
    return icons[iconName] || <Package className="w-6 h-6" />;
  };

  const handlePurchaseAddon = (addon: any) => {
    setSelectedAddon(addon);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedAddon || !selectedService) return;

    // Add to user's active add-ons
    const newUserAddon = {
      id: Date.now(),
      addonId: selectedAddon.id,
      name: selectedAddon.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      priceCredits: selectedAddon.priceCredits,
      activatedAt: new Date().toISOString().split('T')[0],
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active'
    };

    setUserAddons([...userAddons, newUserAddon]);
    setShowPurchaseModal(false);
    setSelectedAddon(null);
    setSelectedService(null);

    alert(`${selectedAddon.name} has been activated for ${selectedService.name}!`);
  };

  const cancelAddon = (userAddon: any) => {
    if (confirm(`Are you sure you want to cancel ${userAddon.name} for ${userAddon.serviceName}?`)) {
      setUserAddons(userAddons.filter(addon => addon.id !== userAddon.id));
      alert(`${userAddon.name} has been cancelled. You'll receive a pro-rated refund.`);
    }
  };

  const isAddonActiveForService = (addonId: number, serviceId: number) => {
    return userAddons.some(userAddon => 
      userAddon.addonId === addonId && userAddon.serviceId === serviceId
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Crown className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Premium Add-ons</h1>
                <p className="text-white/60">Enhance your services with premium features</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold">{user.credits || 250} Credits</span>
              </div>
              <button
                onClick={onBuyCredits}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Buy Credits
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Add-ons Section */}
        {userAddons.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Active Add-ons</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userAddons.map((userAddon) => (
                <div key={userAddon.id} className="bg-white/5 backdrop-blur-xl rounded-xl border border-green-500/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{userAddon.name}</h3>
                        <p className="text-green-400 text-sm">Active</p>
                      </div>
                    </div>
                    <button
                      onClick={() => cancelAddon(userAddon)}
                      className="p-2 text-white/60 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Service:</span>
                      <span className="text-white">{userAddon.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Cost:</span>
                      <span className="text-white">{userAddon.priceCredits} credits/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Next Billing:</span>
                      <span className="text-white">{userAddon.nextBilling}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Add-ons Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Available Premium Add-ons</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableAddons.filter(addon => addon.status === 'active').map((addon) => (
              <div key={addon.id} className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300 relative">
                {addon.popular && (
                  <div className="absolute -top-3 left-4">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg text-purple-400">
                      {getIconComponent(addon.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{addon.name}</h3>
                      <p className="text-purple-400 font-semibold">{addon.priceCredits} credits/{addon.billingCycle}</p>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">{addon.description}</p>

                <div className="space-y-2 mb-6">
                  <h4 className="text-white/80 text-sm font-medium">Features:</h4>
                  <ul className="space-y-1">
                    {addon.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-white/60 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchaseAddon(addon)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-semibold"
                >
                  Add to Service
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Info */}
        <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Add-on Categories</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {['Domain & SSL', 'Security', 'Support', 'Analytics'].map((category) => {
              const categoryAddons = availableAddons.filter(addon => addon.category === category && addon.status === 'active');
              return (
                <div key={category} className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">{category}</h4>
                  <p className="text-white/60 text-sm">{categoryAddons.length} add-ons available</p>
                  <p className="text-purple-400 text-xs mt-1">
                    From {Math.min(...categoryAddons.map(a => a.priceCredits))} credits/month
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedAddon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg text-purple-400 mr-3">
                {getIconComponent(selectedAddon.icon)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedAddon.name}</h3>
                <p className="text-purple-400">{selectedAddon.priceCredits} credits/month</p>
              </div>
            </div>

            <p className="text-white/80 mb-6">{selectedAddon.description}</p>

            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-2">Select Service</label>
              <div className="space-y-2">
                {userServices.map((service) => {
                  const isActive = isAddonActiveForService(selectedAddon.id, service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      disabled={isActive}
                      className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                        isActive
                          ? 'border-green-500/50 bg-green-500/10 cursor-not-allowed'
                          : selectedService?.id === service.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`${isActive ? 'text-green-400' : 'text-white'}`}>
                          {service.name}
                        </span>
                        {isActive && (
                          <span className="text-green-400 text-xs">Already Active</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedService && (
              <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-semibold mb-2">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Add-on:</span>
                    <span className="text-white">{selectedAddon.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Service:</span>
                    <span className="text-white">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Monthly Cost:</span>
                    <span className="text-white">{selectedAddon.priceCredits} credits</span>
                  </div>
                  <div className="border-t border-blue-500/20 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Your Credits:</span>
                      <span className="text-white">{user.credits || 250}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">After Purchase:</span>
                      <span className={`${(user.credits || 250) >= selectedAddon.priceCredits ? 'text-green-400' : 'text-red-400'}`}>
                        {(user.credits || 250) - selectedAddon.priceCredits}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  setSelectedAddon(null);
                  setSelectedService(null);
                }}
                className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                disabled={!selectedService || (user.credits || 250) < selectedAddon.priceCredits}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(user.credits || 250) < selectedAddon.priceCredits ? 'Insufficient Credits' : 'Activate Add-on'}
              </button>
            </div>

            {(user.credits || 250) < selectedAddon.priceCredits && (
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-red-400 text-sm text-center">
                  You need {selectedAddon.priceCredits - (user.credits || 250)} more credits to purchase this add-on.
                  <button
                    onClick={onBuyCredits}
                    className="text-red-300 underline ml-1 hover:text-red-200"
                  >
                    Buy credits now
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};