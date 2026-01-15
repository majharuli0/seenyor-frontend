import React, { useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';
const ScatterChart = ({ data = [] }) => {
  const allTypes = {
    'Went to bed': '#1E8A8A',
    'Fell asleep': '#7A5EBE',
    'Wake up': '#3A81BF',
    'Get up': '#CC8A50',
    'Bed-Exit at Night': '#508C9B',
  };

  const typesInData = Array.from(new Set(data.flat().map((event) => event.type)));
  const dynamicTypes = Object.keys(allTypes).reduce((acc, type) => {
    if (typesInData.includes(type)) {
      acc[type] = allTypes[type];
    }
    return acc;
  }, {});

  let minHour = Infinity;
  let maxHour = -Infinity;

  const seriesData = Object.keys(dynamicTypes).map((type) => ({
    name: type,
    type: 'scatter',
    data: [],
    itemStyle: { color: dynamicTypes[type] },
    symbolSize: 15,
  }));

  data.forEach((day) => {
    if (Array.isArray(day)) {
      day.forEach((event) => {
        const { date, time: timeStr, type, suffix = '' } = event; // Include suffix
        const time = new Date(timeStr);
        const hour = time.getHours() + time.getMinutes() / 60;
        const dayOffset = time.getHours() >= 18 ? 0 : 1;

        minHour = Math.min(minHour, hour + 24 * dayOffset);
        maxHour = Math.max(maxHour, hour + 24 * dayOffset);

        const series = seriesData.find((s) => s.name === type);
        if (series) {
          series.data.push([hour + 24 * dayOffset, date, timeStr, suffix]); // Add suffix
        }
      });
    } else {
      console.warn("Expected an array for 'day', but got:", day);
    }
  });

  if (data?.length === 0) {
    return (
      <div className='h-full flex flex-col items-center justify-center'>
        <Empty description='No data available to show' />
      </div>
    );
  }

  const option = {
    title: {},
    legend: {
      show: true,
      data: Object.keys(dynamicTypes),
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross',
      },
      formatter: (params) => {
        const eventTime = new Date(params.data[2]);
        const suffix = params.data[3]; // Extract the suffix
        return `${params.seriesName}<br/>Date: ${
          params.data[1]
        }<br/>Time: ${suffix} ${eventTime.getHours()}:${eventTime
          .getMinutes()
          .toString()
          .padStart(2, '0')}`;
      },
    },
    xAxis: {
      type: 'value',
      min: Math.floor(minHour),
      max: Math.ceil(maxHour),
      axisLabel: {
        fontSize: 14,
        formatter: (value) => {
          return (value >= 24 ? value - 24 : value) + ':00';
        },
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'category',
      name: 'Date',
      data: [...new Set(data?.flat()?.map((event) => event.date))],
      axisLabel: {
        fontSize: 14,
      },
    },
    series: seriesData,
    dataZoom: [
      {
        type: 'slider',
        yAxisIndex: 0,
        start: data.length > 15 ? 90 : 0,
        end: 100,
      },
    ],

    grid: {
      top: '15%',
      bottom: '10%',
      left: '7%',
      right: '10%',
    },
  };

  return <ReactECharts option={option} />;
};

export default ScatterChart;
