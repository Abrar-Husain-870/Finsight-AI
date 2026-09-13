import React, { createContext, useContext, useState, useMemo } from 'react';

export interface RingDataItem {
  label: string;
  value: number;
  max?: number;
  color?: string;
  fill?: string;
  [key: string]: any;
}

interface RingChartContextType {
  data: RingDataItem[];
  size: number;
  ringGap: number;
  strokeWidth: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  totalValue: number;
}

const RingChartContext = createContext<RingChartContextType | undefined>(undefined);

export function useRingChart() {
  const context = useContext(RingChartContext);
  if (!context) {
    throw new Error('useRingChart must be used within a RingChart component');
  }
  return context;
}

export function RingChartProvider({
  children,
  data,
  size,
  ringGap,
  strokeWidth,
}: {
  children: React.ReactNode;
  data: RingDataItem[];
  size: number;
  ringGap: number;
  strokeWidth: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalValue = useMemo(() => {
    return data.reduce((acc, item) => acc + (item.value || 0), 0);
  }, [data]);

  const value = useMemo(
    () => ({
      data,
      size,
      ringGap,
      strokeWidth,
      hoveredIndex,
      setHoveredIndex,
      totalValue,
    }),
    [data, size, ringGap, strokeWidth, hoveredIndex, totalValue]
  );

  return <RingChartContext.Provider value={value}>{children}</RingChartContext.Provider>;
}
