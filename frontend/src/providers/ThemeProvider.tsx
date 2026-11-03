import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

type Theme = 'dark' | 'light' | 'system';
type Density = 'compact' | 'comfortable';

interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  density: Density;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setDensity: (density: Density) => void;
}

const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'dark',
  density: 'comfortable',
  setTheme: () => null,
  toggleTheme: () => null,
  setDensity: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'finsight-ui-theme',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        return stored;
      }
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
    const initial =
      (typeof window !== 'undefined' ? (localStorage.getItem(storageKey) as Theme | null) : null) || defaultTheme;
    return initial === 'system' ? getSystemTheme() : (initial === 'light' ? 'light' : 'dark');
  });

  const [density, setDensity] = useState<Density>('comfortable');

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      const active = theme === 'system' ? getSystemTheme() : theme;
      root.classList.remove('light', 'dark');
      root.classList.add(active);
      setResolvedTheme(active);
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }

    return undefined;
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme);
      }
      setThemeState(newTheme);
    },
    [storageKey]
  );

  const toggleTheme = useCallback(() => {
    const currentEffective = theme === 'system' ? getSystemTheme() : theme;
    const nextTheme = currentEffective === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      density,
      setTheme,
      toggleTheme,
      setDensity,
    }),
    [theme, resolvedTheme, density, setTheme, toggleTheme]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
