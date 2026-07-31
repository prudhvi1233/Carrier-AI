import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, History, Settings, CreditCard, Shield, HelpCircle, LogOut, FileBox, LayoutList, Bookmark, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from './ProfileHeader';
import DropdownItem from './DropdownItem';
import LogoutModal from './LogoutModal';
import QuickStats from './QuickStats';
import DropdownFooter from './DropdownFooter';

export default function UserDropdown({ isOpen, onClose, user, onLogout }) {
  const { isAdmin } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-20 md:top-full md:mt-3 md:w-80 bg-secondary/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top md:origin-top-right max-h-[calc(100vh-100px)] flex flex-col"
          >
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <ProfileHeader user={user} />
              <QuickStats />

              <div className="h-px w-full bg-white/5 my-1" />

              <div className="py-2 flex flex-col">
                <DropdownItem icon={User} label="My Profile" to="/profile" onClick={onClose} />
                <DropdownItem icon={History} label="Resume History" to="/history" onClick={onClose} />
                <DropdownItem icon={LayoutList} label="Job Tracker" to="/job-tracker" onClick={onClose} />
                <DropdownItem icon={Bookmark} label="Saved Jobs" to="/job-tracker" onClick={onClose} />
                <DropdownItem icon={FileBox} label="My Drafts" to="/resume-builder" onClick={onClose} />
              </div>

              <div className="h-px w-full bg-white/5 my-1" />

              <div className="py-2 flex flex-col">
                {isAdmin && (
                  <DropdownItem 
                    icon={Shield} 
                    label="Admin Portal" 
                    to="/admin/support" 
                    onClick={onClose} 
                    color="text-accent-purple" 
                    hoverColor="text-accent-purple"
                  />
                )}
                <DropdownItem icon={HelpCircle} label="Help & Support" to="/support" onClick={onClose} />
                <DropdownItem 
                  icon={LogOut} 
                  label="Logout" 
                  onClick={handleLogoutClick} 
                  color="text-red-400" 
                  hoverColor="text-red-300" 
                />
              </div>
            </div>
            
            <DropdownFooter />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutModal && (
          <LogoutModal 
            isOpen={showLogoutModal} 
            onClose={() => setShowLogoutModal(false)} 
            onConfirm={onLogout} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
