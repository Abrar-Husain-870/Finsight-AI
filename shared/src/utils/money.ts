
// Money is stored as integer minor units (e.g., cents) to avoid float precision issues.
export const toMinor = (amount: number): number => {
  return Math.round(amount * 100);
};

export const fromMinor = (amount: number): number => {
  return amount / 100;
};

export const parseMoney = (value: string): number => {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) throw new Error('Invalid monetary amount');
  return toMinor(parsed);
};

export const formatMoney = (minorAmount: number, currency = 'USD'): string => {
  const amount = fromMinor(minorAmount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
