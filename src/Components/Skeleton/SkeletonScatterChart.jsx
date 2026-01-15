import React from 'react';
import { Skeleton } from 'antd';
import PropTypes from 'prop-types';

const SkeletonScatterChart = ({
  height = 350,
  chartHeight = 280,
  scatterPoints = 8,
  gridLines = 5,
  yAxisLabels = 5,
  legendItems = 4,
  showTitle = true,
  titleWidth = '40%',
  pointSize = 10,
}) => {
  return (
    <div className='w-full flex flex-col gap-2 p-4' style={{ height }}>
      {/* Title placeholder */}
      {showTitle && <Skeleton active paragraph={{ rows: 0 }} title={{ width: titleWidth }} />}
      {/* Chart container */}
      <div
        className='relative w-full border border-gray-200 rounded-md'
        style={{ height: chartHeight }}
      >
        {/* Y-axis placeholder */}
        <div className='absolute left-0 top-0 h-full w-8'>
          <Skeleton active paragraph={{ rows: yAxisLabels, width: '60%' }} title={false} />
        </div>
        {/* X-axis placeholder */}
        <div className='absolute bottom-0 left-8 right-0 h-8'>
          <Skeleton active paragraph={{ rows: 1, width: ['100%'] }} title={false} />
        </div>
        {/* Grid lines and scatter points */}
        <div className='absolute left-8 top-0 right-0 bottom-8'>
          {/* Grid lines */}
          <div className='w-full h-full flex flex-col justify-between'>
            {[...Array(gridLines)].map((_, i) => (
              <div key={i} className='w-full h-px bg-gray-100' />
            ))}
          </div>
          {/* Scatter points */}
          <div className='absolute inset-0 flex flex-wrap gap-4 p-4'>
            {[...Array(scatterPoints)].map((_, i) => (
              <Skeleton.Node
                key={i}
                active
                style={{
                  width: pointSize,
                  height: pointSize,
                  borderRadius: '50%',
                  position: 'absolute',
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Legend placeholder */}
      {legendItems > 0 && (
        <div className='flex gap-4 mt-2'>
          {[...Array(legendItems)].map((_, i) => (
            <Skeleton.Button key={i} active size='small' style={{ width: 60 }} />
          ))}
        </div>
      )}
    </div>
  );
};

SkeletonScatterChart.propTypes = {
  height: PropTypes.number, // Total height including title/legend
  chartHeight: PropTypes.number, // Height of the chart area
  scatterPoints: PropTypes.number, // Number of scatter point placeholders
  gridLines: PropTypes.number, // Number of horizontal grid lines
  yAxisLabels: PropTypes.number, // Number of Y-axis label placeholders
  legendItems: PropTypes.number, // Number of legend item placeholders
  showTitle: PropTypes.bool, // Show/hide title placeholder
  titleWidth: PropTypes.string, // Width of title placeholder
  pointSize: PropTypes.number, // Size of scatter points
};

export default SkeletonScatterChart;
