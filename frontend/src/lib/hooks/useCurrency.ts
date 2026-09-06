import { useAuthStore } from '../../features/auth/store/auth.store.js';
import { formatMoney as baseFormatMoney } from '@finsight/shared';
import { useCallback, useMemo } from 'react';

export function getCurrencySymbol(currency: string = 'USD'): string {
  try {
    const parts = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0);
    const symbolPart = parts.find(p => p.type === 'currency');
    return symbolPart ? symbolPart.value : currency;
  } catch {
    return '$';
  }
}

export function useCurrency() {
  const currency = useAuthStore(s => s.user?.currency || 'USD');

  const symbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  const formatMoney = useCallback((minorAmount: number) => {
    return baseFormatMoney(minorAmount, currency);
  }, [currency]);

  return {
    currency,
    symbol,
    formatMoney,
  };
}

