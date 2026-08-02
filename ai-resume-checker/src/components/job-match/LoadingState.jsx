import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

const steps = [
  "Reading Resume...",
  "Extracting Skills...",
  "Identifying Keywords...",
  "Comparing Experience...",
  "Calculating ATS Match...",
  "Preparing Recommendations..."
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-32 h-32 mb-8"
      >
        <div className="absolute inset-0 border-4 border-border rounded-full"></div>
        <div className="absolute inset-0 border-4 border-accent-blue rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={40} className="text-accent-blue animate-pulse" />
        </div>
      </motion.div>

      <div className="w-full max-w-md space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;

          return (
            <div key={step} className="flex items-center gap-4">
              <div className="w-8 flex justify-center">
                {isPast ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="text-green-400" size={24} />
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-3 h-3 bg-accent-blue rounded-full"
                  />
                ) : (
                  <div className="w-2 h-2 bg-white/20 rounded-full" />
                )}
              </div>
              <p className={`text-lg transition-colors duration-300 ${
                isPast ? 'text-muted' : isActive ? 'text-foreground font-medium glow-text-blue' : 'text-gray-600'
              }`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
