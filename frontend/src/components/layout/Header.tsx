import React from 'react';
import { useTheme } from '../../providers/ThemeProvider.js';
import { Moon, Sun, LogOut } from 'lucide-react';
import { authApi } from '../../features/auth/api/auth.api.js';
import { useAuthStore } from '../../features/auth/store/auth.store.js';
import { motion, AnimatePresence } from 'framer-motion';
export function Header() {
  const clearAuth = useAuthStore(s => s.clearAuth);
  const user = useAuthStore(s => s.user);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    clearAuth();
  };
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]/80 px-4 backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          {/* Global search placeholder */}
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="-m-2.5 p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
            aria-label="Toggle theme"
          >
            <span className="sr-only">Toggle theme</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[var(--color-border-primary)]" aria-hidden="true" />
          
          {/* Profile placeholder */}
          <div className="flex items-center gap-x-4">
            <div className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
              {user?.picture ? <img src={user.picture} alt="Avatar" className="h-full w-full object-cover"/> : null}
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout} 
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors p-1 rounded-full hover:bg-[var(--color-danger)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]" 
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
