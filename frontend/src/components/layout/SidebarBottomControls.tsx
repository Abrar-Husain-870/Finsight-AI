import React, { useState } from 'react';
import { useUiStore } from '../../store/uiStore.js';
import { Presentation, Database, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/axios.js';

export function SidebarBottomControls() {
  const { presentationMode, setPresentationMode, setAboutModalOpen } = useUiStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleLoadDemo = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/demo/seed');
      await queryClient.invalidateQueries();
      window.location.href = '/'; // hard reload to reset all states
    } catch (err) {
      console.error('Failed to load demo workspace', err);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="mt-auto pt-4 flex flex-col gap-2">
      {showConfirm ? (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
              This will replace all your current data with the realistic demo dataset.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowConfirm(false)}
              disabled={isLoading}
              className="flex-1 text-xs px-2 py-1.5 rounded bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={handleLoadDemo}
              disabled={isLoading}
              className="flex-1 text-xs px-2 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium disabled:opacity-50"
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
          presentationMode ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]"
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
