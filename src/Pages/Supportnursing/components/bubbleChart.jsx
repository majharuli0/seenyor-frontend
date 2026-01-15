import React from 'react';
import ReactECharts from 'echarts-for-react';

const BubbleChart = ({ data = [] }) => {
  const hasData = data.length > 0;
  const option = {
    title: {},
    tooltip: {
      trigger: 'item',
      textStyle: {
        color: '#333', // Text color
        fontSize: 16,
        fontFamily: 'Arial, sans-serif',
      },
      formatter: function (params) {
        return `
            <div style="padding: 5px; text-align: left;">
              <div><strong>Activity:</strong> ${params.data[0]}</div>
              <div><strong>Count:</strong> ${params.data[1]}</div>
            </div>
          `;
      },
    },
    grid: {
      left: '2%',
      right: '0%',
      bottom: '30%',
      top: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false, // Hide x-axis line
      },
      axisTick: {
        show: false, // Hide x-axis ticks
      },
    },
    yAxis: {
      type: 'value',
      name: 'Count',
      nameLocation: 'center',
      nameGap: 40,
      scale: true, // Enables dynamic scaling for the y-axis
      splitLine: {
        show: false, // Optional: Hide grid lines for a cleaner look
      },
    },
    dataZoom: hasData
      ? [
          {
            type: 'inside', // Enables scrolling and zooming
            start: 0,
            end: 100,
          },
          {
            type: 'slider',
            start: 0,
            end: 100,
          },
        ]
      : [], // No zoom bar if there's no data
    series: hasData
      ? [
          {
            type: 'scatter',
            symbolSize: function (value) {
              // Dynamic bubble size with an upper limit for large datasets
              return Math.min(Math.sqrt(value[1]) * 5, 40);
            },
            data: data.map((item) => [item.property_name, item.count]),
            label: {
              show: false, // Turn off bubble labels for large datasets
            },
            itemStyle: {
              color: 'rgba(67, 121, 238, 0.8)', // Semi-transparent shade
            },
          },
        ]
      : [],
  };
  if (data.length === 0) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        {' '}
        <span className='text-[#999999] font-semibold text-xl'> No Data Available</span>{' '}
      </div>
    );
  }
  return (
    <ReactECharts
      option={option}
      style={{ height: '370px', width: '100%' }}
      opts={{ renderer: 'canvas' }} // Ensures canvas-based rendering for responsiveness
    />
  );
};

export default BubbleChart;
