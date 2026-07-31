import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, MessageSquare, Loader, CheckCircle, Activity, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { interviewService } from '../../services/interviewService';
import toast from 'react-hot-toast';

export default function InterviewSimulator({ session, config, onComplete }) {
  const [status, setStatus] = useState('idle'); // idle, listening, thinking, speaking
  const [transcriptLog, setTranscriptLog] = useState([]);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  
  const { isSupported: sttSupported, isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  const { isSupported: ttsSupported, isSpeaking, speak, stopSpeaking, voices } = useSpeechSynthesis();

  const [hasSpokenFirstQuestion, setHasSpokenFirstQuestion] = useState(false);

  // Initialize first question when voices are ready
  useEffect(() => {
    if (session && session.questions && session.questions.length > 0 && voices.length > 0 && !hasSpokenFirstQuestion) {
      const firstQ = session.questions[0].question;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentQuestionText(firstQ);
      setTranscriptLog([{ speaker: 'AI', text: firstQ, time: now }]);
      setStatus('speaking');
      speak(firstQ, config.persona);
      setHasSpokenFirstQuestion(true);
    }
  }, [session, voices, hasSpokenFirstQuestion, speak, config.persona]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  const prevIsSpeaking = useRef(false);
  useEffect(() => {
    if (isSpeaking) {
      setStatus('speaking');
    } else {
      setStatus(prev => prev === 'speaking' ? 'idle' : prev);
      
      // Auto-start microphone when AI finishes speaking
      if (prevIsSpeaking.current && !isSpeaking && sttSupported && !isListening) {
        resetTranscript();
        startListening();
      }
    }
    prevIsSpeaking.current = isSpeaking;
  }, [isSpeaking, sttSupported, isListening, resetTranscript, startListening]);

  // Sync STT state with UI
  useEffect(() => {
    if (isListening) {
      setStatus('listening');
    } else {
      setStatus(prev => prev === 'listening' ? 'idle' : prev);
    }
  }, [isListening]);

  const handleToggleMic = () => {
    if (!sttSupported) {
      toast.error("Speech Recognition is not supported in your browser. Please try Chrome.");
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      if (isSpeaking) stopSpeaking();
      resetTranscript();
      startListening();
    }
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      toast.error('Please provide an answer first.');
      return;
    }

    stopListening();
    setStatus('thinking');
    
    // Add user answer to log
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscriptLog(prev => [...prev, { speaker: 'User', text: transcript, time: now }]);
    
    try {
      const result = await interviewService.submitDynamicTurn(session.id, transcript);
      
      const nextQ = result.next_question;
      setCurrentQuestionText(nextQ);
      const aiNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTranscriptLog(prev => [...prev, { speaker: 'AI', text: nextQ, time: aiNow }]);
      resetTranscript();
      
      setStatus('speaking');
      speak(nextQ, config.persona);
      
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to process answer.';
      toast.error(`API Error: ${errorMsg}`);
      setStatus('idle');
    }
  };

  // Auto-scroll transcript
  const transcriptEndRef = useRef(null);
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptLog, interimTranscript]);

  const [isFinishing, setIsFinishing] = useState(false);

  const handleEndInterview = async () => {
    stopListening();
    stopSpeaking();
    setIsFinishing(true);
    try {
      const completedSession = await interviewService.completeDynamicInterview(session.id);
      onComplete(completedSession);
    } catch (err) {
      console.error(err);
      toast.error('Failed to complete interview.');
      setIsFinishing(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 min-h-0 relative">
      {isFinishing && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl border border-white/10">
          <Loader className="w-12 h-12 text-accent-purple animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Interview</h2>
          <p className="text-gray-400">Please wait while the AI generates your comprehensive feedback report...</p>
        </div>
      )}

      {/* Left Main Stage */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col relative min-h-0">
        {/* Header & Progress */}
        <div className="p-4 border-b border-white/5 bg-black/40 z-10 space-y-3 shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                Live Interview
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
                  {config.role}
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Question {session?.questions?.length || 1} of 8 • Est. {Math.max(1, (8 - (session?.questions?.length || 1)) * 3)} mins remaining
              </p>
            </div>
            <button 
              onClick={handleEndInterview}
              disabled={isFinishing}
              className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shrink-0"
            >
              <Square size={14} className="fill-current" /> End Early
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-accent-blue to-accent-purple"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ((session?.questions?.length || 1) / 8) * 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Avatar Stage (Static Professional Photo) */}
        <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 relative overflow-y-auto custom-scrollbar">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
          
          <div className="my-auto flex flex-col items-center w-full relative z-10">
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center shrink-0 mb-8 mx-auto">
              {/* Outer Glow */}
              <div className={`absolute inset-0 rounded-full border-2 ${status === 'speaking' ? 'border-accent-purple/50 shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-pulse' : status === 'listening' ? 'border-accent-blue/50 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'border-white/10'} transition-all duration-500`} />
              
              {/* Static Avatar Image */}
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-4 border-white/10 overflow-hidden bg-gray-900 shadow-2xl relative z-10 flex items-center justify-center">
                <img 
                  src={config.persona.toLowerCase().includes('female hr') ? '/avatars/female_hr.jpg' : '/avatars/male_tech.jpg'} 
                  alt="HR Interviewer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <User size={64} className="text-gray-400 hidden absolute" />
              </div>
              
              {/* Status Badge */}
              <div className="absolute -bottom-4 bg-gray-900 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl z-20 whitespace-nowrap">
                 {status === 'speaking' ? (
                   <span className="text-sm font-medium text-accent-purple flex items-center gap-2">
                     <Activity size={14} className="animate-pulse" /> Speaking
                   </span>
                 ) : status === 'listening' ? (
                   <span className="text-sm font-medium text-accent-blue flex items-center gap-2">
                     <Mic size={14} className="animate-pulse" /> Listening
                   </span>
                 ) : status === 'thinking' ? (
                   <span className="text-sm font-medium text-yellow-500 flex items-center gap-2">
                     <Loader size={14} className="animate-spin" /> Thinking
                   </span>
                 ) : (
                   <span className="text-sm font-medium text-gray-400">Ready</span>
                 )}
              </div>
            </div>
            
            {/* Subtitles / Current Spoken Text */}
            <div className="w-full px-4 text-center min-h-[60px] flex flex-col items-center justify-center break-words whitespace-normal">
              <AnimatePresence mode="wait">
                {status === 'thinking' ? (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-3 text-accent-blue w-full"
                  >
                    <Loader className="animate-spin" size={20} />
                    <span className="font-medium text-sm md:text-base">Analyzing response and generating next question...</span>
                  </motion.div>
                ) : status === 'speaking' ? (
                  <motion.div
                    key="speaking"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-4 w-full"
                  >
                    <p className="text-base md:text-xl text-white font-medium drop-shadow-md text-center max-w-4xl break-words whitespace-normal leading-relaxed">
                      "{currentQuestionText}"
                    </p>
                    {/* Speaking Waveform */}
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1,2,3,4,5,6,7].map(i => (
                        <motion.div 
                          key={i}
                          className="w-1.5 bg-accent-purple rounded-full"
                          animate={{ height: [4, Math.random() * 24 + 8, 4] }}
                          transition={{ repeat: Infinity, duration: Math.random() * 0.4 + 0.2 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : status === 'listening' ? (
                  <motion.div
                    key="listening"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full flex flex-col items-center"
                  >
                    <p className="text-gray-300 italic text-base md:text-lg drop-shadow-md max-w-4xl break-words whitespace-normal text-center">
                      {interimTranscript || transcript || "Listening..."}
                    </p>
                    {/* Listening Waveform */}
                    <div className="flex items-center justify-center gap-1 mt-4">
                      {[1,2,3,4,5].map(i => (
                        <motion.div 
                          key={i}
                          className="w-1.5 bg-accent-blue rounded-full"
                          animate={{ height: [8, Math.random() * 20 + 10, 8] }}
                          transition={{ repeat: Infinity, duration: Math.random() * 0.5 + 0.3 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-gray-400 text-sm md:text-base text-center w-full"
                  >
                    Click the microphone when you are ready to answer.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="p-4 md:p-6 bg-black/40 border-t border-white/5 relative z-10 shrink-0">
          <div className="flex flex-col items-center gap-4 w-full">
            
            <div className="w-full max-w-3xl bg-black/50 border border-white/10 rounded-xl p-4 min-h-[80px] max-h-[150px] overflow-y-auto custom-scrollbar break-words whitespace-normal">
              <p className={`text-sm ${transcript ? 'text-gray-200' : 'text-gray-600 italic'} break-words whitespace-normal`}>
                {transcript || "Your transcription will appear here..."}
                <span className="text-gray-400 ml-1">{interimTranscript}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleMic}
                disabled={status === 'thinking'}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  status === 'listening' 
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {status === 'listening' ? <MicOff size={20} className="md:w-6 md:h-6" /> : <Mic size={20} className="md:w-6 md:h-6" />}
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={!transcript.trim() || status === 'thinking'}
                className="px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-blue/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap text-sm md:text-base shrink-0"
              >
                <CheckCircle size={18} />
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Transcript Log */}
      <div className="w-full lg:w-96 glass-card flex flex-col hidden md:flex min-h-0 shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-black/20 shrink-0">
          <MessageSquare size={18} className="text-accent-blue" />
          <h3 className="font-bold text-white truncate">Live Transcript</h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-6 min-h-0 break-words">
          {transcriptLog.map((log, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col gap-1.5 w-full ${log.speaker === 'User' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
                <span className="font-bold truncate">{log.speaker === 'AI' ? config.persona : 'You'}</span>
                <span className="shrink-0">{log.time}</span>
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[95%] text-sm leading-relaxed shadow-sm break-words whitespace-normal ${
                log.speaker === 'User' 
                  ? 'bg-accent-blue text-white rounded-br-sm' 
                  : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-sm'
              }`}>
                {log.text}
              </div>
            </motion.div>
          ))}
          {status === 'thinking' && (
            <div className="flex items-start w-full">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm text-sm text-gray-400 flex items-center gap-2">
                <Loader className="animate-spin shrink-0" size={14} />
                Typing...
              </div>
            </div>
          )}
          <div ref={transcriptEndRef} className="shrink-0 h-1 w-full" />
        </div>
      </div>

    </div>
  );
}
