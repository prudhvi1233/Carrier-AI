import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Target, Heart, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function JobsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isJobsActive = location.pathname === '/job-match' || location.pathname === '/job-recommendations';

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

  const items = [
    {
      title: 'Job Match',
      description: 'Compare your resume with any job description.',
      icon: Target,
      path: '/job-match'
    },
    {
      title: 'Opportunities',
      description: 'AI-curated jobs matching your skills.',
      icon: Briefcase,
      path: '/job-recommendations'
    },
    {
      title: 'Saved Jobs',
      description: 'Quickly access bookmarked opportunities.',
      icon: Heart,
      path: '#'
    }
  ];

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all relative group ${
          isJobsActive || isOpen ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {(isJobsActive || isOpen) && (
          <motion.div
            layoutId="navbar-active"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 border border-white/10"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <Briefcase size={18} className={`relative z-10 ${isJobsActive || isOpen ? 'text-accent-blue' : 'group-hover:text-accent-purple transition-colors'}`} />
        <span className="relative z-10">Jobs</span>
        <ChevronDown size={14} className={`relative z-10 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className="absolute top-full left-0 mt-3 w-80 bg-secondary/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50"
          >
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-200 group ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border ${isActive ? 'bg-accent-blue/20 border-accent-blue/30 text-accent-blue' : 'bg-black/40 border-white/5 text-gray-400 group-hover:text-white group-hover:border-white/20'}`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed group-hover:text-gray-400 transition-colors">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
