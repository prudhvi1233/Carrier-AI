import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ToastNotification({ show, message, type = 'success', onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border bg-[#111111]/90 backdrop-blur-md"
          style={{
            borderColor: type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
            boxShadow: type === 'success' ? '0 10px 30px -10px rgba(34,197,94,0.3)' : '0 10px 30px -10px rgba(239,68,68,0.3)'
          }}
        >
          {type === 'success' ? (
            <CheckCircle2 className="text-green-400" size={20} />
          ) : (
            <AlertCircle className="text-red-400" size={20} />
          )}
          
          <p className="text-sm font-medium text-foreground pr-4">{message}</p>
          
          <button 
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
