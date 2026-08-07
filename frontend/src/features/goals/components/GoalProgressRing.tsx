
import React from 'react';

export function GoalProgressRing({ progress, color }: { progress: number; color: string }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, progress) / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-16 h-16">
      <svg className="w-16 h-16 transform -rotate-90">
        <circle cx="32" cy="32" r={radius} className="stroke-[var(--color-bg-secondary)]" strokeWidth="4" fill="transparent" />
        <circle 
          cx="32" cy="32" r={radius} 
          className="transition-all duration-1000 ease-out"
          strokeWidth="4" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          stroke={color}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-[var(--color-text-primary)]">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
