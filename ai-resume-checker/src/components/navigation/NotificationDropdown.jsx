import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, MessageSquare, Briefcase, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(3);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'New Job Match',
      desc: 'You have a 95% match with Senior Frontend Developer at Google.',
      time: '2m ago',
      icon: Briefcase,
      color: 'text-green-400',
      bg: 'bg-green-400/20'
    },
    {
      id: 2,
      title: 'AI Coach Message',
      desc: 'Your resume review is ready. Click to see the feedback.',
      time: '1h ago',
      icon: MessageSquare,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/20'
    },
    {
      id: 3,
      title: 'Profile Viewed',
      desc: 'A recruiter from Microsoft viewed your profile.',
      time: '3h ago',
      icon: CheckCircle2,
      color: 'text-accent-purple',
      bg: 'bg-accent-purple/20'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted hover:text-foreground hover:bg-overlay-hover rounded-full transition-all group"
      >
        <Bell size={20} className="group-hover:scale-110 transition-transform duration-300" />
        {unread > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-secondary"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-secondary/95 backdrop-blur-3xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-overlay">
              <h3 className="font-bold text-foreground">Notifications</h3>
              <button 
                onClick={() => setUnread(0)}
                className="text-xs font-medium text-accent-blue hover:text-blue-400 transition-colors"
              >
                Mark all as read
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {notifications.map(notif => (
                <div key={notif.id} className="p-3 rounded-xl hover:bg-overlay transition-colors cursor-pointer group flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${notif.bg} border border-border`}>
                    <notif.icon size={16} className={notif.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-foreground">{notif.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">{notif.desc}</p>
                    <span className="text-[10px] text-gray-600 mt-2 block">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border bg-white/[0.02]">
              <button className="w-full py-2 flex items-center justify-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors">
                View all notifications <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
