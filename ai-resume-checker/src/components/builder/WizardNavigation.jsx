import React from 'react';
import { ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';

export default function WizardNavigation({ currentStep, totalSteps, onNext, onPrev, onFinish, isValid }) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="absolute bottom-0 w-full p-4 md:p-6 border-t border-white/10 bg-secondary/90 backdrop-blur-md flex justify-between items-center z-40">
      
      <button 
        onClick={onPrev}
        disabled={currentStep === 0}
        className="px-6 py-3 rounded-xl text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-2"
      >
        <ChevronLeft size={18} /> Back
      </button>

      <div className="flex items-center gap-4">
        {!isValid && (
          <span className="text-red-400 text-sm font-medium animate-pulse hidden sm:block">
            Please fill out all required fields.
          </span>
        )}
        
        <button 
          onClick={isLastStep ? onFinish : onNext}
          disabled={!isValid}
          className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
            isLastStep 
              ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-accent-blue/20 hover:shadow-accent-blue/40'
              : 'bg-white text-black hover:bg-gray-200 shadow-white/10 hover:shadow-white/20'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLastStep ? (
            <>Generate Resume <Wand2 size={18} /></>
          ) : (
            <>Next Step <ChevronRight size={18} /></>
          )}
        </button>
      </div>

    </div>
  );
}
