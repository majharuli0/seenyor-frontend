import React, { useState, useEffect, useContext } from 'react';
import TimelineGraph from '@/Components/GraphAndChart/TimelineGraph';
import { FaTimeline } from 'react-icons/fa6';
import { getSleepSummary } from '@/api/deviceReports';
import ls from 'store2';
import { SidebarContext } from '@/Context/CustomContext';
import { transformTime } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';
import SkeletonSleepingTimeline from '@/Components/Skeleton/SkeletonSleepingTimeline';
import SleepHypnogram from '@/Components/GraphAndChart/SleepHynogram';
import { Empty } from 'antd';

export default function ElderlyActivityGraph() {
  const { sleepData, sleepDataLoading } = useContext(CustomContext);

  return (
    <>
      <div className='flex flex-col gap-4 rounded-2xl bg-white p-6 w-full'>
        <div className='text-[24px] font-bold'>Sleep Timeline</div>
        {sleepDataLoading ? (
          <SkeletonSleepingTimeline />
        ) : (
          <div className='w-full'>
            {/* <TimelineGraph
              statisticalData={sleepData?.statistical_data}
              alarmEvents={sleepData?.alarm_events}
              noDataText="No Data Detected for Today"
            /> */}
            {sleepData?.statistical_data?.length && (
              <SleepHypnogram sleepData={sleepData?.statistical_data} height={260} />
            )}

            {!sleepData?.statistical_data?.length && (
              <Empty description={'No Data Detected for Today'} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
