import React from 'react';
import { ServiceItem } from './types';
import { DISCORD_LINK } from './constants';
import ServiceCard from './components/ServiceCard';
import PricingPanel from './components/PricingPanel';
import TermsAndConditions from './components/TermsAndConditions';
import { Disc as DiscordIcon, Sparkles } from 'lucide-react';

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
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-500 selection:text-white pb-10">
      
      {/* Main Content Container */}
      <main className="flex-grow container mx-auto px-4 pt-10 pb-20">
        
        {/* Hero Section */}
        <section className="text-center py-20 relative">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-brand-300 text-xs font-semibold tracking-wider uppercase mb-6 animate-fade-in-up">
              <Sparkles className="w-3 h-3" /> Premium Design Services
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 tracking-tight">
              Logify Makers
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed mb-10">
              We create logos, banners for YouTube, professional profile photos, and thumbnails for creators. 
              Top-tier quality at unbeatable rates with the best support in the industry.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={DISCORD_LINK} 
                target="_blank" 
                rel="noreferrer"
                className="px-8 py-4 bg-discord hover:bg-discordHover text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-discord/30 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <DiscordIcon className="w-6 h-6" />
                Join Discord to Order
              </a>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth'})}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition-all border border-slate-700 w-full sm:w-auto"
              >
                View Pricing
              </button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
            <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Pricing Panel */}
        <PricingPanel />

        {/* Terms and Conditions (Expandable at bottom) */}
        <TermsAndConditions />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-950/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Logify Makers. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default App;