import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Upload, Download, Trash2, RefreshCw, Activity } from 'lucide-react';

export default function ActivityTimeline({ timeline = [] }) {
  const getIcon = (type) => {
    switch(type) {
      case 'upload': return <Upload size={14} className="text-accent-blue" />;
      case 'analyze': return <Activity size={14} className="text-green-400" />;
      case 'download': return <Download size={14} className="text-accent-purple" />;
      case 'delete': return <Trash2 size={14} className="text-red-400" />;
      case 'reanalyze': return <RefreshCw size={14} className="text-yellow-400" />;
      default: return <Clock size={14} className="text-muted" />;
    }
  };

  const formatTime = (isoStr) => {
    const date = new Date(isoStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-overlay rounded-xl border border-border">
          <Clock size={20} className="text-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </div>
      
      <div className="flex-1 relative">
        <div className="absolute left-[15px] top-2 bottom-4 w-px bg-overlay-hover" />

        <div className="flex flex-col gap-6 relative z-10">
          {timeline.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-4 group"
            >
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-border flex items-center justify-center shrink-0 shadow-lg group-hover:border-white/30 transition-colors z-10">
                {getIcon(event.type)}
              </div>
              <div className="flex flex-col pt-1 w-full min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-semibold text-gray-200">{event.title}</span>
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{formatTime(event.timestamp)}</span>
                </div>
                <span className="text-xs text-muted truncate mt-0.5">{event.resume}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
