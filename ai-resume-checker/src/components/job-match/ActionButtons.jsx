import React from 'react';
import { Download, FileText, ArrowRight, RefreshCw } from 'lucide-react';

export default function ActionButtons({ onAnalyzeAnother }) {
  return (
    <div className="flex flex-wrap gap-4 mt-8">
      <button className="flex-1 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold py-4 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2 group">
        <FileText size={20} />
        Improve Resume in Builder
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
      
      <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
        <Download size={20} />
        Download Match Report (PDF)
      </button>
      
      <button 
        onClick={onAnalyzeAnother}
        className="w-full md:w-auto bg-transparent hover:bg-white/5 border border-white/10 text-gray-300 font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <RefreshCw size={18} />
        Analyze Another Job
      </button>
    </div>
  );
}
