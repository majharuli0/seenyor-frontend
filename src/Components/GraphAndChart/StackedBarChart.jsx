import React from 'react';
import ReactECharts from 'echarts-for-react';

const StackedBarChart = ({ data, height = '300px' }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      bottom: 0,
      icon: 'circle',
      itemGap: 20,
    },
    grid: {
      top: '3%',
      left: '3%',
      right: '4%',
      bottom: '10%',
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
    series: data.series.map((s) => ({
      ...s,
      type: 'bar',
      stack: 'total',
      barMaxWidth: 37,
      itemStyle: {
        ...s.itemStyle,
        borderRadius: 0,
      },
    })),
  };

  return <ReactECharts option={option} style={{ height }} />;
};

export default StackedBarChart;
