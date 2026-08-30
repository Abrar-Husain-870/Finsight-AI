import React, { useState, useEffect, useRef } from 'react';
import { useAiConfig, useSaveAiConfig, useChatSessions, useChatSession } from '../features/ai/hooks/useAi.js';
import { Bot, User, Send, Settings, MessageSquare, Plus, Shield, Cpu, Activity, Info, Target } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';
import { Button } from '../components/ui/Button.js';
import { Input as CustomInput } from '../components/ui/Input.js';

import { useAuthStore } from '../features/auth/store/auth.store.js';
import { apiClient } from '../lib/axios.js';

const AiMessageRow = React.memo(({ message }: { message: { role: string; content: string } }) => {
  const isUser = message.role === 'user';
  const proseStyle = {
    '--tw-prose-body': isUser ? 'var(--color-accent-primary-foreground)' : 'var(--color-text-primary)',
    '--tw-prose-headings': isUser ? 'var(--color-accent-primary-foreground)' : 'var(--color-text-primary)',
    '--tw-prose-bold': isUser ? 'var(--color-accent-primary-foreground)' : 'var(--color-text-primary)',
    '--tw-prose-code': isUser ? 'var(--color-accent-primary-foreground)' : 'var(--color-text-primary)',
    '--tw-prose-bullets': isUser ? 'var(--color-accent-primary-foreground)' : 'var(--color-text-primary)',
    '--tw-prose-invert-body': isUser ? 'var(--color-accent-primary-foreground)' : 'var(--color-text-primary)',
    '--tw-prose-invert-headings': isUser ? 'var(--color-accent-primary-foreground)' : 'var(--color-text-primary)',
    '--tw-prose-invert-bold': isUser ? 'var(--color-accent-primary-foreground)' : 'var(--color-text-primary)',
  } as React.CSSProperties;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-4 w-full", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div className={cn("flex items-center justify-center h-8 w-8 rounded-full shrink-0", isUser ? "bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] shadow-sm" : "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm")}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-[var(--color-ai-accent)]" />}
      </div>
      <div className={cn("px-5 py-3.5 max-w-[85%] shadow-sm", isUser ? "bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] rounded-2xl rounded-tr-sm" : "bg-[var(--color-ai-bg)] text-[var(--color-text-primary)] rounded-2xl rounded-tl-sm border border-[var(--color-ai-accent)]/20")}>
        <div className="text-sm prose prose-sm max-w-none leading-relaxed" style={proseStyle}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
});

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
    if (sessions && sessions.length > 0 && sessions[0]?.id && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

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
      let token = useAuthStore.getState().accessToken;
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

      let response = await fetch(`${baseURL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ content: userMessage, sessionId: activeSessionId })
      });

      if (response.status === 401) {
        try {
          const { data: refreshRes } = await apiClient.post('/auth/refresh');
          const newToken = refreshRes.data.accessToken;
          const store = useAuthStore.getState();
          if (store.user) {
            store.setAuth(store.user, newToken);
          }
          response = await fetch(`${baseURL}/ai/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`
            },
            credentials: 'include',
            body: JSON.stringify({ content: userMessage, sessionId: activeSessionId })
          });
        } catch (refreshErr) {
          useAuthStore.getState().clearAuth(true);
          throw new Error('Your session has expired. Please log in again.');
        }
      }

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
    <div className="flex h-full flex-col p-6 sm:p-10 max-w-[1400px] mx-auto w-full gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">AI Financial Coach</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Your personal intelligence agent running on strict deterministic data pipelines.</p>
        </div>
        <button 
          onClick={() => setConfigOpen(true)}
          className={cn("px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-colors", 
            config?.hasApiKey 
              ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary-hover)] hover:text-[var(--color-text-primary)]" 
              : "bg-[var(--color-danger)]/10 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20"
          )}
        >
          <Settings className="h-4 w-4" />
          {config?.hasApiKey ? 'Engine Configured' : 'Configure Engine'}
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-bg-secondary)]/50 text-xs font-medium text-[var(--color-text-secondary)] backdrop-blur-sm">
          <Cpu className="h-3.5 w-3.5" /> Explainable AI
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-bg-secondary)]/50 text-xs font-medium text-[var(--color-text-secondary)] backdrop-blur-sm">
          <Shield className="h-3.5 w-3.5" /> Privacy First
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-bg-secondary)]/50 text-xs font-medium text-[var(--color-text-secondary)] backdrop-blur-sm">
          <Activity className="h-3.5 w-3.5" /> Deterministic Analytics
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden min-h-[500px]">
        {/* Sidebar */}
        <div className="w-64 flex flex-col gap-6 overflow-y-auto hidden md:flex shrink-0">
          <button 
            onClick={() => setActiveSessionId(undefined)}
            className="w-full flex items-center gap-3 py-2.5 px-4 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm font-medium hover:bg-[var(--color-bg-secondary-hover)] transition-colors border border-transparent hover:border-[var(--color-border-primary)]/50"
          >
            <div className="bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] rounded-full p-1">
              <Plus className="h-3 w-3" />
            </div>
            New Chat
          </button>
          
          <div className="flex flex-col gap-1">
            <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 px-2">Recent Sessions</div>
            {sessions?.map(s => (
              <button 
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={cn("flex items-center gap-3 text-sm p-2.5 rounded-[var(--radius-md)] text-left truncate transition-all", 
                  activeSessionId === s.id ? "bg-[var(--color-bg-secondary)]/70 font-medium text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]/40 hover:text-[var(--color-text-primary)]"
                )}
              >
                <MessageSquare className={cn("h-4 w-4 shrink-0", activeSessionId === s.id ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)]/70")} />
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div 
          className="flex-1 flex flex-col bg-[var(--color-bg-secondary)]/10 rounded-2xl overflow-hidden relative shadow-sm border border-[var(--color-border-primary)]/20"
          role="region"
          aria-label="Chat messages"
        >
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 relative scroll-smooth" role="log" aria-live="off">
            {messages.length === 0 && !isStreaming ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 mb-6 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center shadow-sm">
                  <Bot className="h-8 w-8 text-[var(--color-accent-primary)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">FinSight Intelligence</h3>
                <p className="text-sm text-[var(--color-text-secondary)] max-w-md mt-2">
                  I have full context of your recent cash flow, category velocity, goals, and health score. How can I assist you today?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 w-full max-w-2xl px-4">
                  <button onClick={() => setInput("Where am I overspending?")} className="p-4 text-sm rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]/50 text-left hover:border-[var(--color-accent-primary)]/50 hover:shadow-md transition-all font-medium text-[var(--color-text-primary)] group flex flex-col gap-2">
                    <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-primary)] transition-colors"><Info className="h-4 w-4" /></span>
                    "Where am I overspending?"
                  </button>
                  <button onClick={() => setInput("How healthy are my finances?")} className="p-4 text-sm rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]/50 text-left hover:border-[var(--color-accent-primary)]/50 hover:shadow-md transition-all font-medium text-[var(--color-text-primary)] group flex flex-col gap-2">
                    <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-primary)] transition-colors"><Activity className="h-4 w-4" /></span>
                    "How healthy are my finances?"
                  </button>
                  <button onClick={() => setInput("How can I save ₹10,000 in three months?")} className="p-4 text-sm rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]/50 text-left hover:border-[var(--color-accent-primary)]/50 hover:shadow-md transition-all font-medium text-[var(--color-text-primary)] group flex flex-col gap-2">
                    <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-primary)] transition-colors"><Target className="h-4 w-4" /></span>
                    "How can I save ₹10,000 in three months?"
                  </button>
                  <button onClick={() => setInput("What categories increased this month?")} className="p-4 text-sm rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]/50 text-left hover:border-[var(--color-accent-primary)]/50 hover:shadow-md transition-all font-medium text-[var(--color-text-primary)] group flex flex-col gap-2">
                    <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-primary)] transition-colors"><Activity className="h-4 w-4" /></span>
                    "What categories increased this month?"
                  </button>
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
                <div className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="px-5 py-3.5 max-w-[85%] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-2xl rounded-tl-sm border border-[var(--color-border-primary)]/50 shadow-sm">
                  <div 
                    className="text-sm prose prose-sm max-w-none leading-relaxed"
                    style={{
                      '--tw-prose-body': 'var(--color-text-primary)',
                      '--tw-prose-headings': 'var(--color-text-primary)',
                      '--tw-prose-bold': 'var(--color-text-primary)',
                      '--tw-prose-code': 'var(--color-text-primary)',
                      '--tw-prose-bullets': 'var(--color-text-primary)',
                      '--tw-prose-invert-body': 'var(--color-text-primary)',
                      '--tw-prose-invert-headings': 'var(--color-text-primary)',
                      '--tw-prose-invert-bold': 'var(--color-text-primary)',
                    } as React.CSSProperties}
                  >
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
                 <div className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm">
                   <Bot className="h-5 w-5" />
                 </div>
                 <div className="flex items-center px-5 py-4 rounded-2xl bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-tl-sm border border-[var(--color-border-primary)]/50 shadow-sm">
                   <div className="flex space-x-1.5" aria-hidden="true">
                     <motion.div className="w-1.5 h-1.5 bg-[var(--color-text-secondary)]/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                     <motion.div className="w-1.5 h-1.5 bg-[var(--color-text-secondary)]/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                     <motion.div className="w-1.5 h-1.5 bg-[var(--color-text-secondary)]/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                   </div>
                   <span className="sr-only">AI is typing...</span>
                 </div>
               </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-transparent">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2 bg-[var(--color-bg-primary)] p-2 rounded-[var(--radius-lg)] border border-[var(--color-border-primary)] shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-accent-primary)]/20 focus-within:border-[var(--color-accent-primary)]/50 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={config?.hasApiKey ? "Message FinSight Intelligence..." : "Configure AI to start chatting..."}
                disabled={!config?.hasApiKey || isStreaming}
                className="flex-1 bg-transparent px-4 py-2 text-[15px] text-[var(--color-text-primary)] focus:outline-none placeholder:text-[var(--color-text-secondary)] disabled:opacity-50"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                disabled={!input.trim() || !config?.hasApiKey || isStreaming}
                className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] hover:bg-[var(--color-accent-secondary)] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {configOpen && (
        <div className="fixed inset-0 bg-[var(--color-overlay)] flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div 
            ref={configModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="config-modal-title"
            tabIndex={-1}
            className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-drawer)] w-full max-w-md p-8 flex flex-col gap-6 outline-none"
          >
            <h2 id="config-modal-title" className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">AI Engine Configuration</h2>
            
            <form onSubmit={handleConfigSave} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Provider</label>
                <select 
                  value={provider} 
                  onChange={e => setProvider(e.target.value)}
                  className="flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-colors"
                >
                  <option value="groq">Groq (Ultra-fast)</option>
                  <option value="openai">OpenAI</option>
                  <option value="custom">Custom (OpenAI Compatible)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">API Key (AES-256 Encrypted)</label>
                <CustomInput 
                  type="password" 
                  required 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)} 
                  placeholder="gsk_..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Model</label>
                <CustomInput 
                  required 
                  value={selectedModel} 
                  onChange={e => setSelectedModel(e.target.value)} 
                  placeholder="llama3-8b-8192"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={() => setConfigOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saveConfig.isPending} isLoading={saveConfig.isPending}>
                  Save Engine
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
