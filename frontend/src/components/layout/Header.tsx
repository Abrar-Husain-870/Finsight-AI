import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../providers/ThemeProvider.js';
import { Moon, Sun, LogOut, Settings, User, ChevronDown, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { authApi } from '../../features/auth/api/auth.api.js';
import { useAuthStore } from '../../features/auth/store/auth.store.js';
import { useUiStore } from '../../store/uiStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Header() {
  const clearAuth = useAuthStore(s => s.clearAuth);
  const user = useAuthStore(s => s.user);
  const { theme, setTheme } = useTheme();
  const setMobileMenuOpen = useUiStore(s => s.setMobileMenuOpen);
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === '[') {
        event.preventDefault();
        toggleSidebar();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    clearAuth();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-x-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] lg:hidden"
          aria-label="Open mobile menu"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:flex -ml-2.5 sm:-ml-4 p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
          title={sidebarCollapsed ? "Expand Sidebar (⌘[)" : "Collapse Sidebar (⌘[)"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>

        <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)] lg:hidden">FinSight</span>
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
        
        {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-x-3 p-1 rounded-full hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
            >
              <div className="h-8 w-8 rounded-full bg-[var(--color-ai-bg)] border border-[var(--color-ai-muted)] overflow-hidden flex items-center justify-center text-[var(--color-ai-accent)] font-semibold text-sm">
                {user?.picture ? <img src={user.picture} alt="Avatar" className="h-full w-full object-cover"/> : user?.name?.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="h-4 w-4 text-[var(--color-text-secondary)] hidden sm:block" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] shadow-[var(--shadow-dropdown)] focus:outline-none overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{user?.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="group flex items-center px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <User className="mr-3 h-4 w-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="group flex items-center px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <Settings className="mr-3 h-4 w-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors" />
                      Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-[var(--color-border-primary)] py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="group flex w-full items-center px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-muted)] transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-[var(--color-danger)]" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
    </header>
  );
}
