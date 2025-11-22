import React, { useState } from 'react';
import { OrderStatus, Announcement } from '../types';
import { CloudStore } from '../services/cloudStore';
import { X, Send, Radio, ShieldCheck, Trash2, Lock, KeyRound, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  currentStatus: OrderStatus;
  announcements: Announcement[];
  onClose: () => void;
}

// Security Configuration
const ADMIN_PASSWORD = "logify@makers!are!the!goat853@$r72;[";

const AdminPanel: React.FC<AdminPanelProps> = ({ currentStatus, announcements, onClose }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Admin State
  const [newAnnouncement, setNewAnnouncement] = useState("");

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

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    CloudStore.addAnnouncement(newAnnouncement);
    setNewAnnouncement("");
  };

  const handleClear = () => {
    if(confirm("Are you sure you want to delete all announcements? This action cannot be undone.")) {
        CloudStore.clearAnnouncements();
    }
  }

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
            <p className="text-xs text-slate-500 mt-2">Changes are broadcast instantly to all connected users.</p>
          </section>

          {/* Announcement Control */}
          <section>
             <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-brand-400" /> Post Announcement
            </h3>
            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div className="relative">
                <textarea
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="Type your global announcement here..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent min-h-[120px] resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newAnnouncement.trim()}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Live
                </button>
              </div>
            </form>
          </section>

          {/* History */}
           <section className="border-t border-slate-800 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Posts</h3>
                    <button 
                        onClick={handleClear} 
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-2 transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Clear Announcements
                    </button>
                </div>
                <div className="space-y-3">
                    {announcements.length === 0 && <p className="text-slate-600 italic">No active announcements.</p>}
                    {announcements.map((ann) => (
                        <div key={ann.id} className="p-3 bg-slate-800/50 rounded-lg text-sm text-slate-300 border-l-2 border-slate-600">
                            {ann.message}
                            <div className="text-[10px] text-slate-500 mt-1">{new Date(ann.timestamp).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
           </section>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;