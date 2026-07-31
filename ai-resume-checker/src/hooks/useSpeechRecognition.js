import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechRecognition({ onSpeechEnd, onSilenceDetected } = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const onSpeechEndRef = useRef(onSpeechEnd);
  const onSilenceDetectedRef = useRef(onSilenceDetected);

  useEffect(() => {
    onSpeechEndRef.current = onSpeechEnd;
    onSilenceDetectedRef.current = onSilenceDetected;
  }, [onSpeechEnd, onSilenceDetected]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
            setTranscript(prev => prev + ' ' + finalTranscript);
        }
        setInterimTranscript(currentInterim);

        // Reset silence timer on every result
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (onSilenceDetectedRef.current) onSilenceDetectedRef.current();
        }, 5000); // 5 seconds of silence
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (onSpeechEndRef.current) onSpeechEndRef.current();
      };
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Recognition already started");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript: transcript.trim(),
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  };
}
