import React, { useEffect, useMemo, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Empty } from 'antd';
function dayOfWeekFromDayNumber(dayNumber) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return daysOfWeek[dayNumber];
}

const RateChart = ({ dateType, cheartInfo = {}, color, fromDate, toDate }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set the mounted state to true once the component is mounted
    setIsMounted(true);
  }, []);
  const option = useMemo(() => {
    try {
      const { xdata, maxArray, minArray, allAvgNumber } = cheartInfo;

      // Generate all dates in the range
      const dates = [];
      const start = new Date(fromDate);
      const end = new Date(toDate);

      // Create a map of existing data
      const dataMap = new Map();
      xdata.forEach((date, index) => {
        const dateStr = new Date(date).toISOString().split('T')[0];
        dataMap.set(dateStr, {
          min: minArray[index],
          max: maxArray[index],
        });
      });

      // Generate all dates and their data
      const allData = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const existingData = dataMap.get(dateStr);

        if (dateType === 'Month') {
          const month = d.getMonth() + 1;
          const day = d.getDate();
          dates.push(`${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`);
        } else {
          dates.push(dayOfWeekFromDayNumber(d.getDay() === 0 ? 6 : d.getDay() - 1));
        }

        allData.push({
          min: existingData ? existingData.min : null,
          max: existingData ? existingData.max : null,
        });
      }

      // Find min/max values and their positions from valid data only
      const validData = allData.filter((d) => d.min !== null && d.max !== null);
      const minValue = Math.min(...validData.map((d) => d.min));
      const maxValue = Math.max(...validData.map((d) => d.max));

      // Find the positions of min and max values
      const minPosition = allData.findIndex((item) => item.min === minValue);
      const maxPosition = allData.findIndex((item) => item.max === maxValue);

      return {
        backgroundColor: '#fff',
        grid: {
          left: '2%',
          right: '7%',
          bottom: '4%',
          top: '20%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const date = params[0].axisValue;
            const minVal = params[0].value[1];
            const maxVal = params[0].value[2];
            // Determine unit based on color or add a prop for dataType
            const unit = color === '#FF9D3D' ? ' breaths/min' : ' bpm';
            return `<span style="font-weight: bold;">Date: ${date}</span><br/><span >Max: ${
              maxVal || '-'
            }${maxVal ? unit : ''}</span><br/><span >Min: ${
              minVal || (minVal >= 0 && minVal !== null) ? minVal : '-'
            }${minVal || (minVal >= 0 && minVal !== null) ? unit : ''}</span>`;
          },
        },
        xAxis: {
          type: 'category',
          splitLine: { show: false },
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: '#ccc',
            },
          },
          axisLabel: {
            color: '#666',
          },
          data: dates,
        },
        yAxis: {
          type: 'value',
          name: 'BPM',
          nameLocation: 'end',
          axisLine: { show: false },
          axisLabel: {
            color: '#666',
          },
          splitLine: {
            lineStyle: {
              color: '#eee',
            },
          },
        },
        series: [
          {
            name: 'Range',
            type: 'custom',
            renderItem: (params, api) => {
              const start = api.coord([api.value(0), api.value(1)]);
              const end = api.coord([api.value(0), api.value(2)]);
              const height = end[1] - start[1];

              return {
                type: 'rect',
                shape: {
                  x: start[0] - 10,
                  y: start[1],
                  width: 20,
                  height: height,
                  r: 10,
                },
                style: {
                  fill: color, // Adjust the color as needed
                  //   stroke: "#2980b9",
                  lineWidth: 1,
                },
              };
            },
            encode: {
              x: 0,
              y: [1, 2], // Encode for the range (min, max)
            },
            data: allData.map((item, i) => [i, item.min, item.max]),
          },
          {
            name: 'Average',
            type: 'line',
            symbol: 'none',
            lineStyle: {
              type: 'dashed',
              width: 1,
            },
            markLine: {
              silent: true,
              symbol: 'none',
              data: [
                {
                  yAxis: allAvgNumber,
                  label: {
                    show: true,
                    formatter: () => {
                      const unit = color === '#FF9D3D' ? ' breaths/min' : ' bpm';
                      return `Avg: ${allAvgNumber}${unit}`;
                    },
                    position: 'end',
                    color: color,
                  },
                  lineStyle: {
                    color: color,
                    width: 1,
                  },
                },
              ],
            },
          },
          {
            name: 'Minimum',
            type: 'pictorialBar',
            symbolSize: [15, 15],
            symbolOffset: [0, -19],
            symbolPosition: 'end',
            z: 12,
            label: {
              normal: {
                show: true,
                offset: [1, 60],
                position: 'top',
                fontSize: 13,
                fontWeight: 400,
                color: color,
                lineHeight: 15,
                formatter: function (params) {
                  const unit = color === '#FF9D3D' ? ' breaths/min' : ' bpm';
                  return `Min\n${minValue}${unit}`;
                },
              },
            },
            itemStyle: {
              borderColor: color,
              borderWidth: 2,
              borderType: 'solid',
            },
            color: '#fff',
            data: new Array(allData.length).fill(null).map((_, index) => ({
              value: index === minPosition ? minValue : '-',
              symbolSize: [15, 15],
              symbol: index === minPosition ? 'circle' : 'none',
            })),
          },
          {
            name: 'Maximum',
            type: 'pictorialBar',
            symbolSize: [15, 15],
            symbolOffset: [0, 2],
            symbolPosition: 'end',
            z: 12,
            label: {
              normal: {
                show: true,
                offset: [1, 2],
                position: 'top',
                fontSize: 13,
                fontWeight: 400,
                color: color,
                lineHeight: 15,
                formatter: function (params) {
                  const unit = color === '#FF9D3D' ? ' breaths/min' : ' bpm';
                  return `Max\n${maxValue}${unit}`;
                },
              },
            },
            itemStyle: {
              borderColor: color,
              borderWidth: 2,
              borderType: 'solid',
            },
            color: '#fff',
            data: new Array(allData.length).fill(null).map((_, index) => ({
              value: index === maxPosition ? maxValue : '-',
              symbolSize: [15, 15],
              symbol: index === maxPosition ? 'circle' : 'none',
            })),
          },
        ],
        legend: {
          data: ['Average', 'Minimum', 'Maximum'],
          textStyle: {
            color: '#666',
          },
        },
      };
    } catch (error) {
      return {
        backgroundColor: '#fff',
        title: {
          text: 'No data available',
          show: true,
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#000',
            fontSize: '20px',
            fontWeight: 400,
          },
        },
      };
    }
  }, [cheartInfo, dateType, isMounted, fromDate, toDate, color]);
  if (!cheartInfo?.xdata?.length) {
    return <Empty description='No data available to show' />;
  }
  return (
    <ReactEcharts
      option={option}
      notMerge={true}
      style={{
        height: '300px',
        width: '100%',
        transition: 'all 0.3s ease',
      }}
    />
  );
};

export default RateChart;
