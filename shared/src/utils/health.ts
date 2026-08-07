
export function getComponentStatus(score: number): 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'CRITICAL' {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 70) return 'GOOD';
  if (score >= 40) return 'NEEDS_WORK';
  return 'CRITICAL';
}
