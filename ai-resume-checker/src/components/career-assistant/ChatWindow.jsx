import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import EmptyState from './EmptyState';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { careerCoachService } from '../../services/careerCoachService';

export default function ChatWindow({ activeChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const endOfMessagesRef = useRef(null);

  // Load chat messages on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await careerCoachService.getHistory();
        if (history && history.length > 0) {
          const formattedHistory = history.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.message,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(formattedHistory);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    try {
      const response = await careerCoachService.sendMessage(text);
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      toast.error(err.message || 'Failed to get response');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptSelect = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Top Header Gradient Blur */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!activeChat && messages.length === 0 ? (
          <EmptyState onSelectPrompt={handlePromptSelect} />
        ) : (
          <div className="flex flex-col pt-16 pb-32">
            {messages.map((msg, idx) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isLatestAI={idx === messages.length - 1 && msg.role === 'assistant'} 
              />
            ))}
            
            {isGenerating && (
              <ChatMessage 
                message={{ role: 'assistant', timestamp: 'Just now' }} 
                isTyping={true} 
              />
            )}
            
            {/* Follow up suggestions placeholder */}
            {!isGenerating && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
              <div className="h-4" />
            )}

            <div ref={endOfMessagesRef} className="h-10" />
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent pt-10 pb-6 px-4 md:px-8 z-20">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            input={input} 
            setInput={setInput} 
            onSend={() => handleSend()} 
            isGenerating={isGenerating} 
          />
        </div>
      </div>
    </div>
  );
}
