
import React from 'react';
import { ServiceItem } from '../types';
import { Palette, Image as ImageIcon, Youtube, Camera, ArrowRight } from 'lucide-react';
import { DISCORD_LINK } from '../constants';

interface ServiceCardProps {
  service: ServiceItem;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getIcon = () => {
    switch (service.iconName) {
      case 'palette': return <Palette className="w-6 h-6" />;
      case 'youtube': return <Youtube className="w-6 h-6" />;
      case 'camera': return <Camera className="w-6 h-6" />;
      case 'image': default: return <ImageIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="group relative h-full hover:-translate-y-2 transition-transform duration-500 ease-out">
      {/* Glow effect behind card */}
      <div className="absolute -inset-0.5 bg-gradient-to-b from-brand-500 to-brand-accent rounded-2xl opacity-0 group-hover:opacity-50 transition duration-500 blur-lg"></div>
      
      <div className="relative h-full flex flex-col bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors duration-300 overflow-hidden">
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-brand-400 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-400 transition-all duration-300 shadow-lg shadow-black/50">
          {getIcon()}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-200 transition-colors">{service.title}</h3>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
          {service.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-800/50 group-hover:border-slate-700/50 transition-colors">
            <a 
                href={DISCORD_LINK} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center text-sm font-semibold text-slate-300 hover:text-white transition-colors group/link"
            >
                Order on Discord 
                <ArrowRight className="w-4 h-4 ml-2 text-brand-500 group-hover/link:translate-x-1 transition-transform" />
            </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;