import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, EyeOff, Trash2 } from 'lucide-react';

export default function SecurityCard() {
  const features = [
    { icon: Lock, text: 'Fully Encrypted' },
    { icon: Shield, text: 'Processed securely' },
    { icon: EyeOff, text: 'Never shared' },
    { icon: Trash2, text: 'Can be deleted anytime' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
          <Shield size={20} />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Your Privacy First</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="flex items-center gap-2 text-muted group">
              <Icon size={14} className="text-green-500/70 group-hover:text-green-400 transition-colors shrink-0" />
              <span className="text-xs font-medium">{feature.text}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
