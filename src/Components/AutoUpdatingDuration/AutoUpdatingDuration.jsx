import React, { useState, useEffect } from 'react';
import { transformDateAndTimeToDuration } from '@/utils/helper';

const AutoUpdatingDuration = ({ date }) => {
  const [duration, setDuration] = useState(() => transformDateAndTimeToDuration(date));

  useEffect(() => {
    const updateDuration = () => {
      const newDuration = transformDateAndTimeToDuration(date);
      setDuration(newDuration);
    };

    updateDuration();

    const interval = setInterval(updateDuration, 60000);
    return () => clearInterval(interval);
  }, [date]);

  return <>{duration}</>;
};

export default AutoUpdatingDuration;
