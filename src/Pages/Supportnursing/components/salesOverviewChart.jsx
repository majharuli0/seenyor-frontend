import React from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/bar';

export default function SalesOverviewChart({ data = [] }) {
  // Extract _id (dates) and total_orders
  const datesArray = data.map((item) => item._id);
  const totalOrdersArray = data.map((item) => item.total_orders);

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: datesArray,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: totalOrdersArray,
        type: 'line',
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: '#4379EE',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1, // Gradient from top (y=0) to bottom (y=1)
            colorStops: [
              { offset: 0, color: 'rgba(67, 121, 238, 0.5)' }, // Top: Transparent
              { offset: 1, color: 'rgba(255, 255, 255, 0) ' }, // Bottom: Blue with 50% opacity
            ],
          },
        },

        lineStyle: {
          color: '#4379EE',
        },
      },
    ],
    graphic:
      totalOrdersArray.length === 0
        ? {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: {
              text: 'No Data Available',
              fontSize: 20,
              fontWeight: 'bold',
              fill: '#999', // color of the text
            },
          }
        : null,
  };
  return <ReactEcharts notMerge={true} option={option} style={{ width: '100%', height: '100%' }} />;
}
