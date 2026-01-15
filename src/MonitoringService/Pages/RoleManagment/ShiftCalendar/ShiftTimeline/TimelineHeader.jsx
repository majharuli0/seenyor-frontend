const TimelineHeader = () => {
  const hours = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className='flex h-10 border-b border-gray-200 dark:border-white/10 relative bg-white dark:bg-transparent transition-colors duration-300'>
      <div className='w-64 shrink-0 border-r border-gray-200 dark:border-white/10' />{' '}
      {/* Spacer for agent list */}
      <div className='flex-1 flex relative'>
        {hours.map((hour) => (
          <div
            key={hour}
            className='flex-1 border-l border-gray-200 dark:border-white/5 text-[10px] text-gray-500 dark:text-white/40 pl-1 h-full flex items-end pb-1 translate-x-[-1px]'
          >
            {hour % 2 === 0 ? (
              <>
                {(() => {
                  const h = hour % 12;
                  const displayHour = h === 0 ? 12 : h;
                  const ampm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
                  return hour === 24 ? '12 AM' : `${displayHour} ${ampm}`;
                })()}
              </>
            ) : (
              ''
            )}{' '}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineHeader;
