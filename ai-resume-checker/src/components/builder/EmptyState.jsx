import React from 'react';
import { PenTool, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ onStart }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 md:p-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full border-dashed border-white/20"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-overlay backdrop-blur-sm" />
        <PenTool size={36} className="text-foreground relative z-10" />
      </div>
      
      <h3 className="text-2xl font-bold text-foreground mb-3">Create your first AI-generated resume.</h3>
      <p className="text-muted mb-8 max-w-md leading-relaxed text-sm">
        Start from scratch or import your LinkedIn profile. Our AI will guide you through writing professional summaries, bullet points, and ATS-optimized keywords.
      </p>

      <button 
        onClick={onStart}
        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-foreground font-medium shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-0.5 group"
      >
        Start Building Now
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
