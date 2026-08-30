import React, { useState } from 'react';
import { useUiStore } from '../../store/uiStore.js';
import { Presentation, Database, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/axios.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function SidebarBottomControls() {
  const { presentationMode, setPresentationMode, setAboutModalOpen } = useUiStore();
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
              className="flex-1 text-xs px-2 py-1.5 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
            >
              Cancel
            </button>
            <button 
              onClick={handleLoadDemo}
              disabled={isLoading}
              className="flex-1 text-xs px-2 py-1.5 rounded bg-[var(--color-warning)] text-white font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Confirm'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] w-full text-left"
        >
          <Database className="h-5 w-5 shrink-0" />
          Load Demo Workspace
        </button>
      )}

      <button
        onClick={() => setPresentationMode(!presentationMode)}
        className={cn(
          "flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] w-full text-left",
          presentationMode ? "bg-[var(--color-ai-bg)] text-[var(--color-ai-accent)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]"
        )}
      >
        <Presentation className="h-5 w-5 shrink-0" />
        {presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
      </button>

      <button
        onClick={() => setAboutModalOpen(true)}
        className="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] w-full text-left"
      >
        <Info className="h-5 w-5 shrink-0" />
        About FinSight
      </button>
    </div>
  );
}
