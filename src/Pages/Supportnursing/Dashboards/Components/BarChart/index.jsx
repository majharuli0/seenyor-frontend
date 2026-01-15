import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Empty } from 'antd';
import dayjs from 'dayjs';

export default function AlertsOverviewBarChart({ data = [], fromDate, toDate }) {
  const generateWeekDays = (fromDate, toDate) => {
    const days = [];
    let current = dayjs(fromDate);
    while (current.isBefore(toDate) || current.isSame(toDate, 'day')) {
      days.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }
    return days;
  };

  const weekDays = generateWeekDays(fromDate, toDate);

  const structuredData = weekDays.map((day) => {
    const critical = data
      .filter((item) => item.date === day && item.alarm_group === 'Critical')
      .reduce((sum, item) => sum + item.count, 0);

    return {
      day: dayjs(day).format('ddd'),
      critical,
    };
  });

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: structuredData.map((item) => item.day),
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: 'Alarms',
        type: 'bar',
        data: structuredData.map((item) => item.critical),
        itemStyle: {
          color: '#514EB5',
          borderRadius: [10, 10, 0, 0],
        },
        barWidth: '40%',
      },
    ],
  };

  if (!data.length) {
    return (
      <div className='h-full flex items-center w-full justify-center'>
        <Empty description='No data available for this week' />
      </div>
    );
  }

  return <ReactEcharts option={option} style={{ width: '100%', height: '100%' }} />;
}
