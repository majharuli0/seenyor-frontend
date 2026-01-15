import React, { useContext } from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
import { ConfigProvider } from 'antd';

const CustomerTable = ({ data, loading, columns }) => {
  const { page, SetPage, total } = useContext(SidebarContext);

  return (
    <div className='customer-table-wrapper'>
      <ConfigProvider
        theme={{
          token: {
            primaryColor: '#514EB5',
            defaultActiveBg: '#514EB5',
            defaultActiveBorderColor: '#514EB5',
            defaultActiveColor: '#514EB5',
            colorPrimary: '#fff',
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
    </div>
  );
};

export default CustomerTable;
