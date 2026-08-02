import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, FileText, Download, RefreshCw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActionMenu({ resume, onDelete, onReanalyze, onDownload, onView }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted hover:text-foreground hover:bg-overlay-hover rounded-lg transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-secondary border border-border shadow-2xl overflow-hidden z-50"
          >
            <div className="flex flex-col py-1">
              <button 
                onClick={() => handleAction(onView)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-overlay transition-colors"
              >
                <FileText size={16} className="text-accent-blue" />
                View Report
              </button>
              <button 
                onClick={() => handleAction(onDownload)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-overlay transition-colors"
              >
                <Download size={16} className="text-accent-purple" />
                Download PDF
              </button>
              <div className="h-px w-full bg-overlay my-1" />
              <button 
                onClick={() => handleAction(onReanalyze)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-overlay transition-colors"
              >
                <RefreshCw size={16} className="text-yellow-400" />
                Reanalyze
              </button>
              <button 
                onClick={() => handleAction(onDelete)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
