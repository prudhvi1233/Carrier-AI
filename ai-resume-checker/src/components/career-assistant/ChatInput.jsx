import React, { useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatInput({ input, setInput, onSend, isGenerating }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
        {/* Placeholder for small follow-up buttons if needed right above input */}
      </div>

      <div className="bg-secondary/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 shadow-2xl focus-within:border-accent-blue/50 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all flex items-end">
        
        <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0">
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your career..."
          className="flex-1 max-h-[200px] bg-transparent text-white placeholder-gray-500 p-3 resize-none focus:outline-none custom-scrollbar text-base"
          rows={1}
        />

        <div className="flex items-center gap-1 shrink-0 p-1">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:block">
            <Mic size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:block">
            <Smile size={20} />
          </button>
          
          <button
            onClick={onSend}
            disabled={!input.trim() || isGenerating}
            className={`p-3 rounded-xl ml-1 transition-all ${
              input.trim() && !isGenerating
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20 hover:bg-blue-500'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={18} className={input.trim() && !isGenerating ? 'translate-x-0.5' : ''} />
          </button>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <span className="text-[10px] text-gray-500">
          AI Career Assistant can make mistakes. Consider verifying important information.
        </span>
      </div>
    </div>
  );
}
