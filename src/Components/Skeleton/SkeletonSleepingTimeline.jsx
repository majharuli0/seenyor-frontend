import React from 'react';
import { Skeleton } from 'antd';
import PropTypes from 'prop-types';

const SkeletonSleepingTimeline = () => {
  const segmentCount = Math.floor(Math.random() * 3) + 5;
  const itemCount = Math.floor(Math.random() * 3) + 3;

  return (
    <div className='w-full flex flex-col gap-6 p-6 bg-white rounded-2xl skeleton-wrapper'>
      <div className='w-full h-[100px] flex skeleton-timeline'>
        {[...Array(segmentCount)].map((_, index) => (
          <Skeleton.Node
            key={index}
            active
            style={{
              flex: Math.random() * 2 + 1,
              height: 60,
              borderRadius: '4px',
              backgroundColor: '#f0f0f0',
              marginRight: index < segmentCount - 1 ? '4px' : '0',
            }}
          >
            <div style={{ width: '100%', height: '100%' }} />
          </Skeleton.Node>
        ))}
      </div>
      <div className='flex flex-wrap gap-4 items-center justify-center'>
        {[...Array(itemCount)].map((_, index) => (
          <div
            key={index}
            className='flex p-[4px] pr-4 items-center gap-2 rounded-xl skeleton-item'
            style={{ backgroundColor: '#f0f0f0' }}
          >
            <Skeleton.Node
              active
              style={{
                width: 50,
                height: 24,
                borderRadius: '9px',
                backgroundColor: '#e0e0e0',
              }}
            >
              <div style={{ width: '100%', height: '100%' }} />
            </Skeleton.Node>
            <Skeleton.Node
              active
              style={{
                width: 80,
                height: 15,
                borderRadius: '4px',
                backgroundColor: '#e0e0e0',
              }}
            >
              <div style={{ width: '100%', height: '100%' }} />
            </Skeleton.Node>
          </div>
        ))}
      </div>
    </div>
  );
};

SkeletonSleepingTimeline.propTypes = {};

export default SkeletonSleepingTimeline;
