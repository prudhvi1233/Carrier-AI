import React, { useState } from 'react';
import { Menu, X, PanelRightClose, PanelRightOpen, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationSidebar from './ConversationSidebar';
import ChatWindow from './ChatWindow';
import AIToolsSidebar from './AIToolsSidebar';

export default function CareerAssistantLayout() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null); // null means Empty State

  return (
    <div className="flex h-full w-full relative bg-secondary text-white overflow-hidden">
      
      {/* Mobile Toggles */}
      <div className="absolute top-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md border border-white/10 text-white transition-colors"
        >
          {leftSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div className="absolute top-4 right-4 z-50 xl:hidden">
        <button 
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md border border-white/10 text-white transition-colors"
        >
          {rightSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </button>
      </div>

      {/* Left Sidebar (Conversation History) */}
      <AnimatePresence>
        {(leftSidebarOpen || window.innerWidth >= 768) && (
          <>
            {leftSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLeftSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
              />
            )}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className={`fixed md:relative inset-y-0 left-0 w-72 bg-secondary/95 backdrop-blur-xl border-r border-white/10 z-40 md:z-auto flex flex-col`}
            >
              <ConversationSidebar activeChat={activeChat} setActiveChat={setActiveChat} closeMobile={() => setLeftSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Center Chat Window */}
      <div className="flex-1 flex flex-col h-full bg-[#0a0a0f] relative min-w-0">
        <ChatWindow activeChat={activeChat} />
      </div>

      {/* Right Sidebar (AI Tools) */}
      <AnimatePresence>
        {(rightSidebarOpen || window.innerWidth >= 1280) && (
          <>
            {rightSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRightSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 xl:hidden"
              />
            )}
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className={`fixed xl:relative inset-y-0 right-0 w-80 bg-secondary/95 backdrop-blur-xl border-l border-white/10 z-40 xl:z-auto flex flex-col`}
            >
              <AIToolsSidebar closeMobile={() => setRightSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
