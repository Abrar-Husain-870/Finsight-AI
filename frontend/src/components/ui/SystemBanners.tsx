import React, { useState, useEffect } from 'react';
import { WifiOff, AlertCircle, X } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus.js';
import { AnimatePresence, motion } from 'framer-motion';

export function SystemBanners() {
  const { isOnline } = useNetworkStatus();
  
  // We can add a global store for system status later if needed. 
  // For now, this is a placeholder that can be triggered by API interceptors.
  const [systemAlert, setSystemAlert] = useState<{ message: string; type: 'warning' | 'error' } | null>(null);

  // Auto-clear system alert after 10s if it's a warning
  useEffect(() => {
    if (systemAlert?.type === 'warning') {
      const timer = setTimeout(() => setSystemAlert(null), 10000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [systemAlert]);

  // Expose a global method to set system alerts for interceptors
  useEffect(() => {
    const handleSystemAlert = (e: CustomEvent) => {
      setSystemAlert(e.detail);
    };
    window.addEventListener('finsight:system-alert', handleSystemAlert as EventListener);
    return () => window.removeEventListener('finsight:system-alert', handleSystemAlert as EventListener);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="w-full bg-[var(--color-danger)] px-4 py-2 text-white flex items-center justify-center gap-2 shadow-md pointer-events-auto"
            role="alert"
          >
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">You are currently offline. Some features may be unavailable.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOnline && systemAlert && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`w-full px-4 py-2 text-white flex items-center justify-center gap-2 shadow-md pointer-events-auto ${
              systemAlert.type === 'error' ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-accent-primary)]'
            }`}
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{systemAlert.message}</span>
            <button 
              onClick={() => setSystemAlert(null)}
              className="ml-4 hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
