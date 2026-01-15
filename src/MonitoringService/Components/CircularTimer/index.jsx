import { useAlertStore } from '@/MonitoringService/store/useAlertStore';
import { useEffect, useState } from 'react';

export const CircularTimer = () => {
  const { selectedAlert } = useAlertStore();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!selectedAlert?.created_at) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const createdTime = new Date(selectedAlert.created_at).getTime();
      const currentTime = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTime - createdTime) / 1000);
      const timeLeft = Math.max(0, 120 - elapsedSeconds); // 2 minutes = 120 seconds
      return timeLeft;
    };

    // Calculate initial time left
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval when countdown reaches 0
      if (newTimeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedAlert?.created_at]);

  const duration = 120; // 2 minutes in seconds
  const radius = 20;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    timeLeft > 0 ? circumference - (timeLeft / duration) * circumference : circumference;

  // Format time display - show minutes and seconds when time is >= 60 seconds
  const formatTime = (seconds) => {
    if (seconds <= 0) return '0s';
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds}s`;
  };

  const displayTime = formatTime(timeLeft);

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        fill='transparent'
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className='!stroke-border'
      />
      <circle
        stroke={timeLeft < 30 ? 'red' : '#22D2D8'} // Turns red when less than 30 seconds left
        fill='transparent'
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap='round'
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
      <text
        x='50%'
        y='50%'
        dominantBaseline='middle'
        textAnchor='middle'
        fontSize='10' // Slightly smaller font to fit longer text
        className={`${timeLeft < 30 ? '!fill-red-500' : '!fill-text'}`}
      >
        {displayTime}
      </text>
    </svg>
  );
};
