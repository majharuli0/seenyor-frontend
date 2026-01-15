import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

export default function LiveRateChart({ data = [], name }) {
  const rateOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
      formatter: function (params) {
        // Customize the tooltip content
        const { name, value } = params[0];
        return `Time: ${name}<br/>Rate: ${value}`;
      },
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderWidth: 0,
    },
    grid: {
      left: '0%',
      right: '2%',
      bottom: '0%',
      top: '0%',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data?.time,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    series: [
      {
        name: name,
        data: name == 'Heart Rate' ? data?.heartRate : data?.breathRate,
        type: 'line',
        smooth: false,
        lineStyle: {
          width: 2,
          color: '#FFFFFF',
        },
        itemStyle: {
          opacity: 0,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 255, 255, 0.5)' },
              { offset: 1, color: 'rgba(255, 255, 255, 0)' },
            ],
          },
        },
      },
    ],
  };

  return <ReactECharts option={rateOption} style={{ height: '65px' }} />;
}
