import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Trash2, X } from 'lucide-react';
import NotificationCard from './NotificationCard';

export default function NotificationDropdown({ 
  isOpen, 
  onClose, 
  notifications, 
  unreadCount, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDelete, 
  onClearAll 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          className="fixed md:absolute right-0 bottom-0 md:bottom-auto md:top-full mt-3 w-full md:w-96 h-[80vh] md:h-auto md:max-h-[85vh] bg-dropdown border-t md:border border-border md:rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col md:origin-top-right rounded-t-3xl md:rounded-b-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-overlay shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-foreground text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-accent-blue/20 text-accent-blue text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={onMarkAllAsRead}
                  className="text-xs text-muted hover:text-accent-blue transition-colors flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCircle2 size={14} />
                  <span className="hidden md:inline">Mark all read</span>
                </button>
              )}
              <button onClick={onClose} className="md:hidden p-1 text-muted hover:text-foreground bg-overlay rounded-lg">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <AnimatePresence initial={false}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationCard 
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => onMarkAsRead(notification.id)}
                    onDelete={() => onDelete(notification.id)}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-48 text-center"
                >
                  <div className="w-16 h-16 bg-overlay rounded-full flex items-center justify-center mb-4">
                    <Bell size={24} className="text-gray-500" />
                  </div>
                  <h4 className="text-foreground font-medium mb-1">No Notifications Yet</h4>
                  <p className="text-sm text-muted">When you have updates, they will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border bg-overlay shrink-0">
              <button 
                onClick={onClearAll}
                className="w-full py-2 flex items-center justify-center gap-2 text-sm text-muted hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <Trash2 size={16} />
                Clear All Notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
