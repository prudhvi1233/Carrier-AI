import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function OverallScoreCard({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 1500; // ms
    const stepTime = Math.max(16, Math.floor(duration / score));
    
    const timer = setInterval(() => {
      current += 1;
      setAnimatedScore(current);
      if (current >= score) {
        clearInterval(timer);
        setAnimatedScore(score);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [score]);

  let label = 'Needs Improvement';
  let colorClass = 'text-red-400';
  let strokeColor = '#ef4444';

  if (score >= 85) {
    label = 'Excellent';
    colorClass = 'text-green-400';
    strokeColor = '#22c55e';
  } else if (score >= 70) {
    label = 'Good';
    colorClass = 'text-yellow-400';
    strokeColor = '#eab308';
  } else if (score >= 50) {
    label = 'Average';
    colorClass = 'text-orange-400';
    strokeColor = '#f97316';
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center h-full relative overflow-hidden">
      {/* Background glow matching the score color */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl rounded-full scale-150 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: strokeColor }}
      />
      
      <h3 className="text-lg font-semibold text-white mb-6 relative z-10">Overall Resume Score</h3>
      
      <div className="relative w-40 h-40 flex items-center justify-center z-10">
        {/* SVG Circle for Progress */}
        <svg className="w-full h-full -rotate-90 transform absolute inset-0">
          <circle
            className="text-white/10"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
          <motion.circle
            className="transition-all duration-300 ease-out"
            strokeWidth="8"
            strokeLinecap="round"
            stroke={strokeColor}
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-white tracking-tighter">
            {animatedScore}
          </span>
          <span className="text-sm text-gray-400 font-medium">/ 100</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1 z-10">
        <span className="text-sm text-gray-400">Performance</span>
        <span className={`text-xl font-bold ${colorClass} uppercase tracking-wider`}>
          {label}
        </span>
      </div>
    </div>
  );
}
