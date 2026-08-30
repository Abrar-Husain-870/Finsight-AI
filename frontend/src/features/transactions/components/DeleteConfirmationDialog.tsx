import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button.js';
import { useFocusTrap } from '../../../hooks/useFocusTrap.js';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts.js';

interface DeleteDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmationDialog({ isOpen, onConfirm, onCancel, isDeleting }: DeleteDialogProps) {
  const dialogRef = useFocusTrap(isOpen);
  useKeyboardShortcuts({ escape: onCancel });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-[var(--color-overlay)] backdrop-blur-sm animate-in fade-in" onClick={onCancel} />
      <div 
        ref={dialogRef}
        tabIndex={-1}
        className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 scale-100 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] p-6 shadow-2xl animate-in zoom-in-95 fade-in focus:outline-none"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-[var(--color-danger-muted)] p-3 text-[var(--color-danger)]">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Delete Transaction?</h3>
          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            This action cannot be undone. This transaction will be permanently removed from your records.
          </p>
          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={onConfirm}
              isLoading={isDeleting}
              disabled={isDeleting}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
