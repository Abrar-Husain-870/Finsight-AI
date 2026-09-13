"use client" 

import * as React from "react"
import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
 
const cn = (...args: any[]) => {
  return twMerge(clsx(args));
};
 
const DEFAULT_FONT_SIZE = 40;
const DEFAULT_PADDING = 10;
 
export interface CounterProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  start?: number;
  end: number;
  duration?: number;
  className?: string;
  fontSize?: number;
  prefix?: string;
  suffix?: string;
}
 
export const Counter = ({
  start,
  end,
  duration = 1.2,
  className,
  fontSize = 30,
  prefix = '',
  suffix = '',
  ...rest
}: CounterProps) => {
  const [value, setValue] = useState(start !== undefined ? start : end);
  const height = fontSize + Math.max(4, Math.round(fontSize * 0.25));
 
  useEffect(() => {
    if (start !== undefined && start !== end) {
      const steps = Math.abs(end - start) || 1;
      const intervalMs = Math.max(16, (duration / steps) * 1000);
      const interval = setInterval(() => {
        setValue((prev) => {
          if (prev < end) return prev + 1;
          if (prev > end) return prev - 1;
          return prev;
        });
      }, intervalMs);
      return () => clearInterval(interval);
    }
    setValue(end);
    return undefined;
  }, [start, end, duration]);
 
  return (
    <div
      style={{ fontSize, height }}
      {...rest}
      className={cn(
        "inline-flex items-center overflow-hidden leading-none text-primary font-bold tabular-nums select-none",
        className
      )}
    >
      {prefix && <span className="mr-0.5 select-none font-bold text-inherit">{prefix}</span>}
      {value >= 100000 && <Digit place={100000} value={value} height={height} />}
      {value >= 10000 && <Digit place={10000} value={value} height={height} />}
      {value >= 1000 && <Digit place={1000} value={value} height={height} />}
      {value >= 100 && <Digit place={100} value={value} height={height} />}
      {value >= 10 && <Digit place={10} value={value} height={height} />}
      <Digit place={1} value={value} height={height} />
      {suffix && <span className="ml-0.5 select-none font-bold text-inherit">{suffix}</span>}
    </div>
  );
};
 
function Digit({ place, value, height }: { place: number; value: number; height: number }) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace, { stiffness: 280, damping: 28 });
 
  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);
 
  return (
    <div style={{ height }} className="relative w-[1ch] tabular-nums overflow-hidden flex items-center justify-center">
      {[...Array(10)].map((_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}
 
function Number({ mv, number, height }: { mv: MotionValue<number>; number: number; height: number }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
 
    let memo = offset * height;
 
    if (offset > 5) {
      memo -= 10 * height;
    }
 
    return memo;
  });
 
  return (
    <motion.span
      style={{ y, height }}
      className="absolute inset-0 flex items-center justify-center text-inherit font-bold"
    >
      {number}
    </motion.span>
  );
}

export default Counter;
