import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import ManageChileUserActions from './ManageChileUserActions';

// Custom Hook
export const useGetColumnsByRoleAndActiveTab = (activeTab) => {
  const [result, setResult] = useState([]);

  const SalesAgent = [
    {
      title: 'Sales Agent Name',
      render: (row) => (
        <span className='text-[14px] xl:text-base px-[11px] font-normal text-text-secondary'>
          {row?.name} {row?.last_name}
        </span>
      ),
    },
    {
      title: 'Agent Code',
      render: (row) => (
        <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
          {row?.agent_id}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      align: 'center',
      render: (row) => <ManageChileUserActions data={row} />,
    },
  ];

  const Nurse = [
    {
      title: 'Nurse Name',
      render: (row) => (
        <span className='text-[14px] xl:text-base px-[11px] font-normal text-text-secondary'>
          {row.name + ' ' + row.last_name}
        </span>
      ),
    },
    {
      title: 'Nurse E-mail',
      render: (row) => (
        <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
          {row.email}
        </span>
      ),
    },
    {
      title: 'Phone Number',
      render: (row) => (
        <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
          {row.contact_code ? row.contact_code : ''} {row.contact_number}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      align: 'center',
      render: (row) => <ManageChileUserActions data={row} />,
    },
  ];
  const MonitoringAgency = [
    {
      title: 'Monitoring Agent Name',
      render: (row) => (
        <span className='text-[14px] xl:text-base px-[11px] font-normal text-text-secondary'>
          {row.name + ' ' + row.last_name}
        </span>
      ),
    },
    {
      title: 'E-mail',
      render: (row) => (
        <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
          {row.email}
        </span>
      ),
    },
    {
      title: 'Phone Number',
      render: (row) => (
        <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
          {row.contact_code ? row.contact_code : ''} {row.contact_number}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      align: 'center',
      render: (row) => <ManageChileUserActions data={row} />,
    },
  ];

  useEffect(() => {
    if (activeTab === 'office') {
      setResult(SalesAgent);
    } else if (activeTab === 'nursing_home') {
      setResult(Nurse);
    } else if (activeTab === 'monitoring_agency') {
      setResult(MonitoringAgency);
    }
  }, [activeTab]);

  return result;
};
