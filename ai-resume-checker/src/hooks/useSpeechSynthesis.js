import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      };

      loadVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const utteranceRef = useRef(null);
  const timerRef = useRef(null);

  const speak = useCallback((text, persona = 'Female HR') => {
    if (!synthRef.current || !text) return;

    synthRef.current.cancel();
    if (timerRef.current) clearInterval(timerRef.current);

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance; 
    
    if (voices.length > 0) {
      const isMale = persona.toLowerCase().includes('male') && !persona.toLowerCase().includes('female');
      const isBritish = persona.toLowerCase().includes('british');
      
      let selectedVoice = null;
      if (isMale) {
        selectedVoice = voices.find(v => v.name.includes('David') || v.name.includes('Male') || v.name.includes('Guy'));
      } else {
        selectedVoice = voices.find(v => v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Female'));
      }
      if (isBritish && !selectedVoice) {
         selectedVoice = voices.find(v => v.lang === 'en-GB' || v.name.includes('UK'));
      }
      if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }
      utterance.voice = selectedVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
        setIsSpeaking(true);
        // Chrome 15-second bug workaround
        timerRef.current = setInterval(() => {
            if (synthRef.current.speaking) {
                synthRef.current.resume();
            } else {
                clearInterval(timerRef.current);
            }
        }, 10000);
    };
    
    utterance.onend = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsSpeaking(false);
    };
    
    utterance.onerror = (e) => {
        if (timerRef.current) clearInterval(timerRef.current);
        console.error('Speech Synthesis Error', e);
        setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, [voices]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      if (timerRef.current) clearInterval(timerRef.current);
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSupported,
    isSpeaking,
    speak,
    stopSpeaking,
    voices
  };
}
