import React, { useEffect, useState } from 'react';
import Counter from '../ui/animated-counter';
import clsx from 'clsx';

export default function AlertLifeCounter({ date_time = '2025-10-07T04:28:58.038Z' }) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startTime = new Date(date_time).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, now - startTime);
      setElapsedMs(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [date_time]);

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const counterProps = {
    fontSize: 14,
    padding: 0,
    gap: 0,
    fontWeight: 500,
  };
  const statusColor = clsx('border-b-2', {
    'border-green-500': totalSeconds < 60,
    'border-yellow-500': totalSeconds >= 60 && totalSeconds < 120, // 1min to 2min - warning
    'border-red-500': totalSeconds >= 120, // Over 2 minutes - red
  });
  const gradientBackground = clsx({
    'bg-gradient-to-t from-green-500/30 to-transparent': totalSeconds < 60,
    'bg-gradient-to-t from-yellow-500/30 to-transparent': totalSeconds >= 60 && totalSeconds < 120,
    'bg-gradient-to-t from-red-500/30 to-transparent': totalSeconds >= 120,
  });
  return (
    <div
      className={clsx(
        'flex items-center w-fit px-1 justify-center gap-2 text-white font-bold',
        statusColor,
        gradientBackground
      )}
    >
      {/* Hours - show 2 digits */}
      {hours > 0 && (
        <div className='flex gap-0 items-center justify-center'>
          <Counter value={hours} places={hours > 99 ? [100, 10, 1] : [10, 1]} {...counterProps} />
          <span className='pl-0 pt-1 font-normal lowercase text-text text-[12px]'>h</span>
        </div>
      )}

      {/* Minutes - always 2 digits */}
      {(minutes > 0 || hours > 0) && (
        <div className='flex gap-0 items-center justify-center'>
          <Counter value={minutes} places={[10, 1]} {...counterProps} />
          <span className='pl-0 pt-1 font-normal lowercase text-text text-[12px]'>m</span>
        </div>
      )}

      {/* Seconds - always 2 digits */}
      <div className='flex gap-0 items-center justify-center'>
        <Counter value={seconds} places={[10, 1]} {...counterProps} />
        <span className='pl-0 pt-1 font-normal lowercase text-text text-[12px]'>s</span>
      </div>
    </div>
  );
}
