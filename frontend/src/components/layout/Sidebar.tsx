import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils.js';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarBottomControls } from './SidebarBottomControls.js';
import { useUiStore } from '../../store/uiStore.js';
import { SidebarNav } from '../ui/dashboard-sidebar.js';

export function Sidebar() {
  const { mobileMenuOpen, setMobileMenuOpen, sidebarCollapsed } = useUiStore();
  const [activeWorkspace, setActiveWorkspace] = useState('FinSight Personal');
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-[width] duration-300 ease-in-out border-r border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] overflow-hidden",
          sidebarCollapsed ? "lg:w-[72px]" : "lg:w-72"
        )} 
        aria-label="Sidebar"
      >
        <div className="flex grow flex-col gap-y-3 overflow-y-auto overflow-x-hidden px-1 pb-4">
          <div className="pt-2">
            <SidebarNav
              className="w-full border-none bg-transparent p-0"
              activePath={location.pathname}
              activeWorkspace={activeWorkspace}
              onWorkspaceSelect={setActiveWorkspace}
              collapsed={sidebarCollapsed}
            />
          </div>
          <SidebarBottomControls collapsed={sidebarCollapsed} />
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="relative z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[var(--color-overlay)] backdrop-blur-xs"
            />
            <div className="fixed inset-0 flex">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="relative mr-16 flex w-full max-w-xs flex-1 flex-col bg-[var(--color-bg-primary)] px-4 pb-4 pt-5 border-r border-[var(--color-border-primary)] shadow-2xl"
              >
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">FinSight</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-2 flex flex-1 flex-col overflow-y-auto">
                  <SidebarNav
                    className="w-full border-none bg-transparent p-0"
                    activePath={location.pathname}
                    onSelect={() => setMobileMenuOpen(false)}
                    activeWorkspace={activeWorkspace}
                    onWorkspaceSelect={setActiveWorkspace}
                    collapsed={false}
                  />
                  <SidebarBottomControls collapsed={false} />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
