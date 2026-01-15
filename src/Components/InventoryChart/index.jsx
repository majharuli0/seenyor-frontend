import React from 'react';
import PieGraph from '../GraphAndChart/PieGraph';

const InventoryChart = () => {
  const data = [
    { value: 82, name: 'In Stock', itemStyle: { color: '#7086FD' } },
    { value: 46, name: 'Delivered', itemStyle: { color: '#6FD195' } },
    { value: 56, name: 'Shipping', itemStyle: { color: '#FFAE4C' } },
  ];

  return (
    <div className='bg-white p-4 rounded-[10px] h-full'>
      <h3 className='text-2xl font-medium text-gray-800 mb-2'>Inventory</h3>
      <PieGraph data={data} isRose={true} height='320px' />
    </div>
  );
};

export default InventoryChart;
