import React, { useState, useEffect } from 'react';
import { OrderStatus } from '../types';
import { CloudStore } from '../services/cloudStore';
import { X, Radio, ShieldCheck, Lock, KeyRound, AlertCircle, TicketPercent, Save } from 'lucide-react';

interface AdminPanelProps {
  currentStatus: OrderStatus;
  onClose: () => void;
}

// Security Configuration
const ADMIN_PASSWORD = "logify@makers!are!the!goat853@$r72;[";

const AdminPanel: React.FC<AdminPanelProps> = ({ currentStatus, onClose }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Admin State
  const [promoCode, setPromoCode] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const unsub = CloudStore.subscribeToPromoCode(setPromoCode);
    // @ts-ignore
    return () => unsub && unsub();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setPasswordInput("");
    }
  };

  const handleStatusChange = (status: OrderStatus) => {
    CloudStore.setStatus(status);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    CloudStore.setPromoCode(promoCode);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  // ------------------------------------------------------------------
  // RENDER: LOGIN SCREEN
  // ------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* Login Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <div className="flex items-center gap-2 text-slate-200">
                    <Lock className="w-5 h-5 text-brand-500" />
                    <span className="font-bold">Admin Access Required</span>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleLogin} className="p-6 space-y-6">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                        Enter Security Key
                    </label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                            type="password" 
                            value={passwordInput}
                            onChange={(e) => {
                                setPasswordInput(e.target.value);
                                if(loginError) setLoginError(false);
                            }}
                            className={`w-full bg-slate-950 border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 transition-all ${
                                loginError 
                                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                                : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500'
                            }`}
                            placeholder="••••••••••••••••"
                            autoFocus
                        />
                    </div>
                </div>

                {loginError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-in slide-in-from-top-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Access Denied: Invalid Key</span>
                    </div>
                )}

                <button 
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-900/20 active:scale-[0.98]"
                >
                    Unlock Panel
                </button>
            </form>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER: DASHBOARD
  // ------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-500" />
            <h2 className="text-2xl font-bold text-white">Admin Control Center</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* Status Control */}
          <section>
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-brand-400" /> Live Order Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleStatusChange(OrderStatus.ACCEPTING)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  currentStatus === OrderStatus.ACCEPTING 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${currentStatus === OrderStatus.ACCEPTING ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                Accepting Orders
              </button>

              <button
                onClick={() => handleStatusChange(OrderStatus.NOT_ACCEPTING)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  currentStatus === OrderStatus.NOT_ACCEPTING 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                 <div className={`w-3 h-3 rounded-full ${currentStatus === OrderStatus.NOT_ACCEPTING ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'}`}></div>
                Not Accepting
              </button>

              <button
                onClick={() => handleStatusChange(OrderStatus.SERVICES_DOWN)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  currentStatus === OrderStatus.SERVICES_DOWN 
                    ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                 <div className={`w-3 h-3 rounded-full ${currentStatus === OrderStatus.SERVICES_DOWN ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                Services Down
              </button>
            </div>
          </section>

          {/* Promo Code Control */}
          <section className="border-t border-slate-800 pt-8">
             <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <TicketPercent className="w-5 h-5 text-brand-400" /> Manage Promo Code
            </h3>
            <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
              <p className="text-slate-400 text-sm mb-4">Set the active promo code that users can redeem for a discount.</p>
              <form onSubmit={handleSavePromo} className="flex gap-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                        setPromoCode(e.target.value);
                        if(savedMessage) setSavedMessage(false);
                    }}
                    placeholder="e.g., LOGIFY2024"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shrink-0 active:scale-95"
                >
                  {savedMessage ? <span className="text-emerald-300">Saved!</span> : <> <Save className="w-4 h-4" /> Save Code </>}
                </button>
              </form>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;