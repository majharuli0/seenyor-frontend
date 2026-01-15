import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/bar';

export default function TotalSalesChart({ data = [], chartFor = '' }) {
  const totalValue = data.reduce((sum, item) => sum + item.total_orders, 0);
  const [colorMapping, setColorMapping] = useState({});
  const propertyNamesMapping = {
    completed: 'Completed',
    pending: 'In Progress',
    cancelled: 'Cancelled',
    not_started: 'Not Started',
  };
  useEffect(() => {
    if (chartFor === 'totalSales') {
      setColorMapping({
        paid: '#36b610',
        completed: '#4379EE',
        pending: '#F1963A',
        cancelled: '#D90000',
      });
    } else if (chartFor === 'totalInstallations') {
      setColorMapping({
        completed: '#36b610',
        pending: '#833af1',
        not_started: '#5d5d5d',
      });
    }
  }, [chartFor]);
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
    // color: Object.values(colorMapping),
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
        data: data.map((item) => ({
          value: item.total_orders,
          name: propertyNamesMapping[item.property_name] || 'Unknown Status',
          itemStyle: {
            color: colorMapping[item.property_name],
          },
        })),
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
          position: [0, 50],
        },
      ],
    },
  };

  return (
    <ReactEcharts notMerge={true} option={option} style={{ width: '340px', height: '340px' }} />
  );
}
