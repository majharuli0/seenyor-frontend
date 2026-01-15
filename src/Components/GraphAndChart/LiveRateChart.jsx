import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { FaHeartbeat } from 'react-icons/fa';
import { FaLungs } from 'react-icons/fa6';
export default function LiveRateChart({ data = [], color, type }) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
      formatter: function (params) {
        // Customize the tooltip content
        const { name, value } = params[0];

        // Assuming name is in "HH:MM:SS" format
        const [hoursStr, minutesStr, secondsStr] = name.split(':');
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        const seconds = parseInt(secondsStr, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
        const localTime = `${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

        return `
        <span style="font-size: 12px;">${localTime}</span><br/>
        <span style="font-size: 16px;">Heart Rate: ${value}</span>`;
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
      bottom: '3%',
      top: '4%',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.time,
      axisLine: { show: true },
      axisTick: { show: true },
      axisLabel: {
        show: false, // Hide all labels on the x-axis
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
        data: type === 'heartRate' ? data.heartRate : data.breathRate,
        type: 'line',
        smooth: false,
        lineStyle: {
          width: 2,
          color: color, // Set line color to white
        },
        itemStyle: {
          opacity: 0,
          color: color,
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
              { offset: 0, color: `${color}80` }, // 50% opacity
              { offset: 1, color: `${color}00` }, // 0% opacity
            ],
          },
        },
      },
    ],
  };
  return (
    <div className='flex flex-col gap-2'>
      <ReactECharts option={option} style={{ height: '160px' }} />;
    </div>
  );
}
