export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function calculateAverage(total: number, count: number): number {
  if (count === 0) return 0;
  return total / count;
}
