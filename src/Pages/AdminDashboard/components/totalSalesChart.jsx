import React from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/bar';

export default function TotalSalesChart({ data }) {
  const colorMapping = {
    monitoring_station: '#D90000',
    end_user: '#4379EE',
    nursing_home: '#F1963A',
  };
  const roleMapping = {
    monitoring_station: 'Control Centers Sales',
    end_user: 'End User Sales',
    nursing_home: 'Nursing Home sales',
  };

  // Filter the user data for specific roles
  const filteredData = data.filter((user) =>
    ['nursing_home', 'end_user', 'monitoring_station'].includes(user.role)
  );

  // Prepare data for the chart, including colors
  const chartData = filteredData.map((user) => ({
    value: user.count,
    name: roleMapping[user.role] || user.role,
    itemStyle: { color: colorMapping[user.role] }, // Assign specific color
  }));

  // Calculate total value for the center of the pie chart
  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const option = {
    tooltip: {
      trigger: 'item',
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      containLabel: true,
    },
    series: [
      {
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
          position: 'center',
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        labelLine: {
          show: true,
        },
        data: chartData,
      },
    ],
    graphic: {
      elements: [
        {
          type: 'text',
          id: 'center-total-text',
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
          id: 'center-value-text',
          left: 'center',
          top: '45%',
          style: {
            text: totalValue,
            textAlign: 'center',
            fill: '#333',
            fontSize: 22,
            fontWeight: 'bold',
          },
          // Position the value text slightly below the center
          position: [0, 50], // Adjust the 20 value to control the vertical spacing
        },
      ],
    },
  };

  return (
    <ReactEcharts notMerge={true} option={option} style={{ width: '340px', height: '340px' }} />
  );
}
