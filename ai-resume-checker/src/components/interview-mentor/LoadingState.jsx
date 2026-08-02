import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingState({ text }) {
  return (
    <div className="h-full flex items-center justify-center glass-card p-12">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-accent-blue/30 blur-xl rounded-full"></div>
          <Loader2 size={48} className="text-accent-blue relative z-10" />
        </motion.div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground">{text}</h3>
          <p className="text-muted text-sm">Please wait a moment.</p>
        </div>
      </div>
    </div>
  );
}
