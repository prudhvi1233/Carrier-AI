import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, BookOpen, Target, FileText, Briefcase, Calendar, ChevronRight } from 'lucide-react';

export default function AIToolsSidebar({ closeMobile }) {
  
  const quickActions = [
    { name: 'Resume Review', icon: FileText, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
    { name: 'ATS Optimization', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { name: 'Cover Letter Gen', icon: Briefcase, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { name: 'Interview Mentor', icon: Target, color: 'text-red-400', bg: 'bg-red-400/10' },
    { name: 'Learning Roadmap', icon: BookOpen, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  const widgets = [
    { title: 'Current Resume Score', value: '85/100', icon: Trophy, color: 'text-yellow-400' },
    { title: 'Upcoming Interview', value: 'Google - Oct 30', icon: Calendar, color: 'text-accent-blue' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pt-16 xl:pt-4 px-4 pb-4">
      
      <div className="mb-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue glow-blue animate-pulse"></span>
          AI Career Tools
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  if (window.innerWidth < 1280) closeMobile();
                  // Dispatch prompt action here in future
                }}
                className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {action.name}
                  </span>
                </div>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-white mb-4">Your Career Snapshot</h3>
        <div className="flex flex-col gap-3">
          {widgets.map((widget, i) => {
            const Icon = widget.icon;
            return (
              <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon size={64} />
                </div>
                <div className="flex items-center justify-between mb-1 relative z-10">
                  <span className="text-xs font-medium text-gray-400">{widget.title}</span>
                  <Icon size={14} className={widget.color} />
                </div>
                <p className="text-lg font-bold text-white relative z-10">{widget.value}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Promotional / Pro banner placeholder */}
      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="rounded-xl bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border border-accent-blue/20 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h4 className="text-sm font-bold text-white mb-1">Upgrade to Premium</h4>
          <p className="text-xs text-gray-400 mb-3">Unlock unlimited AI requests and advanced interview prep.</p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors">
            View Plans
          </button>
        </div>
      </div>

    </div>
  );
}
