import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  X,
  Volume2,
  Trash2,
  ShieldCheck,
  User,
  Clock,
  Loader2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AIAssistantModal: React.FC = () => {
  const {
    t,
    isAssistantModalOpen,
    setIsAssistantModalOpen,
    chatMessages,
    isChatLoading,
    sendChatMessage,
    clearChatHistory,
    language,
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAssistantModalOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAssistantModalOpen, isChatLoading]);

  if (!isAssistantModalOpen) return null;

  const handleSend = (text?: string) => {
    const messageToSend = text || inputPrompt;
    if (!messageToSend.trim() || isChatLoading) return;
    sendChatMessage(messageToSend);
    setInputPrompt('');
  };

  const handleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full h-[88vh] sm:h-[82vh] flex flex-col shadow-2xl overflow-hidden text-start">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  {t.assistant.title}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.assistant.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={clearChatHistory}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title={t.assistant.clearChat}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                setIsAssistantModalOpen(false);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety Disclaimer Header */}
        <div className="bg-red-50/70 dark:bg-red-950/20 border-b border-red-100/80 dark:border-red-900/40 px-4 py-2 text-[11px] text-red-800 dark:text-red-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
          <span className="truncate">{t.assistant.disclaimerNotice}</span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>

                      {/* Text-to-speech button */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {msg.timestamp}
                        </span>

                        <button
                          onClick={() => handleSpeak(msg.text, msg.id)}
                          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>
                            {isSpeaking === msg.id
                              ? language === 'ar' ? 'إيقاف' : 'Stop'
                              : language === 'ar' ? 'استماع' : 'Listen'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isChatLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>{language === 'ar' ? 'جاري كتابة الرد...' : 'SugarCare AI is thinking...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">
              {t.assistant.quickPromptsTitle}
            </span>
            {t.assistant.prompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isChatLoading}
                className="shrink-0 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={t.assistant.inputPlaceholder}
              disabled={isChatLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isChatLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
