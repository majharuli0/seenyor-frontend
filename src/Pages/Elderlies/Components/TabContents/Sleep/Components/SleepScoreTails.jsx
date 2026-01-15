import React, { useContext, useEffect, useState } from 'react';
import { GiNightSleep } from 'react-icons/gi';
import { RiMoonFoggyFill } from 'react-icons/ri';
import { IoBarcodeSharp } from 'react-icons/io5';
import { MdKingBed } from 'react-icons/md';
import { CustomContext } from '@/Context/UseCustomContext';

const SkeletonSleepScoreTails = () => {
  return (
    <div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-fit skeleton-wrapper'>
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className='flex gap-3 items-center bg-white w-full p-5 rounded-lg skeleton-tile'
        >
          {/* Icon placeholder */}
          <div
            className='p-3 rounded-lg skeleton-icon'
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#e0e0e0', // Gray
              border: '1px solid #b0b0b0', // Darker border
            }}
          />
          {/* Text placeholders */}
          <div className='flex flex-col gap-2'>
            {/* Title placeholder */}
            <div
              className='skeleton-title'
              style={{
                width: '120px',
                height: '14px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
              }}
            />
            {/* Value placeholder */}
            <div
              className='skeleton-value'
              style={{
                width: '60px',
                height: '26px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function SleepScoreTails() {
  const { sleepData, sleepDataLoading } = useContext(CustomContext);
  const [sleepTailsData, setSleepTailsData] = useState([]);
  const itemWithStatus3 = sleepData?.sleep_index_common_list?.find((item) => item.status === '3');

  useEffect(() => {
    if (sleepData) {
      setSleepTailsData([
        {
          title: 'Sleep Quality',
          value: sleepData?.sleep_quality || '--',
          dataType: 'percentage',
          icon: <GiNightSleep size={20} />,
        },
        {
          title: 'Sleep Efficiency',
          value: sleepData?.sleep_efficiency || '--',
          dataType: 'percentage',
          icon: <RiMoonFoggyFill size={20} />,
        },
        {
          title: 'Sleep Flow Indicator',
          value: sleepData?.ahi || '--',
          dataType: 'index',
          icon: <IoBarcodeSharp size={20} />,
        },
        {
          title: 'Bed Exit After Sleep',
          value: itemWithStatus3?.ratio >= 0 ? sleepData?.leave_bed_count : '--',
          dataType: 'index',
          icon: <MdKingBed size={20} />,
        },
      ]);
    }
  }, [sleepData]);

  return (
    <>
      {sleepDataLoading ? (
        <SkeletonSleepScoreTails />
      ) : (
        <div id='sleepTails' className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-fit'>
          {sleepTailsData?.map((item, index) => (
            <div key={index} className='flex gap-3 items-center bg-white w-full p-5 rounded-lg'>
              <div id='icon' className='p-3 bg-primary/10 rounded-lg'>
                {item.icon}
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-primary/80 text-[14px] font-semibold leading-none'>
                  {item.title}
                </p>
                <p className='text-primary text-[26px] font-bold leading-none'>
                  {item.value}
                  {item.dataType === 'percentage' ? '%' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
