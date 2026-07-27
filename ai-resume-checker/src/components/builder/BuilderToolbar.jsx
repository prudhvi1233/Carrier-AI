import React from 'react';
import { Save, Download, Play, Share2 } from 'lucide-react';

export default function BuilderToolbar({ onSave, onDownload, onAnalyze }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-white/10 bg-secondary/80 backdrop-blur-md sticky top-0 z-40">
      
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-white">Resume Editor</h2>
        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">Autosaved just now</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
        >
          <Save size={16} /> Save Draft
        </button>
        <button 
          onClick={onAnalyze}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
        >
          <Play size={16} /> Analyze
        </button>
        <button 
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-bold shadow-lg hover:shadow-accent-blue/20 transition-all hover:-translate-y-0.5"
        >
          <Download size={16} /> Download
        </button>
      </div>

    </div>
  );
}
