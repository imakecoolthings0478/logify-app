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
          color: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400',
          icon: <CheckCircle2 className="w-5 h-5 animate-pulse" />,
          text: "We are currently ACCEPTING orders! Let's create something amazing.",
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
        };
      case OrderStatus.NOT_ACCEPTING:
        return {
          color: 'bg-amber-500/10 border-amber-500/50 text-amber-400',
          icon: <AlertTriangle className="w-5 h-5" />,
          text: "We are currently NOT accepting new orders. Please check back later.",
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]'
        };
      case OrderStatus.SERVICES_DOWN:
        return {
          color: 'bg-red-500/10 border-red-500/50 text-red-400',
          icon: <XCircle className="w-5 h-5" />,
          text: "Services are currently DOWN for maintenance.",
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`w-full py-3 px-4 border-b backdrop-blur-md transition-all duration-500 ${config.color} ${config.glow} flex items-center justify-center gap-3 sticky top-0 z-50`}>
      {config.icon}
      <span className="font-semibold tracking-wide text-sm md:text-base">{config.text}</span>
    </div>
  );
};

export default StatusBanner;