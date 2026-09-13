"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils.js";

// Define the props for the FeatureCard component
export interface FeatureCardProps extends HTMLMotionProps<"div"> {
  title: string;
  description: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, title, description, badge, children, ...props }, ref) => {
    // Animation variants for framer-motion
    const cardVariants = {
      offscreen: {
        y: 20,
        opacity: 0,
      },
      onscreen: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          bounce: 0.3,
          duration: 0.7,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
        className={cn(
          "relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all hover:border-slate-300 dark:hover:border-white/[0.14]",
          className
        )}
        {...props}
      >
        <div className="flex-grow">
          {/* Card Header: Title, Badge, and Description */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] tracking-tight">
              {title}
            </h3>
            {badge && <div>{badge}</div>}
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Main Content Area */}
        <div className="mt-4">{children}</div>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export { FeatureCard };
export default FeatureCard;
