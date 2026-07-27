import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles } from 'lucide-react';

const MESSAGES = [
  'Initializing AI scanner...',
  'Extracting document structure...',
  'Analyzing syntax and keywords...',
  'Evaluating ATS compatibility...',
  'Cross-referencing with industry standards...',
  'Generating improvement roadmap...',
  'Finalizing report...',
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center relative">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-accent-blue/30 blur-2xl rounded-full scale-150 animate-pulse" />
        
        <div className="relative w-24 h-24 rounded-full bg-secondary border-2 border-accent-blue/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <BrainCircuit size={40} className="text-accent-blue animate-pulse" />
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent-purple rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-white font-medium text-lg h-8">
          <Sparkles size={18} className="text-accent-purple" />
          <AnimatePresence mode="wait">
            <motion.span
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-center"
            >
              {MESSAGES[messageIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full w-1/3 animate-[slide_1.5s_ease-in-out_infinite_alternate]" />
        </div>
      </div>

      {/* Skeleton layout hint in background */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none flex flex-col gap-6 p-10">
        <div className="w-1/3 h-10 bg-white/10 rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 h-64 bg-white/10 rounded-2xl animate-pulse delay-100" />
          <div className="col-span-2 h-64 bg-white/10 rounded-2xl animate-pulse delay-200" />
        </div>
        <div className="w-full h-40 bg-white/10 rounded-2xl animate-pulse delay-300" />
      </div>
    </div>
  );
}
