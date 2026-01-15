import React from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/bar';

export default function BarChart({ data, graphTitle }) {
  const yAxisData = data?.map((item) => item.name);
  const seriesData = data?.map((item) => item.total_sales);
  const maxLabelLength = 10;
  const option = {
    xAxis: {
      max: 'dataMax',
    },
    tooltip: {
      formatter: function (params) {
        return `${params.marker}${params.name}<br/>$${params.value}`; // Add dollar sign and use line breaks for column layout
      },
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '10%',
      top: '5%',
      containLabel: true,
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      axisLabel: {
        formatter: function (value) {
          // If the label (name) exceeds the max length, truncate it and add ellipsis
          if (value.length > maxLabelLength) {
            return value.substring(0, maxLabelLength) + '...';
          }
          return value;
        },
      },
    },
    dataZoom: [
      {
        type: 'inside',
        yAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: graphTitle,
        type: 'bar',
        // stack:'total',
        data: seriesData,
        itemStyle: {
          color: '#4379EE',
        },
        label: {
          show: true,
          valueAnimation: true,
          formatter: function (params) {
            return `$${params.value}`; // Add dollar sign
          },
        },
        barWidth: seriesData.length < 5 ? 30 : 'auto',
      },
    ],
    legend: {
      show: false,
    },
    graphic:
      seriesData.length === 0
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
