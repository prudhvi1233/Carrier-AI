import React from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuggestionsList({ suggestions = [] }) {
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-accent-blue/10 rounded-xl border border-accent-blue/20">
          <Lightbulb size={20} className="text-accent-blue" />
        </div>
        <h3 className="text-lg font-semibold text-white">Actionable Suggestions</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
        {suggestions.map((sug, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityColor(sug.priority)}`}>
                {sug.priority} Priority
              </span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{sug.category}</span>
            </div>
            
            <div className="flex items-start gap-3 mt-3">
              <ChevronRight size={16} className="text-accent-blue mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform" />
              <p className="text-sm text-gray-300 leading-relaxed">{sug.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
