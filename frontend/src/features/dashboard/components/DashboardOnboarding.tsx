import React, { useState } from 'react';
import { Upload, Target, Bot, Database, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiClient } from '../../../lib/axios.js';

export function DashboardOnboarding() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadDemo = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/demo/seed');
      await queryClient.invalidateQueries();
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mb-12"
      >
        <div className="mx-auto w-16 h-16 bg-[var(--color-ai-bg)] border border-[var(--color-ai-muted)] rounded-2xl flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-[var(--color-ai-accent)]" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">Welcome to FinSight</h2>
        <p className="text-lg text-[var(--color-text-secondary)]">
          Your intelligent financial analytics workspace is ready. Let's get some data flowing to unlock deterministic insights, health scoring, and AI coaching.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link 
          to="/import" 
          className="group flex flex-col p-6 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-strong)] hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-[var(--color-success-muted)] rounded-xl flex items-center justify-center mb-4 text-[var(--color-success)]">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 flex items-center">
            Import Transactions <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Upload a CSV from your bank to securely parse and categorize your real financial history.</p>
        </Link>

        <Link 
          to="/goals" 
          className="group flex flex-col p-6 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-strong)] hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-[var(--color-ai-bg)] rounded-xl flex items-center justify-center mb-4 text-[var(--color-ai-accent)]">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 flex items-center">
            Create First Goal <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Set a target for an emergency fund, vacation, or new laptop and let FinSight track your progress.</p>
        </Link>

        <Link 
          to="/ai-coach" 
          className="group flex flex-col p-6 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-strong)] hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-[var(--color-ai-bg)] rounded-xl flex items-center justify-center mb-4 text-[var(--color-ai-accent)]">
            <Bot className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 flex items-center">
            Configure AI Coach <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Set up your Groq or OpenAI API key to enable instant, privacy-focused financial intelligence.</p>
        </Link>

        <button 
          onClick={handleLoadDemo}
          disabled={isLoading}
          className="group flex flex-col p-6 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-strong)] hover:shadow-md transition-all text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-[var(--color-warning-muted)] rounded-xl flex items-center justify-center mb-4 text-[var(--color-warning)]">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 flex items-center">
            {isLoading ? 'Loading Workspace...' : 'Load Demo Workspace'} <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Instantly populate FinSight with 6 months of realistic synthetic data to explore all features immediately.</p>
        </button>
      </div>
    </div>
  );
}
