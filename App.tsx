
import React, { useEffect, useState } from 'react';
import { ServiceItem, OrderStatus } from './types';
import { DISCORD_LINK } from './constants';
import { CloudStore } from './services/cloudStore';
import ServiceCard from './components/ServiceCard';
import PricingPanel from './components/PricingPanel';
import TermsAndConditions from './components/TermsAndConditions';
import StatusBanner from './components/StatusBanner';
import PromoCodeSection from './components/PromoCodeSection';
import AdminPanel from './components/AdminPanel';
import FAQSection from './components/FAQSection';
import ChatBot from './components/ChatBot';
import Reveal from './components/Reveal';
import { Disc as DiscordIcon, Sparkles, Lock, ChevronDown } from 'lucide-react';

const SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: 'Custom Logos',
    description: 'Unique, memorable, and professional logos designed to represent your brand identity perfectly.',
    iconName: 'palette'
  },
  {
    id: '2',
    title: 'YouTube Banners',
    description: 'High-impact channel art that converts viewers into subscribers. Optimized for all devices.',
    iconName: 'youtube'
  },
  {
    id: '3',
    title: 'Profile Photos',
    description: 'Professional avatars and profile pictures that make you stand out on any social platform.',
    iconName: 'camera'
  },
  {
    id: '4',
    title: 'Thumbnails',
    description: 'Click-worthy thumbnails designed to increase your CTR and boost video performance.',
    iconName: 'image'
  }
];

const App: React.FC = () => {
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.ACCEPTING);
  const [showAdmin, setShowAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const unsubStatus = CloudStore.subscribeToStatus(setStatus);
    return () => {
      // @ts-ignore
      if(unsubStatus) unsubStatus();
    };
  }, []);

  const handleSecretClick = () => {
    if (clickCount + 1 >= 5) {
      setShowAdmin(true);
      setClickCount(0);
    } else {
      setClickCount(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-200 pb-0 overflow-x-hidden">
      
      {/* Status Banner */}
      <StatusBanner status={status} />

      {/* Main Content Container */}
      <main className="flex-grow container mx-auto px-4 pt-12 pb-24 relative">
        
        {/* Hero Section */}
        <section className="text-center py-24 lg:py-32 relative z-10">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none animate-float"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-800/50 backdrop-blur-md text-brand-300 text-xs font-semibold tracking-widest uppercase mb-8 animate-fade-in-down shadow-lg shadow-brand-900/5">
              <Sparkles className="w-3 h-3 text-brand-400" /> Premium Design Services
            </div>
            
            <h1 
              onClick={handleSecretClick}
              className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight cursor-default select-none drop-shadow-2xl animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-500">
                Logify Makers
              </span>
            </h1>
            
            <p 
              className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed mb-12 font-light animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              We create <span className="text-slate-200 font-medium">stunning logos</span>, <span className="text-slate-200 font-medium">YouTube banners</span>, and <span className="text-slate-200 font-medium">high-CTR thumbnails</span>. 
              Elevate your brand with professional designs.
            </p>

            <div 
              className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <a 
                href={DISCORD_LINK} 
                target="_blank" 
                rel="noreferrer"
                className="group relative px-8 py-4 bg-discord text-white rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg shadow-discord/20 hover:shadow-discord/40 flex items-center gap-3 w-full sm:w-auto justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <DiscordIcon className="w-6 h-6" />
                Join Discord to Order
              </a>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth'})}
                className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg transition-all border border-slate-800 hover:border-slate-600 w-full sm:w-auto backdrop-blur-sm hover:-translate-y-1"
              >
                View Pricing
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-10 opacity-50 animate-bounce hidden md:block delay-1000 duration-1000 transition-opacity">
             <ChevronDown className="w-6 h-6 text-slate-500" />
          </div>
        </section>

        {/* Promo Code Section */}
        <Reveal>
          <PromoCodeSection />
        </Reveal>

        {/* Services Grid */}
        <section id="services" className="py-24 relative">
          <div className="text-center mb-16">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-brand-500 to-brand-accent mx-auto rounded-full"></div>
            </Reveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => (
              <Reveal key={service.id} delay={index * 100}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Pricing Panel */}
        <Reveal>
          <PricingPanel />
        </Reveal>

        {/* FAQ Section */}
        <Reveal>
          <FAQSection />
        </Reveal>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 bg-[#020203]">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-2 text-slate-300 font-bold text-xl tracking-tight">
             <span className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs">LM</span> Logify Makers
          </div>
          <p>© {new Date().getFullYear()} Logify Makers. All rights reserved.</p>
          
          <div className="flex items-center gap-6 mt-2">
             <TermsAndConditions />
             <button 
               onClick={() => setShowAdmin(true)}
               className="opacity-30 hover:opacity-100 transition-all duration-300 flex items-center gap-2 text-xs px-3 py-1 rounded-full hover:bg-slate-900"
             >
               <Lock className="w-3 h-3" /> Admin
             </button>
          </div>
        </div>
      </footer>

      {/* Admin Modal */}
      {showAdmin && (
        <AdminPanel 
          currentStatus={status}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* AI Chat Bot */}
      <ChatBot />

    </div>
  );
};

export default App;