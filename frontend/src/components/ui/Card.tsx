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
        {...(hoverable ? { whileHover: { y: -2, scale: 0.995 } } : {})}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
        className={cn(
          "rounded-[var(--radius-xl)] bg-[var(--color-bg-primary)] shadow-[var(--shadow-card)] transition-shadow duration-300",
          hoverable && "hover:shadow-[var(--shadow-card-hover)] cursor-pointer",
          !noPadding && "p-8",
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
