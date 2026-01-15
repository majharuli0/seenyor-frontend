import React from 'react';

const InfoRow = ({ label, value, valueColor = 'text-gray-600', isGray }) => (
  <div className={`flex justify-between py-3 px-4 ${isGray ? 'bg-[#F8F9FA]' : 'bg-white'}`}>
    <span className='text-gray-500 text-[14px]'>{label}</span>
    <span className={`font-medium text-[14px] ${valueColor} text-right`}>{value}</span>
  </div>
);

const OrderInfoSidebar = () => {
  const orderDetails = [
    { label: 'Order ID', value: '#3464377478' },
    { label: 'Amount', value: '$568.66' },
    { label: 'Payment Status', value: 'Paid', valueColor: 'text-green-500' },
    { label: 'Order Date', value: '25/10/2025' },
    {
      label: 'Order Items',
      value: (
        <div className='flex flex-col'>
          <span>AI Sensor 2x</span>
          <span>AI Speaker 1x</span>
        </div>
      ),
    },
  ];

  const customerDetails = [
    { label: 'Customer ID', value: '#3464377478' },
    { label: 'Email', value: 'davidjonson@gmail.com' },
    { label: 'Phone', value: '+14 6556 9784 5945' },
    {
      label: 'Address',
      value: <div className='max-w-[150px]'>47 W 13th St, New York, NY 10011, USA</div>,
    },
  ];

  return (
    <div className='flex flex-col gap-6'>
      {/* Order Details Card */}
      <div className='bg-white rounded-[10px] pb-6 overflow-hidden'>
        <h3 className='text-[18px] font-normal text-[#1B2559] px-6 py-4 border-b'>Order Details</h3>
        <div className='flex flex-col'>
          {orderDetails.map((item, index) => (
            <InfoRow
              key={index}
              label={item.label}
              value={item.value}
              valueColor={item.valueColor}
              isGray={index % 2 !== 0}
            />
          ))}
        </div>
      </div>

      {/* Customer Details Card */}
      <div className='bg-white rounded-[10px] pb-6 overflow-hidden'>
        <h3 className='text-[18px] font-normal text-[#1B2559] px-6 py-4 border-b'>
          Customer Details
        </h3>
        <div className='flex flex-col'>
          {customerDetails.map((item, index) => (
            <InfoRow
              key={index}
              label={item.label}
              value={item.value}
              valueColor={item.valueColor}
              isGray={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderInfoSidebar;
