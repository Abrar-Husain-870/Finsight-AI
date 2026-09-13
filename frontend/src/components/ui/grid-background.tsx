import React from "react";
import { cn } from "../../lib/utils.js";

export interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  gridClassName?: string;
  variant?: "magenta" | "emerald" | "default";
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  children,
  className,
  gridClassName,
  variant = "magenta",
  ...props
}) => {
  const orbGradients = {
    magenta: "radial-gradient(circle at 50% 40%, rgba(236,72,153,0.18) 0%, rgba(168,85,247,0.09) 35%, rgba(59,130,246,0.03) 60%, transparent 80%)",
    emerald: "radial-gradient(circle at 50% 40%, rgba(16,185,129,0.20) 0%, rgba(52,211,153,0.09) 35%, rgba(6,182,212,0.03) 60%, transparent 80%)",
    default: "radial-gradient(circle at 50% 40%, rgba(236,72,153,0.18) 0%, rgba(168,85,247,0.08) 35%, rgba(16,185,129,0.04) 60%, transparent 80%)"
  };

  const selectedOrb = orbGradients[variant] || orbGradients.default;

  return (
    <div className={cn("min-h-screen w-full relative", className)} {...props}>
      {/* Orb Grid Background Layer */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-0",
          "bg-white dark:bg-[#090a0f]",
          gridClassName
        )}
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px),
            ${selectedOrb}
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      {/* Subtle Ambient Radial Lighting Sheen */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-60"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(236,72,153,0.12), transparent 70%)"
        }}
      />
      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

// Export Component alias for compatibility with provided snippet
export const Component = GridBackground;

export default GridBackground;
