import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { formatDuration, extractTimeAndSuffix } from '@/utils/helper';

// Helper function to convert 24-hour time to 12-hour format with AM/PM
const formatTo12HourTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  return `${formattedHours}:${String(minutes).padStart(2, '0')} ${suffix}`;
};
const DynamicBarChart = ({ title, fromDate, toDate, values, dataType = 'number', unit = '' }) => {
  // Generate dates dynamically based on fromDate and toDate
  const generateDates = (start, end) => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const dates = [];
    let currentDate = startDate;

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      dates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }

    return dates;
  };

  const categories = generateDates(fromDate, toDate);

  // Process the data based on the dataType
  const processedValues = useMemo(() => {
    if (dataType === 'duration') {
      return values.map((time) => {
        if (!time) return 0;
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 60 + minutes + seconds / 60; // Convert to minutes
      });
    }
    if (dataType === 'time') {
      return values.map((time) => {
        const { time: parsedTime } = extractTimeAndSuffix(time);
        const [hours, minutes] = parsedTime.split(':').map(Number);
        return hours * 60 + minutes; // Convert to minutes for Y-axis
      });
    }
    return values;
  }, [values, dataType]);
  // Dynamically define Y-Axis configuration and tooltip
  const { yAxisConfig, tooltipFormatter } = useMemo(() => {
    switch (dataType) {
      case 'duration':
        return {
          yAxisConfig: {
            type: 'value',
            axisLabel: {
              formatter: (value) => formatDuration(`${Math.floor(value / 60)}:${value % 60}:00`),
            },
          },
          tooltipFormatter: (params) => {
            if (params[0]) {
              const date = params[0].axisValueLabel; // Get the date from the X-axis
              const formattedValue = formatDuration(
                `${Math.floor(params[0].value / 60)}:${params[0].value % 60}:00`
              );
              return `${date}<br/><b> ${formattedValue}</b>`;
            }
            return '0h 0m';
          },
        };
      case 'time':
        return {
          yAxisConfig: {
            type: 'value',
            axisLabel: {
              formatter: (value) => {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return formatTo12HourTime(
                  `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
                );
              },
            },
          },
          tooltipFormatter: (params) => {
            const value = params[0]?.value || 0;
            const date = params[0]?.axisValueLabel; // Get the date from the X-axis
            const hours = Math.floor(value / 60);
            const minutes = value % 60;
            const originalTime = formatTo12HourTime(
              `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
            );
            const { suffix } = extractTimeAndSuffix(values[params[0]?.dataIndex]);
            return `${date}<br/><b> ${suffix ? `${originalTime} ${suffix}` : originalTime}</b>`;
          },
        };
      case 'number':
      default:
        return {
          yAxisConfig: {
            type: 'value',
            axisLabel: {
              formatter: '{value}',
            },
          },
          tooltipFormatter: (params) => {
            const value = params[0]?.value;
            const date = params[0]?.axisValueLabel; // Get the date from the X-axis
            return `${date}<br/><b> ${value} ${unit}</b>`;
          },
        };
    }
  }, [values, dataType]);

  // ECharts options
  const options = useMemo(
    () => ({
      title: {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: tooltipFormatter,
      },
      xAxis: {
        type: 'category',
        data: categories,
      },
      yAxis: yAxisConfig,
      series: [
        {
          type: 'bar',
          data: processedValues,
          barMaxWidth: 20,
          itemStyle: {
            color: '#324257',
            borderRadius: [50, 50, 0, 0],
          },
        },
      ],
    }),
    [title, categories, yAxisConfig, processedValues, tooltipFormatter, values, dataType]
  );

  return <ReactECharts option={options} style={{ height: '350px' }} />;
};

export default DynamicBarChart;
