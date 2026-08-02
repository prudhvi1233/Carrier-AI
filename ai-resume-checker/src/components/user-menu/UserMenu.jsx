import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import UserDropdown from './UserDropdown';

export default function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 pr-3 hover:bg-overlay-hover rounded-full transition-all group border border-transparent hover:border-border"
      >
        <img 
          src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=3b82f6`} 
          alt="Profile" 
          className="w-8 h-8 rounded-full border border-border"
        />
        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold text-foreground leading-none group-hover:text-accent-blue transition-colors max-w-[140px] truncate">{user?.name || 'User Name'}</p>
        </div>
        <ChevronDown size={14} className={`text-muted transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180 text-foreground' : ''}`} />
      </button>

      <UserDropdown 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        user={user} 
        onLogout={onLogout} 
      />
    </div>
  );
}
