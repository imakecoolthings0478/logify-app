import React, { useState } from 'react';
import { Announcement } from '../types';
import { Bell, Megaphone, X, ChevronDown, ChevronUp } from 'lucide-react';

interface AnnouncementBoardProps {
  announcements: Announcement[];
}

const AnnouncementBoard: React.FC<AnnouncementBoardProps> = ({ announcements }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (announcements.length === 0) return null;

  const latest = announcements[0];
  const others = announcements.slice(1);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-4">
      <div className="bg-slate-900/80 border border-slate-700 rounded-lg overflow-hidden shadow-xl backdrop-blur-sm">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-900 to-slate-900 cursor-pointer hover:bg-slate-800 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 rounded-full text-brand-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Global Announcements</h3>
              <p className="text-xs text-slate-400">Latest updates from the team</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Content */}
        {isOpen && (
          <div className="divide-y divide-slate-800/50 max-h-60 overflow-y-auto">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 flex gap-3 hover:bg-slate-800/30 transition-colors animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="mt-1 min-w-[4px] h-full bg-brand-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-slate-200 text-sm md:text-base leading-relaxed">{ann.message}</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase">
                    {new Date(ann.timestamp).toLocaleString()} • {ann.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBoard;