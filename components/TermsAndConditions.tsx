
import React, { useState } from 'react';
import { Check, X, Shield } from 'lucide-react';

const TERMS = [
  {
    title: "Ordering Process",
    content: "All commission requests must be made by opening a ticket on our official Discord server. This ensures all communication and files are kept in one place."
  },
  {
    title: "Payment",
    content: "Full payment is required upfront before any design work begins. All payment details will be provided securely within your Discord ticket. Do not trust payment requests from any other source."
  },
  {
    title: "Delivery",
    content: "Final files will be delivered in high-resolution PNG format via your Discord ticket or email. Delivery times are estimates and depend on project complexity and client response time."
  },
  {
    title: "Refund Policy",
    content: "We do not guarantee a 100% refund. However, if you are not satisfied after gratification of work, and request a refund a partial refund of 40-50% will be sent. In some cases no refund will be offered."
  },
  {
    title: "Usage Rights",
    content: "Upon completion and delivery, you (the client) receive full rights to use the design for personal and commercial purposes. We reserve the right to display the final work in our portfolio."
  },
  {
    title: "Client Responsibility",
    content: "You are responsible for providing a clear design brief and any necessary assets. Delays in providing feedback will affect the delivery timeline."
  },
  {
    title: "Changes to T&C",
    content: "Any changes to these terms will be announced on the Discord server. By using our services or joining the server, you agree to the current Terms & Conditions."
  }
];

const TermsAndConditions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Footer Link Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-slate-500 hover:text-brand-400 transition-colors text-xs md:text-sm font-medium hover:underline underline-offset-4"
      >
        Terms & Conditions
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div 
             className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                 <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-500" /> Terms & Conditions
                 </h2>
                 <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              {/* Content */}
              <div className="overflow-y-auto p-6 space-y-6 bg-slate-900/50 custom-scrollbar">
                 <p className="text-sm text-slate-400 italic border-b border-slate-800 pb-4 mb-4">
                    Last updated: {new Date().toLocaleDateString()}
                 </p>
                 {TERMS.map((term, index) => (
                    <div key={index} className="flex gap-3 group">
                       <div className="shrink-0 mt-1 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-brand-500/50 group-hover:bg-brand-500/10 transition-colors">
                          <Check className="w-3 h-3 text-slate-500 group-hover:text-brand-400" />
                       </div>
                       <div>
                          <h3 className="text-slate-200 font-semibold text-sm mb-1 group-hover:text-brand-200 transition-colors">{term.title}</h3>
                          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{term.content}</p>
                       </div>
                    </div>
                 ))}
              </div>
              
              {/* Footer Action */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
              </div>
           </div>
           
           {/* Click outside to close */}
           <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default TermsAndConditions;
