
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: "How do I place an order?",
    answer: "It's simple! Join our Discord server using the link above. Once there, open a support ticket in the specialized channel, and our team will discuss your requirements and get started."
  },
  {
    question: "What is the turnaround time?",
    answer: "Most standard orders (logos, thumbnails) are completed within 24-72 hours. Complex projects like full branding packages or intricate illustrations may take a little longer, but we always keep you updated."
  },
  {
    question: "How is payment handled?",
    answer: "We require full payment upfront to begin work. We accept various payment methods which will be provided securely within your Discord ticket. Do not trust payment requests from DMs outside the ticket."
  },
  {
    question: "Can I request revisions?",
    answer: "Absolutely. We offer minor revisions to ensure the design meets your expectations. Major structural changes after the initial sketch approval may incur an extra fee."
  },
  {
    question: "What file formats do I receive?",
    answer: "You will receive high-quality PNG and JPG files. Source files (PSD/AI) can be provided upon request, though they may sometimes require an additional charge depending on the package."
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full max-w-3xl mx-auto mt-12 mb-24 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-brand-500" /> FAQ
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-brand-500 to-brand-accent mx-auto rounded-full"></div>
        <p className="text-slate-400 mt-4">Common questions about our design services</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <div 
            key={index}
            className={`bg-slate-900/40 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index 
                ? 'border-brand-500/50 shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)] bg-slate-800/30' 
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
              <span className={`font-semibold text-base md:text-lg transition-colors ${openIndex === index ? 'text-brand-300' : 'text-slate-200'}`}>
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-brand-500 shrink-0 ml-4" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-500 shrink-0 ml-4" />
              )}
            </button>
            
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="p-5 pt-0 text-slate-400 leading-relaxed text-sm md:text-base border-t border-white/5 mt-2">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
