import React, { useState, useEffect, useRef } from 'react';
import { useAiConfig, useSaveAiConfig, useChatSessions, useChatSession, useDeleteChatSession } from '../features/ai/hooks/useAi.js';
import { Settings, MessageSquare, Plus, Shield, Cpu, Activity, TrendingDown, Target, Receipt, Loader2, Maximize2, Minimize2, History, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js';
import { Button } from '../components/ui/Button.js';
import { Input as CustomInput } from '../components/ui/Input.js';
import { AnimatedAIChat, type CommandSuggestion } from '../components/ui/animated-ai-chat.js';
import { FinSightLogo } from '../components/ui/FinSightLogo.js';

import { useAuthStore } from '../features/auth/store/auth.store.js';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { apiClient, getBaseUrl } from '../lib/axios.js';

export default function AiCoachPage() {
  const { symbol, currency } = useCurrency();
  const isINR = currency === 'INR';
  const saveExampleAmount = isINR ? '₹10,000' : `${symbol}1,000`;
  const queryClient = useQueryClient();
  const { data: config, isLoading: configLoading } = useAiConfig();
  const { data: sessions, isLoading: sessionsLoading } = useChatSessions();
  const saveConfig = useSaveAiConfig();
  const deleteSession = useDeleteChatSession();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { data: activeSession } = useChatSession(activeSessionId || undefined);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const [configOpen, setConfigOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSessionsDrawer, setShowSessionsDrawer] = useState(false);
  const [provider, setProvider] = useState('groq');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('qwen/qwen3.8-27b');

  const configModalRef = useFocusTrap(configOpen);
  const hasInitializedSession = useRef(false);

  useEffect(() => {
    if (config) {
      if (config.provider) setProvider(config.provider);
      if (config.selectedModel) setSelectedModel(config.selectedModel);
    }
  }, [config]);

  useKeyboardShortcuts({
    'escape': () => {
      if (configOpen) setConfigOpen(false);
      else if (isFullscreen) setIsFullscreen(false);
    }
  });

  // Automatically select the latest session once on initial page load if available
  useEffect(() => {
    if (!hasInitializedSession.current && sessions && sessions.length > 0 && sessions[0]?.id) {
      setActiveSessionId(sessions[0].id);
      hasInitializedSession.current = true;
    }
  }, [sessions]);

  // Sync messages when active session changes or when New Chat is selected
  useEffect(() => {
    if (activeSessionId && activeSession) {
      setMessages(activeSession.messages.map(m => ({ role: m.role, content: m.content })));
    } else if (!activeSessionId) {
      setMessages([]);
    }
  }, [activeSession, activeSessionId]);

  const handleNewChat = () => {
    if (isStreaming) return;
    setActiveSessionId(null);
    setMessages([]);
    setStreamContent('');
  };

  const handleSelectSession = (id: string) => {
    if (isStreaming) return;
    setActiveSessionId(id);
    setStreamContent('');
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isStreaming) return;

    deleteSession.mutate(id, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['ai', 'session', id] });
        if (activeSessionId === id) {
          setActiveSessionId(null);
          setMessages([]);
          setStreamContent('');
        }
      }
    });
  };

  const financialSuggestions: CommandSuggestion[] = [
    { 
      icon: <TrendingDown className="w-4 h-4 text-neutral-400 dark:text-neutral-300" />, 
      label: "Overspending", 
      description: "Where am I overspending?", 
      prefix: "/overspending" 
    },
    { 
      icon: <Activity className="w-4 h-4 text-neutral-400 dark:text-neutral-300" />, 
      label: "Health Score", 
      description: "How healthy are my finances?", 
      prefix: "/health" 
    },
    { 
      icon: <Target className="w-4 h-4 text-neutral-400 dark:text-neutral-300" />, 
      label: "Savings Target", 
      description: "How can I save ₹10,000 in three months?", 
      prefix: "/savings" 
    },
    { 
      icon: <Receipt className="w-4 h-4 text-neutral-400 dark:text-neutral-300" />, 
      label: "Category Velocity", 
      description: "What categories increased this month?", 
      prefix: "/trends" 
    },
  ];

  if (configLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
          <FinSightLogo className="h-6 w-6 animate-pulse" />
          <span>Loading AI Coach...</span>
        </div>
      </div>
    );
  }

  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig.mutate({ provider, apiKey, selectedModel }, {
      onSuccess: () => setConfigOpen(false)
    });
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isStreaming) return;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsStreaming(true);
    setStreamContent('');

    try {
      let token = useAuthStore.getState().accessToken;
      const baseURL = getBaseUrl();

      let response = await fetch(`${baseURL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ content: userMessage, sessionId: activeSessionId || undefined })
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
            body: JSON.stringify({ content: userMessage, sessionId: activeSessionId || undefined })
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
      let fullAssistantText = '';

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
                setActiveSessionId(newSessionId);
                queryClient.invalidateQueries({ queryKey: ['ai', 'sessions'] });
              } else if (data.type === 'chunk') {
                fullAssistantText += data.text;
                setStreamContent(prev => prev + data.text);
              } else if (data.type === 'done') {
                // stream finished
              } else if (data.type === 'error') {
                console.error('AI Stream Error:', data.message);
                fullAssistantText += `\n\n**Error:** ${data.message}`;
                setStreamContent(prev => prev + `\n\n**Error:** ${data.message}`);
              }
            }
          }
        }
      }

      setIsStreaming(false);
      setMessages(prev => {
        const updated = [...prev, { role: 'assistant', content: fullAssistantText }];
        if (newSessionId) {
          queryClient.invalidateQueries({ queryKey: ['ai', 'session', newSessionId] });
        }
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

  const renderSessionsList = () => (
    <div className="flex flex-col gap-1">
      {sessionsLoading && (
        <div className="text-xs text-[var(--color-text-secondary)] py-2 px-2 flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Loading sessions...</span>
        </div>
      )}

      {sessions?.map(s => {
        const isSelected = activeSessionId === s.id;
        const isDeleting = deleteSession.isPending && deleteSession.variables === s.id;

        return (
          <div 
            key={s.id}
            role="button"
            tabIndex={0}
            onClick={() => handleSelectSession(s.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectSession(s.id);
              }
            }}
            className={cn(
              "group relative flex items-center justify-between gap-2 text-xs sm:text-sm py-2 px-2.5 rounded-lg transition-colors cursor-pointer w-full text-left", 
              isSelected 
                ? "bg-neutral-200/80 dark:bg-white/10 text-[var(--color-text-primary)] font-semibold shadow-xs" 
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-neutral-100 dark:hover:bg-white/5",
              isDeleting && "opacity-50 pointer-events-none"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <MessageSquare className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isSelected ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
              )} />
              <span className="truncate">{s.title || "Untitled Session"}</span>
            </div>

            <button
              type="button"
              aria-label="Delete session"
              title="Delete session"
              disabled={isDeleting || isStreaming}
              onClick={(e) => handleDeleteSession(e, s.id)}
              className={cn(
                "p-1 rounded-md transition-all shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100",
                "text-neutral-400 hover:text-red-500 hover:bg-red-500/10 dark:text-neutral-400 dark:hover:text-red-400 dark:hover:bg-red-500/10",
                isDeleting && "opacity-100"
              )}
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        );
      })}

      {!sessionsLoading && (!sessions || sessions.length === 0) && (
        <div className="text-xs text-[var(--color-text-secondary)] py-2 px-2.5">
          No recent sessions
        </div>
      )}
    </div>
  );

  const renderConfigModal = () => (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div 
        ref={configModalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="config-modal-title"
        tabIndex={-1}
        className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 flex flex-col gap-5 outline-none"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FinSightLogo className="h-6 w-6 rounded-md shadow-xs" />
            <h2 id="config-modal-title" className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">AI Engine Configuration</h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Provide your API key to activate the intelligent AI coach. Your keys are encrypted locally with AES-256.
          </p>
        </div>
        
        <form onSubmit={handleConfigSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Provider</label>
            <select 
              value={provider} 
              onChange={e => {
                setProvider(e.target.value);
                if (e.target.value === 'groq') setSelectedModel('qwen/qwen3.8-27b');
                else if (e.target.value === 'openai') setSelectedModel('gpt-4o');
              }}
              className="flex h-10 w-full rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-border-hover)] transition-colors"
            >
              <option value="groq">Groq (Ultra-fast Cloud Engine)</option>
              <option value="openai">OpenAI (GPT-4o)</option>
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
              className="rounded-xl bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)] text-[var(--color-text-primary)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pl-1">Model Name</label>
            <CustomInput 
              required 
              value={selectedModel} 
              onChange={e => setSelectedModel(e.target.value)} 
              placeholder="qwen/qwen3.8-27b"
              className="rounded-xl bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)] text-[var(--color-text-primary)]"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={() => setConfigOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saveConfig.isPending} isLoading={saveConfig.isPending} className="bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:opacity-90">
              Save Engine
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  {/* Fullscreen Workspace: Covers the entire section under the header and right of the sidebar */}
  if (isFullscreen) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-[var(--color-bg-primary)] dark:bg-neutral-950">
        {/* Fullscreen Header Bar */}
        <div id="ai-coach-header" className="scroll-mt-24 shrink-0 h-13 px-4 sm:px-6 flex items-center justify-between border-b border-[var(--color-border-primary)] dark:border-white/10 bg-[var(--color-bg-secondary)]/50 dark:bg-neutral-900/60 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            {/* Toggle Sessions Drawer */}
            <button
              type="button"
              onClick={() => setShowSessionsDrawer(prev => !prev)}
              title={showSessionsDrawer ? "Hide Sessions" : "Show Recent Sessions"}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 border",
                showSessionsDrawer
                  ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-[var(--color-border-primary)] shadow-xs"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] border-transparent"
              )}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Sessions</span>
            </button>

            {/* New Chat */}
            <button
              type="button"
              onClick={handleNewChat}
              title="Start New Chat"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            <div className="h-4 w-px bg-[var(--color-border-primary)] dark:border-neutral-800" />

            {/* Title & Status */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">AI Financial Coach</span>
              <span className="hidden md:inline text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                Full Workspace
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setConfigOpen(true)}
              className="hidden sm:flex px-3 py-1.5 text-xs font-medium rounded-lg items-center gap-1.5 transition-colors cursor-pointer bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)]"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>{config?.id && config.id !== 'default' && config.hasApiKey ? 'Custom Engine' : 'Groq Qwen-27B'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              title="Exit Full Screen (Esc)"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 shadow-xs"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              <span>Exit Full Screen</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1 py-0.5 rounded bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 ml-0.5">Esc</kbd>
            </button>
          </div>
        </div>

        {/* Workspace Body under Header and right of Sidebar */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* Collapsible Left Sessions Drawer */}
          {showSessionsDrawer && (
            <div className="w-64 shrink-0 border-r border-[var(--color-border-primary)] dark:border-white/10 bg-[var(--color-bg-secondary)]/70 dark:bg-neutral-900/60 backdrop-blur-xl p-3.5 flex flex-col overflow-y-auto z-20">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Recent Sessions
                </span>
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="p-1 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] transition-colors cursor-pointer"
                  title="New Chat"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {renderSessionsList()}
            </div>
          )}

          {/* Full Screen Chat area occupying the entire remaining section */}
          <div id="ai-coach-chat" className="scroll-mt-24 flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
            <AnimatedAIChat
              messages={messages}
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              streamContent={streamContent}
              placeholder={config?.hasApiKey ? "Message FinSight Intelligence..." : "Ask FinSight Coach anything (configure engine to chat)..."}
              suggestions={financialSuggestions}
              title="How can I help today?"
              subtitle="I have full context of your recent cash flow, category velocity, goals, and health score."
              botName="FinSight"
              disabled={isStreaming}
              isFullscreen={true}
              onToggleFullscreen={() => setIsFullscreen(false)}
              showFullscreenButton={false}
            />
          </div>
        </div>

        {/* Engine Configuration Modal */}
        {configOpen && renderConfigModal()}
      </div>
    );
  }

  {/* Standard Padded Two-Column Layout */}
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 sm:p-8 max-w-[1400px] mx-auto w-full gap-6 overflow-hidden">
      {/* Top Header Bar */}
      <div className="shrink-0 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">AI Financial Coach</h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Your personal intelligence agent running on strict deterministic data pipelines.
          </p>
          
          {/* Architecture Pillars: Explainable AI | Privacy First | Deterministic Analytics */}
          <div className="flex items-center gap-6 mt-4 text-xs text-[var(--color-text-secondary)] font-medium">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
              <span>Explainable AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
              <span>Deterministic Analytics</span>
            </div>
          </div>
        </div>

        {/* Header Actions: Full Screen Toggle & Engine Configuration */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsFullscreen(true)}
            title="Expand chatbot to full section"
            className="px-3.5 py-2 text-xs sm:text-sm font-medium rounded-full flex items-center gap-2 transition-colors cursor-pointer shrink-0 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)]"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Full Screen</span>
          </button>

          {/* Configure Engine Button */}
          <button 
            type="button"
            onClick={() => setConfigOpen(true)}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-full flex items-center gap-2 transition-colors cursor-pointer shrink-0 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)]"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>{config?.id && config.id !== 'default' && config.hasApiKey ? 'Custom Engine Configured' : 'Default: Groq Qwen-27B'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex gap-8 min-h-0 overflow-hidden">
        {/* Left Column: New Chat & Recent Sessions */}
        <div className="w-52 sm:w-56 shrink-0 flex flex-col overflow-y-auto pr-2">
          {/* + New Chat Button */}
          <button 
            type="button"
            onClick={handleNewChat}
            className={cn(
              "flex items-center gap-2.5 text-sm font-semibold transition-all cursor-pointer mb-6 px-3 py-2 rounded-xl w-full text-left",
              !activeSessionId 
                ? "bg-neutral-200/80 dark:bg-white/10 text-[var(--color-text-primary)] shadow-xs" 
                : "text-[var(--color-text-primary)] hover:bg-neutral-100 dark:hover:bg-white/5 opacity-90 hover:opacity-100"
            )}
          >
            <span className="w-5 h-5 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] flex items-center justify-center font-bold text-xs shrink-0">
              <Plus className="w-3.5 h-3.5 text-[var(--color-bg-primary)] stroke-[3]" />
            </span>
            <span>New Chat</span>
          </button>
          
          {/* RECENT SESSIONS */}
          <div className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 px-1">
            RECENT SESSIONS
          </div>

          {renderSessionsList()}
        </div>

        {/* Right Column: Framed Chatbot Panel with Sleek Border & Soft Glow Background */}
        <div className="flex-1 flex flex-col min-w-0 h-full rounded-2xl border border-neutral-200/90 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/60 backdrop-blur-xl shadow-xs dark:shadow-2xl overflow-hidden relative">
          <AnimatedAIChat
            messages={messages}
            onSendMessage={handleSendMessage}
            isStreaming={isStreaming}
            streamContent={streamContent}
            placeholder={config?.hasApiKey ? "Message FinSight Intelligence..." : "Ask FinSight Coach anything (configure engine to chat)..."}
            suggestions={financialSuggestions}
            title="How can I help today?"
            subtitle="I have full context of your recent cash flow, category velocity, goals, and health score."
            botName="FinSight"
            disabled={isStreaming}
            isFullscreen={false}
            onToggleFullscreen={() => setIsFullscreen(true)}
            showFullscreenButton={true}
          />
        </div>
      </div>

      {/* Engine Configuration Modal */}
      {configOpen && renderConfigModal()}
    </div>
  );
}
