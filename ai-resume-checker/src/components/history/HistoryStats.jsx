import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Target, Activity } from 'lucide-react';

export default function HistoryStats({ stats }) {
  const cards = [
    {
      title: 'Total Analyzed',
      value: stats.total_analyzed,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: 'Average Score',
      value: `${stats.avg_resume_score}/100`,
      icon: Activity,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      title: 'Avg ATS Score',
      value: `${stats.avg_ats_score}%`,
      icon: Target,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    {
      title: 'Total Downloads',
      value: stats.total_downloads,
      icon: Download,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-6 border ${card.border} hover:bg-overlay transition-colors relative overflow-hidden group`}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${card.color}`}>
              <Icon size={64} />
            </div>
            
            <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
              <Icon size={20} />
            </div>
            
            <h4 className="text-muted text-sm font-medium mb-1">{card.title}</h4>
            <div className="text-3xl font-bold text-foreground tracking-tight">{card.value}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
