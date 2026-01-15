import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default function TotalAlertChart({ data = [] }) {
  // Calculate counts for each type
  const problemCount = data
    .filter((item) => item.type === 1)
    .reduce((acc, curr) => acc + curr.count, 0);
  const warningCount = data
    .filter((item) => item.type === 2)
    .reduce((acc, curr) => acc + curr.count, 0);
  const criticalCount = data
    .filter((item) => item.type === 3)
    .reduce((acc, curr) => acc + curr.count, 0);

  // Prepare data for the pie chart
  const pieData = [
    { value: problemCount, name: 'Info' },
    { value: warningCount, name: 'Warning' },
    { value: criticalCount, name: 'Critical' },
  ];

  // Calculate the total value
  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);

  // ECharts option configuration
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    color: ['#4379EE', '#F1963A', '#D90000'],
    series: [
      {
        name: 'Activity',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          formatter: '{b}: {c} ({d}%)',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 18,
            fontWeight: 'bold',
          },
        },
        data: data.length !== 0 ? pieData : null,
      },
    ],
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: '53%',
          style: {
            text: 'Total',
            textAlign: 'center',
            fill: '#333',
            fontSize: 16,
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '45%',
          style: {
            text: totalValue.toString(),
            textAlign: 'center',
            fill: '#333',
            fontSize: 22,
            fontWeight: 'bold',
          },
        },
      ],
    },
  };

  return <ReactEcharts option={option} style={{ width: '340px', height: '340px' }} />;
}
