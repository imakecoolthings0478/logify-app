import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, FileText } from 'lucide-react';

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
    <section className="w-full max-w-4xl mx-auto mt-20 mb-10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 hover:bg-slate-900 transition-all rounded-xl group"
      >
        <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-slate-500 group-hover:text-brand-400 transition-colors" />
            <div className="text-left">
                <h2 className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">Terms & Conditions</h2>
                <p className="text-xs text-slate-500">Click to view our policies and guidelines</p>
            </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-brand-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>

      {isOpen && (
        <div className="mt-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl p-6 md:p-8 space-y-6 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                <span className="text-sm text-slate-400">Please read carefully before placing an order.</span>
            </div>
            {TERMS.map((term, index) => (
            <div key={index} className="flex gap-4 items-start">
                <div className="mt-1 shrink-0">
                <Check className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                <h4 className="text-sky-400 font-bold text-base mb-1">{term.title}:</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                    {term.content}
                </p>
                </div>
            </div>
            ))}
        </div>
      )}
    </section>
  );
};

export default TermsAndConditions;