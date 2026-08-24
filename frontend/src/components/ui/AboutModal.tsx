import React from 'react';
import { useUiStore } from '../../store/uiStore.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { X, Shield, Cpu, Code2, Zap, Compass } from 'lucide-react';
import { useProductTour } from '../../features/tour/useProductTour.js';

export function AboutModal() {
  const { isAboutModalOpen, setAboutModalOpen } = useUiStore();
  const modalRef = useFocusTrap(isAboutModalOpen);
  const { startTour } = useProductTour();

  if (!isAboutModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--color-overlay)] flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        tabIndex={-1}
        className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-xl shadow-[var(--shadow-drawer)] w-full max-w-2xl p-0 flex flex-col overflow-hidden outline-none"
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-primary)]">
          <div>
            <h2 id="about-modal-title" className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">FinSight</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Intelligent Financial Analytics</p>
          </div>
          <button 
            onClick={() => setAboutModalOpen(false)}
            className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6">
          <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
            FinSight is an advanced personal finance platform designed for deterministic analytics, strict privacy, and explainable AI insights. Built as a comprehensive final year engineering project.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
              <div className="flex items-center gap-2 mb-2 text-[var(--color-ai-accent)]">
                <Shield className="h-5 w-5" />
                <h3 className="font-semibold text-[var(--color-text-primary)]">Privacy First</h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                All AI interactions are locally configured. Your raw transaction data is never continuously ingested by proprietary LLMs.
              </p>
            </div>
            
            <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
              <div className="flex items-center gap-2 mb-2 text-[var(--color-success)]">
                <Cpu className="h-5 w-5" />
                <h3 className="font-semibold text-[var(--color-text-primary)]">Deterministic AI</h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                AI insights are strictly grounded. The AI engine only sees pre-calculated deterministic aggregations, preventing hallucinations.
              </p>
            </div>
            
            <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
              <div className="flex items-center gap-2 mb-2 text-[var(--color-ai-accent)]">
                <Code2 className="h-5 w-5" />
                <h3 className="font-semibold text-[var(--color-text-primary)]">Architecture</h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Built with React, Express, Prisma, and Tailwind. Implements precision math via minor integer units to avoid floating-point loss.
              </p>
            </div>
            
            <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
              <div className="flex items-center gap-2 mb-2 text-[var(--color-warning)]">
                <Zap className="h-5 w-5" />
                <h3 className="font-semibold text-[var(--color-text-primary)]">Performance</h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Optimized React Query caching, paginated data tables, debounced search, and highly normalized SQL schemas.
              </p>
            </div>
          </div>
          
          <div className="bg-[var(--color-ai-bg)] p-4 rounded-lg mt-2 border border-[var(--color-ai-muted)]">
            <h4 className="text-sm font-semibold text-[var(--color-ai-accent)] mb-1">Presentation Features</h4>
            <ul className="text-sm text-[var(--color-text-secondary)] space-y-1 list-disc list-inside mb-4">
              <li>Load Demo Workspace dynamically populates realistic 6-month historical data.</li>
              <li>Presentation Mode optimizes visual density for projecting.</li>
              <li>Guided product tour highlights core architecture.</li>
            </ul>
            <button
              onClick={() => {
                setAboutModalOpen(false);
                startTour();
              }}
              className="flex items-center justify-center w-full gap-2 py-2 px-4 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] font-medium hover:bg-[var(--color-accent-secondary)] transition-colors"
            >
              <Compass className="h-4 w-4" /> Start Interactive Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
