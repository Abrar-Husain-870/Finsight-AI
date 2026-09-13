/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useId, useState } from 'react';
import useMeasure from 'react-use-measure';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils.js';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';

export interface FunnelChartDataItem {
  name?: string | undefined;
  label?: string | undefined;
  value?: number | undefined;
  amount?: number | undefined;
  percent?: number | undefined;
  color?: string | undefined;
  [key: string]: any;
}

export interface FunnelChartProps {
  data: FunnelChartDataItem[];
  color?: string | undefined;
  layers?: number | undefined;
  renderPattern?: ((id: string, color: string) => React.ReactNode) | undefined;
  className?: string | undefined;
  height?: number | string | undefined;
  valueFormatter?: ((value: number) => string) | undefined;
}

export function FunnelChart({
  data = [],
  color = 'var(--chart-2)',
  layers = 3,
  renderPattern,
  className,
  height = 260,
  valueFormatter,
}: FunnelChartProps) {
  const { formatMoney } = useCurrency();
  const [ref, bounds] = useMeasure();
  const rawId = useId();
  const patternId = `funnel-pattern-${rawId.replace(/:/g, '')}`;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = bounds.width || 600;
  const h = bounds.height || (typeof height === 'number' ? height : 260);

  const N = data.length;
  if (N === 0) return null;

  const px = 16;
  const pTop = 36;
  const pBottom = 32;
  const W_avail = Math.max(100, width - 2 * px);
  const H_avail = Math.max(60, h - pTop - pBottom);
  const yCenter = pTop + H_avail / 2;
  const dx = W_avail / N;

  const totalValue = data.reduce((acc, curr) => acc + (Number(curr[kVal(curr)]) || 0), 0) || 1;

  function kVal(item: FunnelChartDataItem) {
    if (typeof item.value === 'number') return 'value';
    if (typeof item.amount === 'number') return 'amount';
    return 'value';
  }

  // Calculate funnel half-height at each boundary point (0 to N)
  const rMax = H_avail * 0.46;
  const rMin = H_avail * 0.08;

  const boundaryR: number[] = [];
  for (let k = 0; k <= N; k++) {
    if (k === 0) {
      boundaryR.push(rMax);
    } else if (k === N) {
      boundaryR.push(rMin);
    } else {
      let remSum = 0;
      for (let j = k; j < N; j++) {
        const item = data[j];
        if (item) {
          remSum += Number(item.value ?? item.amount ?? 0);
        }
      }
      const ratio = remSum / totalValue;
      const r = rMin + (rMax - rMin) * Math.sqrt(Math.max(0, Math.min(1, ratio)));
      boundaryR.push(r);
    }
  }

  const getR = (idx: number) => boundaryR[idx] ?? rMin;

  // Generate paths for each layer (from outermost layer 0 to innermost layer `layers - 1`)
  const layerPaths: string[] = [];
  const numLayers = Math.max(1, layers);

  for (let L = 0; L < numLayers; L++) {
    const scale = 1.0 - L * (0.42 / numLayers);

    let pathStr = `M ${px},${yCenter - getR(0) * scale}`;

    // Top curve forward
    for (let k = 0; k < N; k++) {
      const xStart = px + k * dx;
      const xEnd = px + (k + 1) * dx;
      const yStart = yCenter - getR(k) * scale;
      const yEnd = yCenter - getR(k + 1) * scale;
      const cpX1 = xStart + dx * 0.5;
      const cpX2 = xEnd - dx * 0.5;
      pathStr += ` C ${cpX1},${yStart} ${cpX2},${yEnd} ${xEnd},${yEnd}`;
    }

    // Right end vertical line
    pathStr += ` L ${px + W_avail},${yCenter + getR(N) * scale}`;

    // Bottom curve backward
    for (let k = N - 1; k >= 0; k--) {
      const xStart = px + (k + 1) * dx;
      const xEnd = px + k * dx;
      const yStart = yCenter + getR(k + 1) * scale;
      const yEnd = yCenter + getR(k) * scale;
      const cpX1 = xStart - dx * 0.5;
      const cpX2 = xEnd + dx * 0.5;
      pathStr += ` C ${cpX1},${yStart} ${cpX2},${yEnd} ${xEnd},${yEnd}`;
    }

    pathStr += ' Z';
    layerPaths.push(pathStr);
  }

  return (
    <div
      ref={ref}
      className={cn('w-full relative select-none font-sans', className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <svg width={width} height={h} className="w-full h-full overflow-visible">
        <defs>
          {renderPattern && renderPattern(patternId, color)}
        </defs>

        {/* Funnel Layers */}
        <g>
          {layerPaths.map((dPath, L) => {
            const isInnermost = L === numLayers - 1;
            let layerFill = color;
            let layerOpacity = 0.35 + (L * 0.25);

            if (isInnermost && renderPattern) {
              layerFill = `url(#${patternId})`;
              layerOpacity = 1;
            }

            return (
              <motion.path
                key={L}
                d={dPath}
                fill={layerFill}
                opacity={layerOpacity}
                initial={{ opacity: 0, scaleX: 0.9 }}
                animate={{ opacity: layerOpacity, scaleX: 1 }}
                transition={{ duration: 0.6, delay: L * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${px}px ${yCenter}px` }}
              />
            );
          })}
        </g>

        {/* Vertical Section Divider Lines */}
        {Array.from({ length: N - 1 }).map((_, k) => {
          const xSep = px + (k + 1) * dx;
          const rSep = getR(k + 1);
          return (
            <line
              key={k}
              x1={xSep}
              y1={yCenter - rSep}
              x2={xSep}
              y2={yCenter + rSep}
              stroke="var(--border)"
              strokeWidth={2.5}
              opacity={0.75}
            />
          );
        })}

        {/* Stages Labels, Badges & Values */}
        {data.map((item, i) => {
          const xMid = px + (i + 0.5) * dx;
          const val = Number(item.value || item.amount) || 0;
          const pct = item.percent !== undefined ? item.percent : Math.round((val / totalValue) * 100);
          const formattedVal = valueFormatter ? valueFormatter(val) : formatMoney(val);
          const name = item.name || item.label || '';
          const isHovered = hoveredIndex === i;

          return (
            <g key={i} className="transition-all duration-200" style={{ opacity: hoveredIndex !== null && !isHovered ? 0.45 : 1 }}>
              {/* Subtle Column Backdrop Highlight on Hover */}
              {isHovered && (
                <rect
                  x={px + i * dx + 2}
                  y={pTop - 6}
                  width={dx - 4}
                  height={H_avail + 12}
                  rx={8}
                  fill="var(--chart-2)"
                  opacity={0.12}
                />
              )}

              {/* Top Value Label */}
              <text
                x={xMid}
                y={pTop - 12}
                textAnchor="middle"
                fill={isHovered ? "var(--foreground)" : "var(--muted-foreground)"}
                fontSize={isHovered ? 14 : 13}
                fontWeight={isHovered ? 800 : 700}
              >
                {formattedVal}
              </text>

              {/* Center Percentage Badge */}
              <g transform={`translate(${xMid}, ${yCenter})`}>
                <rect
                  x={isHovered ? "-28" : "-25"}
                  y={isHovered ? "-15" : "-13"}
                  width={isHovered ? "56" : "50"}
                  height={isHovered ? "30" : "26"}
                  rx={isHovered ? 15 : 13}
                  fill="#FFFFFF"
                  stroke={isHovered ? "var(--chart-2)" : "rgba(0,0,0,0.15)"}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="shadow-sm transition-all"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#09090B"
                  fontSize={isHovered ? 13 : 12}
                  fontWeight={800}
                >
                  {pct}%
                </text>
              </g>

              {/* Bottom Category Name Label */}
              <text
                x={xMid}
                y={h - 8}
                textAnchor="middle"
                fill={isHovered ? "var(--foreground)" : "var(--muted-foreground)"}
                fontSize={11}
                fontWeight={isHovered ? 700 : 600}
              >
                {name}
              </text>

              {/* Transparent Interactive Hit Area */}
              <rect
                x={px + i * dx}
                y={0}
                width={dx}
                height={h}
                fill="transparent"
                className="cursor-pointer"
                onPointerEnter={() => setHoveredIndex(i)}
                onPointerLeave={() => setHoveredIndex(null)}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
