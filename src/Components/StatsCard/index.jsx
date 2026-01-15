import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, percentage, isIncrease }) => {
  return (
    <div className='group p-4 rounded-[10px] bg-white hover:bg-indigo-600 transition-colors duration-300 flex flex-col justify-between h-full'>
      <div className='flex justify-between items-start'>
        <div>
          <p className='text-sm font-medium mb-1 text-gray-500 group-hover:text-indigo-100 transition-colors duration-300'>
            {title}
          </p>
          <h3 className='text-2xl font-semibold text-gray-800 group-hover:text-white transition-colors duration-300'>
            {value}
          </h3>
        </div>
        <div className='p-2 rounded-full bg-indigo-600 text-white group-hover:bg-white group-hover:text-indigo-600 transition-colors duration-300'>
          <ArrowUpRight size={20} />
        </div>
      </div>

      <div
        className={`mt-4 flex items-center text-[12px] ${isIncrease ? 'text-green-500' : 'text-red-500'} group-hover:text-white transition-colors duration-300`}
      >
        {isIncrease ? (
          <ArrowUpRight size={14} className='mr-1' />
        ) : (
          <ArrowDownRight size={14} className='mr-1' />
        )}
        {percentage}% {isIncrease ? 'increased' : 'decreased'} from last week
      </div>
    </div>
  );
};

export default StatsCard;
