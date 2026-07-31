import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Improve Resume",
  "Career Roadmap",
  "Interview Tips",
  "Skill Gap",
  "Projects",
  "Certifications",
  "Salary Advice",
  "Resume Feedback",
  "Backend Roadmap",
  "Frontend Roadmap",
  "Data Science Roadmap"
];

export default function EmptyState({ onSelectPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 pb-40 text-center max-w-3xl mx-auto w-full">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-accent-blue/20 blur-3xl rounded-full" />
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-blue to-accent-purple p-0.5 relative z-10 shadow-2xl shadow-accent-blue/20">
          <div className="w-full h-full bg-secondary rounded-[23px] flex items-center justify-center">
            <Bot size={48} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </div>
        </div>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold text-white mb-3"
      >
        AI Career Assistant
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 text-lg mb-12 max-w-lg"
      >
        Your intelligent career coach for resumes, interviews, learning, and job preparation.
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={16} className="text-accent-blue" />
          <span className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Suggested Prompts</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSelectPrompt(prompt)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full text-sm text-center text-gray-300 hover:text-white transition-all hover:scale-[1.02]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
