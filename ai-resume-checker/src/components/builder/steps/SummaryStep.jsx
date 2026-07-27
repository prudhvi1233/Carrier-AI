import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SummaryStep({ data, onUpdate }) {
  const handleAI = () => {
    // Mock AI generation
    onUpdate("A highly motivated and results-driven professional with a proven track record of delivering high-quality solutions. Passionate about leveraging cutting-edge technology to solve complex problems and drive business growth.");
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Professional Summary</h2>
        <p className="text-gray-400">Write a short, engaging pitch about your career. Keep it under 4-5 sentences.</p>
      </div>

      <div className="glass-card p-6 border-accent-purple/30 bg-accent-purple/5 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <h3 className="text-white font-bold mb-1">Stuck on what to write?</h3>
          <p className="text-sm text-gray-400">Our AI can analyze your provided job titles and automatically generate a compelling, ATS-optimized summary tailored for you.</p>
        </div>
        <button 
          onClick={handleAI}
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold shadow-lg shadow-accent-purple/20 hover:shadow-accent-purple/40 transition-all hover:-translate-y-0.5"
        >
          <Sparkles size={18} />
          Generate with AI
        </button>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-h-[300px]">
        <label className="text-sm font-medium text-gray-300 flex justify-between">
          Your Summary
          <span className="text-xs text-gray-500">{data.length} characters</span>
        </label>
        <textarea 
          value={data} 
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="e.g. Dedicated software engineer with 5+ years of experience in full-stack development..."
          className="w-full h-full min-h-[200px] bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
