import React from 'react';
import { Skeleton } from 'antd';
import PropTypes from 'prop-types';

const SkeletonRateChart = ({
  height = 300,
  chartHeight = 250,
  barCount = 7,
  barWidth = 40,
  gridLines = 5,
}) => {
  return (
    <div className='w-full flex flex-col p-4 skeleton-wrapper' style={{ height }}>
      <div
        className='relative w-full border border-gray-200 rounded-md'
        style={{ height: chartHeight }}
      >
        <div className='w-full h-full flex flex-col justify-between'>
          {[...Array(gridLines)].map((_, i) => (
            <div key={i} className='w-full h-px bg-gray-100' />
          ))}
        </div>
        <div className='absolute bottom-0 left-0 right-0 top-0 flex justify-between p-4'>
          {[...Array(barCount)].map((_, index) => (
            <div
              key={index}
              className='flex flex-col items-center justify-end skeleton-bar-group'
              style={{ width: `${100 / barCount}%` }}
            >
              <div
                className='relative w-full flex flex-col items-center'
                style={{ width: barWidth }}
              >
                <Skeleton.Node
                  active
                  style={{
                    width: 10,
                    height: 100,
                    position: 'absolute',
                    bottom: `${Math.random() * 50 + 10}%`,
                    backgroundColor: '#f0f0f0',
                  }}
                />
                <Skeleton.Node
                  active
                  style={{
                    width: 6,
                    height: `${Math.random() * 40 + 30}%`,
                    borderRadius: '2px',
                    position: 'absolute',
                    bottom: '10%',
                    backgroundColor: '#f0f0f0',
                  }}
                />
                <Skeleton.Node
                  active
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    position: 'absolute',
                    bottom: `${Math.random() * 40 + 50}%`,
                    backgroundColor: '#f0f0f0',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SkeletonRateChart.propTypes = {
  height: PropTypes.number,
  chartHeight: PropTypes.number,
  barCount: PropTypes.number,
  barWidth: PropTypes.number,
  gridLines: PropTypes.number,
};

export default SkeletonRateChart;
