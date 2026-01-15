import React from 'react';
import ReactECharts from 'echarts-for-react';

export function AreaLineChartComponent({ width = '100%', height = 400, data = [] }) {
  const processData = () => {
    if (!data || data.length === 0) {
      return generateFallbackData();
    }

    const dateMap = new Map();
    data.forEach((item) => {
      const date = new Date(item.year, item.month - 1, item.day);
      const dateKey = date.toISOString().split('T')[0];
      const eventType = item.event === '5' ? 'Device Offline' : 'Fall Alert';

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date,
          timestamp: date.getTime(),
          dateFormatted: formatXAxisDate(date, data),
          tooltipDate: formatTooltipDate(date),
          'Fall Alert': 0,
          'Device Offline': 0,
        });
      }

      const dateData = dateMap.get(dateKey);
      dateData[eventType] += item.count || 0;
    });

    // Convert to array and sort by date
    const sortedData = Array.from(dateMap.values()).sort((a, b) => a.timestamp - b.timestamp);

    // Extract dates and series data
    const dates = sortedData.map((item) => item.dateFormatted);
    const tooltipDates = sortedData.map((item) => item.tooltipDate);
    const fallAlertData = sortedData.map((item) => item['Fall Alert']);
    const deviceOfflineData = sortedData.map((item) => item['Device Offline']);

    return { dates, tooltipDates, fallAlertData, deviceOfflineData };
  };

  // Format date for x-axis label
  const formatXAxisDate = (date, data) => {
    if (!data || data.length === 0) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }

    const dates = data.map((item) => new Date(item.year, item.month - 1, item.day));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const diffTime = Math.abs(maxDate - minDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 60) {
      // Show month and day for short ranges (up to 2 months)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } else {
      // Show month and year for longer ranges
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });
    }
  };

  // Format date for tooltip (always shows full date)
  const formatTooltipDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Generate fallback data if no data provided
  const generateFallbackData = () => {
    const dates = [];
    const tooltipDates = [];
    const fallAlertData = [];
    const deviceOfflineData = [];

    const today = new Date();
    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      tooltipDates.push(
        date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
      fallAlertData.push(Math.floor(0));
      deviceOfflineData.push(Math.floor(0));
    }

    return { dates, tooltipDates, fallAlertData, deviceOfflineData };
  };

  const { dates, tooltipDates, fallAlertData, deviceOfflineData } = processData();

  // Smart label interval calculation
  const getLabelInterval = (dataLength) => {
    if (dataLength <= 10) return 0; // Show all labels
    if (dataLength <= 20) return 1; // Show every other label
    if (dataLength <= 40) return 2; // Show every 3rd label
    if (dataLength <= 60) return 3; // Show every 4th label
    return Math.floor(dataLength / 12); // Dynamic interval for large datasets
  };

  // Calculate totals for legend
  const fallAlertTotal = fallAlertData.reduce((sum, value) => sum + value, 0);
  const deviceOfflineTotal = deviceOfflineData.reduce((sum, value) => sum + value, 0);

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'transparent',
      borderWidth: 0,
      className: '!shadow-none',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.2)',
          width: 1,
        },
      },
      formatter: (params) => {
        const index = params[0].dataIndex;
        const date = tooltipDates[index];
        const fallAlert = params.find((p) => p.seriesName === 'Fall Alert');
        const deviceOffline = params.find((p) => p.seriesName === 'Device Offline');

        return `
          <div class="bg-background border border-border rounded-lg shadow-xl p-3 min-w-[180px]">
            <div class="text-sm font-semibold text-text mb-3 border-b border-border pb-2">
              ${date}
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" style="background-color: #ef4444"></div>
                  <span class="text-text/80 text-sm">Fall Alert</span>
                </div>
                <span class="font-mono font-medium text-text">${fallAlert?.value || 0}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" style="background-color: #f59e0b"></div>
                  <span class="text-text/80 text-sm">Device Offline</span>
                </div>
                <span class="font-mono font-medium text-text">${deviceOffline?.value || 0}</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: true,
      bottom: 10,
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      textStyle: {
        color: 'rgb(var(--ms-text-color))',
        fontSize: 12,
        fontWeight: 'normal',
      },
      formatter: function (name) {
        if (name === 'Fall Alert') {
          return `Fall Alert: ${fallAlertTotal.toLocaleString()}`;
        } else if (name === 'Device Offline') {
          return `Device Offline: ${deviceOfflineTotal.toLocaleString()}`;
        }
        return name;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: dates.length > 15 ? '80px' : '50px',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: {
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.2)',
        },
      },
      axisLabel: {
        color: 'rgb(var(--ms-text-color)/0.7)',
        fontSize: 11,
        interval: getLabelInterval(dates.length),
        rotate: dates.length > 15 ? 45 : 0,
        margin: dates.length > 15 ? 15 : 8,
        formatter: (value) => {
          return value;
        },
      },
      axisTick: {
        alignWithLabel: true,
        interval: getLabelInterval(dates.length),
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.1)',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: 'rgb(var(--ms-text-color)/0.7)',
        fontSize: 12,
      },
    },
    series: [
      {
        name: 'Fall Alert',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: '#ef4444', // Red color for Fall Alert
        },
        itemStyle: {
          color: '#ef4444',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(239, 68, 68, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(239, 68, 68, 0.05)',
              },
            ],
          },
        },
        data: fallAlertData,
      },
      {
        name: 'Device Offline',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: '#f59e0b', // Amber warning color for Device Offline
        },
        itemStyle: {
          color: '#f59e0b',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(245, 158, 11, 0.3)', // Amber with opacity
              },
              {
                offset: 1,
                color: 'rgba(245, 158, 11, 0.05)',
              },
            ],
          },
        },
        data: deviceOfflineData,
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: dates.length > 30 ? 100 - Math.floor(3000 / dates.length) : 0,
        end: 100,
      },
      {
        show: false,
      },
    ],
  };

  return (
    <div style={{ width, height }}>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
