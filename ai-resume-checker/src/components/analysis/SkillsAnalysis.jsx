import React from 'react';
import { Code2, Sparkles, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SkillsAnalysis({ detected = [], missing = [] }) {
  return (
    <div className="glass-card p-6 h-full flex flex-col relative">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-accent-blue/10 rounded-xl border border-accent-blue/20">
          <Code2 size={20} className="text-accent-blue" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Skills Analysis</h3>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Detected Skills */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-green-400 mb-1">
            <Sparkles size={16} />
            <h4 className="text-sm font-semibold uppercase tracking-wider">Detected Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {detected.map((skill, idx) => (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={`detected-${idx}`}
                className="px-3 py-1.5 bg-green-500/10 text-green-300 border border-green-500/20 rounded-lg text-sm font-medium"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <XCircle size={16} />
            <h4 className="text-sm font-semibold uppercase tracking-wider">Suggested Missing Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map((skill, idx) => (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 + 0.2 }}
                key={`missing-${idx}`}
                className="px-3 py-1.5 bg-red-500/10 text-red-300 border border-red-500/20 rounded-lg text-sm font-medium border-dashed"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
