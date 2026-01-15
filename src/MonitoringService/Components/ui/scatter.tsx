import React from 'react';
import ReactECharts from 'echarts-for-react';
import { NoDataChart } from '../NoData';

// Helper function to calculate duration between times
function calculateDurationBetweenTimes(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, totalMinutes: diffMs / (1000 * 60) };
}

// Helper function to format SLA minutes
function formatSLATime(slaMinutes) {
  const hours = Math.floor(slaMinutes / 60);
  const minutes = Math.floor(slaMinutes % 60);
  const seconds = Math.floor((slaMinutes * 60) % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Format your data to match the chart structure
const formatChartData = (rawData) => {
  return rawData.map((item) => {
    const createdDate = new Date(item.created_at);
    const closedDate = new Date(item.closed_at);

    // Calculate response time duration
    const duration = calculateDurationBetweenTimes(item.created_at, item.closed_at);

    // Get date in YYYY-MM-DD format
    const day = createdDate.toISOString().split('T')[0];

    // Get time in HH:MM format
    const time = createdDate.toTimeString().split(' ')[0].substring(0, 5);

    // Calculate decimal hour for positioning (0-24)
    const hour = createdDate.getHours() + createdDate.getMinutes() / 60;

    // Format SLA time
    const slaTimeFormatted = formatSLATime(item.sla_minutes);

    // Map event numbers to alert types if needed
    const eventMap = {
      '2': 'Fall Alert',
      '5': 'Device Offline Alert',
    };

    return {
      _id: item._id,
      day: day,
      time: time,
      hour: hour,
      responseTime: duration.totalMinutes,
      responseTimeFormatted: `${duration.hours}h ${duration.minutes}m ${duration.seconds}s`,
      slaTime: item.sla_minutes,
      slaTimeFormatted: '2m',
      alertId: item._id,
      compliance: item.sla_status,
      alertType: eventMap[item.event] || `Event ${item.event}`,
      created_at: item.created_at,
      closed_at: item.closed_at,
      event: item.event,
    };
  });
};

export function Scatter({ data = [], width = '100%', height = 400 }) {
  // Generate sample data if no data provided
  const generateSampleData = () => {
    const days = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'];
    const alertTypes = ['Device Offline Alert', 'Fall Alert'];
    const sampleData = [];

    days.forEach((day) => {
      // Generate 8-20 random alerts per day
      const alertCount = Math.floor(Math.random() * 12) + 8;

      for (let i = 0; i < alertCount; i++) {
        const hour = Math.floor(Math.random() * 24); // 0-23 hours
        const minute = Math.floor(Math.random() * 60); // 0-59 minutes
        const responseTime = Math.floor(Math.random() * 25) + 5; // 5-30 minutes
        const slaTime = 15; // Fixed SLA time of 15 minutes
        const compliance = responseTime <= slaTime;
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];

        sampleData.push({
          day: day,
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          hour: hour + minute / 60, // Decimal hour for positioning
          responseTime: responseTime,
          slaTime: slaTime,
          alertId: `A${day.replace(/-/g, '')}${i + 1}`,
          compliance: compliance,
          alertType: alertType,
        });
      }
    });

    return sampleData;
  };

  // Format the incoming data or use sample data
  const formattedData = data.length > 0 ? formatChartData(data) : [];
  const chartData = formattedData;

  // Calculate totals for legend
  const totalAlerts = chartData.length;
  const compliantAlerts = chartData.filter((item) => item.compliance).length;
  const nonCompliantAlerts = chartData.filter((item) => !item.compliance).length;

  // Process data for the chart - only two series: compliant and non-compliant
  const compliantData = chartData.filter((item) => item.compliance);
  const nonCompliantData = chartData.filter((item) => !item.compliance);

  // Get unique days for yAxis (sorted)
  const days = [...new Set(chartData.map((alert) => alert.day))].sort();

  // if (days.length === 0) {
  //   return <NoDataChart type="general" height={height} width={width} />;
  // }

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'transparent',
      borderWidth: 0,
      renderMode: 'html',
      appendToBody: true,
      className: '!shadow-none',
      formatter: (params) => {
        const {
          name,
          compliance,
          responseTimeFormatted,
          slaTimeFormatted,
          time,
          day,
          alertType,
          event,
          created_at,
          closed_at,
        } = params.data;
        const status = compliance ? 'Compliance' : 'Not Compliance';
        const statusColor = compliance ? '#10b981' : '#ef4444';

        return `
          <div class="bg-background border border-border rounded-lg shadow-xl p-3 min-w-[250px] z-999">
            <div class="text-sm font-semibold text-text mb-3 border-b border-border pb-2">
              ${alertType}
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-text/80 text-sm">Date</span>
                <span class="font-mono font-medium text-text">${day}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text/80 text-sm">Time</span>
                <span class="font-mono font-medium text-text">${time}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text/80 text-sm">Response Time</span>
                <span class="font-mono font-medium text-text">${responseTimeFormatted}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text/80 text-sm">SLA Time</span>
                <span class="font-mono font-medium text-text">${slaTimeFormatted}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-text/80 text-sm">Status</span>
                <span class="font-mono font-medium" style="color: ${statusColor}">${status}</span>
              </div>
             
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: true,
      bottom: 0,
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      textStyle: {
        color: 'rgb(var(--ms-text-color))',
        fontSize: 12,
      },
      formatter: function (name) {
        if (name === 'Total Alerts') {
          return `Total Alerts: ${totalAlerts}`;
        } else if (name === 'Compliance') {
          return `Compliance: ${compliantAlerts}`;
        } else if (name === 'Not Compliance') {
          return `Not Compliance: ${nonCompliantAlerts}`;
        }
        return name;
      },
      rich: {
        bold: {
          fontWeight: 'bold',
          color: 'rgb(var(--ms-text-color))',
          fontFamily: 'monospace',
          fontSize: 12,
        },
      },
      data: [
        {
          name: 'Total Alerts',
          itemStyle: { color: 'rgb(var(--ms-primary-color))' },
        },
        {
          name: 'Compliance',
          itemStyle: { color: data.length == 0 ? '#ccc' : '#10b981' },
        },
        {
          name: 'Not Compliance',
          itemStyle: { color: data.length == 0 ? '#ccc' : '#ef4444' },
        },
      ],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      nameLocation: 'middle',
      nameGap: 30,
      min: 0,
      max: 24,
      axisLine: {
        show: false,
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.3)',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: 'rgb(var(--ms-text-color)/0.7)',
        formatter: function (value) {
          return `${Math.floor(value)}:00`;
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.1)',
          type: 'solid',
        },
      },
    },
    yAxis: {
      type: 'category',
      nameLocation: 'middle',
      nameGap: 40,
      data: days,
      axisLine: {
        show: false,
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.3)',
        },
      },

      axisTick: {
        show: true,
      },
      axisLabel: {
        show: true,
        color: 'rgb(var(--ms-text-color)/0.7)',
        formatter: function (value) {
          const date = new Date(value);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgb(var(--ms-text-color)/0.1)',
        },
      },
    },
    dataZoom: [
      {
        type: 'slider',
        yAxisIndex: 0,
        show: days.length > 5,
        right: '20px',
        width: 12,
        borderColor: 'transparent',
        backgroundColor: 'rgb(var(--ms-text-color)/0.1)',
        fillerColor: 'rgb(var(--ms-primary-color)/0.2)',
        handleSize: '100%',
        handleStyle: {
          color: 'rgb(var(--ms-primary-color))',
        },
        showDetail: false,
        brushSelect: false,
        zoomLock: false,
        start: 0,
        end: Math.min(100, (10 / days.length) * 100),
        height: '70%',
        top: 'center',
      },
      // {
      //   type: "inside",
      //   yAxisIndex: 0,
      //   filterMode: "filter",
      // },
    ],
    series: [
      {
        name: 'Compliance',
        type: 'scatter',
        symbolSize: 10,
        data: compliantData.map((alert) => ({
          name: alert.alertId,
          value: [alert.hour, alert.day],
          responseTime: alert.responseTime,
          responseTimeFormatted: alert.responseTimeFormatted,
          slaTime: alert.slaTime,
          slaTimeFormatted: alert.slaTimeFormatted,
          compliance: alert.compliance,
          day: alert.day,
          time: alert.time,
          alertType: alert.alertType,
          event: alert.event,
          created_at: alert.created_at,
          closed_at: alert.closed_at,
          itemStyle: {
            color: data.length == 0 ? '#ccc' : '#10b981',
          },
        })),
        itemStyle: {
          color: data?.length == 0 ? '#ccc' : '#10b981',
        },
        emphasis: {
          scale: true,
          scaleSize: 2,
        },
      },
      {
        name: 'Not Compliance',
        type: 'scatter',
        symbolSize: 10,
        data: nonCompliantData.map((alert) => ({
          name: alert.alertId,
          value: [alert.hour, alert.day],
          responseTime: alert.responseTime,
          responseTimeFormatted: alert.responseTimeFormatted,
          slaTime: alert.slaTime,
          slaTimeFormatted: alert.slaTimeFormatted,
          compliance: alert.compliance,
          day: alert.day,
          time: alert.time,
          alertType: alert.alertType,
          event: alert.event,
          created_at: alert.created_at,
          closed_at: alert.closed_at,
          itemStyle: {
            color: data.length == 0 ? '#ccc' : '#ef4444',
          },
        })),
        itemStyle: {
          color: data?.length == 0 ? '#ccc' : '#ef4444',
        },
        emphasis: {
          scale: true,
          scaleSize: 2,
        },
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
