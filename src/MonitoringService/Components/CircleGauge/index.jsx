import React, { useState, useEffect, useId } from 'react';

const CircularGauge = ({ percentage = 0, primaryColor = '#3b82f6', width = 240, height = 200 }) => {
  const id = useId();

  const gradientId = `progress-gradient-${primaryColor.replace('#', '')}-${id}`;
  // Scale values based on width/height
  const viewBoxSize = Math.min(width, height);
  const radius = viewBoxSize * 0.42;
  const centerX = width / 2;
  const centerY = height / 2;
  const strokeWidth = viewBoxSize * 0.05;

  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle;
  const circumference = 2 * Math.PI * radius * (totalAngle / 360);

  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedStrokeDashoffset, setAnimatedStrokeDashoffset] = useState(circumference);

  useEffect(() => {
    const percentageAnimation = setInterval(() => {
      setAnimatedPercentage((prev) => {
        if (prev >= percentage) {
          clearInterval(percentageAnimation);
          return percentage;
        }
        return prev + 1;
      });
    }, 20);

    const targetStrokeDashoffset = circumference - (percentage / 100) * circumference;
    const steps = 60;
    const stepValue = (circumference - targetStrokeDashoffset) / steps;
    let currentStep = 0;

    const strokeAnimation = setInterval(() => {
      setAnimatedStrokeDashoffset((prev) => {
        currentStep++;
        if (currentStep >= steps) {
          clearInterval(strokeAnimation);
          return targetStrokeDashoffset;
        }
        return prev - stepValue;
      });
    }, 16);

    return () => {
      clearInterval(percentageAnimation);
      clearInterval(strokeAnimation);
    };
  }, [percentage, circumference]);

  // Calculate start/end points
  const calculatePoint = (angle, r = radius) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(radians),
      y: centerY + r * Math.sin(radians),
    };
  };

  const startPoint = calculatePoint(startAngle);
  const endPoint = calculatePoint(endAngle);
  const largeArcFlag = totalAngle > 180 ? 1 : 0;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
      }}
      className='flex flex-col items-center justify-center'
    >
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor={primaryColor} stopOpacity='0.2' />
            <stop offset='50%' stopColor={primaryColor} stopOpacity='1' />
            <stop offset='100%' stopColor={primaryColor} />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`}
          fill='transparent'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          className='stroke-text/10'
        />

        {/* Active Progress */}
        <path
          d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`}
          fill='transparent'
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap='round'
          style={{
            transition: 'stroke-dashoffset 0.3s ease-out',
          }}
        />
      </svg>

      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: `${viewBoxSize * 0.18 - 12}px`,
            lineHeight: '1',
            fontWeight: 'bold',
          }}
          className='text-text'
        >
          {animatedPercentage}%
        </h2>
        <p
          style={{
            margin: '5px 0 0 0',
            fontSize: `${viewBoxSize * 0.07 - 2}px`,
            opacity: 0.7,
          }}
          className='text-text/80'
        >
          Based on response
        </p>
      </div>
    </div>
  );
};

export default CircularGauge;
