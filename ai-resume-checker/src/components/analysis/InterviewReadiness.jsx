import React from 'react';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InterviewReadiness({ readiness, confidence }) {
  const getConfidenceColor = (conf) => {
    switch (conf.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-muted bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-150 group-hover:bg-accent-blue/20" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-accent-blue/10 rounded-xl border border-accent-blue/20">
          <Target size={20} className="text-accent-blue" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Interview Readiness</h3>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-6">
        <div className="flex items-end justify-center w-full">
          <span className="text-6xl font-bold tracking-tighter text-foreground">{readiness}</span>
          <span className="text-lg text-muted font-medium mb-1.5 ml-1">/ 100</span>
        </div>

        <div className="w-full flex flex-col gap-2 items-center">
          <span className="text-sm text-muted uppercase tracking-wider font-semibold">Confidence Meter</span>
          <div className={`px-4 py-1.5 rounded-full border font-bold uppercase tracking-wider text-sm shadow-sm ${getConfidenceColor(confidence)}`}>
            {confidence}
          </div>
        </div>
      </div>
    </div>
  );
}
