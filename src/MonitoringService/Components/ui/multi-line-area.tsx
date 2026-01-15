import React from 'react';
import ReactECharts from 'echarts-for-react';
import { NoDataChart } from '../NoData';

export function AgentPerformanceLineChart({ data = [], width = '100%', height = '400px' }) {
  const chartData = data.length > 0 ? data : [];
  console.log(data);

  // if (chartData.length === 0) {
  //   return <NoDataChart type="line" height={height} width={width} />;
  // }

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'transparent',
      borderWidth: 0,
      renderMode: 'html',
      appendToBody: true,
      className: '!shadow-none',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.2)',
          width: 1,
        },
      },
      formatter: (params) => {
        const agentName = params[0].axisValue;
        const responseRate = params.find((p) => p.seriesName === 'Response Rate')?.value || 0;
        const slaCompliance = params.find((p) => p.seriesName === 'SLA Compliance')?.value || 0;

        return `
          <div class="bg-background border border-border rounded-lg shadow-xl p-3 min-w-[180px] z-999">
            <div class="text-sm font-semibold text-text mb-3 border-b border-border pb-2">
              ${agentName}
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" style="background-color: #7086FD"></div>
                  <span class="text-text/80 text-sm">Response Rate: </span>
                </div>
                <span class="font-mono font-medium text-text">${responseRate}%</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" style="background-color: #6FD195"></div>
                  <span class="text-text/80 text-sm">SLA Compliance: </span>
                </div>
                <span class="font-mono font-medium text-text pl-1"> ${slaCompliance}%</span>
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
          name: 'Response Rate',
          itemStyle: { color: '#7086FD' },
        },
        {
          name: 'SLA Compliance',
          itemStyle: { color: '#6FD195' },
        },
      ],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: chartData.length > 10 ? '80px' : '15%', // More space for zoom controls if many agents
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartData.map((agent) => agent.agent_name),
      axisLine: {
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.2)',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: 'rgb(var(--ms-text-color)/0.7)',
        fontSize: 12,
        // Remove rotation
        rotate: 0,
        margin: 8,
        // Truncate long agent names
        formatter: function (value) {
          if (value.length > 15) {
            return value.substring(0, 15) + '...';
          }
          return value;
        },
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.1)',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: 'rgb(var(--ms-text-color)/0.7)',
        fontSize: 12,
        formatter: '{value}%',
      },
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        show: chartData.length > 10, // Show zoom only if more than 10 agents
        bottom: 40,
        height: 20,
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
        end: Math.min(100, (10 / chartData.length) * 100), // Show 10 agents by default
        textStyle: {
          color: 'rgb(var(--ms-text-color)/0.7)',
        },
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        zoomOnMouseWheel: true,
        moveOnMouseWheel: true,
        preventDefaultMouseMove: true,
      },
    ],
    series: [
      {
        name: 'Response Rate',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#7086FD',
        },
        itemStyle: {
          color: '#7086FD',
          borderWidth: 2,
          borderColor: '#ffffff',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(112, 134, 253, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(112, 134, 253, 0.05)',
              },
            ],
          },
        },
        data: chartData.map((agent) => agent.response_rate),
      },
      {
        name: 'SLA Compliance',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#6FD195',
        },
        itemStyle: {
          color: '#6FD195',
          borderWidth: 2,
          borderColor: '#ffffff',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(111, 209, 149, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(111, 209, 149, 0.05)',
              },
            ],
          },
        },
        data: chartData.map((agent) => agent.sla_compliance),
      },
    ],
  };

  return (
    <div style={{ width, height }}>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'svg' }}
        onEvents={{
          mousewheel: function (event) {
            event.stopPropagation();
          },
        }}
      />
    </div>
  );
}
