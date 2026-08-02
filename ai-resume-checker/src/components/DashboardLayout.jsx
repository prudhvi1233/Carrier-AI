import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import TopNavbar from './TopNavbar';

export default function DashboardLayout() {
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <div className="relative min-h-screen w-full bg-primary text-foreground overflow-x-hidden font-sans flex flex-col transition-colors duration-500">
      {/* Image Background Layer with Crossfade */}
      <div className="fixed inset-0 z-0 bg-primary">
        <AnimatePresence mode="popLayout">
          {isDark ? (
            <motion.div
              key="dark-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url("/dark.png")' }}
            />
          ) : (
            <motion.div
              key="light-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url("/light.png")' }}
            >
              {/* Added a subtle white overlay to ensure light mode stays legible even if the user uploads a dark image */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TopNavbar />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col w-full min-h-screen relative z-10 pt-20">
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
