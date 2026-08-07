import React from 'react';
import { formatMoney } from '@finsight/shared';

export function MerchantAnalysisWidget({ data }: { data: { merchant: string; amount: number; count: number }[] }) {
  if (data.length === 0) {
    return <div className="text-sm text-[var(--color-text-secondary)]">No merchant data available.</div>;
  }
  return (
    <div className="flex flex-col gap-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]">
          <div>
            <div className="font-medium text-sm text-[var(--color-text-primary)] capitalize">{item.merchant}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">{item.count} transactions</div>
          </div>
          <div className="font-semibold text-sm text-[var(--color-text-primary)]">
            {formatMoney(item.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
