import React from 'react';
import ReactECharts from 'echarts-for-react';

export function PieChartComponent({ data, centerLabel, width = '100%', height = 400 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Find the maximum value to emphasize the largest segment
  const maxValue = Math.max(...data.map((item) => item.value));

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'transparent',
      borderWidth: 0,
      renderMode: 'html',
      appendToBody: true,
      className: '!shadow-none',
      formatter: (params) => {
        const percent = ((params.value / total) * 100).toFixed(1);
        return `
          <div class="bg-background border border-border rounded-lg shadow-xl p-3 min-w-[140px] z-999">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${params.color}"></div>
              <span class="font-semibold text-text text-sm">${params.name}</span>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <span class="text-text/80 text-sm">Count</span>
                <span class="font-mono font-medium text-text">${params.value.toLocaleString()}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-text/80 text-sm">Percent</span>
                <span class="font-mono font-medium text-text">${percent}%</span>
              </div>
            </div>
          </div>
        `;
      },
    },

    legend: {
      show: false,
    },
    series: [
      {
        type: 'pie',
        radius: ['37%', '77%'],
        roseType: 'area',
        emphasis: {
          scale: true,
          scaleSize: 10,
          focus: 'self',
        },
        itemStyle: {
          borderWidth: 0,
          borderColor: '#fff',
        },
        label: {
          show: true,
          fontSize: 14,
          color: 'rgb(var(--ms-text-color))',
          formatter: ({ name, value }) => {
            return `${name}\n{value|${value.toLocaleString()}}`;
          },
          rich: {
            value: {
              fontSize: 24,
              fontWeight: 600,
              color: 'rgb(var(--ms-text-color)/0.7)',
              padding: [2, 0, 0, 0],
            },
          },
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 10,
          smooth: true,
          lineStyle: {
            width: 1,
            type: 'solid',
          },
        },
        data: data.map((item) => ({
          ...item,
          // Make the largest segment bigger with emphasis
          ...(item.value === maxValue && {
            emphasis: {
              itemStyle: {
                shadowBlur: 15,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            itemStyle: {
              ...item.itemStyle,
              shadowBlur: 8,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          }),
        })),
      },
    ],
  };

  return (
    <div className='relative' style={{ width, height }}>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'svg' }}
      />

      {/* Center Label */}
      <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
        <div className='text-[22px] font-bold text-text'>{total.toLocaleString()}</div>
        <div className='text-xs text-muted-foreground mt-0'>{centerLabel || 'Total'}</div>
      </div>
    </div>
  );
}
