
import React, { useState, useEffect } from 'react';
import { OrderStatus } from '../types';
import { CloudStore } from '../services/cloudStore';
import { X, Radio, ShieldCheck, Lock, KeyRound, AlertCircle, TicketPercent, Save, Cloud, HardDrive, LogOut, Wifi, WifiOff, Settings, RefreshCw, Globe, Database } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'config'>('dashboard');
  const [promoCode, setPromoCode] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);
  
  // Config State
  const [configForm, setConfigForm] = useState({
      PROJECT_ID: '',
      DB: '',
      ENDPOINT: ''
  });
  
  // Diagnostics
  const [connError, setConnError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const unsub = CloudStore.subscribeToPromoCode(setPromoCode);
    
    // Load current config
    const currentConfig = CloudStore.getConfig();
    setConfigForm({
        PROJECT_ID: currentConfig.PROJECT_ID,
        DB: currentConfig.DB,
        ENDPOINT: currentConfig.ENDPOINT
    });

    // Poll for errors
    const interval = setInterval(() => {
        setConnError(CloudStore.getConnectionError());
    }, 1000);

    // @ts-ignore
    return () => {
        unsub && unsub();
        clearInterval(interval);
    };
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

  const handleSaveConfig = (e: React.FormEvent) => {
      e.preventDefault();
      if(confirm("Saving new configuration will reload the app. Continue?")) {
          CloudStore.saveConfig({
              PROJECT_ID: configForm.PROJECT_ID,
              DB: configForm.DB,
              ENDPOINT: configForm.ENDPOINT
          });
      }
  };
  
  const handleRetryConnection = () => {
      setIsRetrying(true);
      CloudStore.retryConnection().then(() => {
          setTimeout(() => setIsRetrying(false), 1000);
      });
  };

  const isCloud = CloudStore.isConfigured();

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
                            placeholder="Enter password..."
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
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] h-[700px]">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col gap-2 shrink-0">
            <div className="mb-6 px-2 pt-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-500" /> Admin
                </h2>
                <p className="text-xs text-slate-500">Control Center</p>
            </div>

            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'dashboard' 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
            >
                <Radio className="w-4 h-4" /> Dashboard
            </button>
            
            <button 
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'config' 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
            >
                <Settings className="w-4 h-4" /> Server Config
            </button>

            <div className="mt-auto pt-4 border-t border-slate-800 space-y-2">
                {/* Status Indicator */}
                <div className={`flex flex-col gap-1 px-4 py-3 rounded-xl border ${isCloud ? 'bg-emerald-950/30 border-emerald-900' : 'bg-amber-950/30 border-amber-900'}`}>
                   <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            {isCloud ? <Wifi className="w-4 h-4 text-emerald-500" /> : <WifiOff className="w-4 h-4 text-amber-500" />}
                            <span className={`text-sm font-semibold ${isCloud ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {isCloud ? 'Cloud Online' : 'Offline'}
                            </span>
                        </div>
                        <button onClick={handleRetryConnection} className="p-1 hover:bg-white/10 rounded-full transition-colors" title="Retry Connection">
                            <RefreshCw className={`w-3 h-3 text-slate-400 ${isRetrying ? 'animate-spin' : ''}`} />
                        </button>
                   </div>
                   {/* Connection Detail Error */}
                   {connError && (
                       <p className="text-[10px] text-red-400 mt-1 leading-tight break-words border-t border-red-900/30 pt-1">
                           {connError}
                       </p>
                   )}
                </div>

                <button onClick={onClose} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                    <LogOut className="w-4 h-4" /> Logout / Close
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8 h-full bg-slate-900">
            
            {activeTab === 'dashboard' && (
                <>
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
                            Accepting
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
                </>
            )}

            {activeTab === 'config' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-amber-400">Advanced Configuration</h4>
                            <p className="text-sm text-amber-200/70">Changing these values will disconnect the current session and reload the app. Only modify if you are setting up a new database.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSaveConfig} className="space-y-6">
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Appwrite Endpoint
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none font-mono text-sm"
                                    value={configForm.ENDPOINT}
                                    onChange={(e) => setConfigForm({...configForm, ENDPOINT: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                    <Cloud className="w-4 h-4" /> Project ID
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none font-mono text-sm"
                                    value={configForm.PROJECT_ID}
                                    onChange={(e) => setConfigForm({...configForm, PROJECT_ID: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                    <Database className="w-4 h-4" /> Database ID
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none font-mono text-sm"
                                    value={configForm.DB}
                                    onChange={(e) => setConfigForm({...configForm, DB: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-800 flex justify-end">
                            <button 
                                type="submit"
                                className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-900/20"
                            >
                                <Save className="w-4 h-4" /> Save & Reload
                            </button>
                        </div>
                    </form>

                    {/* Troubleshooting Guide */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <WifiOff className="w-5 h-5 text-red-400" /> Troubleshooting Connection
                        </h4>
                        <div className="space-y-4 text-sm text-slate-400">
                            <p>If you see "Network Error", follow these steps in your Appwrite Console:</p>
                            <ol className="list-decimal list-inside space-y-2 ml-2">
                                <li>Go to <strong>Appwrite Console</strong> {'>'} <strong>Overview</strong></li>
                                <li>Scroll down to <strong>Platforms</strong></li>
                                <li>Click <strong>Add Platform</strong> {'>'} <strong>Web App</strong></li>
                                <li>Enter Name: <span className="text-brand-400 font-mono">Logify</span></li>
                                <li>Enter Hostname: <span className="text-brand-400 font-mono bg-slate-900 px-1 rounded">*</span> (Asterisk allows all domains)</li>
                                <li>Click Next/Skip until finished.</li>
                            </ol>
                            <div className="mt-4 p-3 bg-brand-900/20 border border-brand-500/20 rounded-lg text-brand-300">
                                <p><strong>Tip:</strong> Using <strong>*</strong> as the hostname is the easiest way to fix "Network Error" on Netlify/Vercel.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
