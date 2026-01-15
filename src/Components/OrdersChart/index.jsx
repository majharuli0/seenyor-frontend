import React from 'react';
import { DatePicker } from 'antd';
import StackedBarChart from '../GraphAndChart/StackedBarChart';

import dayjs from 'dayjs';

const rangePresets = [
  { label: 'This Week', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
  { label: 'This Month', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
  { label: 'This Year', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
];

const OrdersChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      {
        name: 'AI Sensor',
        itemStyle: {
          color: 'rgba(112, 134, 253, 0.6)',
          borderColor: '#7086FD',
          borderWidth: 1,
        },
        data: [70, 20, 35, 25, 45, 10, 50],
        isTop: false,
      },
      {
        name: 'AI Speaker',
        itemStyle: {
          color: 'rgba(111, 209, 149, 0.6)',
          borderColor: '#6FD195',
          borderWidth: 1,
        },
        data: [40, 50, 35, 80, 15, 20, 60],
        isTop: true,
      },
    ],
  };

  return (
    <div className='bg-white p-6 rounded-[10px] h-full'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-2xl font-medium text-gray-800'>Orders</h3>
        <DatePicker.RangePicker
          presets={rangePresets}
          style={{ width: 240 }}
          placeholder={['Start Date', 'End Date']}
        />
      </div>
      <StackedBarChart data={data} height='280px' />
    </div>
  );
};

export default OrdersChart;
