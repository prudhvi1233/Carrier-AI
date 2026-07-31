import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { interviewService } from '../services/interviewService';

import InterviewSetup from '../components/interview-mentor/InterviewSetup';
import InterviewHistory from '../components/interview-mentor/InterviewHistory';
import InterviewSimulator from '../components/interview-mentor/InterviewSimulator';
import InterviewSummary from '../components/interview-mentor/InterviewSummary';
import LoadingState from '../components/interview-mentor/LoadingState';

export default function InterviewMentorPage() {
  const [viewState, setViewState] = useState('SETUP'); // SETUP, LOADING, INTERVIEW, SUMMARY
  const [history, setHistory] = useState([]);
  
  const [session, setSession] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await interviewService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStart = async (setupConfig) => {
    try {
      setViewState('LOADING');
      setConfig(setupConfig);
      
      const newSession = await interviewService.startDynamicInterview(
        setupConfig.role,
        setupConfig.type,
        setupConfig.difficulty,
        setupConfig.persona
      );
      
      setSession(newSession);
      setViewState('INTERVIEW');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to start interview.');
      setViewState('SETUP');
    }
  };

  const handleInterviewComplete = (completedSession) => {
    setSession(completedSession);
    setViewState('SUMMARY');
    fetchHistory();
  };

  const renderContent = () => {
    if (viewState === 'LOADING') {
      return (
        <div className="flex-1 flex items-center justify-center">
          <LoadingState />
        </div>
      );
    }

    if (viewState === 'SETUP') {
      return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto custom-scrollbar">
          <div className="lg:col-span-2 flex flex-col h-full">
            <InterviewSetup onStart={handleStart} />
          </div>
          <div className="flex flex-col h-full">
            <InterviewHistory history={history} />
          </div>
        </div>
      );
    }

    if (viewState === 'INTERVIEW') {
      return (
        <div className="flex-1 p-6 h-full">
          <InterviewSimulator 
            session={session} 
            config={config} 
            onComplete={handleInterviewComplete} 
          />
        </div>
      );
    }

    if (viewState === 'SUMMARY') {
      return (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <InterviewSummary session={session} onBack={() => setViewState('SETUP')} />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <AnimatePresence mode="wait">
        <motion.div 
          key={viewState}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1 flex flex-col h-full w-full relative"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
