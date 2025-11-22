
import React from 'react';
import { Receipt, Check } from 'lucide-react';

const PRICING_ITEMS = [
  { name: "Simple Logo", price: "₹10" },
  { name: "Professional Logo", price: "₹20" },
  { name: "Professional Profile Photo", price: "₹10" },
  { name: "YouTube Channel Banner", price: "₹50" },
  { name: "YouTube Banner & PFP Combo", price: "₹20" },
  { name: "Thumbnails For YouTube Video", price: "₹40" },
];

const PricingPanel: React.FC = () => {
  return (
    <section id="pricing" className="w-full max-w-3xl mx-auto mb-24 px-4">
      <div className="relative">
        {/* Decorative blur */}
        <div className="absolute inset-0 bg-brand-500/5 blur-3xl -z-10 rounded-full"></div>

        <div className="bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Receipt className="w-6 h-6 text-brand-400" /> 
                        Service Pricing
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Transparent rates for quality work</p>
                </div>
                <div className="hidden sm:block px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
                    Affordable
                </div>
            </div>
            
            {/* List */}
            <div className="p-6 md:p-8 space-y-4">
                {PRICING_ITEMS.map((item, index) => (
                    <div key={index} className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-emerald-400" />
                            </div>
                            <span className="text-slate-200 font-medium text-sm md:text-base">{item.name}</span>
                        </div>
                        <div className="font-bold text-lg text-white tracking-tight bg-slate-950/50 px-3 py-1 rounded-lg border border-slate-800 shadow-sm">
                            {item.price}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="bg-slate-950/30 p-4 text-center border-t border-white/5">
                <p className="text-[12px] text-slate-500 font-medium">
                    * Prices may vary depending on the complexity of the request.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPanel;
