import React, { useCallback, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from 'antd';
import { FaBedPulse } from 'react-icons/fa6';
import { GiNightSleep } from 'react-icons/gi';
import WakeUpIcon from '@/assets/icon/wake-up.svg';
import GetUpIcon from '@/assets/icon/get-up.svg';
import { formatTimeWithSuffix } from '@/utils/helper';
import { getDayTimeActivity } from '../../../../../../api/deviceReports';
import { SidebarContext } from '../../../../../../Context/CustomContext';
import { CustomContext } from '@/Context/UseCustomContext';
import dayjs from 'dayjs';
import ls from 'store2';

export const wakeUpIcon = (size) => {
  return <img src={WakeUpIcon} alt='wake-up' width={size} height={size} />;
};
export const getUpIcon = (size) => {
  return <img src={GetUpIcon} alt='get-up' width={size} height={size} />;
};

export default function AverageRoutineTime() {
  const { sleepData, sleepDataLoading } = useContext(CustomContext);

  const items = [
    {
      label: 'Went To Bed',
      color: '#35CECE',
      value: formatTimeWithSuffix(sleepData?.get_bed_idx),
      icon: <FaBedPulse size={20} color='#35CECE' />,
      initial: { x: -50, y: -50 },
      delay: 0.2,
    },
    {
      label: 'Fell Asleep',
      color: '#FF6734',
      value: formatTimeWithSuffix(sleepData?.sleep_st_idx),
      icon: <GiNightSleep size={20} color='#FF6734' />,
      initial: { x: 50, y: -50 },
      delay: 0.2,
    },
    {
      label: 'Woke Up',
      color: '#8088FD',
      value: formatTimeWithSuffix(sleepData?.sleep_ed_idx),
      icon: wakeUpIcon(20),
      initial: { x: -50, y: 50 },
      delay: 0.2,
    },
    {
      label: 'Get out of Bed',
      color: '#ecb81c',
      value: formatTimeWithSuffix(sleepData?.leave_bed_idx),
      icon: getUpIcon(20),
      initial: { x: 50, y: 50 },
      delay: 0.2,
    },
  ];
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const elderlyDetais = ls.get('elderly_details');
  const { elderlyDetails } = useContext(CustomContext);
  const { dailyRepDate } = useContext(SidebarContext);

  const getActivityData = useCallback(() => {
    if (!elderlyDetails?.deviceId || !elderlyDetails._id) {
      setLoading(false);
      return;
    }
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
  const renderSkeletonTile = () => (
    <div className='flex flex-col items-center justify-center h-full gap-2'>
      <Skeleton.Avatar active size={40} shape='square' />
      <div className='flex flex-col items-center justify-center gap-1'>
        <Skeleton.Input active style={{ width: 80, height: 24 }} />
        <Skeleton.Input active style={{ width: 100, height: 14 }} />
      </div>
    </div>
  );

  return (
    <div className='bg-white rounded-2xl p-6 h-full flex flex-col gap-4'>
      <h1 className='text-[21px] font-bold text-primary'>Average Routine Time</h1>
      {sleepDataLoading ? (
        <div className='relative w-full grid grid-cols-2 grid-rows-2 gap-4 h-full'>
          {renderSkeletonTile()}
          {renderSkeletonTile()}
          {renderSkeletonTile()}
          {renderSkeletonTile()}
        </div>
      ) : (
        <div className='relative w-full grid grid-cols-2 grid-rows-2 gap-4 h-full'>
          <motion.div
            className='absolute h-0.5 w-full top-1/2 left-0'
            style={{
              background: 'linear-gradient(to right, #ffffff, #D1D1D1, #ffffff)',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9 }}
          />
          <motion.div
            className='absolute w-0.5 h-full left-1/2 top-0'
            style={{
              background: 'linear-gradient(to bottom, #ffffff, #D1D1D1, #ffffff)',
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9 }}
          />
          {items.map((item, index) => (
            <motion.div
              key={index}
              className='flex flex-col items-center justify-center h-full gap-2'
              initial={{ opacity: 0, ...item.initial }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: item.delay, ease: 'linear' }}
            >
              <div
                id='icon'
                className='w-10 h-10 flex items-center justify-center rounded-lg'
                style={{ backgroundColor: `${item.color}27` }}
              >
                {item.icon}
              </div>
              <div className='flex flex-col items-center justify-center'>
                <div className='text-2xl font-bold text-primary'>{item.value}</div>
                <div className='text-sm font-medium text-primary'>{item.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
