import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Bot, PenTool, Shield, Bell, Check, Trash2, TrendingUp, Download } from 'lucide-react';

export default function NotificationCard({ notification, onMarkAsRead, onDelete }) {
  
  const getIcon = (type, title) => {
    if (title.includes('ATS')) return <TrendingUp size={16} />;
    if (title.includes('Download')) return <Download size={16} />;
    switch(type) {
      case 'analysis': return <Bot size={16} />;
      case 'builder': return <PenTool size={16} />;
      case 'resume': return <FileText size={16} />;
      case 'account': return <Shield size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const getColorClass = (type, title) => {
    if (title.includes('ATS')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (title.includes('Download')) return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
    switch(type) {
      case 'analysis': return 'bg-accent-purple/20 text-accent-purple border-accent-purple/30';
      case 'builder': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'account': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`group relative flex gap-3 p-3 rounded-xl mb-1 transition-colors ${
        notification.isRead ? 'hover:bg-white/5 opacity-80' : 'bg-white/5 hover:bg-white/10 border border-white/5'
      }`}
    >
      <div className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center mt-1 ${getColorClass(notification.type, notification.title)}`}>
        {getIcon(notification.type, notification.title)}
      </div>
      
      <div className="flex-1 min-w-0 pr-8">
        <h4 className={`text-sm truncate mb-0.5 ${notification.isRead ? 'text-gray-300' : 'text-white font-bold'}`}>
          {notification.title}
        </h4>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <span className="text-[10px] text-gray-500 mt-1 block">
          {notification.time}
        </span>
      </div>

      {/* Action Buttons (visible on hover) */}
      <div className="absolute right-3 top-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.isRead && (
          <button 
            onClick={onMarkAsRead}
            className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
            title="Mark as read"
          >
            <Check size={14} />
          </button>
        )}
        <button 
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      {/* Unread dot */}
      {!notification.isRead && (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 w-2 h-2 bg-accent-blue rounded-full group-hover:opacity-0 transition-opacity glow-blue" />
      )}
    </motion.div>
  );
}
