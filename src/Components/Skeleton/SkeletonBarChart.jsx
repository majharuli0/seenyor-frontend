import React from 'react';
import PropTypes from 'prop-types';

const SkeletonBarChart = ({
  height = 350,
  chartHeight = 280,
  barGroups = 13,
  barsPerGroup = 8,
  gridLines = 5,
  barWidth = 40,
}) => {
  const dynamicBarWidth = Math.max(20, barWidth / Math.sqrt(barsPerGroup / 3));

  return (
    <div className='w-full flex flex-col p-4' style={{ height }}>
      {/* Chart container */}
      <div
        className='relative w-full border border-gray-200 rounded-md'
        style={{ height: chartHeight }}
      >
        {/* Grid lines */}
        <div className='w-full h-full flex flex-col justify-between'>
          {[...Array(gridLines)].map((_, i) => (
            <div key={i} className='w-full h-px bg-gray-100' />
          ))}
        </div>
        {/* Bar groups */}
        <div className='absolute bottom-0 left-0 right-0 top-0 flex justify-between p-4'>
          {[...Array(barGroups)].map((_, groupIndex) => (
            <div
              key={groupIndex}
              className='flex gap-1 justify-center items-end '
              style={{
                width: `${100 / barGroups}%`,
              }} // Debug background
            >
              {[...Array(barsPerGroup)].map((_, barIndex) => (
                <div
                  key={`${groupIndex}-${barIndex}`}
                  style={{
                    width: dynamicBarWidth,
                    height: `${Math.random() * 60 + 20}%`, // Random height 20–80%
                    borderRadius: '4px 4px 0 0',
                    opacity: 0.7 + Math.random() * 0.3,
                  }}
                  className='bg-gray-100'
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SkeletonBarChart.propTypes = {
  height: PropTypes.number,
  chartHeight: PropTypes.number,
  barGroups: PropTypes.number,
  barsPerGroup: PropTypes.number,
  gridLines: PropTypes.number,
  barWidth: PropTypes.number,
};

export default SkeletonBarChart;
