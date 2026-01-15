import React from 'react';
import ReactECharts from 'echarts-for-react';

export function PieChartComponent({ data, centerLabel, width = '100%', height = 400 }) {
  const total = data?.filter((item: unknown) => item.name == 'Resolved Alerts')[0]?.value || 0;
  const filteredData = data?.filter((item: unknown) => item.name !== 'Resolved Alerts');

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
        radius: ['67%', '77%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderWidth: 0,
        },
        label: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
        },
        labelLine: {
          show: false,
        },
        data: filteredData,
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
