import React, { createContext, useContext, useState } from 'react';

export interface ChartBrushContextType {
  setXDomain: (domain: [Date, Date] | undefined) => void;
}

export const ChartBrushContext = createContext<ChartBrushContextType | undefined>(undefined);

export function useChartBrushContext() {
  const ctx = useContext(ChartBrushContext);
  if (!ctx) throw new Error('useChartBrushContext must be used within ChartBrushLayout');
  return ctx;
}

export interface BrushLayoutState {
  xDomain: [Date, Date] | undefined;
}

export interface ChartBrushLayoutProps {
  data: any[];
  enabled?: boolean;
  height?: number;
  brushStrip: React.ReactNode;
  children: (layout: BrushLayoutState) => React.ReactNode;
}

export function ChartBrushLayout({
  data,
  enabled = true,
  height = 72,
  brushStrip,
  children
}: ChartBrushLayoutProps) {
  const [xDomain, setXDomain] = useState<[Date, Date] | undefined>(undefined);

  if (!enabled) {
    return <>{children({ xDomain: undefined })}</>;
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex-1 w-full relative">
        {children({ xDomain })}
      </div>
      <div style={{ height }} className="w-full relative shrink-0">
        <ChartBrushContext.Provider value={{ setXDomain }}>
          {brushStrip}
        </ChartBrushContext.Provider>
      </div>
    </div>
  );
}
