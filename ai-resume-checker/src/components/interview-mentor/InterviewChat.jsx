import React, { useState, useEffect } from 'react';
import { Bot, User, Clock, AlertCircle } from 'lucide-react';
import AnswerBox from './AnswerBox';
import FeedbackCard from './FeedbackCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterviewChat({ question, questionNumber, totalQuestions, config, viewState, onAnswerSubmit, feedback, onNextQuestion }) {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question default

  useEffect(() => {
    if (viewState !== 'INTERVIEW') return;
    
    setTimeLeft(120);
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [question, viewState]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* Top Bar */}
      <div className="glass-card p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30">
            <span className="font-bold text-accent-blue">Q{questionNumber}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-overlay-hover text-muted uppercase tracking-wider">{question.category}</span>
              <span className="text-xs text-gray-500">Question {questionNumber} of {totalQuestions}</span>
            </div>
            <h3 className="font-bold text-foreground mt-0.5">{config.role} Interview</h3>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${timeLeft < 30 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-black/40 border-border text-muted'}`}>
          <Clock size={16} />
          <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass-card p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        
        {/* AI Question */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shrink-0 shadow-lg shadow-accent-blue/20">
            <Bot size={20} className="text-foreground" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="bg-overlay border border-border p-4 rounded-2xl rounded-tl-none inline-block">
              <p className="text-foreground text-lg leading-relaxed">{question.text}</p>
            </div>
            
            {viewState === 'INTERVIEW' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-gray-500">
                <AlertCircle size={12} />
                <span>Aim for 2-3 minutes of speaking time (roughly 300-400 words).</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* User Answer Area OR Feedback */}
        <AnimatePresence mode="wait">
          {viewState === 'INTERVIEW' ? (
            <motion.div key="answering" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-auto">
              <AnswerBox onSubmit={onAnswerSubmit} />
            </motion.div>
          ) : (
            <motion.div key="feedback" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
              {feedback && <FeedbackCard feedback={feedback} onNext={onNextQuestion} isLast={questionNumber === totalQuestions} />}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
