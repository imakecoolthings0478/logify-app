
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { DISCORD_LINK } from '../constants';

const SYSTEM_INSTRUCTION = `You are the AI Support Assistant for Logify Makers, a premium design agency.
Your role is to help users understand our services, pricing, and how to order.

KEY BUSINESS INFORMATION:
- Company Name: Logify Makers
- Services: Custom Logos, YouTube Banners, Profile Photos (PFPs), YouTube Thumbnails.
- Ordering Process: Users MUST join our Discord server to place an order. We do not accept orders directly through the website. They need to open a ticket in the specialized channel on Discord.
- Payment: Full payment is required upfront. Details provided in the Discord ticket.
- Pricing (in INR):
  * Simple Logo: ₹10
  * Professional Logo: ₹20
  * Professional Profile Photo: ₹10
  * YouTube Channel Banner: ₹50
  * Banner & PFP Combo: ₹20
  * Thumbnails: ₹40
- Refund Policy: No 100% refunds. 40-50% partial refund if unsatisfied. Revisions are allowed.

TONE & BEHAVIOR:
- Professional, creative, enthusiastic, and helpful.
- Keep answers concise (under 3 sentences preferably).
- Use emojis occasionally to be friendly.
- If a user asks to place an order, specifically guide them to click the Discord link on the site.
- If a user asks about something unrelated to design or Logify Makers, politely steer them back to our services.
- Do not make up prices that are not listed above.
`;

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi there! I'm the Logify AI Assistant. 👋 How can I help you with our designs or pricing today?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Chat
  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });
      } catch (error) {
        console.error("Failed to initialize AI chat", error);
      }
    };
    initChat();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Focus input on open
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsgText = inputText.trim();
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMsgText
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
          // Re-init if missing
           const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
           chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: SYSTEM_INSTRUCTION },
          });
      }

      const result = await chatRef.current.sendMessage({
        message: userMsgText
      });

      const botResponseText = result.text;

      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: botResponseText || "I'm sorry, I couldn't generate a response. Please try again."
      };

      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting to the server right now. Please try again later or check our Discord."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${
          isOpen 
          ? 'bg-slate-800 text-slate-400 rotate-90' 
          : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:shadow-brand-500/50'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 fill-current" />}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 z-40 w-[90vw] sm:w-96 max-h-[600px] h-[70vh] flex flex-col bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400 border border-brand-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Logify Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-400 font-medium">Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                  msg.role === 'user' 
                  ? 'bg-slate-700 text-slate-300' 
                  : 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                }`}>
                  {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>

                {/* Bubble */}
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full">
               <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-4 py-3 rounded-2xl rounded-tl-none ml-8">
                  <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                  <span className="text-xs text-slate-500">Thinking...</span>
               </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-950/30 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about logos, pricing..."
              className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-600"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 disabled:opacity-50 disabled:hover:bg-brand-600 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-600">AI can make mistakes. Review info.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
