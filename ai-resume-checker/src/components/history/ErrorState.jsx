import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ErrorState({ error }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center justify-center min-h-[400px]"
    >
      <div className="glass-card p-10 max-w-lg w-full flex flex-col items-center text-center border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle size={32} className="text-red-400" />
        </div>
        
        <h2 className="text-xl font-bold text-foreground mb-2">Unable to Load History</h2>
        <p className="text-muted mb-8 text-sm">
          {error || 'We encountered an error while fetching your resume history. Please check your connection and try again.'}
        </p>

        <button 
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-overlay hover:bg-overlay-hover text-foreground font-medium border border-border transition-colors group w-full sm:w-auto"
        >
          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          Retry Connection
        </button>
      </div>
    </motion.div>
  );
}
