import React, { useState } from 'react';
import { useUiStore } from '../../store/uiStore.js';
import { Presentation, Database, Info, AlertTriangle, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/axios.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function SidebarBottomControls({ collapsed = false }: { collapsed?: boolean }) {
  const { presentationMode, setPresentationMode, setAboutModalOpen, sidebarCollapsed, toggleSidebar } = useUiStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLoadDemo = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/demo/seed');
      await queryClient.resetQueries();
      toast.success('Demo workspace loaded successfully');
      navigate('/');
    } catch (err) {
      console.error('Failed to load demo workspace', err);
      toast.error('Failed to seed demo workspace');
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  if (collapsed) {
    return (
      <div className="mt-auto pt-4 flex flex-col items-center gap-2">
        <button
          onClick={handleLoadDemo}
          title="Load Demo Workspace"
          disabled={isLoading}
          className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <Database className="h-5 w-5" />
        </button>

        <button
          onClick={() => setPresentationMode(!presentationMode)}
          title={presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
          className={cn(
            "p-2 rounded-lg transition-colors",
            presentationMode ? "bg-[var(--color-ai-bg)] text-[var(--color-ai-accent)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
          )}
        >
          <Presentation className="h-5 w-5" />
        </button>

        <button
          onClick={() => setAboutModalOpen(true)}
          title="About FinSight"
          className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <Info className="h-5 w-5" />
        </button>

        <button
          onClick={toggleSidebar}
          title="Expand Sidebar"
          className="mt-2 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-[var(--color-text-primary)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-[var(--color-border-primary)]"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-auto pt-4 flex flex-col gap-2">
      {showConfirm ? (
        <div className="p-3 bg-[var(--color-warning-muted)] rounded-lg border border-[var(--color-warning)]/30">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-[var(--color-warning)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--color-warning)] font-medium">
              This will replace all your current data with the realistic demo dataset.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowConfirm(false)}
              disabled={isLoading}
              className="flex-1 text-xs px-2 py-1.5 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleLoadDemo}
              disabled={isLoading}
              className="flex-1 text-xs px-2 py-1.5 rounded bg-[var(--color-warning)] text-white font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Loading...' : 'Confirm'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] w-full text-left cursor-pointer"
        >
          <Database className="h-5 w-5 shrink-0" />
          Load Demo Workspace
        </button>
      )}

      <button
        onClick={() => setPresentationMode(!presentationMode)}
        className={cn(
          "flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] w-full text-left cursor-pointer",
          presentationMode ? "bg-[var(--color-ai-bg)] text-[var(--color-ai-accent)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
        )}
      >
        <Presentation className="h-5 w-5 shrink-0" />
        {presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
      </button>

      <button
        onClick={() => setAboutModalOpen(true)}
        className="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] w-full text-left cursor-pointer"
      >
        <Info className="h-5 w-5 shrink-0" />
        About FinSight
      </button>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors w-full text-left cursor-pointer mt-1 border-t border-[var(--color-border-primary)]/50 pt-2"
      >
        <span className="flex items-center gap-x-3">
          <PanelLeftClose className="h-5 w-5 shrink-0" />
          Collapse Sidebar
        </span>
        <kbd className="text-[10px] font-mono font-bold bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--color-border-primary)]">⌘[</kbd>
      </button>
    </div>
  );
}
