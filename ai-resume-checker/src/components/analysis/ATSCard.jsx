import React from 'react';
import { motion } from 'framer-motion';
import { ScanSearch, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ATSCard({ score }) {
  let status = 'Poor';
  let colorClass = 'text-red-400';
  let bgClass = 'bg-red-500';
  let Icon = AlertTriangle;

  if (score >= 80) {
    status = 'ATS Friendly';
    colorClass = 'text-green-400';
    bgClass = 'bg-green-500';
    Icon = ShieldCheck;
  } else if (score >= 50) {
    status = 'Moderate';
    colorClass = 'text-yellow-400';
    bgClass = 'bg-yellow-500';
    Icon = CheckCircle;
  }

  return (
    <div className="glass-card p-8 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-semibold text-foreground">ATS Compatibility</h3>
          <p className="text-sm text-muted mt-1">Applicant Tracking System Match</p>
        </div>
        <div className="p-3 bg-overlay rounded-xl border border-border">
          <ScanSearch size={24} className="text-accent-blue" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="flex items-end justify-between mb-2">
          <span className="text-4xl font-bold text-foreground tracking-tighter">{score}%</span>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-overlay border border-border ${colorClass}`}>
            <Icon size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">{status}</span>
          </div>
        </div>

        <div className="w-full h-3 bg-overlay rounded-full overflow-hidden border border-border mt-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className={`h-full ${bgClass} rounded-full`}
          />
        </div>
        
        <div className="flex justify-between mt-3 text-xs font-medium text-gray-500 uppercase">
          <span>Poor</span>
          <span>Moderate</span>
          <span>Excellent</span>
        </div>
      </div>
    </div>
  );
}
