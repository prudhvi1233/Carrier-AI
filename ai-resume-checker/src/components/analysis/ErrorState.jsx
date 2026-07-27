import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ErrorState({ error }) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center p-6"
    >
      <div className="glass-card p-10 max-w-lg w-full flex flex-col items-center text-center border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Analysis Failed</h2>
        <p className="text-gray-400 mb-8">
          {error || 'We encountered an unexpected error while analyzing your resume. Please try again.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors group"
          >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
          <button 
            onClick={() => navigate('/upload')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium shadow-lg hover:shadow-accent-blue/20 transition-all hover:-translate-y-0.5"
          >
            Go Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}
