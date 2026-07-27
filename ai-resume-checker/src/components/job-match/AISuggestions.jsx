import React from 'react';
import { Lightbulb, AlertTriangle, ArrowUpCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AISuggestions({ suggestions }) {
  const getPriorityConfig = (priority) => {
    switch(priority) {
      case 'High': return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' };
      case 'Medium': return { icon: ArrowUpCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' };
      default: return { icon: Info, color: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/20' };
    }
  };

  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Lightbulb className="text-yellow-400" size={24} />
        AI Suggestions
      </h3>
      
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const config = getPriorityConfig(suggestion.priority);
          const Icon = config.icon;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className={`p-4 rounded-xl border ${config.bg} flex gap-4`}
            >
              <div className="shrink-0 mt-1">
                <Icon className={config.color} size={20} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-sm font-bold ${config.color}`}>{suggestion.priority} Priority</span>
                  <span className="text-xs text-gray-400 px-2 py-0.5 bg-white/10 rounded-full">{suggestion.category}</span>
                  <span className="text-xs text-green-400 font-medium ml-auto flex items-center gap-1">
                    Impact: {suggestion.estimated_impact}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
