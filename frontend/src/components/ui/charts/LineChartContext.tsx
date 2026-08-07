/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useMemo } from 'react';

interface LineChartContextType {
  data: any[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  innerWidth: number;
  innerHeight: number;
  xScale: any;
  yScale: any;
  xDataKey: string;
  tooltipOpen: boolean;
  tooltipData: any;
  tooltipLeft: number;
  tooltipTop: number;
  showTooltip: (args: { tooltipData: any; tooltipLeft: number; tooltipTop: number }) => void;
  hideTooltip: () => void;
  activePointIndex: number | null;
  setActivePointIndex: (index: number | null) => void;
  containerRef: HTMLDivElement | null;
}

const LineChartContext = createContext<LineChartContextType | undefined>(undefined);

export function useLineChart() {
  const context = useContext(LineChartContext);
  if (!context) {
    throw new Error('useLineChart must be used within a LineChart component');
  }
  return context;
}

interface LineChartProviderProps {
  children: React.ReactNode;
  data: any[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  xDataKey: string;
  xScale: any;
  yScale: any;
  containerRef: HTMLDivElement | null;
}

export function LineChartProvider({
  children,
  data,
  width,
  height,
  margin,
  xDataKey,
  xScale,
  yScale,
  containerRef,
}: LineChartProviderProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const [tooltipTop, setTooltipTop] = useState(0);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const showTooltip = ({ tooltipData, tooltipLeft, tooltipTop }: any) => {
    setTooltipOpen(true);
    setTooltipData(tooltipData);
    setTooltipLeft(tooltipLeft);
    setTooltipTop(tooltipTop);
  };

  const hideTooltip = () => {
    setTooltipOpen(false);
    setTooltipData(null);
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const value = useMemo(
    () => ({
      data,
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      xDataKey,
      tooltipOpen,
      tooltipData,
      tooltipLeft,
      tooltipTop,
      showTooltip,
      hideTooltip,
      activePointIndex,
      setActivePointIndex,
      containerRef,
    }),
    [
      data,
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      xDataKey,
      tooltipOpen,
      tooltipData,
      tooltipLeft,
      tooltipTop,
      activePointIndex,
      containerRef,
    ]
  );

  return <LineChartContext.Provider value={value}>{children}</LineChartContext.Provider>;
}
