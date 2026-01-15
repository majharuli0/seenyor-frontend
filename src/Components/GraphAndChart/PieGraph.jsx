import React from 'react';
import ReactECharts from 'echarts-for-react';

const PieGraph = ({ data, height = '250px', isRose = false }) => {
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      icon: 'circle',
      itemGap: 15,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '65%',
        center: ['35%', '50%'],
        roseType: isRose ? 'radius' : false,
        data: data,
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}\n{b}',
          color: '#fff',
          fontSize: 11,
          fontWeight: 'bold',
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} />;
};

export default PieGraph;
