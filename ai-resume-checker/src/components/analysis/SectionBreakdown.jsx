import React from 'react';
import { Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SectionBreakdown({ sectionScores = {} }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
          <Layers size={20} className="text-accent-blue" />
        </div>
        <h3 className="text-lg font-semibold text-white">Section Breakdown</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-between gap-4">
        {Object.entries(sectionScores).map(([section, score], idx) => (
          <div key={section} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-300">{section}</span>
              <span className="text-white">{score}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className={`h-full rounded-full ${getScoreColor(score)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
