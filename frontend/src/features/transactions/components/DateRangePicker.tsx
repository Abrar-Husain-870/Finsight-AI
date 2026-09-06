import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  align?: 'left' | 'right' | undefined;
  className?: string | undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}
function isBetween(d: Date, start: Date, end: Date) {
  const t = startOfDay(d).getTime();
  return t > startOfDay(start).getTime() && t < startOfDay(end).getTime();
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

// ─── Presets ─────────────────────────────────────────────────────────────────

interface Preset {
  label: string;
  getValue: () => DateRange;
}

const PRESETS: Preset[] = [
  {
    label: 'Today',
    getValue: () => {
      const today = startOfDay(new Date());
      return { startDate: today, endDate: today };
    },
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const d = new Date(); d.setDate(d.getDate() - 1);
      const yesterday = startOfDay(d);
      return { startDate: yesterday, endDate: yesterday };
    },
  },
  {
    label: 'This Week',
    getValue: () => {
      const today = new Date();
      const dow = today.getDay();
      const start = new Date(today); start.setDate(today.getDate() - dow);
      return { startDate: startOfDay(start), endDate: startOfDay(today) };
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const end = startOfDay(new Date());
      const start = new Date(end); start.setDate(end.getDate() - 6);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: 'This Month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: start, endDate: startOfDay(now) };
    },
  },
  {
    label: 'Last 30 Days',
    getValue: () => {
      const end = startOfDay(new Date());
      const start = new Date(end); start.setDate(end.getDate() - 29);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: 'Last 3 Months',
    getValue: () => {
      const end = startOfDay(new Date());
      const start = new Date(end); start.setMonth(end.getMonth() - 3);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: 'This Year',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      return { startDate: start, endDate: startOfDay(now) };
    },
  },
];

// ─── Calendar Grid ────────────────────────────────────────────────────────────

interface CalendarGridProps {
  year: number;
  month: number;
  hoverDate: Date | null;
  range: DateRange;
  selectingStart: boolean;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
}

function CalendarGrid({ year, month, hoverDate, range, selectingStart, onDayClick, onDayHover }: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(new Date(year, month, i));
  }
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const today = startOfDay(new Date());

  const effectiveEnd = !selectingStart && range.startDate && hoverDate
    ? (hoverDate >= range.startDate ? hoverDate : range.startDate)
    : range.endDate;
  const effectiveStart = !selectingStart && range.startDate && hoverDate && hoverDate < range.startDate
    ? hoverDate
    : range.startDate;

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider py-1.5">
            {d}
          </div>
        ))}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;

          const isStart = range.startDate && isSameDay(date, range.startDate);
          const isEnd = range.endDate && isSameDay(date, range.endDate);
          const isToday = isSameDay(date, today);
          const isFuture = date > today;
          const isHoverEnd = !selectingStart && range.startDate && hoverDate && isSameDay(date, hoverDate);
          const inRange = effectiveStart && effectiveEnd && isBetween(date, effectiveStart, effectiveEnd);

          const isSelected = isStart || isEnd || isHoverEnd;

          return (
            <button
              key={i}
              type="button"
              disabled={isFuture}
              onClick={() => onDayClick(date)}
              onMouseEnter={() => onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              className={cn(
                'relative flex items-center justify-center h-8 w-full text-xs font-medium rounded-md transition-all duration-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-border-focus)]',
                isFuture
                  ? 'text-[var(--color-text-muted)] opacity-30 cursor-not-allowed'
                  : 'hover:bg-[var(--color-bg-tertiary)] cursor-pointer',
                isSelected && !isFuture
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] hover:bg-[var(--color-accent-primary)] hover:opacity-90 rounded-md z-10'
                  : '',
                inRange && !isSelected
                  ? 'bg-[var(--color-accent-muted)] rounded-none text-[var(--color-text-primary)]'
                  : '',
                // Round the range ends
                isStart && effectiveEnd && !isSameDay(date, effectiveEnd)
                  ? 'rounded-r-none'
                  : '',
                isEnd && effectiveStart && !isSameDay(date, effectiveStart)
                  ? 'rounded-l-none'
                  : '',
                isHoverEnd && !selectingStart && range.startDate && !isSameDay(date, range.startDate)
                  ? 'rounded-l-none'
                  : '',
                !isSelected && !inRange && isToday
                  ? 'ring-1 ring-inset ring-[var(--color-border-strong)] text-[var(--color-text-primary)]'
                  : !isSelected ? 'text-[var(--color-text-primary)]' : '',
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DateRangePicker({ value, onChange, align = 'right', className }: DateRangePickerProps) {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectingStart, setSelectingStart] = useState(true);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleDayClick = useCallback((date: Date) => {
    setActivePreset(null);
    if (selectingStart) {
      onChange({ startDate: date, endDate: null });
      setSelectingStart(false);
    } else {
      if (value.startDate && date < value.startDate) {
        // clicked before start — swap
        onChange({ startDate: date, endDate: value.startDate });
      } else {
        onChange({ startDate: value.startDate, endDate: date });
      }
      setSelectingStart(true);
      setIsOpen(false);
    }
  }, [selectingStart, value.startDate, onChange]);

  const handlePreset = useCallback((preset: Preset) => {
    const range = preset.getValue();
    onChange(range);
    setActivePreset(preset.label);
    setSelectingStart(true);
    setIsOpen(false);
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ startDate: null, endDate: null });
    setActivePreset(null);
    setSelectingStart(true);
  }, [onChange]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Trigger label
  let label = 'Date Range';
  if (value.startDate && value.endDate) {
    if (isSameDay(value.startDate, value.endDate)) {
      label = formatDateLabel(value.startDate);
    } else {
      label = `${formatDateLabel(value.startDate)} – ${formatDateLabel(value.endDate)}`;
    }
  } else if (value.startDate) {
    label = `From ${formatDateLabel(value.startDate)}`;
  }

  const hasValue = value.startDate !== null;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        id="date-range-picker-trigger"
        onClick={() => {
          setIsOpen(prev => !prev);
          if (!isOpen) setSelectingStart(!value.startDate || !!value.endDate);
        }}
        className={cn(
          'flex items-center gap-2 h-10 px-3.5 rounded-[var(--radius-lg)] border text-sm font-medium transition-all duration-150 whitespace-nowrap',
          'bg-[var(--color-bg-primary)] shadow-[var(--shadow-sm)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:border-transparent',
          hasValue
            ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
            : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]',
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="max-w-[200px] truncate">{label}</span>
        {hasValue ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date filter"
            onClick={handleClear}
            onKeyDown={e => e.key === 'Enter' && handleClear(e as unknown as React.MouseEvent)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-[var(--color-accent-muted)] transition-colors cursor-pointer"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </span>
        ) : (
          <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden="true" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Date range calendar"
          className={cn(
            'absolute z-50 mt-2 flex flex-col sm:flex-row',
            'rounded-[var(--radius-xl)] border border-[var(--color-border-primary)]',
            'bg-[var(--color-bg-primary)] shadow-[var(--shadow-dropdown)]',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            align === 'left' ? 'left-0 origin-top-left' : 'right-0 left-auto origin-top-right',
          )}
          style={{ minWidth: '280px' }}
        >
          {/* ── Presets Sidebar ── */}
          <div className="flex flex-col gap-0.5 p-3 border-b sm:border-b-0 sm:border-r border-[var(--color-border-primary)] sm:w-36 shrink-0">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-2 py-1">Quick Select</p>
            {PRESETS.map(preset => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePreset(preset)}
                className={cn(
                  'w-full text-left text-xs px-2 py-1.5 rounded-[var(--radius-md)] transition-all duration-100',
                  activePreset === preset.label
                    ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-primary-foreground)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]',
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* ── Calendar ── */}
          <div className="p-4 w-[280px]">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous month"
                className="flex items-center justify-center h-7 w-7 rounded-[var(--radius-md)] border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {MONTHS[viewMonth]} {viewYear}
              </span>

              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className="flex items-center justify-center h-7 w-7 rounded-[var(--radius-md)] border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Calendar grid */}
            <CalendarGrid
              year={viewYear}
              month={viewMonth}
              range={value}
              hoverDate={hoverDate}
              selectingStart={selectingStart}
              onDayClick={handleDayClick}
              onDayHover={setHoverDate}
            />

            {/* Selection hint */}
            <div className="mt-3 pt-3 border-t border-[var(--color-border-primary)]">
              <p className="text-[11px] text-[var(--color-text-muted)] text-center">
                {selectingStart
                  ? 'Click a day to set the start date'
                  : 'Click a day to set the end date'}
              </p>
              {value.startDate && !value.endDate && (
                <p className="text-[11px] font-medium text-[var(--color-text-secondary)] text-center mt-0.5">
                  Start: {formatDateLabel(value.startDate)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
