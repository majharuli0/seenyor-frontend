import React, { useState, useEffect } from 'react';

const HalfCircleGauge = ({ percentage = 0 }) => {
  const radius = 120; // Increased from 80
  const centerX = 150; // Increased from 100
  const centerY = 150; // Increased from 100
  const strokeWidth = 10; // Increased from 10
  const circumference = Math.PI * radius; // Circumference for a half-circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const animation = setInterval(() => {
      setAnimatedPercentage((prev) => {
        if (prev >= percentage) {
          clearInterval(animation);
          return percentage;
        }
        return prev + 1;
      });
    }, 10);

    return () => clearInterval(animation);
  }, [percentage]);

  const calculatePointerPosition = (percent, extendedRadius = radius) => {
    const angle = (percent / 100) * 180; // Percentage mapped to 0-180 degrees
    const radians = (angle * Math.PI) / 180; // Convert degrees to radians
    const x = centerX + extendedRadius * Math.cos(Math.PI + radians); // Adjust for half-circle (add π)
    const y = centerY + extendedRadius * Math.sin(Math.PI + radians); // Adjust for half-circle (add π)
    return { x, y, angle }; // Return position and angle
  };
  const colorStops = [
    { pos: 0, color: '#E0517F' }, // Pink
    { pos: 33, color: '#7B63D6' }, // Purple
    { pos: 66, color: '#4E94E4' }, // Blue
    { pos: 100, color: '#54D699' }, // Green
  ];

  const getBlendedColor = (percent, colorStops) => {
    // Convert hex color to RGB
    const hexToRgb = (hex) =>
      hex
        .replace(/^#/, '')
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16));

    // Convert RGB back to hex
    const rgbToHex = (rgb) => `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;

    // Linear interpolation between two values
    const lerp = (start, end, factor) => start + factor * (end - start);

    // Blend two RGB colors based on a factor
    const blendRgb = (rgb1, rgb2, factor) => [
      Math.round(lerp(rgb1[0], rgb2[0], factor)),
      Math.round(lerp(rgb1[1], rgb2[1], factor)),
      Math.round(lerp(rgb1[2], rgb2[2], factor)),
    ];

    // Identify the two nearest color stops
    for (let i = 1; i < colorStops.length; i++) {
      if (percent <= colorStops[i].pos) {
        const lowerStop = colorStops[i - 1];
        const upperStop = colorStops[i];

        const range = upperStop.pos - lowerStop.pos;
        const relativePosition = (percent - lowerStop.pos) / range;

        const lowerRgb = hexToRgb(lowerStop.color);
        const upperRgb = hexToRgb(upperStop.color);

        const blendedRgb = blendRgb(lowerRgb, upperRgb, relativePosition);
        return rgbToHex(blendedRgb);
      }
    }

    // If percent exceeds the last stop, return the last color
    return colorStops[colorStops.length - 1].color;
  };

  const pointerPosition = calculatePointerPosition(animatedPercentage);
  const arrowPosition = calculatePointerPosition(animatedPercentage, radius * 0.65); // Reduced to 80% of radius
  const pointerColor = getBlendedColor(percentage, colorStops);

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '150px' }}
      className='flex flex-col items-center justify-center'
    >
      <svg width='300' height='150'>
        <path
          d={`M 30,150 A ${radius},${radius} 0 0,1 270,150`}
          fill='#F5F5F5'
          stroke='none'
          filter='url(#drop-shadow)'
        />
        {/* Full Half-Circle Background Gradient */}
        <defs>
          <linearGradient id='background-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#E0517F' />
            <stop offset='33%' stopColor='#7B63D6' />
            <stop offset='66%' stopColor='#4E94E4' />
            <stop offset='100%' stopColor='#54D699' />
          </linearGradient>
          <linearGradient id='progress-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#E0517F' />
            <stop offset='33%' stopColor='#7B63D6' />
            <stop offset='66%' stopColor='#4E94E4' />
            <stop offset='100%' stopColor='#54D699' />
          </linearGradient>
          <filter id='drop-shadow' x='-100%' y='-100%' width='400%' height='400%'>
            <feGaussianBlur in='SourceAlpha' stdDeviation='8' />
            <feOffset dx='0' dy='3' />
            <feColorMatrix type='matrix' values='0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.10 0' />
            <feGaussianBlur stdDeviation='7' result='glow' />
            <feMerge>
              <feMergeNode />
              <feMergeNode in='glow' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        {/* Full Gradient-Filled Half-Circle */}
        <path
          d={`M 30,150 A ${radius},${radius} 0 0,1 270,150`}
          fill='transparent'
          stroke='url(#background-gradient)'
          strokeWidth={strokeWidth}
        />
        {/* Active Progress Line with Gradient */}
        <path
          d={`M 30,150 A ${radius},${radius} 0 0,1 270,150`}
          fill='transparent'
          stroke='url(#progress-gradient)'
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            strokeDashoffset,
            transition: 'stroke-dashoffset 1s linear',
          }}
        />
        {/* Pointer (circle) */}
        <circle
          cx={pointerPosition.x}
          cy={pointerPosition.y}
          r='10'
          fill='white'
          stroke={pointerColor}
          strokeWidth='7'
        />
        {/* Long Arrow starting from the center of the circle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={arrowPosition.x}
          y2={arrowPosition.y} // Extending the arrow below the white circle
          stroke={pointerColor}
          strokeWidth='7'
          markerEnd='url(#arrowhead)' // Adding an arrowhead at the end of the line
        />
        {/* Arrowhead marker definition */}
        <defs>
          <marker
            id='arrowhead'
            viewBox='0 0 10 10'
            refX='5'
            refY='5'
            markerWidth='5'
            markerHeight='5'
            orient='auto'
          >
            <polygon points='0,0 10,5 0,10' fill={pointerColor} />
          </marker>
        </defs>

        {/* Inner White Half-Circle for Text with shadow */}

        <path
          d={`M 70,150 A ${radius - 45},${radius - 45} 0 0,1 230,150`}
          fill='white'
          stroke='none'
          filter='url(#drop-shadow)'
        />
      </svg>
      {/* Percentage and Label */}
      <div
        style={{
          position: 'absolute',
          top: '80%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontSize: '1.2em',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.8em',
            lineHeight: '0.7',
            fontWeight: 'bold',
          }}
          className='text-2xl'
        >
          {animatedPercentage}
        </h2>
        <p style={{ margin: 0 }} className='text-sm'>
          Wellness Score
        </p>
      </div>
    </div>
  );
};

export default HalfCircleGauge;
