import React, { useCallback, useState, useEffect, useContext } from 'react';
import { CustomContext } from '@/Context/UseCustomContext';
import { SidebarContext } from '@/Context/CustomContext';
import { Skeleton } from 'antd'; // Import Skeleton from antd
import { MdMeetingRoom } from 'react-icons/md';
import { MdOutlineAirlineSeatLegroomNormal } from 'react-icons/md';
import { FaPersonWalking } from 'react-icons/fa6';
import { FaPersonWalkingArrowRight } from 'react-icons/fa6';
import { GiExitDoor } from 'react-icons/gi';
import { getDayTimeActivity } from '@/api/deviceReports';
import ls from 'store2';
import dayjs from 'dayjs';

export default function ActivityOverviewTails() {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const elderlyDetais = ls.get('elderly_details');
  const { elderlyDetails } = useContext(CustomContext);
  const { dailyRepDate } = useContext(SidebarContext);

  const getActivityData = useCallback(() => {
    setLoading(true); // Set loading to true when fetching starts
    getDayTimeActivity({
      uids: elderlyDetails?.deviceId,
      elderly_id: elderlyDetails._id,
      to_date: dailyRepDate || dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    })
      .then((res) => {
        setActivityData(res.data?.user_activity);
        setLoading(false); // Set loading to false when data is received
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Set loading to false on error
      });
  }, [elderlyDetails, dailyRepDate]);

  useEffect(() => {
    getActivityData();
  }, [getActivityData]);

  // Skeleton loader for each tile
  const renderSkeletonTile = () => (
    <div className='flex justify-between gap-1 items-center bg-white rounded-2xl p-4 w-full'>
      <div className='flex gap-3 items-center'>
        <Skeleton.Avatar active size={48} shape='square' /> {/* Icon placeholder */}
        <div className='flex flex-col gap-2'>
          <Skeleton.Input active style={{ width: 120, height: 16 }} /> {/* Title */}
          <Skeleton.Input active style={{ width: 80, height: 24 }} /> {/* Value */}
        </div>
      </div>
    </div>
  );

  return (
    <div className='flex justify-between gap-4 w-full'>
      {loading ? (
        // Show skeleton loaders while loading
        <>
          {renderSkeletonTile()}
          {renderSkeletonTile()}
          {renderSkeletonTile()}
          {renderSkeletonTile()}
          {renderSkeletonTile()}
        </>
      ) : (
        // Show actual data when loaded
        <>
          <div
            id='indoorDuration'
            className='flex justify-between gap-1 items-center bg-white rounded-2xl p-4 w-full'
          >
            <div className='flex gap-3 items-center'>
              <div id='icon' className='p-3 bg-[#26C0C0] rounded-md'>
                <MdMeetingRoom className='text-[#fff] text-[24px]' />
              </div>
              <div className='flex flex-col gap-0'>
                <div className='text-base font-semibold text-primary/80'>Indoor Duration</div>
                <div className='text-2xl font-bold text-primary'>
                  {activityData?.in_room_duration ? activityData?.in_room_duration : '--'}
                </div>
              </div>
            </div>
          </div>

          <div
            id='stillTime'
            className='flex justify-between gap-1 items-center bg-white rounded-2xl p-4 w-full'
          >
            <div className='flex gap-3 items-center'>
              <div id='icon' className='p-3 bg-[#F1B812] rounded-md'>
                <MdOutlineAirlineSeatLegroomNormal className='text-[#fff] text-[24px]' />
              </div>
              <div className='flex flex-col gap-0'>
                <div className='text-base font-semibold text-primary/80'>Still Time</div>
                <div className='text-2xl font-bold text-primary'>
                  {activityData?.static_duration ? activityData?.static_duration : '--'}
                </div>
              </div>
            </div>
          </div>
          <div
            id='walking'
            className='flex justify-between gap-1 items-center bg-white rounded-2xl p-4 w-full'
          >
            <div className='flex gap-3 items-center'>
              <div id='icon' className='p-3 bg-[#7F87FC] rounded-md'>
                <FaPersonWalking className='text-[#fff] text-[24px]' />
              </div>
              <div className='flex flex-col gap-0'>
                <div className='text-base font-semibold text-primary/80'>Walking</div>
                <div className='text-2xl font-bold text-primary'>
                  {activityData?.step_number ? activityData?.step_number : '--'} steps
                </div>
              </div>
            </div>
          </div>
          <div
            id='speed'
            className='flex justify-between gap-1 items-center bg-white rounded-2xl p-4 w-full'
          >
            <div className='flex gap-3 items-center'>
              <div id='icon' className='p-3 bg-[#a02adf] rounded-md'>
                <FaPersonWalkingArrowRight className='text-[#fff] text-[24px]' />
              </div>
              <div className='flex flex-col gap-0'>
                <div className='text-base font-semibold text-primary/80'>Speed</div>
                <div className='text-2xl font-bold text-primary'>
                  {activityData?.speed ? activityData?.speed : '--'} m/min
                </div>
              </div>
            </div>
          </div>
          <div
            id='roomEntryExit'
            className='flex justify-between gap-1 items-center bg-white rounded-2xl p-4 w-full'
          >
            <div className='flex gap-3 items-center'>
              <div id='icon' className='p-3 bg-[#82cb24] rounded-md'>
                <GiExitDoor className='text-[#fff] text-[24px]' />
              </div>
              <div className='flex flex-col gap-0'>
                <div className='text-base font-semibold text-primary/80'>Room Entry/Exit</div>
                <div className='text-2xl font-bold text-primary'>
                  {activityData?.entry_room_count ? activityData?.entry_room_count : '--'}x
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
