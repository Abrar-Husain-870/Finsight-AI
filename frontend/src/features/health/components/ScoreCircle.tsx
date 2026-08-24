
import React from 'react';
import { cn } from '../../../lib/utils.js';

export function ScoreCircle({ score, trend }: { score: number; trend: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  let color = 'text-[var(--color-success)]';
  if (score < 40) color = 'text-[var(--color-danger)]';
  else if (score < 70) color = 'text-[var(--color-warning)]';

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-40 h-40 transform -rotate-90">
        <circle cx="80" cy="80" r={radius} className="stroke-[var(--color-bg-secondary)]" strokeWidth="12" fill="transparent" />
        <circle 
          cx="80" cy="80" r={radius} 
          className={cn("transition-all duration-1000 ease-out", color)} 
          strokeWidth="12" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          stroke="currentColor"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-bold", color)}>{score}</span>
        <span className="text-xs text-[var(--color-text-secondary)] font-medium">/ 100</span>
      </div>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium">
        {trend > 0 ? (
          <span className="text-[var(--color-success)]">+{trend} pts</span>
        ) : trend < 0 ? (
          <span className="text-[var(--color-danger)]">{trend} pts</span>
        ) : (
          <span className="text-[var(--color-text-secondary)]">No change</span>
        )}
        <span className="text-[var(--color-text-secondary)]">vs last month</span>
      </div>
    </div>
  );
}
