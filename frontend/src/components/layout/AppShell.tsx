import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { Header } from './Header.js';
import { AnimatePresence, motion } from 'framer-motion';
import { pageTransitionVariants } from '../../lib/motion.js';
import { KeyboardShortcutsDialog } from '../ui/KeyboardShortcutsDialog.js';
import { AboutModal } from '../ui/AboutModal.js';
import { useUiStore } from '../../store/uiStore.js';
import { cn } from '../../lib/utils.js';
import { useAuthStore } from '../../features/auth/store/auth.store.js';

export function AppShell() {
  const location = useLocation();
  const { presentationMode, sidebarCollapsed } = useUiStore();
  const currency = useAuthStore(s => s.user?.currency || 'USD');

  return (
    <div
      className="min-h-screen bg-[var(--color-bg-secondary)]"
      data-presentation={presentationMode ? 'true' : 'false'}
      style={{ '--sidebar-offset': sidebarCollapsed ? '72px' : '288px' } as React.CSSProperties}
    >
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-[var(--color-bg-primary)] focus:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:rounded-md shadow-md"
      >
        Skip to main content
      </a>
      <Sidebar />
      <div 
        className={cn(
          "flex flex-col min-h-screen transition-[padding] duration-300 ease-in-out",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-72"
        )}
      >
        <Header />
        <main id="main-content" className="flex-1 flex flex-col min-w-0" tabIndex={-1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${location.pathname}-${currency}`}
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <KeyboardShortcutsDialog />
        <AboutModal />
      </div>
    </div>
  );
}
