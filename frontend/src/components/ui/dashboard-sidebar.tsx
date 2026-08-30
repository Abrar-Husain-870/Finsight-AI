"use client";

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Receipt, 
  Activity, 
  Target, 
  Upload,
  Calculator,
  Bot,
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
  X,
  CreditCard,
  Building2,
  UserCheck
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useAuthStore } from '../../features/auth/store/auth.store.js';

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  path?: string;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

export const finsightNavGroups: NavGroupData[] = [
  {
    items: [
      { id: 'search', title: 'Quick Search', icon: Search, shortcut: '⌘K' },
      { id: 'home', title: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { id: 'transactions', title: 'Transactions', icon: Receipt, path: '/transactions', badge: '5' },
      { id: 'analytics', title: 'Analytics', icon: Activity, path: '/analytics' },
    ]
  },
  {
    heading: 'Financial Management',
    items: [
      { 
        id: 'health', 
        title: 'Financial Health', 
        icon: ShieldCheck,
        path: '/health',
        children: [
          { id: 'h-score', title: 'Health Score', icon: ShieldCheck, path: '/health' },
        ]
      },
      { 
        id: 'goals', 
        title: 'Goals & Savings', 
        icon: Target,
        path: '/goals',
        children: [
          { id: 'g-active', title: 'Active Milestones', icon: Target, path: '/goals' },
        ]
      },
      { id: 'import', title: 'Import Ledgers', icon: Upload, path: '/import' },
      { id: 'simulation', title: 'Simulation', icon: Calculator, path: '/simulation' },
      { id: 'ai-coach', title: 'AI Financial Coach', icon: Bot, path: '/ai-coach', badge: 'AI' },
    ]
  }
];

export const finsightBottomItems: NavItemData[] = [
  { id: 'settings', title: 'Settings', icon: Settings, path: '/settings', shortcut: '⌘,' },
  { id: 'logout', title: 'Log out', icon: LogOut },
];

function WorkspaceSwitcher({ 
  selected, 
  onSelect,
  collapsed = false
}: { 
  selected?: string; 
  onSelect?: (ws: string) => void;
  collapsed?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState('FinSight Personal');
  
  const current = selected || internalSelected;
  const handleSelect = onSelect || setInternalSelected;

  const workspaces = [
    { name: 'FinSight Personal', plan: 'Pro Account', icon: UserCheck },
    { name: 'Family Vault', plan: 'Shared Vault', icon: CreditCard },
    { name: 'Business Ledger', plan: 'Enterprise', icon: Building2 },
  ];

  if (collapsed) {
    return (
      <div className="flex justify-center mb-3">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          title={current}
          className="w-9 h-9 rounded-xl bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer hover:scale-105 transition-transform"
        >
          {current.charAt(0)}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2.5 py-2 mb-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors select-none group border border-[var(--color-border-primary)]/50"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
            {current.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-bold leading-none mb-1 text-[var(--color-text-primary)] truncate max-w-[130px]">{current}</span>
            <span className="text-[10px] text-[var(--color-text-secondary)] font-medium leading-none">FinSight Pro</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors shrink-0" strokeWidth={1.5} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[52px] left-0 w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-xl shadow-xl z-50 py-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
            {workspaces.map(ws => (
              <div 
                key={ws.name}
                onClick={() => { handleSelect(ws.name); setIsOpen(false); }}
                className={`px-3 py-2 mx-1 text-[12px] rounded-lg cursor-pointer flex items-center justify-between transition-colors ${current === ws.name ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-bold' : 'text-[var(--color-text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--color-text-primary)]'}`}
              >
                <div className="flex items-center gap-2">
                  <ws.icon className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                  <span>{ws.name}</span>
                </div>
                <span className="text-[10px] font-semibold opacity-60">{ws.plan}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function NavItem({ 
  item, 
  activePath, 
  onSelect,
  level = 0,
  collapsed = false
}: { 
  item: NavItemData; 
  activePath: string; 
  onSelect: (item: NavItemData) => void;
  level?: number;
  collapsed?: boolean;
}) {
  const isActive = item.path ? (item.path === '/' ? activePath === '/' : activePath.startsWith(item.path)) : false;
  const hasChildren = !!item.children;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren && !collapsed) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item);
    }
  };

  if (collapsed) {
    return (
      <div 
        title={item.title + (item.badge ? ` (${item.badge})` : '')}
        onClick={handleClick}
        className={`group relative flex items-center justify-center w-10 h-10 mx-auto rounded-xl cursor-pointer transition-all duration-200 select-none
          ${isActive 
            ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-2xs border border-[var(--color-border-primary)] font-bold' 
            : 'text-[var(--color-text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--color-text-primary)]'
          }
        `}
      >
        <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
        {item.badge && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[var(--color-bg-primary)]" />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div 
        className={`group flex items-center justify-between px-2.5 py-[7px] rounded-lg cursor-pointer transition-all duration-200 select-none
          ${isActive 
            ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-bold shadow-2xs border border-[var(--color-border-primary)]' 
            : 'text-[var(--color-text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--color-text-primary)]'
          }
        `}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2.5">
          <item.icon 
            className={`w-[16px] h-[16px] transition-colors
              ${isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'}
            `} 
            strokeWidth={1.5} 
          />
          <span className="text-[13px] tracking-wide truncate">
            {item.title}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {item.shortcut && (
             <kbd className="hidden group-hover:inline-flex items-center justify-center h-4 px-1.5 text-[9px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded shadow-2xs">
               {item.shortcut}
             </kbd>
          )}
          {item.badge && (
            <span className="flex items-center justify-center min-w-[18px] h-4 px-1.5 text-[9px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight 
              className={`w-3.5 h-3.5 text-[var(--color-text-secondary)] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
              strokeWidth={2}
            />
          )}
        </div>
      </div>

      {hasChildren && (
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5 mt-0.5">
            <div 
              className="absolute top-0 bottom-0 border-l border-[var(--color-border-primary)] opacity-50"
              style={{ left: `${level * 12 + 17.5}px` }}
            />
            {item.children!.map(child => (
              <NavItem 
                key={child.id} 
                item={child} 
                activePath={activePath} 
                onSelect={onSelect} 
                level={level + 1} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarNav({ 
  className = '',
  activePath,
  onSelect,
  activeWorkspace,
  onWorkspaceSelect,
  collapsed = false
}: { 
  className?: string;
  activePath?: string;
  onSelect?: (item: NavItemData) => void;
  activeWorkspace?: string;
  onWorkspaceSelect?: (ws: string) => void;
  collapsed?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const clearAuth = useAuthStore(s => s.clearAuth);

  const currentPath = activePath !== undefined ? activePath : location.pathname;

  const handleDefaultSelect = (item: NavItemData) => {
    if (item.id === 'logout') {
      clearAuth();
      navigate('/login');
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleSelect = onSelect || handleDefaultSelect;

  return (
    <div className={`flex flex-col h-full bg-[var(--color-bg-primary)] p-3 font-sans transition-all duration-300 ${collapsed ? 'w-16 items-center px-1.5' : 'w-[260px]'} ${className}`}>
      <WorkspaceSwitcher 
        {...(activeWorkspace !== undefined ? { selected: activeWorkspace } : {})} 
        {...(onWorkspaceSelect !== undefined ? { onSelect: onWorkspaceSelect } : {})} 
        collapsed={collapsed}
      />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 mt-1 w-full">
        {finsightNavGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1 w-full">
            {!collapsed && group.heading && (
              <span className="px-2.5 mb-1 text-[10px] font-bold tracking-wider text-[var(--color-text-secondary)] uppercase opacity-70">
                {group.heading}
              </span>
            )}
            {group.items.map(item => (
              <NavItem 
                key={item.id} 
                item={item} 
                activePath={currentPath} 
                onSelect={handleSelect} 
                collapsed={collapsed}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-[var(--color-border-primary)] flex flex-col gap-1 w-full">
        {finsightBottomItems.map(item => (
          <NavItem 
            key={item.id} 
            item={item} 
            activePath={currentPath} 
            onSelect={handleSelect} 
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardSidebarPreview() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState('FinSight Personal');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (item: NavItemData) => {
    if (item.id === 'search') {
      setIsSearchOpen(true);
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="relative w-full h-[700px] bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border-primary)] flex overflow-hidden shadow-xs">
      
      {/* Sidebar Nav */}
      <div 
        className={`h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-[var(--color-bg-primary)] border-r border-[var(--color-border-primary)] ${
          isOpen ? 'w-[260px] opacity-100' : 'w-0 opacity-0 border-none'
        }`}
      >
        <SidebarNav 
          className="w-[260px] border-none bg-transparent" 
          activePath={location.pathname}
          onSelect={handleSelect}
          activeWorkspace={activeWorkspace}
          onWorkspaceSelect={setActiveWorkspace}
        />
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 bg-[var(--color-bg-secondary)]/30 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Top Control Bar */}
        <div className="h-14 border-b border-[var(--color-border-primary)] flex items-center px-4 justify-between bg-[var(--color-bg-primary)] shrink-0">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              {isOpen ? <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />}
            </button>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <span className="truncate font-semibold">{activeWorkspace}</span>
              <span>/</span>
              <span className="font-bold text-[var(--color-text-primary)] truncate">FinSight Ledger</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="px-3 py-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg text-xs text-[var(--color-text-secondary)] flex items-center gap-4 hover:border-[var(--color-border-hover)] cursor-pointer"
            >
              <span>Search transactions & insights...</span>
              <kbd className="text-[10px] font-mono font-bold bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded border border-[var(--color-border-primary)]">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">
            FinSight Workspace Overview
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Collapsible sidebar navigation tailored for personal financial management.
          </p>
        </div>
      </div>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-xs px-4">
          <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
            <div className="flex items-center px-4 border-b border-[var(--color-border-primary)]">
              <Search className="w-[18px] h-[18px] text-[var(--color-text-secondary)] mr-3 shrink-0" strokeWidth={1.5} />
              <input 
                autoFocus
                className="flex-1 bg-transparent py-4 outline-none text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/60"
                placeholder="Search transactions, budgets, goals or reports..."
              />
              <kbd 
                onClick={() => setIsSearchOpen(false)}
                className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 ml-2 text-[10px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded cursor-pointer"
              >
                ESC
              </kbd>
              <button 
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="ml-3 p-1 rounded-md text-[var(--color-text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              >
                <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-2">
               <Command className="w-6 h-6 text-[var(--color-text-secondary)]/50" strokeWidth={1.5} />
               <p className="text-[13px] text-[var(--color-text-secondary)] font-medium">Type to search transactions, category budgets, or financial goals...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
