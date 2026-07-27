import React from 'react';
import { Download, Share2, Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ActionButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 mt-8 mb-12">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
      >
        <ArrowLeft size={18} />
        Dashboard
      </button>

      <button 
        onClick={() => navigate('/upload')}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
      >
        <Upload size={18} />
        Analyze Another
      </button>

      <button 
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
      >
        <Share2 size={18} />
        Share
      </button>

      <button 
        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-0.5"
      >
        <Download size={18} />
        Download PDF
      </button>
    </div>
  );
}
