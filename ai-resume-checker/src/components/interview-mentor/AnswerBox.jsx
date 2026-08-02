import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Square } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AnswerBox({ onSubmit }) {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setAnswer(prev => prev + ' ' + finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        toast.error('Voice dictation error: ' + event.error);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    if (answer.trim().length > 10) {
      onSubmit(answer);
      setAnswer(''); // Clear answer after submit
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here, or use voice dictation..."
          className="w-full h-40 bg-black/40 border border-border rounded-2xl p-4 text-foreground placeholder-gray-500 focus:border-accent-blue/50 outline-none resize-none custom-scrollbar"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">{answer.length} chars</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={toggleRecording}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isRecording 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-overlay text-muted hover:text-foreground hover:bg-overlay-hover border border-border'
          }`}
        >
          {isRecording ? <Square size={16} /> : <Mic size={16} />}
          {isRecording ? 'Stop Recording' : 'Voice Answer'}
        </button>

        <button
          onClick={handleSubmit}
          disabled={answer.trim().length < 10}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent-blue hover:bg-blue-500 disabled:bg-overlay disabled:text-gray-500 text-foreground font-bold rounded-xl transition-all shadow-lg shadow-accent-blue/20 disabled:shadow-none"
        >
          Submit Answer <Send size={16} />
        </button>
      </div>
    </div>
  );
}
