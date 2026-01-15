import React from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { ConfigProvider } from 'antd';

const OrderTable = ({ data, loading, columns }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          primaryColor: '#514EB5',
          colorPrimary: '#514EB5',
        },
      }}
    >
      <CustomTable
        tableData={data}
        columns={columns}
        loading={loading}
        scroll={{ x: 1000 }}
        showPagination={true}
        pageSize={10}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
        }}
      />
    </ConfigProvider>
  );
};

export default OrderTable;
