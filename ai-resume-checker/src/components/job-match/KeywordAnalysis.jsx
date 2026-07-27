import React from 'react';
import { Tag } from 'lucide-react';

export default function KeywordAnalysis({ keywords }) {
  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Tag className="text-accent-blue" size={24} />
        Keyword Analysis
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Keywords Found</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.found.map(kw => (
              <span key={kw} className="px-2 py-1 bg-white/5 border border-white/10 text-gray-300 rounded text-sm">
                {kw}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Missing Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.missing.map(kw => (
              <span key={kw} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-300 rounded text-sm">
                {kw}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Suggested Additions</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.suggested.map(kw => (
              <span key={kw} className="px-2 py-1 bg-accent-purple/20 border border-accent-purple/30 text-accent-purple rounded text-sm glow-purple">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
