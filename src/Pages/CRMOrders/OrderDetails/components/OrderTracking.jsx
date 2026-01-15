import React from 'react';
import { Steps, ConfigProvider } from 'antd';

const OrderTracking = () => {
  return (
    <div className='bg-white rounded-[10px] pb-6 overflow-hidden'>
      <h3 className='text-[18px] font-normal text-[#1B2559] px-6 py-4 border-b'>Order Tracking</h3>

      <div className='px-6 pt-4'>
        <div className='flex justify-between items-center mb-6 border-b pb-4'>
          <span className='text-gray-500 text-[14px]'>Tracking ID</span>
          <span className='font-medium text-[14px] text-gray-600'>N/A</span>
        </div>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#514EB5',
            },
          }}
        >
          <Steps
            direction='vertical'
            current={0}
            progressDot
            items={[
              {
                title: <span className='font-medium text-[#1B2559] text-[14px]'>Order Placed</span>,
              },
              {
                title: <span className='text-gray-500 text-[14px]'>Processed Shipment</span>,
              },
              {
                title: <span className='text-gray-500 text-[14px]'>In Transit</span>,
              },
              {
                title: <span className='text-gray-500 text-[14px]'>Delivered</span>,
              },
            ]}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default OrderTracking;
