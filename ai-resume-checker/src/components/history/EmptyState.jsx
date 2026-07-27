import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmptyState() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-16 flex flex-col items-center justify-center text-center w-full min-h-[400px]"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-accent-blue/5 rounded-full blur-xl animate-pulse" />
        <FileText size={40} className="text-accent-blue relative z-10" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">No Resume Analyses Yet</h3>
      <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
        You haven't analyzed any resumes. Upload your first resume to get detailed AI-powered insights, ATS compatibility scores, and actionable feedback.
      </p>

      <button 
        onClick={() => navigate('/upload')}
        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-0.5 group"
      >
        Analyze Your First Resume
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
