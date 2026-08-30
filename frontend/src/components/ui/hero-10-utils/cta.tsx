import * as React from "react";
import { Button } from "@/components/ui/Button";

export interface CtaProps {
  ctaEnabled?: boolean;
  text?: string;
  link?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
}

export function Cta({ cta, className }: { cta: CtaProps; className?: string }) {
  if (!cta || !cta.ctaEnabled) return null;

  return (
    <Button
      variant={cta.variant || "default"}
      size={cta.size || "default"}
      className={className}
      onClick={cta.onClick ? cta.onClick : () => {
        if (cta.link && cta.link.startsWith('http')) {
          window.open(cta.link, '_blank');
        } else if (cta.link) {
          window.location.href = cta.link;
        }
      }}
    >
      {cta.text}
    </Button>
  );
}
