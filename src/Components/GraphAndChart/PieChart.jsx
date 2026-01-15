import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { formatTimeToHoursAndMinutes } from '@/utils/helper';

// Sleep Score Pie Chart Component
export default function SleepScorePieChart({ sleepData = [], sleepScore = '' }) {
  const chartRef = useRef(null);

  // Filter to include only light and deep sleep
  const filterSleepData = (data) =>
    data.filter((item) => item.status === '0' || item.status === '1' || item.status === '7');

  // Calculate total sleep in hours and minutes
  const calculateTotalSleep = (data) => {
    const filteredData = filterSleepData(data);
    const totalMinutes = filteredData.reduce((sum, item) => sum + Number(item.value), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const totalSleep = calculateTotalSleep(sleepData);

  // Map and translate data for the pie chart with colors
  const statusMap = {
    0: { name: 'Deep Sleep', color: '#7F87FC' }, // Blue
    1: { name: 'Light Sleep', color: '#4285F4' }, // Teal
    7: { name: 'REM', color: '#A0C878' }, // Purple
  };

  const filteredData = filterSleepData(sleepData);
  const formattedData = filteredData.map((item) => ({
    name: statusMap[item.status].name,
    value: item.value,
    itemStyle: {
      color: statusMap[item.status].color,
    },
  }));

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const sleepDuration = formatTimeToHoursAndMinutes(params.value);
        return `${params.name}: ${sleepDuration} (${params.percent}%)`;
      },
    },
    grid: {
      top: '00%',
    },
    legend: {
      show: true,
      orient: 'horizontal',
      bottom: 0,
      left: 'center',
    },
    series: [
      {
        name: 'Sleep Stages',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        data: formattedData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'center',
          formatter: () => `{c|${totalSleep.hours}h ${totalSleep.minutes}m}\n{a|Total Duration}`,
          rich: {
            a: {
              fontSize: 12,
              fontWeight: 'normal',
              color: '#999',
              marginTop: 5,
            },
            c: {
              fontSize: 26,
              fontWeight: 'bold',
              color: '#000',
              padding: [10, 0, 0, 0],
            },
          },
        },
        labelLine: {
          show: false,
        },
      },
    ],
  };

  return <ReactECharts ref={chartRef} option={option} style={{ height: 320, width: '100%' }} />;
}
