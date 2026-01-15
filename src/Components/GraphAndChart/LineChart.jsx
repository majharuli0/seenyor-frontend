import React from 'react';
import ReactECharts from 'echarts-for-react';

const LineChart = ({ data, color = '#818cf8', height = '300px' }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af' },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e5e7eb',
        },
      },
      axisLabel: { color: '#9ca3af' },
    },
    series: [
      {
        name: 'Value',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbolSize: 8,
        data: data.values,
        itemStyle: {
          color: color,
          borderColor: '#fff',
          borderWidth: 2,
        },
        lineStyle: {
          color: color,
          width: 3,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${color}4D` }, // 30% opacity
              { offset: 1, color: `${color}00` }, // 0% opacity
            ],
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} />;
};

export default LineChart;
