import React from 'react';
import { TrendingDown, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeaknessesCard({ weaknesses = [] }) {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
          <TrendingDown size={20} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Areas to Improve</h3>
      </div>
      
      <ul className="flex flex-col gap-4">
        {weaknesses.map((item, idx) => (
          <motion.li 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3 group"
          >
            <XCircle size={18} className="text-red-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-gray-300 leading-tight">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
