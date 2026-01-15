import React from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line';
import { Empty } from 'antd';
import dayjs from 'dayjs';

export default function MultiLineChart({ data = [], fromDate, toDate }) {
  // Function to generate week days between fromDate and toDate
  const generateWeekDays = (fromDate, toDate) => {
    const days = [];
    let current = dayjs(fromDate);
    while (current.isBefore(toDate) || current.isSame(toDate, 'day')) {
      days.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }
    return days;
  };

  // Map data into a structured format for the chart
  const weekDays = generateWeekDays(fromDate, toDate);

  const structuredData = weekDays.map((day) => {
    const critical = data
      .filter((item) => item.date === day && item.alarm_group === 'Critical')
      .reduce((sum, item) => sum + item.count, 0);

    const warning = data
      .filter((item) => item.date === day && item.alarm_group === 'Warning')
      .reduce((sum, item) => sum + item.count, 0);

    const problem = data
      .filter((item) => item.date === day && item.alarm_group === 'Info')
      .reduce((sum, item) => sum + item.count, 0);

    return { day: dayjs(day).format('ddd'), critical };
  });

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '20%',
      top: '10%',
      containLabel: true,
    },
    legend: {
      show: true,
      orient: 'horizontal', // Align horizontally
      bottom: '10%', // Position at the bottom
    },
    xAxis: {
      type: 'category',
      data: structuredData.map((item) => item.day),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Critical',
        type: 'line',
        data: structuredData.map((item) => item.critical),
        itemStyle: { color: '#FF0000' },
        smooth: true,
      },
      // {
      //   name: "Warning",
      //   type: "line",
      //   data: structuredData.map((item) => item.warning),
      //   itemStyle: { color: "#FFA500" },
      //   smooth: true,
      // },
      // {
      //   name: "Problem",
      //   type: "line",
      //   data: structuredData.map((item) => item.problem),
      //   itemStyle: { color: "#800080" },
      //   smooth: true,
      // },
    ],
  };

  if (!data.length) {
    return (
      <div className='h-full flex items-center w-full justify-center'>
        <Empty description='No data available for this week' />
      </div>
    );
  }

  return <ReactEcharts option={option} style={{ width: '100% !important', height: '100%' }} />;
}
