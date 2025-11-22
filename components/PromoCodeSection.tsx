
import React, { useState, useEffect } from 'react';
import { CloudStore } from '../services/cloudStore';
import { Ticket, CheckCircle, XCircle, ArrowRight, Gift } from 'lucide-react';
import { DISCORD_LINK } from '../constants';

const PromoCodeSection: React.FC = () => {
  const [input, setInput] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const unsub = CloudStore.subscribeToPromoCode(setActiveCode);
    // @ts-ignore
    return () => unsub && unsub();
  }, []);

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    if (activeCode && input.trim().toUpperCase() === activeCode.toUpperCase()) {
      setStatus('success');
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-lg mx-auto mt-8 mb-16 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-500/30 backdrop-blur-md rounded-2xl p-8 text-center relative overflow-hidden shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 blur-3xl rounded-full"></div>
            
            <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-emerald-900/50">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Code Redeemed!</h3>
                <p className="text-emerald-200/80 mb-8 font-medium text-sm">
                    Your discount code has been verified. Join our Discord to claim it on your next order.
                </p>
                <a 
                    href={DISCORD_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold transition-all shadow-lg"
                >
                    Claim on Discord <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8 mb-16 px-4 relative z-20">
        <div className="group relative">
            {/* Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-brand-accent rounded-2xl opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
            
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-xl flex items-center">
                <div className="pl-4 pr-3 text-slate-500">
                    <Gift className="w-5 h-5" />
                </div>
                <form onSubmit={handleRedeem} className="flex-grow flex items-center">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if(status === 'error') setStatus('idle');
                        }}
                        placeholder="Have a promo code?"
                        className="w-full bg-transparent border-none text-white py-3 focus:outline-none focus:ring-0 placeholder:text-slate-600 font-mono text-sm uppercase tracking-wider"
                    />
                    <button 
                        type="submit"
                        className={`ml-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                            status === 'error' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed' 
                            : 'bg-slate-800 text-slate-300 hover:bg-brand-600 hover:text-white border border-slate-700 hover:border-brand-500'
                        }`}
                        disabled={status === 'error'}
                    >
                        {status === 'error' ? (
                            <>Invalid <XCircle className="w-4 h-4" /></>
                        ) : (
                            <>Redeem</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default PromoCodeSection;
