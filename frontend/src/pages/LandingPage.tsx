import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FeatureShowcase, type TabMedia, type ShowcaseStep } from '../components/ui/feature-showcase.js';
import { SaasTemplateSection } from '../components/ui/saa-s-template.js';
import Hero10 from '../components/ui/hero-10.js';
import { FeaturedCrmDemoSection } from '../components/ui/featured-crm-demo-section.js';
import { Stats2 } from '../components/ui/stats-2.js';
import { Compare2 } from '../components/ui/compare-2.js';
import { TestimonialsSection } from '../components/ui/testimonials-3.js';
import FAQs from '../components/ui/text-reveal-faqs.js';
import { authApi } from '../features/auth/api/auth.api.js';
import { useAuthStore } from '../features/auth/store/auth.store.js';
import { useTheme } from '../providers/ThemeProvider.js';
import { Button } from '../components/ui/Button.js';
import { ShieldCheck, TrendingUp, PieChart, Wallet, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import overviewImg from '../Public/Overview.webp';
import incomeImg from '../Public/Income.jpg';
import abstractImg from '../Public/Abstract.jpg';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      const data = await authApi.demoLogin();
      setAuth(data.user, data.accessToken);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const steps: ShowcaseStep[] = [
    {
      id: "step-1",
      title: "Bring your finances together",
      text: "Keep your income, expenses and financial activity organised in one place.",
    },
    {
      id: "step-2",
      title: "Understand where your money goes",
      text: "See spending patterns, category breakdowns and cash flow without digging through spreadsheets.",
    },
    {
      id: "step-3",
      title: "Make better financial decisions",
      text: "Use clear insights and financial goals to stay on track with what matters to you.",
    },
  ];

  const tabs: TabMedia[] = [
    {
      value: "overview",
      label: "Overview",
      src: overviewImg,
      alt: "FinSight Overview",
    },
    {
      value: "income",
      label: "Income",
      src: incomeImg,
      alt: "FinSight Income",
    },
    {
      value: "analytics",
      label: "Analytics",
      src: abstractImg,
      alt: "FinSight Analytics",
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col justify-between">
      {/* Pre-login Header */}
      <header className="border-b border-[var(--color-border-primary)] px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] flex items-center justify-center font-bold text-xl shadow-xs">
              F
            </div>
            <span className="font-bold text-xl tracking-tight">FinSight</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
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
            <div className="h-5 w-px bg-[var(--color-border-primary)]" aria-hidden="true" />
            <Link 
              to="/login" 
              className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2 py-1.5"
            >
              Sign in
            </Link>
            <Button size="sm" onClick={handleDemoLogin} isLoading={isLoading}>
              Try Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section 1: Feature Showcase */}
        <div className="w-full flex items-center py-6 sm:py-10 border-b border-[var(--color-border-primary)]">
          <FeatureShowcase
            eyebrow="Personal Finance, Simplified"
            title="Know where your money stands"
            description="Track your income, expenses and savings in one calm, organised workspace. FinSight turns your financial activity into a clear picture of where your money goes and how you're doing."
            stats={["One clear view", "Real-time insights", "Built for your finances"]}
            steps={steps}
            tabs={tabs}
            defaultTab="overview"
            panelMinHeight={520}
            primaryActionLabel="Get started with FinSight"
            primaryActionTo="/register"
            secondaryActionLabel={isLoading ? "Logging in..." : "Explore FinSight"}
            secondaryActionTo="#"
            onSecondaryAction={handleDemoLogin}
          />
        </div>

        {/* Hero Section 2: SaaS Showcase Template Section */}
        <div className="w-full border-b border-[var(--color-border-primary)]">
          <SaasTemplateSection
            badgeText="FinSight v2.0 is live"
            badgeLinkText="Explore smart insights"
            onBadgeLinkClick={handleDemoLogin}
            title={
              <>
                Give your financial future <br className="hidden sm:inline" />
                the clarity it deserves
              </>
            }
            description="Track spending, analyze monthly cash flow, and achieve your financial goals with bank-grade privacy and automated insights."
            primaryActionLabel={isLoading ? "Logging in..." : "Explore Dashboard Demo"}
            onPrimaryAction={handleDemoLogin}
          />
        </div>

        {/* Hero Section 3: Hero10 Fan Showcase */}
        <Hero10
          title="A clearer view of your finances"
          titleLine2Prefix="for"
          titleHighlight="better financial decisions"
          description="See where your money goes, track your financial health, and stay in control without the noise."
          socialProof="Everything you need. Nothing you don't."
          images={[
            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop',
          ]}
          imageAlts={['Financial calculations', 'Digital banking interface', 'Growth & analytics dashboard']}
          animation="subtle"
          primaryCTA={{
            ctaEnabled: true,
            text: 'Get Started',
            onClick: () => navigate('/register'),
            variant: 'default',
            size: 'lg',
          }}
          secondaryCTA={{
            ctaEnabled: true,
            text: isLoading ? 'Logging in...' : 'See how it works',
            onClick: handleDemoLogin,
            variant: 'outline',
            size: 'lg',
          }}
          variant="standard"
        />

        {/* Hero Section 4: Video Demo & Feature Showcase Section */}
        <FeaturedCrmDemoSection />

        {/* Hero Section 5: Feature Comparison Section ("Why Us") */}
        <Compare2 />

        {/* Hero Section 6: Testimonials Section */}
        <TestimonialsSection />

        {/* Hero Section 7: Stats2 Capability & Trust Showcase */}
        <Stats2 onPrimaryAction={() => navigate('/register')} />

        {/* Hero Section 6: FAQs Section */}
        <FAQs />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-primary)] py-6 text-xs text-[var(--color-text-secondary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} FinSight. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--color-text-secondary)]" />
            <span>Bank-grade privacy & local data encryption</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
