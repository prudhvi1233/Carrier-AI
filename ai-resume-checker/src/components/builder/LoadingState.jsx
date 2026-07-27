import React from 'react';
import { Bot, Sparkles, LayoutDashboard, FileText } from 'lucide-react';

export default function LoadingState({ step = 0 }) {
  const steps = [
    { icon: Bot, text: 'AI is analyzing your profile...' },
    { icon: Sparkles, text: 'Optimizing ATS keywords...' },
    { icon: LayoutDashboard, text: 'Designing premium layout...' },
    { icon: FileText, text: 'Generating final document...' }
  ];

  const currentStep = steps[Math.min(step, steps.length - 1)];
  const Icon = currentStep.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-accent-blue/20 rounded-full animate-ping" />
        <div className="absolute inset-2 bg-accent-purple/20 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
        <div className="absolute inset-0 flex items-center justify-center bg-secondary rounded-full border-2 border-white/10 z-10">
          <Icon size={32} className="text-white animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 tracking-wide animate-pulse">
        {currentStep.text}
      </h3>
      <p className="text-gray-400 text-sm">Please wait while we prepare your resume.</p>
    </div>
  );
}
