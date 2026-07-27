import React from 'react';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MatchScoreCard({ score, label, title, company }) {
  const getScoreColor = (s) => {
    if (s >= 80) return 'text-green-400';
    if (s >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getScoreGradient = (s) => {
    if (s >= 80) return 'from-green-400/20 to-green-500/5 border-green-400/20';
    if (s >= 60) return 'from-yellow-400/20 to-yellow-500/5 border-yellow-400/20';
    return 'from-red-400/20 to-red-500/5 border-red-400/20';
  };

  return (
    <div className={`bg-secondary/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border relative overflow-hidden bg-gradient-to-br ${getScoreGradient(score)}`}>
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Target size={100} />
      </div>
      
      <div className="flex items-center gap-8 relative z-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-white/10 stroke-current"
              strokeWidth="8"
              cx="50" cy="50" r="40"
              fill="transparent"
            ></circle>
            <motion.circle
              className={`${getScoreColor(score)} stroke-current`}
              strokeWidth="8"
              strokeLinecap="round"
              cx="50" cy="50" r="40"
              fill="transparent"
              initial={{ strokeDasharray: "0 251" }}
              animate={{ strokeDasharray: `${(score / 100) * 251} 251` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            ></motion.circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{score}%</span>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{label}</h2>
          <p className="text-gray-300 text-lg">{title}</p>
          <p className="text-gray-400">{company}</p>
        </div>
      </div>
    </div>
  );
}
