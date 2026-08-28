import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Send, Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAIAssistant } from '@/lib/ai-assistant';
import { cn } from '@/lib/utils';
import type { SiteContent } from '@shared/types';

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onContentChange?: (content: Partial<SiteContent>) => Promise<void>;
  currentLanguage?: 'en' | 'es';
}

export function AIPanel({ isOpen, onClose, onContentChange, currentLanguage = 'en' }: AIPanelProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const assistant = useAIAssistant({ 
    onContentChange, 
    currentLanguage 
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistant.messages]);

  const handleSend = async () => {
    if (inputText.trim()) {
      await assistant.sendTextMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-ocean-950/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Panel */}
        <motion.div
          className="relative z-10 w-full max-w-lg bg-sand-50 sm:rounded-4xl shadow-lift overflow-hidden"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          style={{ maxHeight: '85vh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-ocean-900/10 bg-gradient-to-r from-ocean-900 to-lagoon-600 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-white/20 text-sun-400">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-sand-50">
                  {currentLanguage === 'es' ? 'Asistente IA' : 'AI Assistant'}
                </h3>
                <p className="text-[0.7rem] font-medium tracking-wide text-seafoam-200 uppercase">
                  {currentLanguage === 'es' 
                    ? 'Control por voz y texto' 
                    : 'Voice & Text Control'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {assistant.isSpeaking ? (
                <button
                  type="button"
                  onClick={assistant.stopSpeaking}
                  className="grid size-9 place-items-center rounded-full bg-white/20 text-sand-50 hover:bg-white/30"
                  title={currentLanguage === 'es' ? 'Silenciar' : 'Mute'}
                >
                  <VolumeX className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => assistant.speak(assistant.messages[assistant.messages.length - 1]?.content || '')}
                  className="grid size-9 place-items-center rounded-full bg-white/20 text-sand-50 hover:bg-white/30"
                  title={currentLanguage === 'es' ? 'Escuchar' : 'Listen'}
                >
                  <Volume2 className="size-4" />
                </button>
              )}
              
              <button
                type="button"
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full bg-white/20 text-sand-50 hover:bg-white/30"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="no-scrollbar edge-fade h-[calc(85vh-180px)] overflow-y-auto p-5">
            <div className="space-y-4">
              {assistant.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-3xl px-4 py-3 text-[0.9rem] leading-relaxed',
                      message.role === 'user'
                        ? 'bg-ocean-900 text-sand-50 rounded-br-md'
                        : 'bg-white border border-ocean-900/10 text-ocean-900 rounded-bl-md shadow-soft'
                    )}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {assistant.isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 rounded-3xl bg-white border border-ocean-900/10 px-4 py-3 text-[0.9rem] text-ocean-800/60 shadow-soft">
                    <Loader2 className="size-4 animate-spin" />
                    {currentLanguage === 'es' ? 'Procesando...' : 'Processing...'}
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-ocean-900/10 bg-white p-4">
            {/* Voice Button */}
            <div className="mb-3 flex justify-center">
              <motion.button
                type="button"
                onClick={assistant.isListening ? assistant.stopListening : assistant.startListening}
                className={cn(
                  'group relative grid size-16 place-items-center rounded-full shadow-soft transition-all duration-300',
                  assistant.isListening
                    ? 'bg-coral-500 text-white scale-110'
                    : 'bg-ocean-900 text-sand-50 hover:scale-105'
                )}
              >
                {assistant.isListening && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-coral-500/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {assistant.isListening ? (
                  <MicOff className="relative size-7" />
                ) : (
                  <Mic className="relative size-7" />
                )}
              </motion.button>
            </div>
            
            <p className="mb-3 text-center text-[0.75rem] font-medium tracking-wide text-ocean-800/50 uppercase">
              {assistant.isListening
                ? (currentLanguage === 'es' ? 'Escuchando... habla ahora' : 'Listening... speak now')
                : (currentLanguage === 'es' 
                    ? 'Toca el micrófono o escribe abajo' 
                    : 'Tap mic or type below')}
            </p>

            {/* Text Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentLanguage === 'es' 
                  ? 'Escribe tu mensaje...' 
                  : 'Type your message...'}
                className="flex-1 rounded-full border border-ocean-900/12 bg-sand-50 px-5 py-3 text-[0.9rem] text-ocean-900 placeholder:text-ocean-800/40 focus:border-lagoon-500 focus:outline-none focus:ring-2 focus:ring-lagoon-500/20"
              />
              
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim() || assistant.isProcessing}
                className="grid size-11 place-items-center rounded-full bg-ocean-900 text-sand-50 transition-colors hover:bg-ocean-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
