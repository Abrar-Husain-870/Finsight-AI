import React, { useState } from 'react';
import { useAuthStore } from '../features/auth/store/auth.store.js';
import { useTheme } from '../providers/ThemeProvider.js';
import { User, Moon, Sun, Monitor, ShieldAlert, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { emitSystemAlert } from '../lib/errors.js';
import { authApi } from '../features/auth/api/auth.api.js';

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
  const { user, accessToken, setAuth } = useAuthStore(s => ({ 
    user: s.user, 
    accessToken: s.accessToken,
    setAuth: s.setAuth 
  }));
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
    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage your account preferences and application settings.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Profile Section */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Account Information</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Your personal profile details</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Full Name</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Email Address</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{user?.email}</p>
              </div>
              <div className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Verified
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Preferred Currency</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Used across all charts and metrics</p>
              </div>
              <select 
                value={user?.currency || 'USD'} 
                onChange={handleCurrencyChange}
                disabled={isUpdatingCurrency}
                className="p-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-md text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Preferences Section */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Monitor className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Appearance</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Customize how FinSight looks on your device</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-focus)]'}`}
            >
              <Sun className={`h-5 w-5 ${theme === 'light' ? 'text-blue-500' : 'text-[var(--color-text-secondary)]'}`} />
              <div>
                <p className={`font-medium ${theme === 'light' ? 'text-blue-700 dark:text-blue-400' : 'text-[var(--color-text-primary)]'}`}>Light Mode</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Clean and bright</p>
              </div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-focus)]'}`}
            >
              <Moon className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-500' : 'text-[var(--color-text-secondary)]'}`} />
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-blue-700 dark:text-blue-400' : 'text-[var(--color-text-primary)]'}`}>Dark Mode</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Easy on the eyes</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200 dark:border-red-900/30">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Irreversible and destructive actions</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50">
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">Clear Workspace Data</p>
              <p className="text-xs text-red-600 dark:text-red-400/70 mt-1">Permanently delete all transactions and goals.</p>
            </div>
            <Button variant="danger" size="sm" onClick={handleClearData} isLoading={isClearing}>
              <Trash2 className="h-4 w-4 mr-2" /> Clear Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
