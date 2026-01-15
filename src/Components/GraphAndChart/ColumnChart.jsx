import React from 'react';
import ReactECharts from 'echarts-for-react';

const ColumnChart = ({ data, color = '#818cf8', height = '300px', showLabel = false }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
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
        type: 'bar',
        barMaxWidth: 37,
        label: {
          show: showLabel,
          position: 'top',
          color: '#6b7280',
          fontSize: 12,
          fontWeight: 'bold',
        },
        itemStyle: {
          color: color,
          borderRadius: 0,
        },
        // ... (rest of series)
        showBackground: true,
        backgroundStyle: {
          color: `${color}1A`, // 10% opacity
          borderRadius: 0,
        },
        data: data.values,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} />;
};

export default ColumnChart;
