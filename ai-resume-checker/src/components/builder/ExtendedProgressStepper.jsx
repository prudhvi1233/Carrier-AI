import React, { useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

export default function ExtendedProgressStepper({ steps, currentStep, onStepClick }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.children[currentStep];
      if (activeElement) {
        const scrollLeft = activeElement.offsetLeft - (containerRef.current.clientWidth / 2) + (activeElement.clientWidth / 2);
        containerRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [currentStep]);

  const completionPercent = Math.round((currentStep / (steps.length - 1)) * 100);

  return (
    <div className="w-full bg-black/20 border-b border-white/5 flex flex-col">
      <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-white/5">
        <span className="text-sm font-bold text-white uppercase tracking-wider">Step {currentStep + 1} of {steps.length}</span>
        <span className="text-sm font-bold text-accent-blue">{completionPercent}% Complete</span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex items-center gap-8 px-6 py-4 overflow-x-auto hide-scrollbar relative"
      >
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div 
              key={idx}
              onClick={() => (isCompleted || isActive) && onStepClick(idx)}
              className={`relative z-10 flex flex-col items-center gap-2 min-w-[80px] shrink-0 ${isCompleted || isActive ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-lg ${
                  isCompleted ? 'bg-accent-blue text-white shadow-accent-blue/20' : 
                  isActive ? 'bg-secondary border-2 border-accent-blue text-accent-blue scale-110 shadow-accent-blue/10' : 
                  'bg-secondary border-2 border-white/10 text-gray-400'
                }`}
              >
                {isCompleted ? <Check size={18} /> : (idx + 1)}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-accent-blue' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Global Progress Bar at bottom of stepper */}
      <div className="h-1 bg-white/5 w-full">
        <div 
          className="h-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-500 ease-out" 
          style={{ width: `${completionPercent}%` }} 
        />
      </div>
    </div>
  );
}
