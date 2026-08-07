import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers/index.js';
import { SystemBanners } from './components/ui/SystemBanners.js';
import { AppShell } from './components/layout/AppShell.js';
import { AuthLayout } from './components/layout/AuthLayout.js';
import { AuthGuard } from './features/auth/components/AuthGuard.js';
import { GuestGuard } from './features/auth/components/GuestGuard.js';
import { MotionConfig } from 'framer-motion';

// Eager Pages
import DashboardPage from './pages/DashboardPage.js';
import TransactionsPage from './pages/transactions/TransactionsPage.js';
import LoginPage from './pages/auth/LoginPage.js';
import RegisterPage from './pages/auth/RegisterPage.js';
import OAuthSuccessPage from './pages/auth/OAuthSuccessPage.js';
import NotFoundPage from './pages/NotFoundPage.js';

// Lazy Pages
const ImportPage = React.lazy(() => import('./pages/import/ImportPage.js'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage.js'));
const HealthPage = React.lazy(() => import('./pages/HealthPage.js'));
const GoalsPage = React.lazy(() => import('./pages/GoalsPage.js'));
const SimulationPage = React.lazy(() => import('./pages/SimulationPage.js'));
const AiCoachPage = React.lazy(() => import('./pages/AiCoachPage.js'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.js'));

// Placeholder components

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProviders>
        <SystemBanners />
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route element={<GuestGuard><AuthLayout /></GuestGuard>}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            
            <Route path="/auth/success" element={<GuestGuard><OAuthSuccessPage /></GuestGuard>} />

            {/* Protected App Routes */}
            <Route path="/" element={<AuthGuard><AppShell /></AuthGuard>}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              
              <Route path="/import" element={
                <React.Suspense fallback={<div className="p-6 h-full flex items-center justify-center text-sm text-[var(--color-text-secondary)]"><span className="animate-pulse">Loading Import...</span></div>}>
                  <ImportPage />
                </React.Suspense>
              } />
              
              <Route path="/analytics" element={
                <React.Suspense fallback={<div className="p-6 h-full flex items-center justify-center text-sm text-[var(--color-text-secondary)]"><span className="animate-pulse">Loading Analytics...</span></div>}>
                  <AnalyticsPage />
                </React.Suspense>
              } />
              
              <Route path="/health" element={
                <React.Suspense fallback={<div className="p-6 h-full flex items-center justify-center text-sm text-[var(--color-text-secondary)]"><span className="animate-pulse">Loading Health...</span></div>}>
                  <HealthPage />
                </React.Suspense>
              } />
              
              <Route path="/goals" element={
                <React.Suspense fallback={<div className="p-6 h-full flex items-center justify-center text-sm text-[var(--color-text-secondary)]"><span className="animate-pulse">Loading Goals...</span></div>}>
                  <GoalsPage />
                </React.Suspense>
              } />
              
              <Route path="/simulation" element={
                <React.Suspense fallback={<div className="p-6 h-full flex items-center justify-center text-sm text-[var(--color-text-secondary)]"><span className="animate-pulse">Loading Simulation...</span></div>}>
                  <SimulationPage />
                </React.Suspense>
              } />
              
              <Route path="/ai-coach" element={
                <React.Suspense fallback={<div className="p-6 h-full flex items-center justify-center text-sm text-[var(--color-text-secondary)]"><span className="animate-pulse">Loading AI Coach...</span></div>}>
                  <AiCoachPage />
                </React.Suspense>
              } />
              
              <Route path="settings" element={
                <React.Suspense fallback={<div className="p-6 h-full flex items-center justify-center text-sm text-[var(--color-text-secondary)]"><span className="animate-pulse">Loading Settings...</span></div>}>
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
