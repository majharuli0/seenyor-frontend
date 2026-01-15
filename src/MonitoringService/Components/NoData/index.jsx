import React from 'react';
import { HiOutlineInbox } from 'react-icons/hi';

export function NoData({
  title = 'No Data Available',
  description = 'There is no data to display at the moment.',
  icon = <HiOutlineInbox />,
  height = '400px',
  width = '100%',
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-card  ${className}`}
      style={{ width, height }}
    >
      <div className='text-6xl mb-4'>{icon}</div>
      <h3 className='text-lg font-semibold text-text mb-2'>{title}</h3>
      <p className='text-text/60 text-sm text-center max-w-xs'>{description}</p>
    </div>
  );
}

// Specific variations for different chart types
export function NoDataChart({ type = 'general', ...props }) {
  const config = {
    general: {
      title: 'No Data Available',
      description: 'There is no data to display at the moment.',
      icon: <HiOutlineInbox />,
    },
  };

  return <NoData {...config[type]} {...props} />;
}
