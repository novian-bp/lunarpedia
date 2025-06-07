import React from 'react';
import { Cloud, Zap, Shield, Star, ArrowRight, Server, Database, MessageSquare } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onGetStarted }) => {
  const services = [
    {
      name: 'n8n',
      description: 'Powerful workflow automation platform',
      icon: <Zap className="w-8 h-8" />,
      price: '50 credits/month',
      features: ['Visual workflow builder', 'API integrations', 'Custom triggers']
    },
    {
      name: 'Chatwoot',
      description: 'Customer engagement platform',
      icon: <MessageSquare className="w-8 h-8" />,
      price: '40 credits/month',
      features: ['Live chat', 'Multi-channel', 'Team collaboration']
    },
    {
      name: 'Database Services',
      description: 'Managed database solutions',
      icon: <Database className="w-8 h-8" />,
      price: '30 credits/month',
      features: ['Auto backups', 'High availability', 'Scaling options']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Cloud className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Lunarpedia
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLoginClick}
                className="px-4 py-2 text-white/80 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Deploy Services
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Launch powerful services like n8n, Chatwoot, and more with just a few clicks. 
              Pay only for what you use with our flexible credit system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center"
              >
                Start Building
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all duration-200 backdrop-blur-sm">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Available Services</h2>
            <p className="text-xl text-white/70">Choose from our curated selection of powerful tools</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl text-purple-400">
                      {service.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white">{service.name}</h3>
                      <p className="text-purple-400 font-semibold">{service.price}</p>
                    </div>
                  </div>
                  <p className="text-white/70 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-white/60">
                        <Star className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instant Deployment</h3>
              <p className="text-white/70">Deploy services in seconds with our optimized infrastructure</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
              <p className="text-white/70">Bank-grade security with encrypted data and secure connections</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Scalable Infrastructure</h3>
              <p className="text-white/70">Auto-scaling resources to handle any workload</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Cloud className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Lunarpedia
            </span>
          </div>
          <p className="text-white/60">© 2024 Lunarpedia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};