import React from 'react';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CareerProgressWidget({ score = 65, level = "Intermediate" }) {
  // Demo static values, could be fetched
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center h-full relative overflow-hidden">
      <h3 className="text-lg font-bold text-white mb-2 self-start w-full">Career Readiness</h3>
      
      <div className="relative flex items-center justify-center mt-4">
        {/* SVG Circle Progress */}
        <svg className="transform -rotate-90 w-40 h-40">
          <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent" />
          <motion.circle 
            cx="80" cy="80" r={radius} 
            stroke="url(#gradient)" strokeWidth="12" fill="transparent" 
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white tracking-tighter">{score}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Score</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy size={14} /> {level} Level
        </div>
        <p className="text-xs text-gray-400 max-w-[200px]">
          You are 35 points away from the 'Ready' tier. Keep improving your ATS score and practicing interviews!
        </p>
      </div>
    </div>
  );
}
