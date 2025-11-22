import React, { useState, useEffect } from 'react';
import { CloudStore } from '../services/cloudStore';
import { Ticket, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
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
      <div className="w-full max-w-md mx-auto mt-8 mb-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full transform scale-150"></div>
            <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-emerald-300 mb-2">Code Applied!</h3>
                <p className="text-emerald-200/90 mb-6 font-medium">
                    You got a discount join our discord for off
                </p>
                <a 
                    href={DISCORD_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
                >
                    Join Discord <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8 mb-12 px-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-1 backdrop-blur-sm shadow-lg">
            <form onSubmit={handleRedeem} className="relative flex items-center">
                <div className="absolute left-4 text-slate-500">
                    <Ticket className="w-5 h-5" />
                </div>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        if(status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter Promo Code..."
                    className="w-full bg-transparent border-none text-white pl-12 pr-32 py-4 focus:outline-none focus:ring-0 placeholder:text-slate-600 font-mono uppercase tracking-wider"
                />
                <button 
                    type="submit"
                    className={`absolute right-2 top-2 bottom-2 px-4 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                        status === 'error' 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 cursor-not-allowed' 
                        : 'bg-slate-800 text-slate-300 hover:bg-brand-600 hover:text-white'
                    }`}
                    disabled={status === 'error'}
                >
                    {status === 'error' ? (
                        <>Invalid <XCircle className="w-4 h-4" /></>
                    ) : (
                        <>Redeem <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </form>
        </div>
    </div>
  );
};

export default PromoCodeSection;