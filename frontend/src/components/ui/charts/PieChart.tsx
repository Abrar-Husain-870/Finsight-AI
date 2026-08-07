/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ParentSize } from '@visx/responsive';
import { Group } from '@visx/group';
import { PieChartProvider, PieData } from './PieChartContext.js';
import { cn } from '../../../lib/utils.js';
import { Pie } from '@visx/shape';

export interface PieChartProps {
  data: PieData[];
  size?: number;
  innerRadius?: number;
  padAngle?: number;
  cornerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  hoveredIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
  className?: string;
  children: React.ReactNode;
}

export function PieChart({
  data,
  size,
  innerRadius = 0,
  padAngle = 0,
  cornerRadius = 0,
  startAngle = 0,
  endAngle = Math.PI * 2,
  hoveredIndex,
  onHoverChange,
  className,
  children
}: PieChartProps) {
  
  const renderChart = (width: number, height: number) => {
    const minDim = Math.min(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = minDim / 2;

    return (
      <PieChartProvider
        data={data}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        padAngle={padAngle}
        cornerRadius={cornerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        controlledHoveredIndex={hoveredIndex}
        onHoverChange={onHoverChange}
        centerX={centerX}
        centerY={centerY}
      >
        <svg width={width} height={height} className={cn("overflow-visible", className)}>
          <Group top={centerY} left={centerX}>
            {/* The actual Pie layout calculation is done via visx/shape Pie component wrapping the children, 
                but since we want composability (mapping over data to render PieSlice), 
                we use visx Pie to calculate arcs and pass them to children via render props, 
                OR we can just let Pie calculate and we clone elements. 
                Wait, the simplest way is to wrap children in a Pie that uses a custom render function. */}
            <Pie
              data={data}
              pieValue={(d) => d.value}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              cornerRadius={cornerRadius}
              padAngle={padAngle}
              startAngle={startAngle}
              endAngle={endAngle}
            >
              {(pie) => {
                return (
                  <>
                    {/* We need to pass the arc data to PieSlice. 
                        To keep the API `<PieSlice index={i} />`, we can inject the arc into the context, 
                        or clone the children and inject the arc.
                        Actually, it's easier to just pass the arcs array via context.
                        Let's just pass `arcs` to the children directly by cloning, OR via a Context layer.
                        For simplicity, we'll map the children and inject `arc={pie.arcs[child.props.index]}`. */}
                    {React.Children.map(children, (child) => {
                      if (React.isValidElement(child)) {
                        const childElement = child as React.ReactElement<any>;
                        // If it's PieSlice, it needs the arc
                        if (childElement.props.index !== undefined && pie.arcs[childElement.props.index]) {
                          return React.cloneElement(childElement, {
                            arc: pie.arcs[childElement.props.index],
                            path: pie.path
                          });
                        }
                        return childElement;
                      }
                      return null;
                    })}
                  </>
                );
              }}
            </Pie>
          </Group>
          {/* Render non-PieSlice children like PieCenter which don't need arc but need context */}
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const childElement = child as React.ReactElement<any>;
              if (childElement.props.index === undefined) {
                return childElement;
              }
            }
            return null;
          })}
        </svg>
      </PieChartProvider>
    );
  };

  if (size) {
    return renderChart(size, size);
  }

  return (
    <div className={cn("w-full h-full min-h-[200px]", className)}>
      <ParentSize>
        {({ width, height }) => renderChart(width, height)}
      </ParentSize>
    </div>
  );
}
