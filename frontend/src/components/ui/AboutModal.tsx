import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { X, Compass } from 'lucide-react';
import { useProductTour } from '../../features/tour/useProductTour.js';
import { GradientCard } from './gradient-card.js';

export function AboutModal() {
  const { isAboutModalOpen, setAboutModalOpen } = useUiStore();
  const modalRef = useFocusTrap(isAboutModalOpen);
  const { startTour } = useProductTour();
  const navigate = useNavigate();

  if (!isAboutModalOpen) return null;

  const cardData = [
    {
      badgeText: "Local-First / Encrypted",
      badgeColor: "#F59E0B",
      title: "Privacy First Engine",
      description: "All financial processing runs locally. Your raw transaction data is never continuously ingested by external proprietary LLMs.",
      ctaText: "Learn about Privacy",
      ctaHref: "#",
      imageUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-CVv0qK2DYZbOAQP2LboVFgQGt0UMfB.png&w=320&q=75",
      gradient: "orange" as const,
    },
    {
      badgeText: "Grounded Analytics",
      badgeColor: "#8B5CF6",
      title: "Deterministic AI",
      description: "Grounded on pre-calculated aggregations to eliminate hallucinations and give exact, trustworthy financial insights.",
      ctaText: "Try AI Coach",
      ctaHref: "/ai-coach",
      imageUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-5i9EDsbgEZk9k7NBeKt3ImNXkx0F66.png&w=320&q=75",
      gradient: "purple" as const,
      onCtaClick: () => {
        setAboutModalOpen(false);
        navigate('/ai-coach');
      }
    },
    {
      badgeText: "Zero Floating Loss",
      badgeColor: "#10B981",
      title: "Precision Ledger",
      description: "Built with minor integer unit calculations to prevent rounding drift across multi-currency accounts and transactions.",
      ctaText: "View Ledgers",
      ctaHref: "/transactions",
      imageUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Q24CTBwBqnBrGujxuykBW9GfOYTdeE.png&w=320&q=75",
      gradient: "green" as const,
      onCtaClick: () => {
        setAboutModalOpen(false);
        navigate('/transactions');
      }
    },
    {
      badgeText: "Guided Experience",
      badgeColor: "#6B7280",
      title: "Interactive Product Tour",
      description: "Step-by-step walkthrough highlighting FinSight's real-time analytics, budgeting goals, and intelligent coach.",
      ctaText: "Start Interactive Tour",
      ctaHref: "#",
      imageUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-5WJZLkaCfLUnCYpgNz89tPx5C4KYgJ.png&w=320&q=75",
      gradient: "gray" as const,
      onCtaClick: () => {
        setAboutModalOpen(false);
        startTour();
      }
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-overlay)] flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        tabIndex={-1}
        className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-3xl shadow-2xl w-full max-w-4xl p-0 flex flex-col overflow-hidden outline-none max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-primary)] shrink-0">
          <div>
            <h2 id="about-modal-title" className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">About FinSight</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Intelligent Financial Analytics & Architecture Pillars</p>
          </div>
          <button 
            onClick={() => setAboutModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Modal Body with GradientCard Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 scrollbar-none">
          <p className="text-xs sm:text-sm text-[var(--color-text-primary)] leading-relaxed font-medium">
            FinSight is an advanced personal finance platform built for deterministic analytics, strict privacy, and explainable AI insights. Explore our core architectural pillars below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {cardData.map((card, index) => (
              <GradientCard
                key={index}
                badgeText={card.badgeText}
                badgeColor={card.badgeColor}
                title={card.title}
                description={card.description}
                ctaText={card.ctaText}
                ctaHref={card.ctaHref}
                imageUrl={card.imageUrl}
                gradient={card.gradient}
                {...(card.onCtaClick ? { onCtaClick: card.onCtaClick } : {})}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
