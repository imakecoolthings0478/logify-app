import React from 'react';

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
    <section id="pricing" className="w-full max-w-4xl mx-auto p-4 md:p-0 mb-16">
      {/* Pricing List Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white">Service Pricing</h3>
            <div className="h-1 w-12 bg-brand-500 mx-auto rounded-full mt-2"></div>
        </div>
        
        <div className="space-y-6">
          {PRICING_ITEMS.map((item, index) => (
            <div key={index} className="flex items-end justify-between group">
              <span className="text-slate-200 font-medium shrink-0 pr-2 text-sm md:text-base">{item.name}:</span>
              
              {/* Dotted Leader */}
              <div className="flex-grow border-b-2 border-dotted border-slate-700/40 mb-1.5 mx-1 relative"></div>
              
              <span className="font-bold shrink-0 pl-2 text-sm md:text-base text-sky-400">
                {item.price}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-[11px] text-slate-500 font-medium text-center">
          Note:- Prices may vary depending on the complexity of the request.
        </div>
      </div>
    </section>
  );
};

export default PricingPanel;