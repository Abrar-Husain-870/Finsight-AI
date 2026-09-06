import React from 'react';
import { cn } from '../../../lib/utils.js';

export interface LegendItem {
  label: string;
  value?: string | number;
  color: string;
  [key: string]: any;
}

export interface LegendProps {
  items: LegendItem[];
  hoveredIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
  className?: string;
  children?: React.ReactNode;
}

interface LegendContextType {
  currentItem: LegendItem | null;
  currentIndex: number;
  isHovered: boolean;
  onHoverChange?: ((index: number | null) => void) | undefined;
}

const LegendContext = React.createContext<LegendContextType>({
  currentItem: null,
  currentIndex: -1,
  isHovered: false,
});

export function Legend({
  items,
  hoveredIndex,
  onHoverChange,
  className,
  children,
}: LegendProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 w-full", className)}>
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index;
        return (
          <LegendContext.Provider
            key={index}
            value={{ currentItem: item, currentIndex: index, isHovered, onHoverChange }}
          >
            <div
              onMouseEnter={() => onHoverChange?.(index)}
              onMouseLeave={() => onHoverChange?.(null)}
              className={cn(
                "inline-flex items-center gap-2 py-1 px-2.5 rounded-lg transition-all cursor-pointer select-none",
                isHovered
                  ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] scale-105 shadow-2xs font-semibold"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
              )}
            >
              {children ? (
                React.Children.map(children, (child) => child)
              ) : (
                <div className="inline-flex items-center gap-2">
                  <LegendMarker />
                  <LegendLabel />
                </div>
              )}
            </div>
          </LegendContext.Provider>
        );
      })}
    </div>
  );
}

export function LegendItemComponent({ children, className }: { children?: React.ReactNode; className?: string }) {
  const { currentItem } = React.useContext(LegendContext);
  if (!currentItem) return null;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {children || (
        <>
          <LegendMarker />
          <LegendLabel />
        </>
      )}
    </div>
  );
}

export function LegendMarker({ className }: { className?: string }) {
  const { currentItem } = React.useContext(LegendContext);
  if (!currentItem) return null;
  return (
    <span
      className={cn("h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs transition-transform", className)}
      style={{ backgroundColor: currentItem.color }}
    />
  );
}

export function LegendLabel({ className }: { className?: string }) {
  const { currentItem } = React.useContext(LegendContext);
  if (!currentItem) return null;
  return (
    <span className={cn("text-xs font-semibold text-[var(--color-text-primary)] truncate", className)}>
      {currentItem.label}
    </span>
  );
}
