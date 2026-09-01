import { useState, useRef, useCallback, useEffect } from 'react';
import type { SiteContent } from '@shared/types';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  action?: AdminAction;
}

export type AdminAction =
  | { kind: 'update_setting'; field: string; value: string }
  | { kind: 'add_treatment'; name: string; description?: string; price?: number; minutes?: number }
  | { kind: 'add_faq'; question: string; answer: string }
  | { kind: 'none' }
  | { kind: string; [k: string]: unknown }

export interface AIAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  messages: AIMessage[];
  error: string | null;
}

// Speech recognition types. The Web Speech API is not part of the TypeScript
// DOM lib, so the minimal surface this hook uses is declared locally.
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
  [Symbol.iterator](): IterableIterator<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionResultEvent {
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface IWindow extends Window {
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  SpeechRecognition?: SpeechRecognitionConstructor;
}

interface UseAIAssistantProps {
  onContentChange?: (content: Partial<SiteContent>) => Promise<void>;
  currentLanguage?: 'en' | 'es';
}

export function useAIAssistant({ onContentChange, currentLanguage = 'en' }: UseAIAssistantProps = {}) {
  const [state, setState] = useState<AIAssistantState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: currentLanguage === 'es' 
          ? '¡Hola! Soy tu asistente de IA. Puedo ayudarte a actualizar el contenido del sitio web. ¿Qué te gustaría hacer hoy?'
          : 'Hello! I\'m your AI assistant. I can help you update the website content. What would you like to do today?',
        timestamp: Date.now(),
      },
    ],
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguage === 'es' ? 'es-ES' : 'en-US';
      
      recognition.onresult = async (event: SpeechRecognitionResultEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          stopListening();
          await processVoiceInput(transcript);
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setState((prev) => ({
          ...prev,
          isListening: false,
          error: event.error === 'no-speech' 
            ? (currentLanguage === 'es' ? 'No se detectó voz. Inténtalo de nuevo.' : 'No speech detected. Try again.')
            : (currentLanguage === 'es' ? 'Error de reconocimiento de voz.' : 'Speech recognition error.'),
        }));
      };
      
      recognition.onend = () => {
        setState((prev) => ({ ...prev, isListening: false }));
      };
      
      recognitionRef.current = recognition;
    }

    synthesisRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [currentLanguage]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      setState((prev) => ({ ...prev, isListening: true, error: null }));
      recognitionRef.current.start();
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
      setState((prev) => ({ ...prev, isListening: false }));
    }
  }, [state.isListening]);

  const speak = useCallback((text: string) => {
    if (!synthesisRef.current || !text) return;
    
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setState((prev) => ({ ...prev, isSpeaking: true }));
    utterance.onend = () => setState((prev) => ({ ...prev, isSpeaking: false }));
    utterance.onerror = () => setState((prev) => ({ ...prev, isSpeaking: false }));
    
    synthesisRef.current.speak(utterance);
  }, [currentLanguage]);

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setState((prev) => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string, action?: AIMessage['action']) => {
    const message: AIMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role,
      content,
      timestamp: Date.now(),
      action,
    };
    setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
    return message;
  }, []);

  const processVoiceInput = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return;

    addMessage('user', transcript);
    setState((prev) => ({ ...prev, isProcessing: true, error: null }));

    try {
      const history = [...state.messages, { role: 'user', content: transcript }]
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role === 'user' ? 'user' as const : 'assistant' as const, content: m.content }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, language: currentLanguage }),
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) throw new Error('AI processing failed');
      const result = await response.json() as { reply?: string };
      const rawReply = result.reply ?? '';

      // Extract <action>{...}</action>
      let action: AdminAction | undefined;
      const m = rawReply.match(/<action>([\s\S]*?)<\/action>/i);
      const spoken = rawReply.replace(/<action>[\s\S]*?<\/action>/i, '').trim();
      if (m) { try { action = JSON.parse(m[1]) as AdminAction } catch { /* ignore */ } }

      addMessage('assistant', spoken, action);
      speak(spoken);

      if (action && action.kind !== 'none' && onContentChange) {
        await onContentChange({ __aiAction: action } as unknown as Partial<SiteContent>);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      const errorMessage = currentLanguage === 'es'
        ? 'Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo.'
        : "Sorry, I couldn't process your request. Please try again.";

      addMessage('assistant', errorMessage);
      speak(errorMessage);
      setState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  }, [currentLanguage, onContentChange, addMessage, speak, state.messages]);

  const sendTextMessage = useCallback(async (text: string) => {
    await processVoiceInput(text);
  }, [processVoiceInput]);

  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [{
        id: 'welcome',
        role: 'assistant',
        content: currentLanguage === 'es'
          ? '¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte?'
          : 'Hello! I\'m your AI assistant. How can I help you?',
        timestamp: Date.now(),
      }],
    }));
  }, [currentLanguage]);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    sendTextMessage,
    clearMessages,
    isSupported: !!((window as unknown as IWindow).SpeechRecognition
      || (window as unknown as IWindow).webkitSpeechRecognition),
  };
}
