import { useContext, useEffect, useState } from 'react';
import TimelineGraph from '@/Components/GraphAndChart/TimelineGraph';
import { Button, Empty } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import SummaryModal from '@/Components/SummaryModal/SummaryModal';
import { FaTimeline } from 'react-icons/fa6';
import { getSleepSummary } from '@/api/deviceReports';
import { CustomContext } from '@/Context/UseCustomContext';
import Template from '@/Components/GraphAndChartTemp/Template';
import { transformTime } from '@/utils/helper';
import { SidebarContext } from '@/Context/CustomContext';
import SkeletonSleepingTimeline from '@/Components/Skeleton/SkeletonSleepingTimeline';
import { formatTimeWithSuffix } from '@/utils/helper';
import SleepHypnogram from '@/Components/GraphAndChart/SleepHynogram';

const TimelineItem = ({ time, ItemName, color }) => {
  return (
    <div className='flex items-center gap-2 text-sm py-2 px-4 bg-white rounded-lg shadow-sm border border-text-primary/10'>
      <div className='flex items-center gap-1'>
        {ItemName != 'Fell Asleep' && ItemName != 'Wake Up' && (
          <div
            className='w-3 h-3 rounded border-2 border-white shadow-sm'
            style={{ backgroundColor: color }}
          />
        )}
        <span className='text-gray-600 font-medium min-w-[60px]'>{ItemName}</span>
      </div>
      <span className='text-gray-600 text-sm font-bold'>{time}</span>
    </div>
  );
};

export default function SleepingTimeline() {
  const { sleepData, elderlyDetails, sleepDataLoading } = useContext(CustomContext);
  const { sleepEventsType, sleepEventsColor } = useContext(SidebarContext);
  const [events, setEvents] = useState([]);
  const summaryProps = {
    title: 'Sleep Timeline Summary',
    pickerTypes: ['day', 'range'],
    chartType: 'multibar',
    dataType: 'duration',
    color: '#FF725E',
    icon: <FaTimeline />,
    apisProps: {
      endpoint: getSleepSummary,
      query: {
        uids: elderlyDetails?.deviceId,
      },
    },
  };
  function minutesToHoursAndMinutes(minutes) {
    if (minutes == 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}hr ${mins}m`;
  }
  // useEffect(() => {
  //   if (!sleepData) return;
  //   const aggregatedEvents = sleepData?.statistical_data?.reduce(
  //     (acc, data) => {
  //       if (data.status === "3") return acc;
  //       const startTime = new Date(data.start_time);
  //       const endTime = new Date(data.end_time);
  //       const durationInMinutes = (endTime - startTime) / (1000 * 60);
  //       const statusName = sleepEventsType[data.status];
  //       if (!acc[statusName]) {
  //         acc[statusName] = {
  //           duration: 0,
  //           color: sleepEventsColor[statusName],
  //         };
  //       }
  //       acc[statusName].duration += durationInMinutes;
  //       return acc;
  //     },
  //     {}
  //   );

  //   const events = Object.entries(aggregatedEvents || {}).map(
  //     ([name, { duration, color }]) => {
  //       const hours = Math.floor(duration / 60);
  //       const minutes = Math.floor(duration % 60);
  //       return {
  //         name,
  //         duration: `${hours}hr ${minutes}m`,
  //         color,
  //       };
  //     }
  //   );

  //   setEvents([...events]);
  // }, [sleepData, sleepEventsType, sleepEventsColor]);
  function transformSleepData(originalData, sleepEventsType, sleepEventsColor) {
    const transformedData = {};

    originalData.forEach((item) => {
      const status = item.status;
      const typeName = sleepEventsType[status];

      transformedData[status] = {
        name: typeName,
        value: Number(item.value) || 0,
        color: sleepEventsColor[typeName] || '#CCCCCC',
      };
    });

    return transformedData;
  }
  useEffect(() => {
    if (sleepData?.sleep_index_common_list) {
      console.log(sleepData?.get_bed_idx);

      const transformedData = transformSleepData(
        sleepData.sleep_index_common_list,
        sleepEventsType,
        sleepEventsColor
      );
      console.log(sleepData);

      setEvents(transformedData);
    }
  }, [sleepData, sleepEventsType, sleepEventsColor]);
  return (
    <Template
      title='Sleep Timeline'
      color='#FF725E'
      icon={<FaTimeline />}
      isDataAnalysis={false}
      headerClassName='!text-2xl'
      summaryProps={summaryProps}
    >
      {sleepDataLoading ? (
        <SkeletonSleepingTimeline />
      ) : (
        <>
          {/* <TimelineGraph
            statisticalData={sleepData?.statistical_data}
            enterBedTime={formatTimeWithSuffix(sleepData?.get_bed_idx)}
            getupAfterTime={formatTimeWithSuffix(sleepData?.leave_bed_idx)}
            noDataText="No Data Detected for Today"
          /> */}
          <div className='flex flex-wrap gap-4 items-center justify-between'>
            {sleepData && sleepData?.leave_bed_idx && (
              <TimelineItem
                time={formatTimeWithSuffix(sleepData?.sleep_st_idx)}
                ItemName={'Fell Asleep'}
                color={'#AAA492'}
              />
            )}

            {sleepData && sleepData?.sleep_ed_idx && (
              <TimelineItem
                time={formatTimeWithSuffix(sleepData?.sleep_ed_idx)}
                ItemName={'Woke Up'}
                color={'#AAA492'}
              />
            )}
            {/* {sleepData && sleepData?.leave_bed_count && (
              <TimelineItem
                time={sleepData?.leave_bed_count + "x"}
                ItemName={"Leave bed after sleep"}
                color={"#FF725E"}
              />
            )} */}
          </div>
          {sleepData?.statistical_data?.length && (
            <SleepHypnogram sleepData={sleepData?.statistical_data} height={260} />
          )}

          {!sleepData?.statistical_data?.length && (
            <Empty description={'No Data Detected for Today'} />
          )}
          <div className='flex flex-wrap gap-4 items-center justify-center mt-12'>
            {events && events[1] && (
              <TimelineItem
                time={minutesToHoursAndMinutes(events[1]?.value)}
                ItemName={'Light Sleep'}
                color={events[1]?.color}
              />
            )}
            {events && events[0] && (
              <TimelineItem
                time={minutesToHoursAndMinutes(events[0]?.value)}
                ItemName={'Deep Sleep'}
                color={events[0]?.color}
              />
            )}
            {events && events[7] && (
              <TimelineItem
                time={minutesToHoursAndMinutes(events[7]?.value)}
                ItemName={'REM'}
                color={events[7]?.color}
              />
            )}
            {events && events[2] && (
              <TimelineItem
                time={minutesToHoursAndMinutes(events[2]?.value)}
                ItemName={'Awake After Sleep'}
                color={events[2]?.color}
              />
            )}

            {sleepData && sleepData?.leave_bed_count >= 0 && (
              <TimelineItem
                time={sleepData?.leave_bed_count + 'x'}
                ItemName={'Bed Exit After Sleep'}
                color={'#FF725E'}
              />
            )}
          </div>
        </>
      )}
    </Template>
  );
}
