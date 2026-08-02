import React from 'react';
import { Bot } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="glass-card p-6 flex items-center gap-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5"></div>
      
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-border flex items-center justify-center shrink-0 relative z-10">
        <Bot size={32} className="text-accent-blue" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-foreground mb-1">Your AI Interview Mentor is ready.</h3>
        <p className="text-muted text-sm">Configure your session below to begin your personalized mock interview.</p>
      </div>
    </div>
  );
}
