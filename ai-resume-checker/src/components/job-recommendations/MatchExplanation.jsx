import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MatchExplanation({ text }) {
  return (
    <div className="mt-4 p-3 bg-gradient-to-r from-accent-blue/10 via-accent-purple/5 to-transparent border border-accent-blue/20 rounded-xl flex items-start gap-3 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-blue to-accent-purple"></div>
      <div className="p-1.5 bg-accent-blue/20 rounded-lg shrink-0 mt-0.5">
        <Sparkles size={14} className="text-accent-blue" />
      </div>
      <p className="text-sm text-gray-300 leading-relaxed italic">
        "{text}"
      </p>
    </div>
  );
}
