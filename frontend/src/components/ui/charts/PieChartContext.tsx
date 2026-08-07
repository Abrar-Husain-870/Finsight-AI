import React, { createContext, useContext, useState } from 'react';

export interface PieData {
  label: string;
  value: number;
  color?: string | undefined;
  fill?: string | undefined;
}

interface PieChartContextType {
  data: PieData[];
  innerRadius: number;
  outerRadius: number;
  cornerRadius: number;
  padAngle: number;
  startAngle: number;
  endAngle: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  isControlled: boolean;
  total: number;
  centerX: number;
  centerY: number;
}

const PieChartContext = createContext<PieChartContextType | undefined>(undefined);

export function usePieChart() {
  const context = useContext(PieChartContext);
  if (!context) {
    throw new Error('usePieChart must be used within a PieChart component');
  }
  return context;
}

interface PieChartProviderProps extends Omit<PieChartContextType, 'setHoveredIndex' | 'isControlled' | 'hoveredIndex' | 'total'> {
  children: React.ReactNode;
  controlledHoveredIndex?: number | null | undefined;
  onHoverChange?: ((index: number | null) => void) | undefined;
}

export function PieChartProvider({
  children,
  data,
  innerRadius,
  outerRadius,
  cornerRadius,
  padAngle,
  startAngle,
  endAngle,
  controlledHoveredIndex,
  onHoverChange,
  centerX,
  centerY
}: PieChartProviderProps) {
  const [internalHover, setInternalHover] = useState<number | null>(null);
  const isControlled = controlledHoveredIndex !== undefined;
  
  const hoveredIndex = isControlled ? controlledHoveredIndex : internalHover;
  
  const setHoveredIndex = (index: number | null) => {
    if (!isControlled) setInternalHover(index);
    if (onHoverChange) onHoverChange(index);
  };

  const total = data.reduce((acc, d) => acc + (d.value || 0), 0);

  return (
    <PieChartContext.Provider value={{
      data,
      innerRadius,
      outerRadius,
      cornerRadius,
      padAngle,
      startAngle,
      endAngle,
      hoveredIndex,
      setHoveredIndex,
      isControlled,
      total,
      centerX,
      centerY
    }}>
      {children}
    </PieChartContext.Provider>
  );
}
