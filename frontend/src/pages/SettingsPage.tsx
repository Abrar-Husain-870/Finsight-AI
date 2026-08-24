import React, { useState } from 'react';
import { useAuthStore } from '../features/auth/store/auth.store.js';
import { useTheme } from '../providers/ThemeProvider.js';
import { User, Moon, Sun, ShieldAlert, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { emitSystemAlert } from '../lib/errors.js';
import { authApi } from '../features/auth/api/auth.api.js';
import { motion } from 'framer-motion';

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' }
];

export default function SettingsPage() {
  const user = useAuthStore(s => s.user);
  const accessToken = useAuthStore(s => s.accessToken);
  const setAuth = useAuthStore(s => s.setAuth);
  const { theme, setTheme } = useTheme();
  const [isClearing, setIsClearing] = useState(false);
  const [isUpdatingCurrency, setIsUpdatingCurrency] = useState(false);

  const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    if (!user || !accessToken) return;
    
    setIsUpdatingCurrency(true);
    try {
      const updatedUser = await authApi.updateProfile({ currency: newCurrency });
      setAuth(updatedUser, accessToken);
    } catch (err) {
      console.error(err);
      emitSystemAlert("Failed to update currency", "error");
    } finally {
      setIsUpdatingCurrency(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm("Are you absolutely sure? This will delete all your transactions, goals, and AI configurations. This action cannot be undone.")) return;
    
    setIsClearing(true);
    try {
      emitSystemAlert("Data clearance is currently restricted in this environment.", "warning");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex flex-col p-6 sm:p-10 max-w-3xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">Manage your account preferences and application settings.</p>
      </div>

      <div className="flex flex-col gap-16">
        {/* Profile Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
              <User className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Account Information</h2>
          </div>
          
          <div className="flex flex-col rounded-[var(--radius-xl)] bg-[var(--color-bg-secondary)]/30 border border-[var(--color-border-primary)]/50 overflow-hidden backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-primary)]/50">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Full Name</span>
              <span className="text-sm text-[var(--color-text-secondary)]">{user?.name}</span>
            </div>
            
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-primary)]/50">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Email Address</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-secondary)]">{user?.email}</span>
                <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
              </div>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">Preferred Currency</span>
                <span className="text-xs text-[var(--color-text-secondary)] mt-0.5">Used across all charts and metrics</span>
              </div>
              <select 
                value={user?.currency || 'USD'} 
                onChange={handleCurrencyChange}
                disabled={isUpdatingCurrency}
                className="bg-transparent border-none text-right text-sm text-[var(--color-text-primary)] font-medium focus:outline-none cursor-pointer hover:text-[var(--color-accent-primary)] transition-colors disabled:opacity-50"
              >
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value} className="bg-[var(--color-bg-primary)]">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
              <Sun className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Appearance</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`relative flex items-start gap-4 p-5 rounded-[var(--radius-xl)] transition-all overflow-hidden ${
                theme === 'light' 
                  ? 'bg-[var(--color-bg-secondary)] border-transparent shadow-sm' 
                  : 'bg-transparent border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)]/50'
              }`}
            >
              {theme === 'light' && (
                <motion.div layoutId="theme-active" className="absolute inset-0 border-2 border-[var(--color-text-primary)] rounded-[var(--radius-xl)] pointer-events-none" />
              )}
              <Sun className={`h-5 w-5 mt-0.5 ${theme === 'light' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`} />
              <div className="flex flex-col text-left">
                <span className={`font-medium ${theme === 'light' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-primary)]'}`}>Light</span>
                <span className="text-xs text-[var(--color-text-secondary)] mt-1">Clean and bright aesthetics</span>
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`relative flex items-start gap-4 p-5 rounded-[var(--radius-xl)] transition-all overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-[var(--color-bg-secondary)] border-transparent shadow-sm' 
                  : 'bg-transparent border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)]/50'
              }`}
            >
              {theme === 'dark' && (
                <motion.div layoutId="theme-active" className="absolute inset-0 border-2 border-[var(--color-text-primary)] rounded-[var(--radius-xl)] pointer-events-none" />
              )}
              <Moon className={`h-5 w-5 mt-0.5 ${theme === 'dark' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`} />
              <div className="flex flex-col text-left">
                <span className={`font-medium ${theme === 'dark' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-primary)]'}`}>Dark</span>
                <span className="text-xs text-[var(--color-text-secondary)] mt-1">Easy on the eyes, cinematic feel</span>
              </div>
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-danger)]">Danger Zone</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-[var(--radius-xl)] bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/20 shadow-sm gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Clear Workspace Data</span>
              <span className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-md leading-relaxed">
                Permanently delete all your transactions, goals, and AI configurations. This action cannot be undone and will reset your entire financial workspace.
              </span>
            </div>
            <Button 
              variant="danger" 
              onClick={handleClearData} 
              isLoading={isClearing}
              className="shrink-0 rounded-full"
            >
              <Trash2 className="h-4 w-4 mr-2" /> 
              Clear Workspace
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
