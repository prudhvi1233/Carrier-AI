import React, { useState, useEffect } from 'react';
import { Lightbulb, Zap } from 'lucide-react';
import { TIPS } from '../../mockInterviewMentorData';
import { motion, AnimatePresence } from 'framer-motion';

export default function TipsSidebar() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quickModes = [
    'Mock HR Interview', 'Frontend Interview', 'DSA Interview', 
    'Java Interview', 'Python Interview', 'React Interview', 
    'Node.js Interview', 'SQL Interview', 'Behavioral Round'
  ];

  return (
    <div className="space-y-6">
      
      {/* Rotating Tips */}
      <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Lightbulb size={64} />
        </div>
        <div className="flex items-center gap-2 text-accent-blue font-bold mb-4">
          <Zap size={18} className="fill-accent-blue" />
          AI Interview Tips
        </div>
        
        <div className="h-16 relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white text-sm font-medium leading-relaxed absolute"
            >
              "{TIPS[currentTip]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Modes */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Start Modes</h3>
        <div className="flex flex-wrap gap-2">
          {quickModes.map(mode => (
            <button 
              key={mode}
              className="px-3 py-1.5 bg-black/40 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-lg text-xs font-medium text-gray-300 transition-colors"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
