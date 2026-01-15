import React from 'react';
import ReactECharts from 'echarts-for-react';

export function CleanBarGraph({ data = [], width = '100%', height = 350 }) {
  const generateAgentData = () => {
    const scores = data.map((agent) => agent.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    return data.map((agent) => ({
      ...agent,
      isHighest: agent.score === maxScore,
      isLowest: agent.score === minScore,
      itemStyle: {
        color:
          agent.score === maxScore
            ? '#10b981'
            : agent.score === minScore
              ? '#ef4444'
              : 'rgb(var(--ms-primary-color))',
      },
    }));
  };

  const agentData = generateAgentData();

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'transparent',
      borderWidth: 0,
      renderMode: 'html',
      appendToBody: true,
      className: '!shadow-none',
      formatter: (params) => {
        const { name, value, color } = params;
        return `
          <div class="bg-background border border-border rounded-lg shadow-xl p-3 min-w-[140px] z-999">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${color}"></div>
              <span class="font-semibold text-text text-sm">${name}</span>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <span class="text-text/80 text-sm pr-1">Performance Score: </span>
                <span class="font-mono font-bold text-text text-sm">${value}%</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: false,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      show: false,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
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
    series: [
      {
        name: 'Performance Score',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [7, 7, 0, 0],
          borderWidth: 0,
        },
        label: {
          show: true,
          position: 'top',
          color: 'rgb(var(--ms-text-color))',
          fontSize: 12,
          fontWeight: 'bold',
          formatter: '{c}%',
        },
        emphasis: {
          disabled: true,
        },
        data: agentData.map((agent) => ({
          value: agent.score,
          name: agent.name,
          itemStyle: {
            ...agent.itemStyle,
            borderWidth: 0,
          },
          emphasis:
            agent.isHighest || agent.isLowest
              ? undefined
              : {
                  itemStyle: {
                    opacity: 0.8,
                  },
                },
        })),
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
