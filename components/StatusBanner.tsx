
import React from 'react';
import { OrderStatus } from '../types';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface StatusBannerProps {
  status: OrderStatus;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case OrderStatus.ACCEPTING:
        return {
          color: 'border-emerald-500/30 text-emerald-400',
          bg: 'bg-emerald-950/30',
          icon: <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />,
          text: "Orders are OPEN! Let's create something amazing.",
          glow: 'shadow-[0_4px_20px_-5px_rgba(16,185,129,0.2)]'
        };
      case OrderStatus.NOT_ACCEPTING:
        return {
          color: 'border-amber-500/30 text-amber-400',
          bg: 'bg-amber-950/30',
          icon: <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />,
          text: "Orders are temporarily CLOSED. Check back soon!",
          glow: 'shadow-[0_4px_20px_-5px_rgba(245,158,11,0.2)]'
        };
      case OrderStatus.SERVICES_DOWN:
        return {
          color: 'border-red-500/30 text-red-400',
          bg: 'bg-red-950/30',
          icon: <XCircle className="w-4 h-4 md:w-5 md:h-5" />,
          text: "Services are currently DOWN for maintenance.",
          glow: 'shadow-[0_4px_20px_-5px_rgba(239,68,68,0.2)]'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b ${config.bg} ${config.color} ${config.glow} transition-all duration-500`}>
      <div className="container mx-auto flex items-center justify-center py-3 px-4 gap-3">
        {config.icon}
        <span className="font-medium tracking-wide text-xs md:text-sm uppercase">{config.text}</span>
      </div>
    </div>
  );
};

export default StatusBanner;
