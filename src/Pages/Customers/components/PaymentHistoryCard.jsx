import React from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { Button } from 'antd';
import { SidebarContext } from '@/Context/CustomUsertable';

const PaymentHistoryCard = ({ payments }) => {
  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => <span className='text-gray-500 font-medium text-sm'>{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span className='text-gray-500 text-sm'>{text}</span>,
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <div className='flex justify-end gap-4'>
          <Button type='text' className='text-indigo-600 font-medium hover:bg-transparent '>
            Receipt
          </Button>
          <Button type='text' className='text-indigo-600 font-medium hover:bg-transparent '>
            Refund
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='bg-white rounded-[10px] p-6'>
      <h3 className='text-[20px] font-medium text-gray-800 mb-4'>Payments</h3>
      <SidebarContext.Provider
        value={{ total: payments.length, page: 1, SetPage: () => {}, getlist: () => {} }}
      >
        <div className='max-h-[500px] overflow-y-auto'>
          <CustomTable
            tableData={payments}
            columns={columns}
            loading={false}
            pagination={false}
            className='no-border-table hide-pagination'
            showPagination={false}
          />
        </div>
      </SidebarContext.Provider>
    </div>
  );
};

export default PaymentHistoryCard;
