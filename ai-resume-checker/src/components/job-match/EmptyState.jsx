import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-32 h-32 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-full flex items-center justify-center mb-8 border border-border shadow-2xl"
      >
        <Search size={48} className="text-accent-blue/50" />
      </motion.div>
      <h3 className="text-2xl font-bold text-foreground mb-3">No Job Description Analyzed Yet</h3>
      <p className="text-muted max-w-md">
        Select a resume and paste a job description above. Our AI will analyze the match, identify skill gaps, and provide tailored suggestions to improve your chances.
      </p>
    </div>
  );
}
