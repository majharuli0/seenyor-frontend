import React, { useRef, useEffect, useState } from 'react';

export default function SvgTitleBanner({ title = 'SEENYOR MONITORING' }) {
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getBBox().width);
    }
  }, [title]);

  const padding = 60; // left/right padding
  const height = 62;
  const width = textWidth + padding * 3;

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill='none'
      className='mx-auto'
    >
      {/* angled path under text */}
      <path
        d={`M1 1 L60 ${height - 1} H${width - 60} L${width - 1} 1`}
        stroke='url(#paint0_linear)'
        strokeWidth='2'
      />
      <defs>
        <linearGradient
          id='paint0_linear'
          x1={width / 2}
          y1={height}
          x2={width / 2}
          y2='1'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#7C7C7C' stopOpacity='0.31' />
          <stop offset='1' stopColor='#fff' stopOpacity='0' />
        </linearGradient>
      </defs>

      {/* text centered */}
      <text
        ref={textRef}
        x='50%'
        y='50%'
        textAnchor='middle'
        dominantBaseline='middle'
        className='font-bold'
        fontSize='24'
        style={{
          letterSpacing: '1px',
          fill: 'rgb(var(--ms-text-color))',
        }}
      >
        {title}
      </text>
    </svg>
  );
}
