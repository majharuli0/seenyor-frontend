import React, { useEffect, useState, useMemo, useContext } from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { SidebarContext } from '@/Context/CustomContext';
import { Empty } from 'antd';

// Extend dayjs with the plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function MultibarChart({ data, fromDate, toDate, valueType = 'duration' }) {
  const [chartData, setChartData] = useState([]);
  const { sleepEventsType, sleepEventsColor } = useContext(SidebarContext);

  useEffect(() => {
    setChartData(Array.isArray(data) ? data : []);
  }, [data]);

  const formatValue = (value, type) => {
    if (type === 'duration') {
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return `${hours}hr ${minutes}m`;
    }
    // For time or number type values, return as is
    return value.toString();
  };

  const chartOptions = useMemo(() => {
    // Generate all dates between fromDate and toDate
    const getAllDates = (start, end) => {
      const dates = [];
      let currentDate = dayjs(start);
      const endDate = dayjs(end);

      while (currentDate.isSameOrBefore(endDate)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
      }
      return dates;
    };

    const allDates = getAllDates(fromDate, toDate);

    // Create a map of existing data indexed by date
    const dataByDate = (Array.isArray(chartData) ? chartData : []).reduce((acc, item) => {
      if (!item?.date || !item?.data) return acc;
      const dateKey = dayjs(item.date).format('YYYY-MM-DD');
      acc[dateKey] = item.data;
      return acc;
    }, {});

    // Get unique status values from the actual data
    const activeStatuses = [
      ...new Set(
        (Array.isArray(chartData) ? chartData : []).flatMap(
          (item) => item?.data?.map((d) => d.status) || []
        )
      ),
    ];

    // Filter sleepEventsType to only include active events
    const activeEvents = Object.entries(sleepEventsType).filter(([status]) =>
      activeStatuses.includes(status)
    );

    // Create series only for events that exist in the data
    const series = activeEvents.map(([status, label]) => {
      const seriesData = allDates.map((date) => {
        const dayData = dataByDate[date];
        const eventData = dayData?.find((d) => d.status === status);
        const value = eventData ? Number(eventData.value) : 0;
        return value;
      });

      return {
        name: label,
        type: 'bar',
        stack: 'total',
        data: seriesData,
        barMaxWidth: 20,
        itemStyle: { color: sleepEventsColor[label] },
      };
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          let tooltipText = `${params[0].axisValue}<br/>`;
          params.forEach((param) => {
            if (param.value > 0) {
              tooltipText += `${param.marker} ${
                param.seriesName
              }: ${formatValue(param.value, valueType)}<br/>`;
            }
          });
          return tooltipText;
        },
      },
      legend: {
        data: activeEvents.map(([_, label]) => label),
      },
      xAxis: {
        type: 'category',
        data: allDates,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => formatValue(value, valueType),
        },
      },
      series,
    };
  }, [chartData, fromDate, toDate, sleepEventsType, sleepEventsColor, valueType]);

  if (data?.length === 0 || !toDate || !fromDate) {
    return <Empty description='No data available to show' />;
  }

  return <ReactECharts option={chartOptions} style={{ height: '350px' }} />;
}
