import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '../../lib/utils.js';

// Props interface for type-safety and reusability
export interface Vo2MaxCardProps {
  /** The main title of the card. */
  title: string;
  /** The primary numerical value to display. */
  value: number;
  /** A descriptive status text below the value (e.g., 'Excellent', 'Optimal'). */
  status: string;
  /** A footer description. Can be a string or a ReactNode for rich text. */
  description: React.ReactNode;
  /** The progress percentage (0-100) for the radial bar. */
  progress: number;
  /** An icon component to display in the top-right corner. */
  icon: React.ReactNode;
  /** Optional className to merge with the default card styles. */
  className?: string;
  /** Optional custom stroke color for progress ring. */
  strokeColor?: string;
}

export const Vo2MaxCard: React.FC<Vo2MaxCardProps> = ({
  title,
  value,
  status,
  description,
  progress,
  icon,
  className,
  strokeColor = '#10B981',
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const progressValue = useMotionValue(0);

  React.useEffect(() => {
    // Animate the numerical value
    const valueAnimation = animate(count, value, {
      duration: 1.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    });

    // Animate the progress bar
    const progressAnimation = animate(progressValue, progress, {
      duration: 1.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    });

    return () => {
      valueAnimation.stop();
      progressAnimation.stop();
    };
  }, [value, progress, count, progressValue]);

  // SVG circle properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useTransform(
    progressValue,
    (v) => circumference - (v / 100) * circumference
  );

  return (
    <div
      className={cn(
        'relative flex w-full max-w-sm flex-col gap-4 rounded-2xl border bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl border-slate-200/80 dark:border-white/[0.08] p-6 text-[var(--color-text-primary)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] overflow-hidden transition-all duration-300',
        className
      )}
    >
      {/* Subtle decorative glow */}
      <div 
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 rounded-full blur-3xl -z-10 opacity-30" 
        style={{ backgroundColor: strokeColor }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] tracking-tight">{title}</h3>
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm"
          style={{ backgroundColor: strokeColor }}
        >
          {icon}
        </div>
      </div>

      {/* Radial Progress and Value */}
      <div className="relative flex h-56 w-full items-center justify-center">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="-rotate-90"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Background track with segmented look */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="12"
            fill="transparent"
            stroke="currentColor"
            className="text-white/10 dark:text-white/10 light:text-neutral-200"
            strokeDasharray="8 12"
            strokeLinecap="round"
          />
          {/* Foreground progress */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="12"
            fill="transparent"
            stroke={strokeColor}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
            style={{ strokeDashoffset }}
          />
        </svg>

        {/* Central Text Content */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span className="text-6xl font-bold tracking-tighter text-[var(--color-text-primary)] tabular-nums">
            {rounded}
          </motion.span>
          <p className="text-sm font-semibold tracking-wide uppercase mt-1" style={{ color: strokeColor }}>
            {status}
          </p>
        </div>
      </div>

      {/* Footer Description */}
      <div className="text-center text-sm text-[var(--color-text-secondary)] leading-relaxed">
        {description}
      </div>
    </div>
  );
};

export default Vo2MaxCard;
