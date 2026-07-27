import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationDropdown from './NotificationDropdown';

// Mock initial notifications
const initialNotifications = [
  { id: 1, type: 'analysis', title: 'Resume Analysis Completed', message: 'Your AI analysis is ready.', time: '5 min ago', isRead: false },
  { id: 2, type: 'builder', title: 'Draft Saved', message: 'Resume draft saved successfully.', time: '12 min ago', isRead: false },
  { id: 3, type: 'resume', title: 'ATS Score Improved', message: 'Congratulations! Your ATS score increased to 92%.', time: '1 hr ago', isRead: true },
  { id: 4, type: 'resume', title: 'Resume Downloaded', message: 'Resume exported successfully.', time: '2 hrs ago', isRead: true },
  { id: 5, type: 'account', title: 'Password Updated', message: 'Security settings changed.', time: '1 day ago', isRead: true },
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const menuRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-colors group border
          ${isOpen 
            ? 'bg-white/10 border-white/20 text-white' 
            : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <Bell size={20} className={isOpen ? 'text-accent-blue' : 'group-hover:text-accent-blue transition-colors'} />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-secondary shadow-[0_0_10px_rgba(239,68,68,0.8)] text-[9px] font-bold text-white flex items-center justify-center animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <NotificationDropdown 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
