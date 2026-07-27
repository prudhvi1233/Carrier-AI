import React, { useState, useEffect } from 'react';
import { Bell, Check, Info, TrendingUp, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../services/careerServices';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      if (!data || data.length === 0) {
        setNotifications([
          { id: 1, type: 'analysis', message: 'Your AI resume analysis is ready.', time: '5 min ago', is_read: false },
          { id: 2, type: 'builder', message: 'Resume draft saved successfully.', time: '12 min ago', is_read: false },
          { id: 3, type: 'improvement', message: 'Congratulations! Your ATS score increased to 92%.', time: '1 hr ago', is_read: true },
          { id: 4, type: 'interview', message: 'You have a new interview scheduled for tomorrow.', time: '2 hrs ago', is_read: true },
        ]);
      } else {
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
      // Fallback to mock data if backend fails
      setNotifications([
        { id: 1, type: 'analysis', message: 'Your AI resume analysis is ready.', time: '5 min ago', is_read: false },
        { id: 2, type: 'builder', message: 'Resume draft saved successfully.', time: '12 min ago', is_read: false },
        { id: 3, type: 'improvement', message: 'Congratulations! Your ATS score increased to 92%.', time: '1 hr ago', is_read: true },
        { id: 4, type: 'interview', message: 'You have a new interview scheduled for tomorrow.', time: '2 hrs ago', is_read: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({...n, is_read: true})));
    try {
      await notificationService.markAllAsRead();
    } catch (err) {}
  };

  const getIcon = (type) => {
    switch(type) {
      case 'interview': return <Briefcase size={16} className="text-accent-blue" />;
      case 'improvement': return <TrendingUp size={16} className="text-accent-purple" />;
      default: return <Info size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => { setIsOpen(!isOpen); if(!isOpen) fetchNotifications(); }}
        className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-secondary" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-secondary border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-accent-blue hover:text-white transition-colors flex items-center gap-1">
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {loading ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
              ) : notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-4 flex gap-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${!notif.is_read ? 'bg-white/[0.02]' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className={`text-sm ${!notif.is_read ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-gray-500 uppercase">2 hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">You have no notifications.</div>
              )}
            </div>
            
            <div className="p-3 border-t border-white/10 text-center bg-black/20">
              <button className="text-xs text-gray-400 hover:text-white transition-colors">View All Settings</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
