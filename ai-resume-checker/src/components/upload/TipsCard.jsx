import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle2, FileText, Zap, LayoutList, Target } from 'lucide-react';

export default function TipsCard() {
  const tips = [
    { icon: FileText, text: 'Upload in PDF format' },
    { icon: LayoutList, text: 'Keep resume under 2 pages' },
    { icon: Zap, text: 'Include technical skills clearly' },
    { icon: Target, text: 'Add measurable achievements' },
    { icon: CheckCircle2, text: 'Keep formatting ATS-friendly' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-accent-blue/10 text-accent-blue rounded-lg border border-accent-blue/20">
          <Lightbulb size={20} />
        </div>
        <h3 className="text-lg font-semibold text-white">Quick Tips</h3>
      </div>
      
      <ul className="flex flex-col gap-3">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <li key={idx} className="flex items-start gap-3 text-gray-300 group">
              <Icon size={16} className="text-accent-blue/70 mt-0.5 group-hover:text-accent-blue transition-colors shrink-0" />
              <span className="text-sm leading-relaxed">{tip.text}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
