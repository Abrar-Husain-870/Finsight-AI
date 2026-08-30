"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../../lib/utils.js";

export interface TimelineAnimationProps {
  children: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function TimelineAnimation({
  children,
  animationNum = 1,
  timelineRef,
  className,
}: TimelineAnimationProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef || ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: animationNum * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}

export default TimelineAnimation;
