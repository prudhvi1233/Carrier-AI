import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationDropdown from './NotificationDropdown';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();
  
  const timeoutRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      const countData = await notificationService.getUnreadCount();
      setUnreadCount(countData.count);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
    
    // Poll every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms delay before closing
  };

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

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      // Re-fetch to get correct unread count since we deleted one
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
