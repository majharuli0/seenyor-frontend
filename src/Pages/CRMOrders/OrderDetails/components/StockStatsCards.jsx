import React from 'react';
import { Layers } from 'lucide-react';
import AISensor from '../../../../assets/ai_sensor.png';
import AISpeaker from '../../../../assets/ai_speker.png';

const StatCard = ({ title, value, subTitle, icon: Icon, image, iconColor, bg }) => {
  return (
    <div className='bg-white rounded-[10px] p-6 flex items-center justify-between flex-1'>
      <div>
        <h3 className='text-[24px] font-bold text-[#1B2559]'>{value}</h3>
        <p className='text-gray-500 text-[14px]'>{title}</p>
      </div>
      <div className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center`}>
        {image ? (
          <img src={image} alt={title} className='w-full h-full object-contain scale-150' />
        ) : (
          <Icon size={24} className={iconColor} />
        )}
      </div>
    </div>
  );
};

const StockStatsCards = () => {
  return (
    <div className='flex flex-col md:flex-row gap-6 mb-6'>
      <StatCard
        value='1265'
        title='Stock Available'
        icon={Layers}
        iconColor='text-[#514EB5]'
        bg='bg-indigo-50'
      />
      <StatCard value='980' title='Available AI Sensor' image={AISensor} bg='bg-transparent' />
      <StatCard value='285' title='Available AI Speaker' image={AISpeaker} bg='bg-transparent' />
    </div>
  );
};

export default StockStatsCards;
