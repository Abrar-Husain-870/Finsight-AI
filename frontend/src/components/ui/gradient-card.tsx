// components/ui/gradient-card.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "../../lib/utils.js";

// Define variants for the card's overall style using cva
const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-2xl p-4 sm:p-5 shadow-xs transition-all duration-300 hover:shadow-md border border-black/5 dark:border-white/10",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-100 to-amber-200/50 dark:from-amber-950/60 dark:to-orange-900/40 text-amber-950 dark:text-amber-100",
        gray: "bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-900/60 dark:to-zinc-800/50 text-slate-950 dark:text-slate-100",
        purple: "bg-gradient-to-br from-purple-100 to-indigo-200/50 dark:from-indigo-950/60 dark:to-purple-900/40 text-indigo-950 dark:text-indigo-100",
        green: "bg-gradient-to-br from-emerald-100 to-teal-200/50 dark:from-emerald-950/60 dark:to-teal-900/40 text-emerald-950 dark:text-emerald-100",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

// Define the props interface for type safety and reusability
export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  badgeText: string;
  badgeColor: string; // Expecting a hex color string, e.g., "#FF5733"
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  onCtaClick?: () => void;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, gradient, badgeText, badgeColor, title, description, ctaText, ctaHref, imageUrl, onCtaClick, ...props }, ref) => {
    
    // Animation variants for framer-motion
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.02, y: -3 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0 },
      hover: { scale: 1.08, rotate: 2 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
        ref={ref}
      >
        <div
          className={cn(cardVariants({ gradient }), className)}
          {...props}
        >
          {/* Decorative background image with animation */}
          <motion.img
            src={imageUrl}
            alt={`${title} background graphic`}
            variants={imageAnimation}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute -right-1/4 -bottom-1/4 w-3/4 opacity-70 pointer-events-none dark:opacity-25"
          />

          {/* Card Content */}
          <div className="z-10 flex flex-col h-full justify-between relative">
            {/* Badge */}
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-black/40 px-2.5 py-0.5 text-[11px] font-semibold text-foreground/90 backdrop-blur-xs w-fit border border-black/5 dark:border-white/10">
              <span 
                className="h-1.5 w-1.5 rounded-full shrink-0" 
                style={{ backgroundColor: badgeColor }}
              />
              {badgeText}
            </div>

            {/* Title and Description */}
            <div className="flex-grow my-1">
              <h3 className="text-base sm:text-lg font-bold mb-1 tracking-tight">{title}</h3>
              <p className="text-xs opacity-80 leading-normal max-w-xs">{description}</p>
            </div>
            
            {/* Call to Action Link */}
            <a
              href={ctaHref}
              onClick={(e) => {
                if (onCtaClick) {
                  e.preventDefault();
                  onCtaClick();
                }
              }}
              className="group mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold opacity-90 hover:opacity-100 transition-all cursor-pointer"
            >
              {ctaText}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
