import React from 'react';
import { FileSearch } from 'lucide-react';

export default function ATSBreakdown({ ats }) {
  const metrics = [
    { label: "ATS Compatibility", score: ats.ats_compatibility },
    { label: "Keyword Density", score: ats.keyword_density },
    { label: "Formatting Compatibility", score: ats.formatting_compatibility },
    { label: "Section Completeness", score: ats.section_completeness }
  ];

  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <FileSearch className="text-accent-purple" size={24} />
        ATS Optimization
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-overlay border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-overlay-hover transition-colors">
            <span className={`text-2xl font-bold mb-1 ${
              metric.score >= 90 ? 'text-green-400' :
              metric.score >= 75 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metric.score}%
            </span>
            <span className="text-xs text-muted">{metric.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
