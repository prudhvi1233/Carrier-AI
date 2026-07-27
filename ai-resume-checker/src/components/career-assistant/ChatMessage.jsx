import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, User, Bot, Check } from 'lucide-react';

export default function ChatMessage({ message, isLatestAI, isTyping }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-4 w-full px-4 md:px-8 py-6 ${isUser ? '' : 'bg-white/[0.02]'}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
        isUser 
          ? 'bg-secondary border border-white/10 text-white' 
          : 'bg-gradient-to-br from-accent-blue to-accent-purple text-white shadow-accent-blue/20'
      }`}>
        {isUser ? <User size={20} /> : <Bot size={24} />}
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">{isUser ? 'You' : 'Career Copilot'}</span>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
        </div>

        <div className="text-gray-300 text-sm md:text-base leading-relaxed overflow-hidden">
          {isTyping ? (
            <div className="flex items-center gap-1.5 h-6">
              <span className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-bounce glow-blue" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-bounce glow-blue" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-bounce glow-blue" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-secondary prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && !isTyping && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleCopy}
              className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors" 
              title="Copy"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
            <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Regenerate">
              <RefreshCw size={16} />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors" title="Good response">
              <ThumbsUp size={16} />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors" title="Bad response">
              <ThumbsDown size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
