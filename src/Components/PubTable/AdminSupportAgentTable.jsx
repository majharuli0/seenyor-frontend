import React, { useContext } from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { useNavigate } from 'react-router-dom';
import { SidebarContext } from '@/Context/CustomContext';
import './index.css';

const AdminSupportAgentTable = ({ tableData, columns, loading = false }) => {
  return (
    <div>
      <CustomTable
        loading={loading}
        tableData={tableData}
        columns={columns}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default AdminSupportAgentTable;
