import React from 'react';
import { cn } from '../../lib/utils.js';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<"div"> {
  noPadding?: boolean;
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, noPadding = false, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        {...(hoverable ? { whileHover: { y: -2 } } : {})}
        className={cn(
          "rounded-[var(--radius-xl)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-[var(--shadow-card)] transition-shadow duration-300",
          hoverable && "hover:shadow-[var(--shadow-card-hover)]",
          !noPadding && "p-6",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";
