import React from 'react';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HiringProbability({ probabilities }) {
  const gauges = [
    { label: "Hiring Probability", value: probabilities.hiring_probability, color: "text-accent-blue" },
    { label: "Interview Probability", value: probabilities.interview_probability, color: "text-accent-purple" },
    { label: "Confidence Score", value: probabilities.confidence_score, color: "text-green-400" }
  ];

  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Award className="text-accent-blue" size={24} />
        Prediction Engine
      </h3>
      
      <div className="flex justify-around items-end gap-4 h-48 pt-8">
        {gauges.map((gauge, index) => (
          <div key={gauge.label} className="flex flex-col items-center gap-4 w-1/3">
            <div className="relative w-full h-full max-h-32 flex justify-center items-end bg-white/5 rounded-t-full border-t border-x border-white/10 overflow-hidden pb-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${gauge.value}%` }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
                className={`absolute bottom-0 w-full opacity-30 ${gauge.color.replace('text', 'bg')}`}
              />
              <span className={`text-3xl font-bold ${gauge.color} relative z-10`}>{gauge.value}%</span>
            </div>
            <span className="text-xs text-gray-400 text-center uppercase tracking-wider font-semibold h-8">{gauge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
