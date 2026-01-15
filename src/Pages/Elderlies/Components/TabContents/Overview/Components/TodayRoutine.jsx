import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaBedPulse } from 'react-icons/fa6';
import { GiNightSleep } from 'react-icons/gi';
import { Skeleton } from 'antd'; // Import AntD Skeleton
import WakeUpIcon from '@/assets/icon/wake-up.svg';
import GetUpIcon from '@/assets/icon/get-up.svg';
import ls from 'store2';
import { formatTimeWithSuffix } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';

export const wakeUpIcon = (size) => {
  return <img src={WakeUpIcon} alt='wake-up' width={size} height={size} />;
};
export const getUpIcon = (size) => {
  return <img src={GetUpIcon} alt='get-up' width={size} height={size} />;
};

export default function TodayRoutine() {
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
      label: 'Woke up',
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

  return (
    <div className='bg-white rounded-2xl p-6 h-full flex flex-col gap-4'>
      {sleepDataLoading ? (
        <div className='relative w-full flex justify-evenly h-full'>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className='flex flex-col items-center justify-center h-full gap-2 w-full'
              >
                <Skeleton.Avatar active size={40} shape='circle' />
                <div className='w-full flex justify-center'>
                  <Skeleton
                    active
                    paragraph={{ rows: 2, width: ['60%', '80%'] }}
                    title={false}
                    className='w-[80%]' // Optional: Adjust width to match design
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className='relative w-full flex justify-evenly h-full'>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <div className='flex flex-col items-center justify-center h-full gap-2 w-full'>
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
              </div>
              {index < items.length - 1 && <div className='w-[1px] bg-gray-200 h-full' />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
