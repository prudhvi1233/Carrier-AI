import React from 'react';
import { Plus, Search, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { careerCoachService } from '../../services/careerCoachService';
import toast from 'react-hot-toast';

export default function ConversationSidebar({ activeChat, setActiveChat, closeMobile }) {

  const handleClearHistory = async () => {
    try {
      await careerCoachService.clearHistory();
      toast.success("Chat history cleared!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error("Failed to clear history.");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden pt-16 md:pt-4">
      {/* Header & New Chat */}
      <div className="px-4 pb-4 shrink-0">
        <button 
          onClick={handleClearHistory}
          className="w-full flex items-center justify-between px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] font-medium"
        >
          <div className="flex items-center gap-2">
            <div className="bg-red-500 text-white rounded-full p-1">
              <Trash2 size={16} />
            </div>
            <span>Clear History</span>
          </div>
          <span className="text-xs opacity-60 font-mono hidden md:block">⌘K</span>
        </button>
      </div>



      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
          <div className="mb-6">
            <h4 className="px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Current Session
            </h4>
            <div className="flex flex-col gap-1">
                <div className="relative">
                  <button
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all bg-white/10 text-white`}
                  >
                    <MessageSquare size={16} className="text-accent-blue" />
                    <span className="text-sm font-medium truncate flex-1">AI Career Coach Session</span>
                  </button>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}
