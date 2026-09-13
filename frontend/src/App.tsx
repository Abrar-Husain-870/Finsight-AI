import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers/index.js';
import { SystemBanners } from './components/ui/SystemBanners.js';
import { AppShell } from './components/layout/AppShell.js';
import { AuthGuard } from './features/auth/components/AuthGuard.js';
import { GuestGuard } from './features/auth/components/GuestGuard.js';
import { MotionConfig } from 'framer-motion';

// Eager Pages (Authentication & Error boundaries)
import LoginPage from './pages/auth/LoginPage.js';
import RegisterPage from './pages/auth/RegisterPage.js';
import OAuthSuccessPage from './pages/auth/OAuthSuccessPage.js';
import NotFoundPage from './pages/NotFoundPage.js';

// Lazy Loaded Protected Routes
const DashboardPage = React.lazy(() => import('./pages/DashboardPage.js'));
const TransactionsPage = React.lazy(() => import('./pages/transactions/TransactionsPage.js'));
const ImportPage = React.lazy(() => import('./pages/import/ImportPage.js'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage.js'));
const HealthPage = React.lazy(() => import('./pages/HealthPage.js'));
const GoalsPage = React.lazy(() => import('./pages/GoalsPage.js'));
const BudgetPage = React.lazy(() => import('./pages/BudgetPage.js'));
const SimulationPage = React.lazy(() => import('./pages/SimulationPage.js'));
const AiCoachPage = React.lazy(() => import('./pages/AiCoachPage.js'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.js'));

const PageFallback = ({ name }: { name: string }) => (
  <div className="p-6 h-full flex items-center justify-center text-sm text-[var(--color-text-secondary)]">
    <span className="animate-pulse">Loading {name}...</span>
  </div>
);

const LandingPage = React.lazy(() => import('./pages/LandingPage.js'));

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProviders>
        <SystemBanners />
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/landing" element={
              <GuestGuard>
                <React.Suspense fallback={<PageFallback name="Landing" />}>
                  <LandingPage />
                </React.Suspense>
              </GuestGuard>
            } />

            <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
            <Route path="/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />
            
            <Route path="/auth/success" element={<GuestGuard><OAuthSuccessPage /></GuestGuard>} />

            {/* Protected App Routes */}
            <Route path="/" element={<AuthGuard><AppShell /></AuthGuard>}>
              <Route path="/" element={
                <React.Suspense fallback={<PageFallback name="Dashboard" />}>
                  <DashboardPage />
                </React.Suspense>
              } />
              <Route path="/transactions" element={
                <React.Suspense fallback={<PageFallback name="Transactions" />}>
                  <TransactionsPage />
                </React.Suspense>
              } />
              
              <Route path="/import" element={
                <React.Suspense fallback={<PageFallback name="Import" />}>
                  <ImportPage />
                </React.Suspense>
              } />
              
              <Route path="/analytics" element={
                <React.Suspense fallback={<PageFallback name="Analytics" />}>
                  <AnalyticsPage />
                </React.Suspense>
              } />
              
              <Route path="/health" element={
                <React.Suspense fallback={<PageFallback name="Health" />}>
                  <HealthPage />
                </React.Suspense>
              } />
              
              <Route path="/goals" element={
                <React.Suspense fallback={<PageFallback name="Goals" />}>
                  <GoalsPage />
                </React.Suspense>
              } />

              <Route path="/budget" element={
                <React.Suspense fallback={<PageFallback name="Budget" />}>
                  <BudgetPage />
                </React.Suspense>
              } />
              
              <Route path="/simulation" element={
                <React.Suspense fallback={<PageFallback name="Simulation" />}>
                  <SimulationPage />
                </React.Suspense>
              } />
              
              <Route path="/ai-coach" element={
                <React.Suspense fallback={<PageFallback name="AI Coach" />}>
                  <AiCoachPage />
                </React.Suspense>
              } />
              
              <Route path="settings" element={
                <React.Suspense fallback={<PageFallback name="Settings" />}>
                  <SettingsPage />
                </React.Suspense>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProviders>
    </MotionConfig>
  );
}
