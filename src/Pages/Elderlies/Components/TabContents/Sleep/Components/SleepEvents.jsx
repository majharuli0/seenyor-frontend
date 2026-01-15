import { useState, useEffect, useContext } from 'react';
import TimelineBar from '@/Components/GraphAndChart/TimelineBar';
import { getSleepEvents } from '@/api/deviceReports';
import { FaTimeline } from 'react-icons/fa6';
import Template from '@/Components/GraphAndChartTemp/Template';
import { SidebarContext } from '@/Context/CustomContext';
import { transformTime } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';
import SkeletonSleepingTimeline from '@/Components/Skeleton/SkeletonSleepingTimeline';
import { formatTimeWithSuffix } from '../../../../../../utils/helper';

const EventItem = ({ count, eventName, color }) => {
  return (
    <div className='flex items-center gap-2 text-sm py-2 px-4 bg-white rounded-lg shadow-sm border border-text-primary/10'>
      <div className='flex items-center gap-1'>
        <div
          className='w-3 h-3 rounded border-2 border-white shadow-sm'
          style={{ backgroundColor: color }}
        />
        <span className='text-gray-600 font-medium min-w-[60px]'>{eventName}</span>
      </div>
      <span className='text-gray-600 text-sm font-bold'>{count}</span>
    </div>
  );
};

export default function SleepEvents() {
  const { sleepEventsType, sleepEventsColor } = useContext(SidebarContext);
  const { sleepData, elderlyDetails, sleepDataLoading } = useContext(CustomContext);
  const [eventCounts, setEventCounts] = useState([]);

  const summaryProps = {
    title: 'Sleep Events Summary',
    pickerTypes: ['day', 'range'],
    chartType: 'multibar_sleep_events',
    dataType: 'time',
    color: '#FF725E',
    apisProps: {
      endpoint: getSleepEvents,
      query: {
        uids: elderlyDetails?.bedRoomIds,
      },
    },
  };

  useEffect(() => {
    if (sleepData?.alarm_events) {
      const alarmEventCounts = sleepData?.alarm_events.reduce((acc, event) => {
        const eventName = sleepEventsType[event.event_type];
        const existingEvent = acc.find((e) => e.event_name === eventName);
        if (existingEvent) {
          existingEvent.count += 1;
        } else {
          acc.push({
            event_name: eventName,
            count: 1,
            color: sleepEventsColor[eventName],
          });
        }
        return acc;
      }, []);
      setEventCounts(alarmEventCounts);
    }
  }, [sleepData, sleepEventsType, sleepEventsColor]);

  return (
    <Template
      title='Sleep Events'
      color='#FF725E'
      icon={<FaTimeline />}
      isDataAnalysis={false}
      headerClassName='!text-2xl'
      description='Displays a timeline of sleep-related events (e.g., snoring, apnea) detected during the sleep session, along with a summary count for each event type. This helps in identifying specific sleep disturbances.'
      summaryProps={summaryProps}
    >
      {sleepDataLoading ? (
        <SkeletonSleepingTimeline />
      ) : (
        <>
          <TimelineBar
            alarmEvents={sleepData?.alarm_events}
            enterBedTime={formatTimeWithSuffix(sleepData?.get_bed_idx)}
            getupAfterTime={formatTimeWithSuffix(sleepData?.leave_bed_idx)}
            noDataText='No Data Detected for Today'
          />
          <div className='flex flex-wrap gap-4 items-center justify-center'>
            {eventCounts.map((event, index) => (
              <EventItem
                key={index}
                count={event.count}
                eventName={event.event_name}
                color={event.color}
              />
            ))}
          </div>
        </>
      )}
    </Template>
  );
}
