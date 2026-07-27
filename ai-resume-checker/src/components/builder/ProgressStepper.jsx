import React from 'react';
import { Check } from 'lucide-react';

export default function ProgressStepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="w-full px-4 py-4 bg-black/20 border-b border-white/5 overflow-x-auto hide-scrollbar">
      <div className="flex items-center min-w-max max-w-5xl mx-auto justify-between relative">
        
        {/* Background Line */}
        <div className="absolute left-0 top-4 w-full h-1 bg-white/5 rounded-full z-0" />

        {/* Progress Line */}
        <div 
          className="absolute left-0 top-4 h-1 bg-accent-blue rounded-full z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div 
              key={idx}
              onClick={() => (isCompleted || isActive) && onStepClick(idx)}
              className={`relative z-10 flex flex-col items-center gap-2 pb-2 ${isCompleted || isActive ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isCompleted ? 'bg-accent-blue text-white' : 
                  isActive ? 'bg-secondary border-2 border-accent-blue text-accent-blue' : 
                  'bg-secondary border-2 border-white/20 text-gray-400'
                }`}
              >
                {isCompleted ? <Check size={16} /> : (idx + 1)}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-accent-blue font-bold' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
