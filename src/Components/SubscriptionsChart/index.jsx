import React from 'react';
import { DatePicker } from 'antd';
import ColumnChart from '../GraphAndChart/ColumnChart';
import dayjs from 'dayjs';

const rangePresets = [
  { label: 'This Week', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
  { label: 'This Month', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
  { label: 'This Year', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
];

const SubscriptionsChart = () => {
  const data = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    values: [69, 17, 32, 20, 41, 11, 57, 15, 57, 52, 92, 42],
  };

  return (
    <div className='bg-white p-6 rounded-[10px] h-full'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-2xl font-medium text-gray-800'>Subscriptions</h3>
        <DatePicker.RangePicker
          presets={rangePresets}
          style={{ width: 240 }}
          placeholder={['Start Date', 'End Date']}
        />
      </div>
      <ColumnChart data={data} showLabel={true} height='350px' />
    </div>
  );
};

export default SubscriptionsChart;
