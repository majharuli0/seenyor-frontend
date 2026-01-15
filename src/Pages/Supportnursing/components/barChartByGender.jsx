import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

export default function BarChartByGender({ data = [], chartFor }) {
  const [options, setOptions] = useState({});
  useEffect(() => {
    if (data.length === 0) {
      setOptions({
        graphic: {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: 'No Data Available',
            fontSize: 20,
            fontWeight: 'bold',
            fill: '#999',
          },
        },
      });
      return;
    }

    // Default X-Axis for Age Chart
    const defaultAgeXAxis = [
      '20-29',
      '30-39',
      '40-49',
      '50-59',
      '60-69',
      '70-79',
      '80-89',
      '90-99',
    ];

    // Prepare X-Axis and Y-Axis Data
    const xAxisData = chartFor === 'age' ? defaultAgeXAxis : data.map((item) => item._id);
    const yAxisData = [
      {
        name: 'Male',
        type: 'bar',
        color: '#357AF6',
        data: xAxisData.map((range) => {
          const found = data.find((item) => item._id === range);
          return found ? found.male_count : 0;
        }),
      },
      {
        name: 'Female',
        type: 'bar',
        color: '#5CC8BE',
        data: xAxisData.map((range) => {
          const found = data.find((item) => item._id === range);
          return found ? found.female_count : 0;
        }),
      },
    ];
    const maxValue = Math.max(...yAxisData.flatMap((item) => item.data));

    // Define chart options dynamically
    const newOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        show: true,
        top: 0,
        data: ['Male', 'Female'],
      },
      grid: {
        left: chartFor === 'age' ? '0%' : '5%',
        right: '0%',
        bottom: '10%',
        top: '10%',
        containLabel: true,
      },
      series: yAxisData, // Series is the same for both chart types
    };

    if (chartFor === 'age') {
      newOptions.xAxis = {
        type: 'category',
        data: xAxisData,
      };
      newOptions.yAxis = {
        type: 'value',
        boundaryGap: [0, 0.01],
        min: 0,
        max: maxValue,
        interval: 1,
        axisLabel: {
          formatter: (value) => {
            // Display integer values only
            return Math.floor(value);
          },
        },
      };
    } else if (chartFor === 'diseases') {
      newOptions.yAxis = {
        type: 'category',
        data: xAxisData,
      };
      newOptions.xAxis = {
        type: 'value',
        boundaryGap: [0, 0.01],
        min: 0,
        max: maxValue,
        interval: 1,
        axisLabel: {
          formatter: (value) => {
            // Display integer values only
            return Math.floor(value);
          },
        },
      };
    }

    setOptions(newOptions);
  }, [chartFor, data, data.length]);

  return (
    <ReactEcharts notMerge={true} option={options} style={{ width: '100%', height: '100%' }} />
  );
}
