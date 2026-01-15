import React from 'react';
import ReactECharts from 'echarts-for-react';
import { NoDataChart } from '../NoData';

export function MultibarBarChart({ data = [], width = '100%', height = '400px' }) {
  const generateSampleData = () => {
    const agents = [];
    for (let i = 1; i <= 30; i++) {
      agents.push({
        _id: i.toString(),
        agent_name: `Agent ${i} with potentially very long name that needs truncation`,
        total_true: Math.floor(Math.random() * 50) + 10,
        total_false: Math.floor(Math.random() * 30) + 5,
      });
    }
    return agents;
  };

  const chartData = data.length > 0 ? data : [];
  if (chartData.length === 0) {
    return <NoDataChart type='general' height={height} width={width} />;
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'transparent',
      borderWidth: 0,
      renderMode: 'html',
      appendToBody: true,
      className: '!shadow-none',
      formatter: (params) => {
        const agentName = params[0].name;
        const trueAlarms = params.find((p) => p.seriesName === 'True')?.value || 0;
        const falseAlarms = params.find((p) => p.seriesName === 'False')?.value || 0;
        const totalAlarms = trueAlarms + falseAlarms;

        return `
          <div class="bg-background border border-border rounded-lg shadow-xl p-3 min-w-[180px] z-999">
            <div class="text-sm font-semibold text-text mb-3 border-b border-border pb-2">
              ${agentName}
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" style="background-color: #7086FD"></div>
                  <span class="text-text/80 text-sm">True</span>
                </div>
                <span class="font-mono font-medium text-text">${trueAlarms}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" style="background-color: #FF6633"></div>
                  <span class="text-text/80 text-sm">False</span>
                </div>
                <span class="font-mono font-medium text-text">${falseAlarms}</span>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-border">
                <span class="text-text/80 text-sm font-medium">Total</span>
                <span class="font-mono font-bold text-text">${totalAlarms}</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: true,
      bottom: 10,
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      textStyle: {
        color: 'rgb(var(--ms-text-color))',
        fontSize: 12,
      },
      data: [
        {
          name: 'True',
          itemStyle: { color: '#7086FD' },
        },
        {
          name: 'False',
          itemStyle: { color: '#FF6633' },
        },
      ],
    },
    grid: {
      left: '120px',
      right: '40px',
      bottom: '60px',
      top: '50px',
      containLabel: false,
    },
    xAxis: {
      type: 'value',
      position: 'top',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: 'rgb(var(--ms-text-color)/0.7)',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.1)',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: chartData.map((agent) => agent.agent_name),
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: 'rgb(var(--ms-text-color)/0.7)',
        fontSize: 12,
        margin: 8,
        width: 100,
        overflow: 'truncate',
        formatter: function (value) {
          if (value.length > 15) {
            return value.substring(0, 15) + '...';
          }
          return value;
        },
      },
      splitLine: {
        show: false,
      },
    },
    dataZoom: [
      {
        type: 'slider',
        yAxisIndex: 0,
        show: chartData.length > 10,
        right: '20px',
        width: 12,
        borderColor: 'transparent',
        backgroundColor: 'rgb(var(--ms-text-color)/0.1)',
        fillerColor: 'rgb(var(--ms-primary-color)/0.2)',
        handleSize: '100%',
        handleStyle: {
          color: 'rgb(var(--ms-primary-color))',
        },
        showDetail: false,
        brushSelect: false,
        zoomLock: false,
        start: 0,
        end: Math.min(100, (10 / chartData.length) * 100),
        height: '70%',
        top: 'center',
      },
    ],
    series: [
      {
        name: 'True',
        type: 'bar',
        barGap: 0,
        barCategoryGap: '20%',
        barWidth: '15px',
        itemStyle: {
          color: '#7086FD',
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: false,
        },
        emphasis: {
          focus: 'series',
        },
        data: chartData.map((agent) => agent.total_false),
      },
      {
        name: 'False',
        type: 'bar',
        barGap: 0,
        barCategoryGap: '20%',
        barWidth: '15px',
        itemStyle: {
          color: '#FF6633',
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: false,
        },
        emphasis: {
          focus: 'series',
        },
        data: chartData.map((agent) => agent.total_true),
      },
    ],
  };

  return (
    <div style={{ width, height }}>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
