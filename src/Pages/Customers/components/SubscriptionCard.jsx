import React, { useState } from 'react';
import { Button, Tag } from 'antd';
import { Copy, Mail } from 'lucide-react';
import CreateSubscriptionModal from './CreateSubscriptionModal';

const SubscriptionCard = ({ subscription }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreate = (values) => {
    console.log('Created subscription:', values);
    setIsCreateModalOpen(false);
    // Trigger API call to create subscription
  };

  return (
    <div className='bg-white rounded-[10px] p-6 h-full'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-[20px] font-medium text-gray-800'>Subscription</h3>
        <Button
          type='text'
          className='text-[#514EB5] text-[18px] font-semibold p-0 h-auto hover:!bg-transparent hover:text-[#514EB5]'
          style={{ backgroundColor: 'transparent' }}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Subscription
        </Button>
      </div>

      <div className='space-y-4 mb-6'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500 text-sm'>Status</span>
          <span className='text-green-500 font-medium text-sm'>{subscription.status}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500 text-sm'>Plan</span>
          <span className='text-gray-800 font-medium text-sm'>{subscription.plan}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500 text-sm'>Amount</span>
          <span className='text-gray-800 font-medium text-sm'>{subscription.amount}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500 text-sm'>Subscription ID</span>
          <span className='text-gray-800 font-medium text-sm'>{subscription.id}</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500 text-sm'>Current Period</span>
          <span className='text-gray-800 font-medium text-sm'>{subscription.period}</span>
        </div>
      </div>

      <div className='bg-[#F8F9FA] rounded-lg p-4 flex items-center justify-between'>
        <div>
          <p className='text-xs text-indigo-400 font-medium mb-1'>Next Invoice</p>
          <p className='text-indigo-600 font-bold text-sm'>{subscription.nextInvoice}</p>
        </div>
        <div className='flex gap-3'>
          <Button
            type='text'
            icon={<Mail size={14} />}
            className='text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-none text-xs flex items-center gap-1.5 h-8'
          >
            Send email
          </Button>
          <Button
            type='text'
            icon={<Copy size={14} />}
            className='text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-none text-xs flex items-center gap-1.5 h-8'
          >
            Copy link
          </Button>
        </div>
      </div>

      <CreateSubscriptionModal
        visible={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default SubscriptionCard;
