import React, { useState, useEffect, useRef } from 'react';
import { useAiConfig, useSaveAiConfig, useChatSessions, useChatSession } from '../features/ai/hooks/useAi.js';
import { Bot, User, Send, Settings, MessageSquare, Plus, Shield, Cpu, Activity } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';

const AiMessageRow = React.memo(({ message }: { message: { role: string; content: string } }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={cn("flex gap-4 w-full", message.role === 'user' ? "flex-row-reverse" : "flex-row")}
  >
    <div className={cn("flex items-center justify-center h-8 w-8 rounded-full shrink-0", message.role === 'user' ? "bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] shadow-sm" : "bg-[var(--color-success)] text-white shadow-sm")}>
      {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
    </div>
    <div className={cn("px-4 py-3 rounded-2xl max-w-[85%] shadow-sm", message.role === 'user' ? "bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] rounded-tr-none" : "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-tl-none border border-[var(--color-border-primary)]")}>
      <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  </motion.div>
));

export default function AiCoachPage() {
  const queryClient = useQueryClient();
  const { data: config, isLoading: configLoading } = useAiConfig();
  const { data: sessions } = useChatSessions();
  const saveConfig = useSaveAiConfig();

  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const { data: activeSession } = useChatSession(activeSessionId);

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const [configOpen, setConfigOpen] = useState(false);
  const [provider, setProvider] = useState('groq');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama3-8b-8192');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const configModalRef = useFocusTrap(configOpen);

  useKeyboardShortcuts({
    'escape': () => {
      if (configOpen) setConfigOpen(false);
    }
  });

  useEffect(() => {
    if (activeSession) {
      setMessages(activeSession.messages.map(m => ({ role: m.role, content: m.content })));
    } else {
      setMessages([]);
    }
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamContent]);

  if (configLoading) return <div className="p-6">Loading AI Coach...</div>;

  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig.mutate({ provider, apiKey, selectedModel }, {
      onSuccess: () => setConfigOpen(false)
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    if (!config?.hasApiKey) {
      setConfigOpen(true);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsStreaming(true);
    setStreamContent('');

    try {
      const response = await fetch('http://localhost:3000/api/ai/chat', { // using absolute for bypass in testing
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: userMessage, sessionId: activeSessionId })
      });

      if (!response.ok) {
        let msg = 'Failed to connect to AI engine.';
        try {
          const data = await response.json();
          msg = data.error?.message || msg;
        } catch {
          // ignore parsing error if response is not json
        }
        throw new Error(msg);
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let newSessionId = activeSessionId;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '');
              if (!dataStr) continue;
              const data = JSON.parse(dataStr);
              
              if (data.type === 'session_id') {
                newSessionId = data.sessionId;
                if (!activeSessionId) {
                  setActiveSessionId(newSessionId);
                  queryClient.invalidateQueries({ queryKey: ['ai', 'sessions'] });
                }
              } else if (data.type === 'chunk') {
                setStreamContent(prev => prev + data.text);
              } else if (data.type === 'done') {
                // stream finished
              } else if (data.type === 'error') {
                console.error('AI Stream Error:', data.message);
                setStreamContent(prev => prev + `\n\n**Error:** ${data.message}`);
              }
            }
          }
        }
      }

      setIsStreaming(false);
      setMessages(prev => {
        const updated = [...prev, { role: 'assistant', content: streamContent || (messagesEndRef.current ? (messagesEndRef.current.innerText) : '') }];
        // Need to refetch session to get exact final DB state
        queryClient.invalidateQueries({ queryKey: ['ai', 'session', newSessionId] });
        return updated;
      });
      setStreamContent('');

    } catch (err) {
      console.error(err);
      setIsStreaming(false);
      setMessages(prev => {
        const errorMsg = `\n\n> [!WARNING]\n> Streaming was interrupted. Please try again. (${err instanceof Error ? err.message : 'Network error'})`;
        return [...prev, { role: 'assistant', content: (streamContent || '') + errorMsg }];
      });
      setStreamContent('');
    }
  };

  return (
    <div className="flex h-full flex-col p-6 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">AI Financial Coach</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Your personal intelligence agent running on strict deterministic data pipelines.</p>
        </div>
        <button 
          onClick={() => setConfigOpen(true)}
          className={cn("px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 border", 
            config?.hasApiKey 
              ? "border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)]" 
              : "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          )}
        >
          <Settings className="h-4 w-4" />
          {config?.hasApiKey ? 'AI Configured' : 'Configure AI Engine'}
        </button>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <Cpu className="h-3.5 w-3.5" /> Explainable AI
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-xs font-medium text-blue-700 dark:text-blue-400">
          <Shield className="h-3.5 w-3.5" /> Privacy First
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/20 text-xs font-medium text-purple-700 dark:text-purple-400">
          <Activity className="h-3.5 w-3.5" /> Deterministic Analytics
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-[500px]">
        {/* Sidebar */}
        <div className="w-64 flex flex-col gap-4 border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] rounded-xl p-4 overflow-y-auto hidden md:flex">
          <button 
            onClick={() => setActiveSessionId(undefined)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> New Chat
          </button>
          
          <div className="flex flex-col gap-1 mt-4">
            <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Recent Sessions</div>
            {sessions?.map(s => (
              <button 
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={cn("flex items-center gap-2 text-sm p-2 rounded-lg text-left truncate transition-colors", 
                  activeSessionId === s.id ? "bg-[var(--color-bg-secondary)] font-medium text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div 
          className="flex-1 flex flex-col border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] rounded-xl overflow-hidden relative"
          role="region"
          aria-label="Chat messages"
        >
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative" role="log" aria-live="off">
            {messages.length === 0 && !isStreaming ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                <Bot className="h-16 w-16 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">FinSight Intelligence</h3>
                <p className="text-sm text-[var(--color-text-secondary)] max-w-md mt-2">
                  I have full context of your recent cash flow, category velocity, goals, and health score. How can I assist you today?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
                  <button onClick={() => setInput("Where am I overspending?")} className="p-3 text-sm rounded-xl border border-[var(--color-border-primary)] text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-[var(--color-text-primary)]">"Where am I overspending?"</button>
                  <button onClick={() => setInput("How healthy are my finances?")} className="p-3 text-sm rounded-xl border border-[var(--color-border-primary)] text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-[var(--color-text-primary)]">"How healthy are my finances?"</button>
                  <button onClick={() => setInput("How can I save ₹10,000 in three months?")} className="p-3 text-sm rounded-xl border border-[var(--color-border-primary)] text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-[var(--color-text-primary)]">"How can I save ₹10,000 in three months?"</button>
                  <button onClick={() => setInput("What categories increased this month?")} className="p-3 text-sm rounded-xl border border-[var(--color-border-primary)] text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-[var(--color-text-primary)]">"What categories increased this month?"</button>
                  <button onClick={() => setInput("Summarize my financial health.")} className="p-3 text-sm rounded-xl border border-[var(--color-border-primary)] text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-[var(--color-text-primary)]">"Summarize my financial health."</button>
                  <button onClick={() => setInput("What would happen if my salary increased by ₹10,000?")} className="p-3 text-sm rounded-xl border border-[var(--color-border-primary)] text-left hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all font-medium text-[var(--color-text-primary)]">"What if my salary increased by ₹10,000?"</button>
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((m, idx) => (
                  <AiMessageRow key={`msg-${idx}`} message={m} />
                ))}
              </AnimatePresence>
            )}
            
            {isStreaming && streamContent && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex gap-4 w-full flex-row"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 bg-[var(--color-success)] text-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="px-4 py-3 rounded-2xl max-w-[85%] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-tl-none border border-[var(--color-border-primary)] shadow-sm">
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{streamContent}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
            
            {isStreaming && !streamContent && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex gap-4 w-full flex-row"
               >
                 <div className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 bg-[var(--color-success)] text-white shadow-sm">
                   <Bot className="h-5 w-5" />
                 </div>
                 <div className="flex items-center px-4 py-3 rounded-2xl bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-tl-none border border-[var(--color-border-primary)] shadow-sm">
                   <div className="flex space-x-1" aria-hidden="true">
                     <motion.div className="w-1.5 h-1.5 bg-[var(--color-text-secondary)] rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                     <motion.div className="w-1.5 h-1.5 bg-[var(--color-text-secondary)] rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                     <motion.div className="w-1.5 h-1.5 bg-[var(--color-text-secondary)] rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                   </div>
                   <span className="sr-only">AI is typing...</span>
                 </div>
               </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]">
            <form onSubmit={handleSend} className="flex items-center gap-2 bg-[var(--color-bg-secondary)] p-1.5 rounded-full border border-[var(--color-border-primary)]">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={config?.hasApiKey ? "Ask FinSight..." : "Configure AI to start chatting..."}
                disabled={!config?.hasApiKey || isStreaming}
                className="flex-1 bg-transparent px-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none placeholder:text-[var(--color-text-secondary)] disabled:opacity-50"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                disabled={!input.trim() || !config?.hasApiKey || isStreaming}
                className="p-2 rounded-full bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-secondary)] disabled:opacity-50 transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {configOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div 
            ref={configModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="config-modal-title"
            tabIndex={-1}
            className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-xl shadow-[var(--shadow-drawer)] w-full max-w-md p-6 flex flex-col gap-4 outline-none"
          >
            <h2 id="config-modal-title" className="text-xl font-bold text-[var(--color-text-primary)]">AI Engine Configuration</h2>
            
            <form onSubmit={handleConfigSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">Provider</label>
                <select 
                  value={provider} 
                  onChange={e => setProvider(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                >
                  <option value="groq">Groq (Ultra-fast)</option>
                  <option value="openai">OpenAI</option>
                  <option value="custom">Custom (OpenAI Compatible)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">API Key (AES-256 Encrypted)</label>
                <input 
                  type="password" 
                  required 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)} 
                  placeholder="gsk_..."
                  className="w-full h-10 px-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">Model</label>
                <input 
                  required 
                  value={selectedModel} 
                  onChange={e => setSelectedModel(e.target.value)} 
                  placeholder="llama3-8b-8192"
                  className="w-full h-10 px-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]" onClick={() => setConfigOpen(false)}>Cancel</button>
                <button type="submit" disabled={saveConfig.isPending} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white disabled:opacity-50">
                  Save Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
