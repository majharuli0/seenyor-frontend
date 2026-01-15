import React from 'react';
import { Tabs } from 'antd';

const OrderTabs = () => {
  const items = [
    {
      key: '1',
      label: (
        <span className='text-[16px]'>
          All Orders <span className='ml-1 text-gray-400'>40</span>
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span className='text-[16px]'>
          New Orders <span className='ml-1 text-gray-400'>12</span>
        </span>
      ),
    },
    {
      key: '3',
      label: (
        <span className='text-[16px]'>
          Processed <span className='ml-1 text-gray-400'>23</span>
        </span>
      ),
    },
    {
      key: '4',
      label: (
        <span className='text-[16px]'>
          Completed <span className='ml-1 text-gray-400'>20</span>
        </span>
      ),
    },
    {
      key: '5',
      label: (
        <span className='text-[16px]'>
          Returned <span className='ml-1 text-gray-400'>08</span>
        </span>
      ),
    },
    {
      key: '6',
      label: (
        <span className='text-[16px]'>
          Cancelled <span className='ml-1 text-gray-400'>24</span>
        </span>
      ),
    },
  ];

  return (
    <div className='w-full bg-white p-4 pb-0 rounded-[10px]'>
      <Tabs defaultActiveKey='1' items={items} className='custom-tabs' />
    </div>
  );
};

export default OrderTabs;
