'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';
import { NoDataChart } from '../NoData';

interface PieChartProps {
  data: {
    alert: string;
    count: number;
    fill: string;
  }[];
  chartConfig: ChartConfig;
  centerLabel?: {
    count: number;
    title: string;
  };
  innerRadius?: number;
  outerRadius?: number;
}

export function PieChartComponent({
  data,
  chartConfig,
  centerLabel,
  innerRadius = 60,
  outerRadius = 80,
}: PieChartProps) {
  const validData = data.filter((item) => item.count > 0);
  console.log(validData?.length);

  if (validData.length === 0) {
    return (
      <div className='flex items-center justify-center aspect-square max-h-[250px] border rounded-lg'>
        <NoDataChart type='general' height={'auto'} width={'auto'} />
      </div>
    );
  }

  const totalCount = centerLabel?.count || validData.reduce((sum, item) => sum + item.count, 0);

  // Create a mapping of original colors for tooltip
  const colorMap = validData.reduce(
    (map, item) => {
      map[item.alert] = item.fill;
      return map;
    },
    {} as Record<string, string>
  );

  return (
    <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[150px]'>
      <PieChart height={150} width={150}>
        <defs>
          {validData.map((item, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`gradient-${index}`}
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#ffffff' />
              <stop offset='100%' stopColor={item.fill} />
            </linearGradient>
          ))}
        </defs>

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              nameKey='alert'
              formatter={(value, name, item, index, payload) => {
                const originalColor = colorMap[name as string] || item.fill;

                return (
                  <div className='flex items-center gap-2 w-full'>
                    <div
                      className='h-2.5 w-2.5 rounded-[2px] shrink-0'
                      style={{ backgroundColor: originalColor }}
                    />
                    <div className='flex flex-1 justify-between items-center'>
                      <span className='text-muted-foreground'>
                        {chartConfig[name as keyof typeof chartConfig]?.label || name}
                      </span>
                      <span className='text-foreground font-mono font-medium tabular-nums pl-3'>
                        {value?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          }
        />

        <Pie
          data={validData.map((item, index) => ({
            ...item,
            fill: `url(#gradient-${index})`,
            // Add original color to payload for tooltip
            originalColor: item.fill,
          }))}
          dataKey='count'
          nameKey='alert'
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className='fill-foreground text-3xl font-bold'
                    >
                      {totalCount.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className='fill-muted-foreground'
                    >
                      {centerLabel?.title || 'Total Alerts'}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
