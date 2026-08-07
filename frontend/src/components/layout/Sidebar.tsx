import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils.js';
import { Home, PieChart, Activity, Target, Receipt, Upload, Settings, Calculator, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { SidebarBottomControls } from './SidebarBottomControls.js';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'Financial Health', href: '/health', icon: Activity },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Import', href: '/import', icon: Upload },
  { name: 'Simulation', href: '/simulation', icon: Calculator },
  { name: 'AI Coach', href: '/ai-coach', icon: Bot },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const prefetchRoute = (href: string) => {
  switch(href) {
    case '/import': void import('../../pages/import/ImportPage.js'); break;
    case '/analytics': void import('../../pages/AnalyticsPage.js'); break;
    case '/health': void import('../../pages/HealthPage.js'); break;
    case '/goals': void import('../../pages/GoalsPage.js'); break;
    case '/simulation': void import('../../pages/SimulationPage.js'); break;
    case '/ai-coach': void import('../../pages/AiCoachPage.js'); break;
  }
};

export function Sidebar() {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col" aria-label="Sidebar">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">FinSight</span>
        </div>
        <nav aria-label="Main Navigation" className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      onMouseEnter={() => prefetchRoute(item.href)}
                      className={({ isActive }) =>
                        cn(
                          isActive
                            ? 'text-[var(--color-text-primary)]'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                          'relative group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active"
                              className="absolute inset-0 rounded-md bg-[var(--color-bg-primary)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border-primary)]"
                              initial={false}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <div className="relative flex items-center gap-x-3 z-10 w-full">
                            <item.icon
                              className={cn(
                                isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]',
                                'h-6 w-6 shrink-0 transition-colors'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </div>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <SidebarBottomControls />
        </nav>
      </div>
    </aside>
  );
}
