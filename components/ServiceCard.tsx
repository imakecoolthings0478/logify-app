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
      case 'palette': return <Palette className="w-8 h-8" />;
      case 'youtube': return <Youtube className="w-8 h-8" />;
      case 'camera': return <Camera className="w-8 h-8" />;
      case 'image': default: return <ImageIcon className="w-8 h-8" />;
    }
  };

  return (
    <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-slate-700 to-slate-800 hover:from-brand-500 hover:to-brand-accent transition-all duration-300 transform hover:-translate-y-2">
      <div className="bg-slate-950 rounded-xl p-6 h-full flex flex-col items-start gap-4 relative overflow-hidden">
        {/* Hover Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="p-3 bg-slate-900 rounded-lg text-brand-400 group-hover:text-brand-300 group-hover:bg-brand-900/50 transition-colors">
          {getIcon()}
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">
            {service.description}
          </p>
        </div>

        <div className="mt-auto pt-4 w-full">
            <a 
                href={DISCORD_LINK} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
                Order on Discord <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;