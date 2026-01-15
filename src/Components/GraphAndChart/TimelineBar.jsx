import React, { useState, useEffect, useContext, useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Empty } from 'antd';
import { SidebarContext } from '@/Context/CustomContext';

const TimelineChart = ({
  alarmEvents = [],
  enterBedTime,
  getupAfterTime,
  noDataText = 'No data available to show',
}) => {
  const { sleepEventsType, sleepEventsColor } = useContext(SidebarContext);

  const events = useMemo(
    () =>
      alarmEvents
        .map((event) => {
          const typeName = Object.prototype.hasOwnProperty.call(sleepEventsType, event.event_type)
            ? sleepEventsType[event.event_type]
            : undefined;
          return {
            id: `${event.event_type}-${event.ts}`,
            name: typeName,
            startTime: new Date(event.ts),
            endTime: new Date(event.ts),
            color:
              typeName && Object.prototype.hasOwnProperty.call(sleepEventsColor, typeName)
                ? sleepEventsColor[typeName]
                : undefined,
          };
        })
        .filter((event) => event.name),
    [alarmEvents, sleepEventsType, sleepEventsColor]
  );

  const displayedEventKeys = [11, 12, 13, 14, 15];

  const uniqueEventNames = useMemo(
    () => displayedEventKeys.map((key) => sleepEventsType[key]).filter(Boolean),
    [sleepEventsType]
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

  if (events.length === 0) {
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

          const width = Math.max(end[0] - start[0], 5);

          // Calculate a consistent base Y position
          const baseY = params.coordSys.height - barHeight;

          // Apply a reduced offset for staggered bars
          const offset = params.dataIndex % 5;
          const yOffset = offset * 2; // Adjust as necessary to minimize vertical shifts
          const yPosition = params.coordSys.height - barHeight + 60;

          return {
            type: 'rect',
            shape: {
              x: start[0],
              y: yPosition,
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
