import React from 'react';
import StatsCard from '@/Components/StatsCard';
import CustomersChart from '@/Components/CustomersChart';
import EarningsChart from '@/Components/EarningsChart';
import OrdersChart from '@/Components/OrdersChart';
import SubscriptionsChart from '@/Components/SubscriptionsChart';
import InventoryChart from '@/Components/InventoryChart';

const CRMAdminDashboard = () => {
  return (
    <div
      className='w-full p-6 min-h-screen'
      style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#F4F4F4' }}
    >
      <div className='grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6'>
        {/* Left Column (70% width) */}
        <div className='flex flex-col gap-6'>
          {/* Stats Cards Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
            <StatsCard title='Total Customers' value='265' percentage='20' isIncrease={true} />
            <StatsCard title='Active Subscribers' value='196' percentage='05' isIncrease={true} />
            <StatsCard title='Active Orders' value='06' percentage='15' isIncrease={false} />
            <StatsCard title='Open Tickets' value='15' percentage='60' isIncrease={true} />
          </div>

          {/* Customers Chart */}
          <div className='w-full'>
            <CustomersChart />
          </div>

          {/* Subscriptions Chart */}
          <div className='w-full'>
            <SubscriptionsChart />
          </div>
        </div>

        {/* Right Column (30% width) */}
        <div className='flex flex-col gap-6'>
          <EarningsChart />
          <OrdersChart />
          <InventoryChart />
        </div>
      </div>
    </div>
  );
};

export default CRMAdminDashboard;
