import React from 'react';
import { DatePicker } from 'antd';
import LineChart from '../GraphAndChart/LineChart';

import dayjs from 'dayjs';

const rangePresets = [
  { label: 'This Week', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
  { label: 'This Month', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
  { label: 'This Year', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
];

const CustomersChart = () => {
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
    values: [35, 10, 58, 10, 30, 90, 15, 95, 45, 80, 40, 70],
  };

  return (
    <div className='bg-white p-6 rounded-[10px] h-full'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-2xl font-medium text-gray-800'>Customers</h3>
        <DatePicker.RangePicker
          presets={rangePresets}
          style={{ width: 240 }}
          placeholder={['Start Date', 'End Date']}
        />
      </div>
      <LineChart data={data} />
    </div>
  );
};

export default CustomersChart;
