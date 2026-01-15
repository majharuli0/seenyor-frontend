import React, { useEffect, useState } from 'react';

import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/bar';
import grid from 'antd/es/grid';

export default function PieChart({ data = [], chartFor }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let datForChart = data?.map((item) => {
      if (chartFor === 'device') {
        const colorMap = {
          completed: '#08A1F7', // Changed to hex code for green
          pending: '#922BF2', // Changed to hex code for gray
          not_started: '#FF3B11',
        };

        const colors = data.map((item) => colorMap[item._id]);

        const newOptions = {
          ...options,
          color: colors,
        };

        setOptions(newOptions);
        const nameMap = {
          not_started: 'Not Started',
          completed: 'Completed',
          pending: 'Pending',
        };
        return {
          value: item.count,
          name: nameMap[item._id] || item._id,
        };
      } else {
        return {
          value: item.male_count + item.female_count,
          name: item._id === 'male' ? 'Male' : item._id === 'fe-male' ? 'Female' : null,
        };
      }
    });
    setChartData(datForChart);
  }, [data]);

  const [options, setOptions] = useState({
    title: {},
    tooltip: {
      trigger: 'item',
    },

    legend: { show: false },
    labelLine: {
      show: false,
    },
    color: ['#4379EE', '#5CC8BE', '#243642', '#BC7C7C'],
  });

  useEffect(() => {
    const newOptions = { ...options };
    if (chartFor == 'gender') {
      newOptions.series = [
        {
          type: 'pie',
          radius: '50%',
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ];
    } else if (chartFor == 'device') {
      newOptions.series = [
        {
          type: 'pie',
          radius: '50%',
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ];
    }
    setOptions(newOptions);
  }, [chartFor, chartData]);

  return (
    <ReactEcharts notMerge={true} option={options} style={{ width: '340px', height: '340px' }} />
  );
}
