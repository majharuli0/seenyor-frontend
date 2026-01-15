import React from 'react';
import ReactECharts from 'echarts-for-react';

const DonutChart = ({
  data,
  height = '250px',
  centerText,
  centerSubtext,
  withLabels = false,
  valuePrefix = '',
}) => {
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: true,
        label: {
          show: withLabels,
          position: withLabels ? 'outside' : 'center',
          formatter: withLabels ? `{name|{b}}\n{value|${valuePrefix} {c}}` : undefined,
          color: 'inherit',
          rich: {
            name: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#6b7280',
              padding: [0, 0, 4, 0],
            },
            value: {
              fontSize: 16,
              fontWeight: 'bold',
              color: 'inherit',
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: withLabels ? 14 : 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: withLabels,
          length: 15,
          length2: 10,
        },
        data: data,
      },
    ],
  };

  return (
    <div className='relative'>
      <ReactECharts option={option} style={{ height }} />
      {(centerText || centerSubtext) && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none'>
          {centerText && <p className='text-2xl font-bold text-gray-800'>{centerText}</p>}
          {centerSubtext && <p className='text-xs text-gray-500'>{centerSubtext}</p>}
        </div>
      )}
    </div>
  );
};

export default DonutChart;
