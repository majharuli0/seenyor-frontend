import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useParams } from 'react-router-dom';
import StockStatsCards from './components/StockStatsCards';
import CreateShipment from './components/CreateShipment';
import OrderInfoSidebar from './components/OrderInfoSidebar';
import OrderTracking from './components/OrderTracking';

const OrderDetails = () => {
  const { id } = useParams();

  return (
    <div className='p-6 bg-[#F8F9FA] min-h-screen font-poppins'>
      {/* Breadcrumb */}
      <div className='mb-6'>
        <Breadcrumb
          items={[
            {
              title: <span className='text-gray-500'>Home</span>,
            },
            {
              title: (
                <Link to='/management/orders' className='text-gray-500'>
                  Orders
                </Link>
              ),
            },
            {
              title: <span className='text-[#514EB5] font-medium'>#{id || '4657583788'}</span>,
            },
          ]}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-10 gap-6'>
        {/* Main Content Area */}
        <div className='lg:col-span-7 flex flex-col gap-4'>
          <StockStatsCards />
          <CreateShipment />
        </div>

        {/* Right Sidebar */}
        <div className='lg:col-span-3 flex flex-col gap-6'>
          <OrderInfoSidebar />
          <OrderTracking />
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
