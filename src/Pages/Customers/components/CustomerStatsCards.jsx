import React from 'react';
import { Users, UserCheck, UserX, Archive } from 'lucide-react';

const CustomerStatsCards = ({ selectedFilter, onFilterChange }) => {
  const cards = [
    {
      id: 'all',
      title: 'All Customers',
      value: '326',
      icon: <Users size={24} />,
    },
    {
      id: 'active',
      title: 'Subscribers',
      value: '265',
      icon: <UserCheck size={24} />,
    },
    {
      id: 'inactive',
      title: 'Non Subscribers',
      value: '78',
      icon: <UserX size={24} />,
    },
    {
      id: 'archived',
      title: 'Archived',
      value: '22',
      icon: <Archive size={24} />,
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {cards.map((card, index) => {
        const isSelected = selectedFilter === card.id;

        const containerClasses = isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800';

        const iconContainerClasses = isSelected
          ? 'bg-white/20 text-white'
          : 'bg-indigo-50 text-indigo-600';

        return (
          <div
            key={index}
            onClick={() => onFilterChange && onFilterChange(card.id)}
            className={`${containerClasses} py-6 px-[20px] rounded-[5px] flex items-center justify-between transition-all cursor-pointer`}
          >
            <div>
              <h1 className='text-[32px] font-medium mb-1'>{card.value}</h1>
              <p
                className={`text-[16px] font-medium ${isSelected ? 'text-white/90' : 'text-gray-500'}`}
              >
                {card.title}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${iconContainerClasses}`}>
              {React.cloneElement(card.icon, {
                className: isSelected ? 'text-white' : 'text-indigo-600',
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerStatsCards;
