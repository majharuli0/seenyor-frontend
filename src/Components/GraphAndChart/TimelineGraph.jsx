import React, { useState, useContext, useEffect, useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Empty } from 'antd';
import { SidebarContext } from '@/Context/CustomContext';

const TimelineChart = ({
  statisticalData = [],
  alarmEvents = [],
  enterBedTime,
  getupAfterTime,
  noDataText = 'No data available to show',
}) => {
  const { sleepEventsType, sleepEventsColor } = useContext(SidebarContext);
  console.log(statisticalData);

  const events = useMemo(
    () =>
      [
        ...statisticalData.map((data) => ({
          id: `${data.status}-${data.start_time}-${data.end_time}`,
          name: sleepEventsType[data.status],
          startTime: new Date(data.start_time),
          endTime: new Date(data.end_time),
          color: sleepEventsColor[sleepEventsType[data.status]],
        })),
        ...alarmEvents.map((event) => ({
          id: `${event.event_type}-${event.ts}`,
          name: sleepEventsType[event.event_type],
          startTime: new Date(event.ts),
          endTime: new Date(event.ts),
          color: sleepEventsColor[sleepEventsType[event.event_type]],
        })),
      ].filter((event) => event.name),
    [statisticalData, alarmEvents, sleepEventsType, sleepEventsColor]
  );

  const uniqueEventNames = useMemo(
    () => [...new Set(events.map((event) => event.name))].filter(Boolean),
    [events]
  );

  const [visibleEvents, setVisibleEvents] = useState(() => {
    return uniqueEventNames.reduce((acc, eventName) => {
      acc[eventName] = true;
      return acc;
    }, {});
  });

  useEffect(() => {
    const newEvents = uniqueEventNames.filter((name) => !(name in visibleEvents));
    if (newEvents.length > 0) {
      setVisibleEvents((prev) => ({
        ...prev,
        ...newEvents.reduce((acc, name) => ({ ...acc, [name]: true }), {}),
      }));
    }
  }, [uniqueEventNames, visibleEvents]);

  const toggleEventVisibility = (eventName) => {
    setVisibleEvents((prev) => ({
      ...prev,
      [eventName]: !prev[eventName],
    }));
  };

  const filteredEvents = useMemo(
    () => events.filter((event) => visibleEvents[event.name]),
    [events, visibleEvents]
  );

  const minTime = Math.min(...events.map((event) => event.startTime.getTime()));
  const maxTime = Math.max(...events.map((event) => event.endTime.getTime()));

  const seriesData = useMemo(
    () =>
      filteredEvents.map((event, index) => {
        const isSingleEvent = event.startTime.getTime() === event.endTime.getTime();
        return {
          id: index,
          name: event.name,
          value: [event.startTime.getTime(), event.endTime.getTime(), isSingleEvent ? 15 : 10],
          itemStyle: {
            color: event.color,
          },
        };
      }),
    [filteredEvents]
  );

  if (statisticalData?.length === 0) {
    return <Empty description={noDataText} />;
  }

  const options = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const event = filteredEvents[params.data.id];
        const isSingleEvent = event.startTime.getTime() === event.endTime.getTime();
        const startTimeLocal = new Date(event.startTime).toLocaleString();

        if (isSingleEvent) {
          return `${event.name}<br/>Date & Time: ${startTimeLocal}`;
        } else {
          const endTimeLocal = new Date(event.endTime).toLocaleString();
          const durationMs = event.endTime - event.startTime;
          const durationMinutes = Math.floor(durationMs / (1000 * 60));
          const hours = Math.floor(durationMinutes / 60);
          const minutes = durationMinutes % 60;
          const durationStr =
            hours > 0 ? `${hours} hour(s) ${minutes} minute(s)` : `${minutes} minute(s)`;
          return `<b>${event.name}</b> <br/>Start: ${startTimeLocal}<br/>End: ${endTimeLocal}<br/>Duration: ${durationStr}`;
        }
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      containLabel: false,
    },
    xAxis: {
      type: 'time',
      boundaryGap: true,
      min: minTime,
      max: maxTime,
      splitNumber: 5,
      axisLabel: {
        formatter: (value) => {
          const date = new Date(value);
          return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
        },
        interval: 0,
        margin: 5,
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
    },
    yAxis: {
      show: false,
    },
    series: [
      {
        name: 'Events',
        type: 'custom',
        renderItem: (params, api) => {
          const start = api.coord([api.value(0), 0]);
          const end = api.coord([api.value(1), 0]);
          const barHeight = api.size([0, api.value(2)])[1];

          // Ensure minimum width for visibility
          const width = Math.max(end[0] - start[0], 5);

          // Apply consistent offsets for overlapping events
          const offset = params.dataIndex % 10; // Adjust the divisor for fine-tuning
          const yOffset = offset * 3; // Adjust as needed

          // Calculate the y position to avoid bars "going up"
          const yPosition = params.coordSys.height - barHeight + 60 - yOffset;

          // Ensure yPosition stays within bounds of the chart area
          const safeYPosition = params.coordSys.height - barHeight + 60;

          return {
            type: 'rect',
            shape: {
              x: start[0],
              y: safeYPosition,
              width: width,
              height: barHeight,
            },
            style: {
              fill: api.style().fill,
              stroke: '#fff',
              lineWidth: 1,
            },
          };
        },

        encode: {
          x: [0, 1],
        },
        data: seriesData,
      },
    ],
    graphic:
      enterBedTime && getupAfterTime
        ? [
            {
              type: 'text',
              left: '5%',
              bottom: '1%',
              style: {
                text: `Enter Bed ${enterBedTime}`,
                fontSize: 12,
              },
            },
            {
              type: 'text',
              right: '5%',
              bottom: '1%',
              style: {
                text: `Getup ${getupAfterTime}`,
                fontSize: 12,
              },
            },
          ]
        : [],
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full'>
      <div id='customLegend' className='w-full'>
        <div className='flex flex-wrap gap-4 items-center justify-center'>
          {uniqueEventNames.map((eventName) => (
            <div
              key={eventName}
              className='flex items-center gap-2 cursor-pointer'
              onClick={() => toggleEventVisibility(eventName)}
            >
              <div
                id='legendColorShape'
                className='size-3 rounded-[4px] border-2'
                style={{
                  backgroundColor: visibleEvents[eventName] ? sleepEventsColor[eventName] : 'grey',
                  borderColor: visibleEvents[eventName] ? 'transparent' : '#ccc',
                  color: visibleEvents[eventName] ? 'grey' : 'inherit',
                }}
              ></div>
              <div>{eventName}</div>
            </div>
          ))}
        </div>
      </div>
      <ReactEcharts option={options} style={{ height: 200, width: '100%' }} />
    </div>
  );
};

export default TimelineChart;
