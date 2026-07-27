import React from 'react';
import { Bot } from 'lucide-react';

export default function ResumeSummary({ summary }) {
  return (
    <div className="glass-card p-6 h-full relative overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2.5 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 rounded-xl border border-white/10 text-white">
          <Bot size={20} className="text-accent-purple" />
        </div>
        <h3 className="text-lg font-semibold text-white">AI Executive Summary</h3>
      </div>
      
      <div className="flex-1 relative z-10">
        <p className="text-gray-300 leading-relaxed text-sm">
          {summary}
        </p>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 blur-[50px] pointer-events-none" />
    </div>
  );
}
