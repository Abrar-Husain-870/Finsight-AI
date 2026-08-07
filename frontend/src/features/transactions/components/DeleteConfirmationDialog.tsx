import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmationDialog({ isOpen, onConfirm, onCancel, isDeleting }: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={onCancel} />
      <div className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 scale-100 rounded-xl bg-[var(--color-bg-primary)] p-6 shadow-2xl animate-in zoom-in-95 fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Delete Transaction?</h3>
          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            This action cannot be undone. This transaction will be permanently removed from your records.
          </p>
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 rounded-md border border-[var(--color-border-primary)] bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-md bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
