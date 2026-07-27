import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { interviewService } from '../services/interviewService';

import InterviewSetup from '../components/interview-mentor/InterviewSetup';
import InterviewHistory from '../components/interview-mentor/InterviewHistory';
import InterviewChat from '../components/interview-mentor/InterviewChat';
import InterviewSummary from '../components/interview-mentor/InterviewSummary';
import TipsSidebar from '../components/interview-mentor/TipsSidebar';
import LoadingState from '../components/interview-mentor/LoadingState';

export default function InterviewMentorPage() {
  const [viewState, setViewState] = useState('SETUP'); // SETUP, LOADING, INTERVIEW, FEEDBACK, SUMMARY
  const [history, setHistory] = useState([]);
  
  const [session, setSession] = useState(null);
  const [config, setConfig] = useState(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState(null);

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
      
      const newSession = await interviewService.startInterview(
        setupConfig.role,
        setupConfig.type,
        setupConfig.difficulty
      );
      
      setSession(newSession);
      setCurrentQuestionIndex(0);
      setCurrentFeedback(null);
      setViewState('INTERVIEW');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to start interview.');
      setViewState('SETUP');
    }
  };

  const handleAnswerSubmit = async (answerText) => {
    try {
      setViewState('LOADING');
      
      const evaluation = await interviewService.submitAnswer(
        session.id,
        currentQuestionIndex,
        answerText
      );
      
      setCurrentFeedback(evaluation);
      setViewState('FEEDBACK');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit answer.');
      setViewState('INTERVIEW');
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex + 1 < session.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentFeedback(null);
      setViewState('INTERVIEW');
    } else {
      // Complete interview
      try {
        setViewState('LOADING');
        const completedSession = await interviewService.completeInterview(session.id);
        setSession(completedSession);
        setViewState('SUMMARY');
        fetchHistory(); // Refresh history
      } catch (err) {
        console.error(err);
        toast.error('Failed to complete interview.');
        setViewState('FEEDBACK');
      }
    }
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

    if (viewState === 'INTERVIEW' || viewState === 'FEEDBACK') {
      const currentQuestion = session.questions[currentQuestionIndex];
      // Map API structure to what component expects
      const mappedQuestion = {
        text: currentQuestion.question,
        category: currentQuestion.category || currentQuestion.difficulty
      };

      return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto custom-scrollbar">
          <div className="lg:col-span-2 flex flex-col h-full">
            <InterviewChat 
              question={mappedQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={session.questions.length}
              config={config}
              viewState={viewState}
              onAnswerSubmit={handleAnswerSubmit}
              feedback={currentFeedback}
              onNextQuestion={handleNextQuestion}
            />
          </div>
          <div className="hidden lg:flex flex-col h-full">
            <TipsSidebar category={mappedQuestion.category} />
          </div>
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
