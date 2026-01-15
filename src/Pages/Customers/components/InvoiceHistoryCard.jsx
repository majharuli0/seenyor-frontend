import React from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { Button } from 'antd';
import { SidebarContext } from '@/Context/CustomUsertable';

const InvoiceHistoryCard = ({ invoices }) => {
  const columns = [
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => <span className='text-gray-500 font-medium text-sm'>{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span className='text-gray-500 text-sm'>{text}</span>,
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (text) => <span className='text-gray-500 text-sm'>{text}</span>,
    },
    {
      title: 'Invoice ID',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      render: (text) => <span className='text-gray-500 text-sm'>{text}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type='text' className='text-indigo-600 font-medium hover:bg-transparent '>
          Download PDF
        </Button>
      ),
    },
  ];

  return (
    <div className='bg-white rounded-[10px] p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-[20px] font-medium text-gray-800'>Invoices</h3>
        <Button
          type='text'
          className='text-[#514EB5] text-[18px] font-semibold p-0 h-auto hover:!bg-transparent hover:text-[#514EB5]'
          style={{ backgroundColor: 'transparent' }}
        >
          Create Invoice
        </Button>
      </div>
      <SidebarContext.Provider
        value={{ total: invoices.length, page: 1, SetPage: () => {}, getlist: () => {} }}
      >
        <div className='max-h-[500px] overflow-y-auto'>
          <CustomTable
            tableData={invoices}
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

export default InvoiceHistoryCard;
