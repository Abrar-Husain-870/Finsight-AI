
import React from 'react';
import { Vo2MaxCard } from '../../../components/ui/progress.js';
import { ShieldCheck } from 'lucide-react';

export function ScoreCircle({ score, trend }: { score: number; trend?: number }) {
  const { status, strokeColor } = React.useMemo(() => {
    if (score >= 80) return { status: 'Optimal', strokeColor: '#10B981' };
    if (score >= 65) return { status: 'Stable', strokeColor: '#34D399' };
    if (score >= 50) return { status: 'Fair', strokeColor: '#94A3B8' };
    return { status: 'At Risk', strokeColor: '#64748B' };
  }, [score]);

  return (
    <div className="w-full flex items-center justify-center">
      <Vo2MaxCard
        title="Financial Health"
        value={score}
        status={status}
        progress={Math.min(100, Math.max(0, score))}
        strokeColor={strokeColor}
        icon={<ShieldCheck className="h-5 w-5" />}
        className="w-full max-w-full"
        description={
          <div className="space-y-1">
            <p>
              Your score is in the{' '}
              <span className="font-semibold" style={{ color: strokeColor }}>
                {score >= 80 ? 'Top 15%' : score >= 65 ? 'Top 35%' : 'Bottom 40%'}
              </span>{' '}
              of peer profiles.
            </p>
            {trend !== undefined && (
              <div className="flex items-center justify-center gap-1 text-xs text-[var(--color-text-secondary)] pt-0.5">
                {trend > 0 ? (
                  <span className="text-emerald-500 font-semibold">+{trend} pts</span>
                ) : trend < 0 ? (
                  <span className="text-rose-500 font-semibold">{trend} pts</span>
                ) : (
                  <span className="text-[var(--color-text-secondary)] font-semibold">0 pts</span>
                )}
                <span>vs last month</span>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}

export default ScoreCircle;

