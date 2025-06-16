'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

declare global {
    interface Window {
      webkitSpeechRecognition: any;
      SpeechRecognition: any;
    }
  
    interface SpeechRecognitionEvent extends Event {
      readonly resultIndex: number;
      readonly results: SpeechRecognitionResultList;
    }
  }

const SpeechToText: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window?.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + ' ';
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        // Append final transcripts to the main spoken text
        if (finalTranscript) {
          setSpokenText((prev) => prev + finalTranscript);
        }
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    if (!isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Speech to Text</h2>
        <button
          onClick={handleToggleListening}
          className={`p-2 rounded-full text-white transition duration-200 ${
            isListening ?  'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
          }`}
          title={isListening ? 'Stop Listening' : 'Start Listening'}
        >
          {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
      </div>

      {/* <div className="p-4 rounded bg-gray-800 text-white min-h-[150px] whitespace-pre-wrap"> */}
        {spokenText || '🎤 Speak something and it will appear here...'}
      {/* </div> */}
    </div>
  );
};

export default SpeechToText;
