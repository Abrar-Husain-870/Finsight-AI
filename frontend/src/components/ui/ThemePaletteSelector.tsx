import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../providers/ThemeProvider.js';
import { THEME_PALETTES } from '../../styles/themes/themeConfig.js';
import { Palette, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils.js';

interface ThemePaletteSelectorProps {
  variant?: 'navbar' | 'grid';
  className?: string;
}

export function ThemePaletteSelector({ variant = 'navbar', className }: ThemePaletteSelectorProps) {
  const { palette, setPalette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Swatch strip component representing the 5-Color Distribution
  const SwatchStrip = ({ colors, size = 'sm' }: { colors: string[]; size?: 'sm' | 'md' }) => (
    <div className={cn(
      "flex items-center gap-1 rounded-full p-1 bg-black/10 dark:bg-white/10 shrink-0 border border-black/5 dark:border-white/10",
      size === 'sm' ? "h-6" : "h-7"
    )}>
      {colors.map((color, i) => (
        <span
          key={i}
          className={cn(
            "rounded-full shrink-0 shadow-2xs border border-black/10 dark:border-white/20",
            size === 'sm' ? "w-3.5 h-3.5" : "w-4 h-4"
          )}
          style={{ backgroundColor: color }}
          title={`Color ${i + 1}: ${color}`}
        />
      ))}
    </div>
  );

  // 1. Grid Variant for Settings Page
  if (variant === 'grid') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
        {THEME_PALETTES.map((t) => {
          const isSelected = palette === t.id;

          return (
            <motion.button
              key={t.id}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setPalette(t.id)}
              className={cn(
                "relative flex flex-col text-left p-5 rounded-[var(--radius-xl)] transition-all cursor-pointer border overflow-hidden",
                isSelected
                  ? "bg-[var(--color-bg-secondary)] border-[var(--color-accent-primary)] shadow-sm ring-1 ring-[var(--color-accent-primary)]/40"
                  : "bg-transparent border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)]/50 hover:border-[var(--color-border-hover)]"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="palette-active"
                  className="absolute inset-0 border-2 border-[var(--color-accent-primary)] rounded-[var(--radius-xl)] pointer-events-none"
                />
              )}

              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">
                      {t.name}
                    </h3>
                    {t.isDefault && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/20">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-0.5">
                    {t.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <SwatchStrip colors={t.previewColors} size="sm" />
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-2">
                {t.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // 2. Navbar Variant for Header
  const activePalette = THEME_PALETTES.find(t => t.id === palette) || THEME_PALETTES[0];
  const activePaletteName = activePalette?.name ?? 'Default';

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] cursor-pointer flex items-center gap-1.5"
        title={`Change Theme Palette (Active: ${activePaletteName})`}
        aria-label="Change theme palette"
        aria-expanded={isOpen}
      >
        <Palette className="h-5 w-5" />
        <span className="sr-only">Change Theme Palette</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 sm:w-80 origin-top-right rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            {/* Popover Header */}
            <div className="px-4 py-3 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-accent-primary)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Color Themes
                </span>
              </div>
              <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                {THEME_PALETTES.length} Styles
              </span>
            </div>

            {/* List of Palettes */}
            <div className="p-2 max-h-[380px] overflow-y-auto space-y-1">
              {THEME_PALETTES.map((t) => {
                const isSelected = palette === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setPalette(t.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer group",
                      isSelected
                        ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-semibold shadow-2xs border border-[var(--color-border-primary)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]/50 border border-transparent"
                    )}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                          {t.name}
                        </span>
                        {t.isDefault && (
                          <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-white/10 text-[var(--color-text-secondary)]">
                            Orig
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--color-text-secondary)] truncate">
                        {t.tagline}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <SwatchStrip colors={t.previewColors} size="sm" />
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
