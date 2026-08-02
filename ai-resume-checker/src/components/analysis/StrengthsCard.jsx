import React from 'react';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrengthsCard({ strengths = [] }) {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-green-500/10 rounded-xl border border-green-500/20">
          <TrendingUp size={20} className="text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Top Strengths</h3>
      </div>
      
      <ul className="flex flex-col gap-4">
        {strengths.map((item, idx) => (
          <motion.li 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3 group"
          >
            <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-muted leading-tight">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
