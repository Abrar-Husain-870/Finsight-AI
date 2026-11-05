import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { Header } from './Header.js';
import { motion } from 'framer-motion';
import { KeyboardShortcutsDialog } from '../ui/KeyboardShortcutsDialog.js';
import { AboutModal } from '../ui/AboutModal.js';
import { DemoTourController } from '../../features/tour/components/DemoTourController.js';
import { QuickSearchModal } from '../ui/QuickSearchModal.js';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts.js';
import { useUiStore } from '../../store/uiStore.js';
import { cn } from '../../lib/utils.js';

export function AppShell() {
  const location = useLocation();
  const { presentationMode, sidebarCollapsed, toggleQuickSearch, setQuickSearchOpen } = useUiStore();

  useKeyboardShortcuts({
    'ctrl+k': toggleQuickSearch,
    '/': (e) => {
      e.preventDefault();
      setQuickSearchOpen(true);
    },
  });

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
        <main id="main-content" className="flex-1 flex flex-col min-w-0 relative z-0" tabIndex={-1}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex-1 flex flex-col w-full"
          >
            <Outlet />
          </motion.div>
        </main>
        <KeyboardShortcutsDialog />
        <AboutModal />
        <DemoTourController />
        <QuickSearchModal />
      </div>
    </div>
  );
}
