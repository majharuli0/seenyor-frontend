import React from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/bar';
import { tooltip } from 'leaflet';

export default function TotalAlertsChart() {
  const data = [
    { value: 250, name: 'End User Sales' },
    { value: 120, name: 'Nursing Home Sales' },
    { value: 304, name: 'Monitoring Stations Sales' },
  ];

  const option = {
    legend: false,
    toolbox: {
      show: false,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    series: [
      {
        name: 'Alert',
        type: 'pie',
        radius: ['30%', '80%'], // Reduce the radius to fit in the container
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 40, name: 'Alert 1' },
          { value: 38, name: 'Alert 2' },
          { value: 32, name: 'Alert 3' },
          { value: 30, name: 'Alert 4' },
          { value: 28, name: 'Alert 5' },
          { value: 26, name: 'Alert 6' },
          { value: 22, name: 'Alert 7' },
          { value: 18, name: 'Alert 8' },
        ],
      },
    ],
  };

  return (
    <ReactEcharts
      notMerge={true}
      option={option}
      style={{ width: '100%', height: '400px' }} // Set a fixed height to avoid cutting
    />
  );
}
