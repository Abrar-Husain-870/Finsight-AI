import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { ThemePaletteId, THEME_PALETTES } from '../styles/themes/themeConfig.js';

export type Theme = 'dark' | 'light' | 'system';
export type Density = 'compact' | 'comfortable';
export type { ThemePaletteId };

interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  palette: ThemePaletteId;
  density: Density;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setPalette: (palette: ThemePaletteId) => void;
  setDensity: (density: Density) => void;
}

const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'dark',
  palette: 'default',
  density: 'comfortable',
  setTheme: () => null,
  toggleTheme: () => null,
  setPalette: () => null,
  setDensity: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultPalette = 'default',
  storageKey = 'finsight-ui-theme',
  paletteStorageKey = 'finsight-ui-palette',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultPalette?: ThemePaletteId;
  storageKey?: string;
  paletteStorageKey?: string;
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

  const [palette, setPaletteState] = useState<ThemePaletteId>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(paletteStorageKey) as ThemePaletteId | null;
      if (stored && THEME_PALETTES.some(p => p.id === stored)) {
        return stored;
      }
    }
    return defaultPalette;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
    const initial =
      (typeof window !== 'undefined' ? (localStorage.getItem(storageKey) as Theme | null) : null) || defaultTheme;
    return initial === 'system' ? getSystemTheme() : (initial === 'light' ? 'light' : 'dark');
  });

  const [density, setDensity] = useState<Density>('comfortable');

  // Sync mode (light / dark)
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

  // Sync palette attribute
  useEffect(() => {
    const root = window.document.documentElement;
    // The landing page always remains in default theme
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/landing')) {
      root.removeAttribute('data-palette');
      return undefined;
    }
    if (palette === 'default') {
      root.removeAttribute('data-palette');
    } else {
      root.setAttribute('data-palette', palette);
    }
    return undefined;
  }, [palette]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme);
      }
      setThemeState(newTheme);
    },
    [storageKey]
  );

  const setPalette = useCallback(
    (newPalette: ThemePaletteId) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(paletteStorageKey, newPalette);
      }
      setPaletteState(newPalette);
    },
    [paletteStorageKey]
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
      palette,
      density,
      setTheme,
      toggleTheme,
      setPalette,
      setDensity,
    }),
    [theme, resolvedTheme, palette, density, setTheme, toggleTheme, setPalette]
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
