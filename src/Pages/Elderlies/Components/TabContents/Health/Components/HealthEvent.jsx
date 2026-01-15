import React from 'react';
import { Button } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import TimelineBar from '@/Components/GraphAndChart/TimelineBar';
export default function HealthEvent({ isSummaryBtn = true }) {
  return (
    <>
      <div className='flex flex-col gap-6 p-6 bg-white rounded-2xl w-full'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-primary'>Health Events</h1>
          {isSummaryBtn && (
            <Button onClick={() => {}} icon={<FileOutlined />} size='large'>
              Summary
            </Button>
          )}
        </div>
        <div className='w-full my-0 mx-auto flex items-center justify-center h-[200px]'>
          <TimelineBar />
        </div>
        <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-4 items-center justify-center '></div>
      </div>
    </>
  );
}
const EventItem = ({ count, eventName, color }) => {
  return (
    <div className={`flex w-fill p-[4px] items-center gap-2 rounded-xl ${color} `}>
      <span className='text-[17px] p-2 py-1 font-bold bg-white rounded-[9px] text-primary'>
        {count}x
      </span>
      <span className='text-[15px] font-medium text-white leading-[1.2]'>{eventName}</span>
    </div>
  );
};
