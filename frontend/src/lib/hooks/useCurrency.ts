import { useAuthStore } from '../../features/auth/store/auth.store.js';
import { formatMoney as baseFormatMoney } from '@finsight/shared';
import { useCallback } from 'react';

export function useCurrency() {
  const currency = useAuthStore(s => s.user?.currency || 'USD');

  const formatMoney = useCallback((minorAmount: number) => {
    return baseFormatMoney(minorAmount, currency);
  }, [currency]);

  return {
    currency,
    formatMoney,
  };
}
