import React from 'react';
import { Shield, UploadCloud, User, Download, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActivityLog({ data }) {
  
  const getIcon = (action) => {
    if (action.includes('Password')) return <Shield size={16} className="text-red-400" />;
    if (action.includes('upload')) return <UploadCloud size={16} className="text-blue-400" />;
    if (action.includes('Profile')) return <User size={16} className="text-purple-400" />;
    if (action.includes('download')) return <Download size={16} className="text-green-400" />;
    return <Smartphone size={16} className="text-yellow-400" />;
  };

  const getIconBg = (action) => {
    if (action.includes('Password')) return 'bg-red-500/10 border-red-500/20';
    if (action.includes('upload')) return 'bg-blue-500/10 border-blue-500/20';
    if (action.includes('Profile')) return 'bg-purple-500/10 border-purple-500/20';
    if (action.includes('download')) return 'bg-green-500/10 border-green-500/20';
    return 'bg-yellow-500/10 border-yellow-500/20';
  };

  const formatDate = (isoStr) => {
    return new Date(isoStr).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-foreground mb-2">Activity Log</h2>
        <p className="text-muted text-sm">Monitor recent activity and security events on your account.</p>
      </div>

      <div className="glass-card p-6 md:p-8">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-overlay-hover" />

          <div className="flex flex-col gap-8 relative z-10">
            {data.map((log, idx) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-5"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${getIconBg(log.action)} shadow-lg bg-secondary`}>
                  {getIcon(log.action)}
                </div>
                
                <div className="flex flex-col flex-1 min-w-0 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <span className="text-base font-semibold text-foreground">{log.action}</span>
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{formatDate(log.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <span className="flex items-center gap-1.5"><Smartphone size={14} /> {log.device}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span>{log.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
