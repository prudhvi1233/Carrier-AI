import React from 'react';
import { Check, Edit3, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GrammarFormattingCards({ grammarScore, formattingScore }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
      {/* Grammar Card */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Edit3 size={60} />
        </div>
        
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="p-2 bg-overlay rounded-lg border border-border">
            <Edit3 size={18} className="text-accent-purple" />
          </div>
          <h3 className="font-semibold text-foreground">Grammar</h3>
        </div>
        
        <div className="flex items-end justify-between relative z-10">
          <span className={`text-4xl font-bold tracking-tighter ${getScoreColor(grammarScore)}`}>
            {grammarScore}
          </span>
          <span className="text-sm text-muted font-medium mb-1">/ 100</span>
        </div>
      </motion.div>

      {/* Formatting Card */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <LayoutTemplate size={60} />
        </div>
        
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="p-2 bg-overlay rounded-lg border border-border">
            <LayoutTemplate size={18} className="text-accent-blue" />
          </div>
          <h3 className="font-semibold text-foreground">Formatting</h3>
        </div>
        
        <div className="flex items-end justify-between relative z-10">
          <span className={`text-4xl font-bold tracking-tighter ${getScoreColor(formattingScore)}`}>
            {formattingScore}
          </span>
          <span className="text-sm text-muted font-medium mb-1">/ 100</span>
        </div>
      </motion.div>
    </div>
  );
}
