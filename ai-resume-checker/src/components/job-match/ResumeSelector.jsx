import React, { useState } from 'react';
import { FileText, CheckCircle, UploadCloud, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockHistoryData } from '../../mockHistoryData';

export default function ResumeSelector({ selectedResume, setSelectedResume }) {
  const [isOpen, setIsOpen] = useState(false);
  const resumes = mockHistoryData.resumes.slice(0, 5); // Take top 5 recent resumes

  return (
    <div className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative z-20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="text-accent-blue" size={24} />
        Select Resume
      </h3>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left hover:bg-white/10 transition-colors"
        >
          {selectedResume ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center text-accent-blue">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-white font-medium truncate">{selectedResume.name}</p>
                <p className="text-xs text-gray-400">Score: {selectedResume.resume_score}% • {new Date(selectedResume.uploaded_at).toLocaleDateString()}</p>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Select a resume from history...</span>
          )}
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-secondary/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30"
            >
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {resumes.map(resume => (
                  <button
                    key={resume.id}
                    onClick={() => {
                      setSelectedResume(resume);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center text-accent-blue shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{resume.name}</p>
                      <p className="text-xs text-gray-400">Score: {resume.resume_score}%</p>
                    </div>
                    {selectedResume?.id === resume.id && (
                      <CheckCircle size={16} className="text-green-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-white/10">
                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors">
                  <UploadCloud size={16} />
                  Upload New Resume
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
