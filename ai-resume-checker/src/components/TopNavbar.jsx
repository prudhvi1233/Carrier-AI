import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Bot, Mic, FileText, UploadCloud, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import UserMenu from './user-menu/UserMenu';
import NotificationCenter from './NotificationCenter';
import JobsDropdown from './navigation/JobsDropdown';
import NavItem from './navigation/NavItem';

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 max-w-7xl mx-auto z-50 h-[76px] bg-secondary/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 px-6 flex items-center justify-between transition-all duration-500">
        
        {/* Left side: Logo & Desktop Links */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-bold text-white shadow-lg shadow-accent-blue/20">
              AI
            </div>
            <span className="font-bold text-xl tracking-tight hidden lg:block text-white mr-4">CareerAI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-black/20 rounded-full border border-white/5">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <JobsDropdown />
            <NavItem to="/job-tracker" icon={ClipboardList} label="Applications" />
            <NavItem to="/career-assistant" icon={Bot} label="AI Coach" />
            <NavItem to="/interview-mentor" icon={Mic} label="Interviews" />
            <NavItem to="/resume-builder" icon={FileText} label="Builder" />
            <NavItem to="/upload" icon={UploadCloud} label="Upload" />
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center gap-4">
          <button 
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Right side items (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="bg-black/20 rounded-full border border-white/5 p-1 flex items-center">
            <NotificationCenter />
          </div>
          
          <div className="w-px h-8 bg-white/10" />

          <div className="bg-black/20 rounded-full border border-white/5 p-1 flex items-center">
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay is handled by Sidebar for structural consistency, 
          but if needed we can add it here. Given Sidebar exists, we can let Sidebar handle it. */}
    </>
  );
}
