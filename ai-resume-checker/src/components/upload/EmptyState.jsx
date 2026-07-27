import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';

export default function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10"
    >
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
        <FolderOpen size={32} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No resumes uploaded yet</h3>
      <p className="text-sm text-gray-400 max-w-sm">
        Your recent uploads and analysis reports will appear here once you upload a resume.
      </p>
    </motion.div>
  );
}
