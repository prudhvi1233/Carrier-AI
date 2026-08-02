import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, X, UploadCloud, FileText, ClipboardList, Mic, Bot, Briefcase, Target, Heart, ChevronDown, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const [jobsOpen, setJobsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isJobsActive = location.pathname === '/job-match' || location.pathname === '/job-recommendations';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/job-tracker', icon: ClipboardList },
    { name: 'AI Coach', path: '/career-assistant', icon: Bot },
    { name: 'Interviews', path: '/interview-mentor', icon: Mic },
    { name: 'Builder', path: '/resume-builder', icon: FileText },
    { name: 'Upload', path: '/upload', icon: UploadCloud },
  ];

  const jobsItems = [
    { name: 'Job Match', path: '/job-match', icon: Target },
    { name: 'Opportunities', path: '/job-recommendations', icon: Briefcase },
    { name: 'Saved Jobs', path: '/job-tracker', icon: Heart },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-secondary backdrop-blur-3xl border-r border-border p-6 shadow-2xl relative z-40 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-bold text-foreground shadow-lg shadow-accent-blue/20">
            AI
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground hidden md:block">CareerAI</span>
        </div>
        <button 
          className="md:hidden text-muted hover:text-foreground bg-overlay p-2 rounded-xl"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {/* Dashboard Link First */}
        <Link
          to={navItems[0].path}
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
            location.pathname === navItems[0].path ? 'text-foreground bg-overlay-hover border border-border' : 'text-muted hover:text-foreground hover:bg-overlay'
          }`}
        >
          <navItems[0].icon size={20} className={location.pathname === navItems[0].path ? 'text-accent-blue' : ''} />
          <span className="font-medium">{navItems[0].name}</span>
        </Link>

        {/* Jobs Accordion */}
        <div className="flex flex-col">
          <button
            onClick={() => setJobsOpen(!jobsOpen)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
              isJobsActive || jobsOpen ? 'text-foreground bg-overlay border border-border' : 'text-muted hover:text-foreground hover:bg-overlay'
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase size={20} className={isJobsActive ? 'text-accent-blue' : ''} />
              <span className="font-medium">Jobs</span>
            </div>
            <ChevronDown size={16} className={`transition-transform duration-300 ${jobsOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {jobsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex flex-col gap-1 mt-1 pl-4"
              >
                {jobsItems.map(item => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                      location.pathname === item.path ? 'text-foreground bg-overlay-hover' : 'text-gray-500 hover:text-foreground hover:bg-overlay'
                    }`}
                  >
                    <item.icon size={16} className={location.pathname === item.path ? 'text-accent-blue' : ''} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Remaining Links */}
        {navItems.slice(1).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive ? 'text-foreground bg-overlay-hover border border-border' : 'text-muted hover:text-foreground hover:bg-overlay'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-accent-blue' : ''} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin/support"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group mt-4 border border-accent-purple/30 bg-accent-purple/5 text-accent-purple hover:bg-accent-purple/10 ${
              location.pathname === '/admin/support' ? 'bg-accent-purple/20' : ''
            }`}
          >
            <Shield size={20} />
            <span className="font-bold">Admin Portal</span>
          </Link>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 flex items-center gap-3 px-4 py-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors font-medium w-full"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <>
      <div className="hidden md:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
