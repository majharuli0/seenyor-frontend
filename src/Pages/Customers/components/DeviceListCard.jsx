import React from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';

const DeviceListCard = ({ devices }) => {
  const columns = [
    {
      title: 'Device',
      dataIndex: 'device',
      key: 'device',
      render: (text) => <span className='text-gray-500 text-sm'>{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span className='text-gray-500 text-sm'>{text}</span>,
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      render: (text) => <span className='text-gray-500 text-sm'>{text}</span>,
    },
  ];

  return (
    <div className='bg-white rounded-[10px] p-6 h-full'>
      <h3 className='text-[20px] font-medium text-gray-800 mb-4'>Device Lists</h3>
      <SidebarContext.Provider
        value={{ total: devices.length, page: 1, SetPage: () => {}, getlist: () => {} }}
      >
        <div className='max-h-[500px] overflow-y-auto'>
          <CustomTable
            tableData={devices}
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

export default DeviceListCard;
