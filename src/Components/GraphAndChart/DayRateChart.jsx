import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { FaHeartbeat } from 'react-icons/fa';
import { FaLungs } from 'react-icons/fa6';
import { Empty } from 'antd';
export default function LiveRateChart({ data, color, type, timestamp }) {
  // Define safe range
  const safeMin = type === 'heartRate' ? 80 : 8;
  const safeMax = type === 'heartRate' ? 45 : 24;

  // Map data with corresponding timestamps
  const filteredData = data?.map((value, index) => {
    const time = timestamp[index];
    // Extract hours and minutes from timestamp
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours}:${minutes}`;

    const intValue = value === '-1' ? null : parseInt(value, 10);
    return {
      value: intValue,
      time: formattedTime,
      isDanger: intValue !== null && (intValue < safeMin || intValue > safeMax),
    };
  });

  if (data.length === 0) {
    return <Empty description='No data available to show' />;
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
      formatter: function (params) {
        const dataIndex = params[0].dataIndex;
        const { value, time } = filteredData[dataIndex];
        return `
         <span style="font-size: 12px;">Time: ${time}</span><br/>
         <span style="font-size: 16px;">${
           type === 'heartRate' ? 'Heart Rate' : 'Breath Rate'
         }: ${value !== null ? value : 'No Data'}</span>`;
      },
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderWidth: 0,
    },
    grid: {
      left: '5%',
      right: '3%',
      bottom: '10%',
      top: '4%',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: filteredData.map((item) => item.time),
      axisLine: { show: true },
      axisTick: { show: true },
      axisLabel: {
        show: true,
        interval: function (index, value) {
          // Show label if:
          // 1. It's the first timestamp
          // 2. It's the last timestamp
          // 3. It's roughly one of 5 evenly spaced points
          const interval = Math.floor(filteredData.length / 4); // Divide by 4 to get 5 points
          return index === 0 || index === filteredData.length - 1 || index % interval === 0;
        },
        formatter: function (value, index) {
          const time = timestamp[index];
          if (!time) return '';
          const [hours, minutes] = time.split(':');
          return `${hours}:${minutes}`;
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: true,
        formatter: function (value) {
          return value; // Ensure the value format is correct
        },
      },
      splitLine: { show: false },
    },
    series: [
      {
        name: type === 'heartRate' ? 'Heart Rate' : 'Breath Rate',
        data: filteredData.map((item) => item.value),
        type: 'line',
        smooth: false,
        lineStyle: {
          width: 2,
          color: color,
        },
        itemStyle: {
          color: function (params) {
            return filteredData[params.dataIndex].isDanger ? 'red' : color;
          },
          opacity: 0,
          emphasis: {
            opacity: 1,
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${color}80` },
              { offset: 1, color: `${color}00` },
            ],
          },
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            {
              name: 'Safe Min',
              yAxis: safeMin,
              lineStyle: {
                type: 'dashed',
                color: 'gray',
              },
              label: {
                formatter: '',
                position: 'end',
              },
            },
            {
              name: 'Safe Max',
              yAxis: safeMax,
              lineStyle: {
                type: 'dashed',
                color: 'gray',
              },
              label: {
                formatter: '',
                position: 'end',
              },
            },
          ],
        },
      },
    ],
  };
  return (
    <div className='flex flex-col gap-2'>
      <ReactECharts option={option} style={{ height: '180px' }} />
    </div>
  );
}
