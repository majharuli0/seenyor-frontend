import { Table } from 'antd';
import React, { useContext, useEffect } from 'react';
import { SidebarContext } from '@/Context/CustomUsertable';

const CustomTable = ({
  tableData,
  columns,
  scroll,
  loading,
  pageSize = 10,
  rowSelection,
  expandable,
  rowKey,
  showPagination = true,
  ...props
}) => {
  const [start, setStart] = React.useState(1);
  const [end, setend] = React.useState(10);
  const { total = '', query = '', page = '', SetPage = {}, getlist } = useContext(SidebarContext);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    setend(pageSize);
  }, []);

  // ====table pagination funcation====
  const handlePaginationChange = (page, pageSize) => {
    SetPage({
      page: page,
      size: pageSize,
      limit: pageSize,
    });
  };
  const paginationOptions = {
    onChange: handlePaginationChange,
    current: page.page,
    pageSize: pageSize,
    total: total,
    showSizeChanger: false,
  };

  return (
    <div className='lg:relative text-secondary text-base w-full' {...props}>
      <Table
        columns={columns}
        loading={loading}
        id='admin__support__agent'
        className='admin__Table'
        dataSource={tableData}
        pagination={showPagination && { ...paginationOptions }}
        scroll={{ x: scroll?.x || scroll || 700, y: scroll?.y }}
        expandable={expandable}
        rowKey={rowKey}
        rowSelection={rowSelection}
      />
      {showPagination && (
        <div className='lg:block text-light-black font-medium text-[13px] lg:absolute bottom-[25px] left-6 hidden '>
          Showing {start} to {end} of {total ? total : tableData?.length} entries
        </div>
      )}
    </div>
  );
};

export default CustomTable;
