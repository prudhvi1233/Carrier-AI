import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Trophy, TrendingUp, Save } from 'lucide-react';

export default function QuickStats() {
  const stats = [
    { label: "Total Analyses", value: "34", icon: FileText, color: "text-accent-blue" },
    { label: "Highest Score", value: "95", icon: Trophy, color: "text-yellow-400" },
    { label: "Current ATS", value: "92", icon: TrendingUp, color: "text-green-400" },
    { label: "Saved Drafts", value: "12", icon: Save, color: "text-accent-purple" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 p-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon size={14} className={stat.color} />
              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{stat.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
