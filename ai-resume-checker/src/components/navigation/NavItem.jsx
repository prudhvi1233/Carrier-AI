import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NavItem({ to, icon: Icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all relative group ${
        isActive ? 'text-foreground bg-overlay-hover shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-border' : 'text-muted hover:text-foreground hover:bg-overlay'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="navbar-active"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 border border-border"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon size={18} className={`relative z-10 ${isActive ? 'text-accent-blue' : 'group-hover:text-accent-purple transition-colors'}`} />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
