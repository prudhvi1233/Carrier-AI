import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit } from 'lucide-react';

const MESSAGES = [
  'Uploading resume securely...',
  'Extracting text and structure...',
  'Detecting technical skills...',
  'Checking ATS compatibility...',
  'Running AI analysis...',
  'Preparing detailed report...',
];

export default function UploadProgress({ onComplete, isBackendDone }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const duration = 4000; // 4 seconds for the initial fake progress
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      // If backend isn't done, pause progress at 90%
      if (!isBackendDone && currentStep >= steps * 0.9) {
        // do not increment
      } else {
        currentStep++;
      }
      
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(currentProgress);

      const msgIdx = Math.floor((currentProgress / 100) * (MESSAGES.length - 1));
      setMessageIndex(Math.min(msgIdx, MESSAGES.length - 1));

      if (currentStep >= steps && isBackendDone) {
        clearInterval(timer);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete, isBackendDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center justify-center py-8 px-4"
    >
      <div className="relative mb-8">
        {/* Glowing effect behind icon */}
        <div className="absolute inset-0 bg-accent-blue/30 blur-2xl rounded-full scale-150 animate-pulse" />
        
        {/* Center Icon */}
        <div className="relative w-24 h-24 rounded-full bg-secondary border-2 border-accent-blue/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <BrainCircuit size={40} className="text-accent-blue animate-pulse" />
          
          {/* Orbiting element */}
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
        {/* Message */}
        <div className="flex items-center gap-2 text-white font-medium text-lg h-8">
          <Sparkles size={18} className="text-accent-purple" />
          <motion.span
            key={messageIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {MESSAGES[messageIndex]}
          </motion.span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Shine effect on progress bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="text-sm text-gray-400 font-medium font-mono">
          {Math.round(progress)}%
        </div>
      </div>
    </motion.div>
  );
}
