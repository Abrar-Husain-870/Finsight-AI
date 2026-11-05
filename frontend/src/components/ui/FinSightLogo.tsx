import React from 'react';
import logoImg from '@/Public/Finsight Logo.png';
import { cn } from '@/lib/utils';

export interface FinSightLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export function FinSightLogo({ className, alt = "FinSight", ...props }: FinSightLogoProps) {
  return (
    <img
      src={logoImg}
      alt={alt}
      className={cn("object-contain select-none", className)}
      {...props}
    />
  );
}

export function FinSightBrand({
  className,
  logoClassName = "h-8 w-8 rounded-lg shadow-xs",
  textClassName = "text-xl font-bold tracking-tight text-[var(--color-text-primary)]",
  showText = true,
}: {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  showText?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <FinSightLogo className={logoClassName} />
      {showText && <span className={textClassName}>FinSight</span>}
    </div>
  );
}

export default FinSightLogo;

