import React from 'react';
import { Button } from 'antd';
import { Server, Wifi, WifiOff, Cpu } from 'lucide-react';
import { HiOutlineChip } from 'react-icons/hi';
const StatCard = ({ title, count, icon: Icon, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-[10px] p-6 flex items-center justify-between min-w-[200px] cursor-pointer transition-all duration-200 ${
        active ? 'bg-[#514EB5] text-white shadow-lg' : 'bg-white text-gray-800 hover:bg-gray-50'
      }`}
    >
      <div>
        <p className={`text-sm mb-1 ${active ? 'text-white/80' : 'text-gray-500'}`}>{title}</p>
        <h3 className='text-3xl font-bold'>{count}</h3>
      </div>
      <div className={`p-3 rounded-xl ${active ? 'bg-white/20' : 'bg-gray-50'}`}>
        <Icon size={24} className={active ? 'text-white' : 'text-gray-400'} />
      </div>
    </div>
  );
};

const DeviceStats = ({ currentFilter, onFilterChange, onBatchOTAClick }) => {
  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
      <div className='flex flex-wrap gap-4 w-full md:w-auto'>
        <StatCard
          title='All Devices'
          count='256'
          icon={Server}
          active={currentFilter === 'All'}
          onClick={() => onFilterChange('All')}
        />
        <StatCard
          title='Online'
          count='26'
          icon={Wifi}
          active={currentFilter === 'Online'}
          onClick={() => onFilterChange('Online')}
        />
        <StatCard
          title='Offline'
          count='230'
          icon={WifiOff}
          active={currentFilter === 'Offline'}
          onClick={() => onFilterChange('Offline')}
        />
      </div>

      <Button
        type='primary'
        size='large'
        className='bg-[#514EB5] hover:!bg-[#403D94] border-none font-medium h-12 px-6 rounded-lg'
        style={{ backgroundColor: '#514EB5' }}
        onClick={onBatchOTAClick}
      >
        <HiOutlineChip /> Batch OTA result
      </Button>
    </div>
  );
};

export default DeviceStats;
