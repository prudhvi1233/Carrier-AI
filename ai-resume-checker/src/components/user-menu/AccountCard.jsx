import React from 'react';
import { User, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountCard({ user, isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-1.5 pr-4 rounded-xl transition-all border outline-none
        ${isOpen 
          ? 'bg-overlay-hover border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
          : 'bg-transparent border-transparent hover:bg-overlay hover:border-border'
        }
      `}
    >
      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue p-[2px]">
        <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={18} className="text-muted" />
          )}
        </div>
      </div>
      <div className="flex flex-col items-start hidden sm:flex">
        <span className="text-sm font-medium text-foreground leading-none mb-1">{user?.name || 'Jane Doe'}</span>
        <span className="text-xs text-accent-blue font-medium leading-none px-1.5 py-0.5 bg-accent-blue/10 rounded-full">
          {user?.plan || 'Pro Plan'}
        </span>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-muted ml-1 hidden sm:block"
      >
        <ChevronDown size={16} />
      </motion.div>
    </button>
  );
}
