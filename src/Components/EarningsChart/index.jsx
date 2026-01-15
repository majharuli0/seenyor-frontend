import React from 'react';
import { DatePicker } from 'antd';
import DonutChart from '../GraphAndChart/DonutChart';

import dayjs from 'dayjs';

const rangePresets = [
  { label: 'This Week', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
  { label: 'This Month', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
  { label: 'This Year', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
];

const EarningsChart = () => {
  const data = [
    { value: 2105, name: 'Product', itemStyle: { color: '#6FD195' } },
    { value: 4125.56, name: 'Subscription', itemStyle: { color: '#7086FD' } },
  ];

  return (
    <div className='bg-white p-6 rounded-[10px] h-full'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-2xl font-medium text-gray-800'>Earnings</h3>
        <DatePicker.RangePicker
          presets={rangePresets}
          style={{ width: 240 }}
          placeholder={['Start Date', 'End Date']}
        />
      </div>

      <DonutChart
        data={data}
        centerText='$6259.56'
        centerSubtext='Total'
        withLabels={true}
        valuePrefix='$'
      />
    </div>
  );
};

export default EarningsChart;
