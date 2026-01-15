import React from 'react';
import priority1 from './Icons/p1.svg';
import priority2 from './Icons/p2.svg';

const svgs = import.meta.glob('./Icons/TrendIcons/*.svg', { eager: true });
let obj = {};
for (const key in svgs) {
  if (Object.hasOwnProperty.call(svgs, key)) {
    const element = svgs[key];
    obj[key] = element.default;
  }
}
export default function TrendCard({ name, value, priority, style, onClick, trendId, icon: Icon }) {
  return (
    <div
      className='tramsition-all duration-300 cursor-pointer flex justify-between gap-2 min-w-[300px] w-full bg-white rounded-lg p-4 items-center !border-2 border-transparent'
      style={style}
      onClick={onClick}
    >
      <div id='trendIconTitle' className='flex flex-col gap-2 items-start'>
        <div
          id='icon'
          className='text-lg rounded-full p-2 w-[36px] h-[36px] flex items-center justify-center'
          style={{
            backgroundColor: priority === 0 ? '#324257' : priority === 2 ? '#FF0F0F' : '#FF9831',
          }}
        >
          {/* <img
            src={obj[`./Icons/TrendIcons/${trendId}.svg`]}
            className="w-auto max-h-[20px]"
          /> */}
          {Icon && <Icon className='w-auto max-h-[20px] text-white' />}
        </div>
        <h1 className='text-[15px] font-bold text-center'>{name}</h1>
      </div>
      <div className='flex gap-1 items-center'>
        <img
          src={priority === 1 ? priority1 : priority === 2 ? priority2 : ''}
          className='w-auto max-h-[20px]'
        />
        <div id='trendCount' className='text-[30px] font-bold'>
          {value < 10 && value !== 0 ? `0${value}` : value}
        </div>
      </div>
    </div>
  );
}
