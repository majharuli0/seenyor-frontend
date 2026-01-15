import React from 'react';
import { Skeleton } from 'antd';
import PropTypes from 'prop-types';

const SkeletonTile = ({ width = '100%' }) => {
  return (
    <div className='flex justify-between gap-1 items-center bg-white rounded-2xl p-6 skeleton-tile w-full'>
      <div className='flex gap-3 items-center'>
        <Skeleton.Avatar active size={48} shape='square' style={{ backgroundColor: '#f0f0f0' }} />
        <div className='flex flex-col gap-2'>
          <Skeleton.Input
            active
            size='small'
            style={{ width: 80, height: 16, backgroundColor: '#f0f0f0' }}
          />
          <Skeleton.Input
            active
            size='large'
            style={{ width: 120, height: 24, backgroundColor: '#f0f0f0' }}
          />
        </div>
      </div>
      <Skeleton.Input
        active
        size='small'
        style={{ width: 40, height: 36, backgroundColor: '#f0f0f0' }}
      />
    </div>
  );
};

SkeletonTile.propTypes = {
  width: PropTypes.string,
};

export default SkeletonTile;
