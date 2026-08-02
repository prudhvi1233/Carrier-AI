import React from 'react';
import { Briefcase, FileUp } from 'lucide-react';

export default function JobDescriptionInput({ jobDescriptionText, setJobDescriptionText }) {
  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-xl flex flex-col h-full">
      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Briefcase className="text-accent-purple" size={24} />
        Job Description
      </h3>
      
      <div className="flex-1 flex flex-col">
        <textarea
          value={jobDescriptionText}
          onChange={(e) => setJobDescriptionText(e.target.value)}
          placeholder="Paste the job description here to analyze..."
          className="flex-1 w-full bg-overlay border border-border rounded-xl p-4 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none min-h-[150px] custom-scrollbar"
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-4 text-xs text-muted">
            <span>{jobDescriptionText.length} characters</span>
            <span>{jobDescriptionText.split(/\s+/).filter(w => w.length > 0).length} words</span>
          </div>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-overlay hover:bg-overlay-hover border border-border rounded-lg text-sm text-foreground cursor-pointer transition-colors">
            <FileUp size={16} />
            <span>Upload JD (PDF/DOCX)</span>
            <input type="file" className="hidden" accept=".pdf,.docx" />
          </label>
        </div>
      </div>
    </div>
  );
}
