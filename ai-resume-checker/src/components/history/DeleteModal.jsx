import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, resumeName }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-secondary border border-red-500/20 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl pointer-events-none" />

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center mt-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">Delete Analysis</h3>
            
            <p className="text-sm text-muted mb-6">
              Are you sure you want to permanently delete <span className="text-gray-200 font-semibold">{resumeName}</span> and its analysis? This action cannot be undone.
            </p>

            <div className="flex gap-4 w-full">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-overlay hover:bg-overlay-hover text-foreground font-medium border border-border transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-foreground font-medium shadow-lg hover:shadow-red-500/25 transition-all"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
