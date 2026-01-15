import React, { useMemo } from 'react';
import { AiOutlineAlert } from 'react-icons/ai';
import { AiOutlineBug } from 'react-icons/ai';
import { Tooltip } from 'antd';
export default function Elderly({ data = [], onClick }) {
  const getInitials = (name = '') => {
    if (!name || typeof name !== 'string') {
      return ''; // Return an empty string or a placeholder
    }

    // Remove leading/trailing spaces and handle multiple spaces between words
    const trimmedName = name.trim();
    const names = trimmedName.split(' ').filter(Boolean); // Filter out empty strings caused by multiple spaces

    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    } else {
      return trimmedName.slice(0, 2).toUpperCase();
    }
  };

  const generateColors = useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    const bgColor = `hsl(${hue}, 70%, 95%)`; // Increased lightness to 90%
    const textColor = `hsl(${hue}, 70%, 40%)`;
    return { bgColor, textColor };
  }, [data?.name]);
  console.log(data);
  const initials = getInitials(data?.name);
  const { bgColor, textColor } = generateColors;
  return (
    <div className='flex items-center gap-2 cursor-pointer min-w-[250px]' onClick={onClick}>
      {/* Make avater base on firm and last name first later and rendom color */}
      <div
        id='avatar'
        className='text-lg p-2 relative rounded-xl w-[40px] h-[40px]'
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <span className=' font-baloo font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          {initials}
        </span>
      </div>
      <div>
        {/* <Tooltip title="Click to copy" trigger="hover"> */}
        <h4
          className='text-[17px] font-semibold text-text-primary cursor-pointer relative group'
          onClick={(e) => {
            navigator.clipboard.writeText(data.name);
            e.target.innerText = 'Copied!';
            setTimeout(() => {
              e.target.innerText = data.name;
            }, 1000);
          }}
        >
          {data?.name}
        </h4>
        {/* </Tooltip> */}
        {/* <Tooltip title="Click to copy" trigger="hover"> */}
        <p
          className='text-sm cursor-pointer relative group'
          onClick={(e) => {
            navigator.clipboard.writeText(data.address);
            e.target.innerText = 'Copied!';
            setTimeout(() => {
              e.target.innerText = data.address;
            }, 1000);
          }}
        >
          {data.address}
        </p>
        {/* </Tooltip> */}
      </div>
    </div>
  );
}
