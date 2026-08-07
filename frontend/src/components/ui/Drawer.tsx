import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { AnimatePresence, motion } from 'framer-motion';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts.js';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const drawerRef = useFocusTrap(isOpen);

  useKeyboardShortcuts({
    'escape': () => {
      if (isOpen) onClose();
    }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className={cn(
              "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--color-bg-primary)] shadow-[var(--shadow-drawer)] flex flex-col",
              "border-l border-[var(--color-border-primary)] outline-none"
            )}>
            <div className="flex items-center justify-between border-b border-[var(--color-border-primary)] px-6 py-4">
              <h2 id="drawer-title" className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h2>
              <button 
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
