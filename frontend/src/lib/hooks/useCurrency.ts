import { useAuthStore } from '../../features/auth/store/auth.store.js';
import { formatMoney as baseFormatMoney, fromMinor } from '@finsight/shared';
import { useCallback, useMemo } from 'react';

const SYMBOL_FALLBACK_MAP: Record<string, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: '$',
  AUD: '$',
};

export function getCurrencySymbol(currency: string = 'USD'): string {
  try {
    const parts = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0);
    const symbolPart = parts.find(p => p.type === 'currency');
    return symbolPart ? symbolPart.value : (SYMBOL_FALLBACK_MAP[currency.toUpperCase()] || currency);
  } catch {
    return SYMBOL_FALLBACK_MAP[currency.toUpperCase()] || '$';
  }
}

export function formatMoneyDirect(minorAmount: number, currency = 'USD', options?: Intl.NumberFormatOptions): string {
  if (options) {
    const amount = fromMinor(minorAmount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      ...options,
    }).format(amount);
  }
  return baseFormatMoney(minorAmount, currency);
}

export function formatMajorDirect(majorAmount: number, currency = 'USD', options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    ...options,
  }).format(majorAmount);
}

export function formatCompactDirect(amount: number, currency = 'USD', isMinor = false): string {
  const sym = getCurrencySymbol(currency);
  const val = isMinor ? fromMinor(amount) : amount;
  const absVal = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (absVal >= 1_000_000) {
    const mVal = (absVal / 1_000_000).toFixed(1).replace(/\.0$/, '');
    return `${sign}${sym}${mVal}M`;
  }
  if (absVal >= 1_000) {
    const kVal = (absVal / 1_000).toFixed(1).replace(/\.0$/, '');
    return `${sign}${sym}${kVal}k`;
  }
  if (absVal === 0) {
    return `${sym}0`;
  }
  return `${sign}${sym}${absVal.toLocaleString('en-US', { maximumFractionDigits: 1 })}`;
}

export function useCurrency() {
  const currency = useAuthStore(s => s.user?.currency || 'USD');

  const symbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  const formatMoney = useCallback((minorAmount: number, options?: Intl.NumberFormatOptions) => {
    return formatMoneyDirect(minorAmount, currency, options);
  }, [currency]);

  const formatMajor = useCallback((majorAmount: number, options?: Intl.NumberFormatOptions) => {
    return formatMajorDirect(majorAmount, currency, options);
  }, [currency]);

  const formatCompact = useCallback((amount: number, isMinor = false) => {
    return formatCompactDirect(amount, currency, isMinor);
  }, [currency]);

  return {
    currency,
    symbol,
    formatMoney,
    formatMajor,
    formatCompact,
  };
}
