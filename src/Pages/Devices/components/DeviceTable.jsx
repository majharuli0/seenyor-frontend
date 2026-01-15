import React from 'react';
import CustomTable from '@/Shared/Table/CustomTable';

const DeviceTable = ({ data, loading, columns }) => {
  return (
    <div className='bg-white rounded-b-[10px] p-6 pt-0 relative'>
      <CustomTable
        tableData={data}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
        className='no-border-table'
        showPagination={true}
      />
    </div>
  );
};

export default DeviceTable;
