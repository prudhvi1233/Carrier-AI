import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export default function TemplateComparison({ templates, onClose, onSelect }) {
  if (!templates || templates.length !== 2) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-secondary border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              Compare Templates
              <ArrowRightLeft size={18} className="text-gray-400" />
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-y-auto">
            {templates.map((template, idx) => (
              <div key={template.id} className={`flex-1 flex flex-col p-8 ${idx === 0 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''}`}>
                <h3 className="text-2xl font-bold text-white mb-2">{template.name}</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{template.description}</p>
                
                <div className="w-full aspect-[1/1.414] bg-white rounded-lg shadow-xl mb-8 flex items-center justify-center">
                  <span className="text-gray-400 font-bold text-lg opacity-50">Preview Box</span>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">ATS Rating</span>
                    <span className="text-white font-bold">{template.atsRating}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Difficulty</span>
                    <span className="text-white font-bold">{template.difficulty}</span>
                  </div>
                </div>

                <button 
                  onClick={() => onSelect(template)}
                  className="mt-auto flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors w-full"
                >
                  <CheckCircle2 size={18} />
                  Choose {template.name}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
