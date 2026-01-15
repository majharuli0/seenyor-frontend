import React, { useEffect, useState } from 'react';
import AdminFiled from '@/Shared/AdminFiled/AdminFiled';
import RestoreAction from '@/Components/RestoreAction/index';
import PermanentDeleteAction from '@/Components/PermanentDelete';

export default function GetRecentlyDeletedUserColumn() {
  const [result, setResult] = useState(undefined);
  const roleMappings = {
    distributor: 'Distributor',
    nursing_home: 'Nursing Home',
    sales_agent: 'Sales Agent',
    supports_agent: 'Support Agent',
    super_agent: 'Super Admin',
    elderly: 'Elderly',
    installers: 'Installer',
    monitoring_agency: 'Monitoring Station',
    monitoring_stations: 'Control Centers',
    office: 'Office',
    end_user: 'End User',
    nurse: 'Nurse',
  };
  const deletedUserList = [
    {
      title: 'User',
      key: 'id',
      render: (row) =>
        row?.role == 'elderly' ? (
          <button style={{ width: '200px', textAlign: 'left' }}>
            <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
              {row.name}
            </span>
          </button>
        ) : (
          <button>
            <AdminFiled data={row} />
          </button>
        ),
    },
    {
      title: 'Contact Number',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.phone_number}
          </span>
        </button>
      ),
    },
    {
      title: 'Contact Person',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.contact_person_name}
          </span>
        </button>
      ),
    },
    {
      title: 'Role',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {roleMappings[row.role]}
          </span>
        </button>
      ),
    },
    {
      title: 'Action',
      render: (row) => (
        <div className='flex items-center gap-5'>
          <RestoreAction data={row} />
          <PermanentDeleteAction data={row} />
        </div>
      ),
    },
  ];
  useEffect(() => {
    setResult(deletedUserList);
  }, []);
  return result;
}
