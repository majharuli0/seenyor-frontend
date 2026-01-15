import React, { useEffect, useRef, useState, useContext } from 'react';
import AdminSupportAgentTableAction from '@/Components/PubTable/AdminSupportAgentTableAction';
import AdminFiled from '@/Shared/AdminFiled/AdminFiled';
import { Select, Space, Table, Tag, Switch, Modal, ConfigProvider } from 'antd';
import ls from 'store2';
import { useCountStore } from '@/store/index';
import { useNavigate } from 'react-router-dom';
import { updateUserDetails } from '@/api/Users';
import { MdSignalWifiStatusbarConnectedNoInternet2 } from 'react-icons/md';
import ReportActionModal from './components/ReportActionModal';
import Elderly from '@/Components/NameCol/Elderly';
import { LuNavigation } from 'react-icons/lu';
import NursingHomeTableAction from '@/Components/PubTable/AdminSupportAgentTableAction';
import SalesAgentAction from '@/Components/PubTable/SalesAgentAction';
import { formatCreatedAt } from '../../utils/helper';

function StatusSwitch({ row }) {
  const [status, setStatus] = useState(row?.status);
  const [handleLoading, sethandleLoading] = useState(false);
  // let status = row?.status
  const handleChange = (value) => {
    sethandleLoading(true);
    updateUserDetails(row?._id, {
      status: value,
    })
      .then((res) => {
        console.log(res);
        if (res) {
          setStatus(res?.user?.status);
        }
      })
      .finally(() => {
        sethandleLoading(false);
      });
  };
  // Update local state if row status changes
  useEffect(() => {
    setStatus(row?.status);
  }, [row]);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: '#707EAE',
          colorPrimary: '#06A44F',
          colorLinkActive: '#8086AC',
          colorLinkHover: '#8086AC',
          colorLink: '#8086AC',
        },
      }}
    >
      <Switch
        loading={handleLoading}
        onChange={handleChange}
        handleBg='#00000'
        className='bg-slate-200'
        value={status}
        // defaultChecked
      />
    </ConfigProvider>
  );
}
//Dropdown For Office Status Change
function StatusDropdown({ row }) {
  const [status, setStatus] = useState(row?.status);
  const [handleLoading, sethandleLoading] = useState(false);

  // let status = row?.status
  const handleChange = (value) => {
    sethandleLoading(true);
    updateUserDetails(row?._id, {
      status: value,
    })
      .then((res) => {
        console.log(res);
        if (res) {
          setStatus(res?.user?.status);
        }
      })
      .finally(() => {
        sethandleLoading(false);
      });
  };
  // Update local state if row status changes
  useEffect(() => {
    setStatus(row?.status);
  }, [row]);
  return (
    <div className='flex items-center space-x-2 mr-0 '>
      {/* Red or green circle based on status */}
      <span
        className={`w-3 h-3 rounded-full relative -right-2 ${
          status == true ? 'bg-[#1EB564]' : 'bg-red-500'
        }`}
      ></span>
      {/* Status select dropdown */}
      <ConfigProvider
        theme={{
          token: {
            colorText: '#707EAE',
            colorPrimary: '#8086AC',
            colorLinkActive: '#8086AC',
            colorLinkHover: '#8086AC',
            colorLink: '#8086AC',
          },
        }}
      >
        <Select
          value={status}
          variant='borderless'
          onChange={handleChange}
          loading={handleLoading}
          dropdownMatchSelectWidth={false}
          optionSelectedColor='#8086AC'
          className='w-fit !text-red-100'
          options={[
            { value: false, label: <span>Disable</span> },
            { value: true, label: <span>Active</span> },
          ]}
        />
      </ConfigProvider>
    </div>
  );
}

export const useGetColumnsByRoleAndActiveTab = (activeTab) => {
  const [mainRole, setMainRole] = useState(ls.get('mainRole'));
  const [result, setResult] = useState(undefined);
  const { setUserDetil } = useCountStore();
  const navigate = useNavigate();
  console.log(activeTab);

  const handelClick = (row, name) => {
    ls.set('tableData', row);
    setUserDetil(row);
    console.log('id', row.id);
    console.log('kio');

    navigate(`/support-agent/dashboard/suspended-user/${row.id}`);
  };

  const roleBasedColumns = {
    distributor: {
      office: [
        'name',
        'address',
        'contact_person',
        'contact_number',
        'end_user_count',
        'nursing_home_count',
        'monitoring_company_count',
        'action',
      ],
      sales_agent: [
        'name',
        // "office_name",
        'address',
        'contact_number',
        'agent_id',
        'nursing_home_count',
        'monitoring_company_count',
        'end_user_count',
        'action',
      ],
    },
    sales_agent: {
      nursing_home: [
        'name',
        'address',
        'contact_person',
        'contact_number',
        'assigned_nurse_count',
        'action',
      ],
      end_user: [
        'name',
        'address',
        // "date",
        'contact_number',
        // "external_id",
        // "products",
        // "products_price",
        // "addons",
        // "addons_price",
        // "total_price",
      ],
      monitoring_station: ['name', 'address', 'contact_person', 'contact_number', 'action'],
      installer: ['name', 'address', 'contact_number', 'action'],
      support_agent: ['name', 'address', 'contact_number', 'action'],
    },
    nursing_home: {
      nurse: ['name', 'contact_number', 'action'],
      elderly: ['elderlyName', 'activeAlert', 'allergies', 'diseases', 'viewOnMap'],
      end_user: [
        'name',
        'address',
        'created_date',
        'contact_number',
        'devices',
        'expiry',
        'nursing_home_action',
      ],
    },
    monitoring_station: {
      support_agent: ['name', 'address', 'contact_number', 'action'],
      installer: ['name', 'address', 'contact_number', 'action'],
      elderly: ['elderlyName', 'activeAlert', 'allergies', 'diseases', 'viewOnMap'],
    },
    nurse: {
      elderly: ['name', 'age', 'alert_count', 'device_count'],
    },
    installer: {
      end_user: ['name', 'address', 'contact_number', 'action'],
    },
    office: {
      sales_agent: [
        'name',
        // "office_name",
        'address',
        'contact_number',
        'agent_id',
        'is_default',
        'nursing_home_count',
        'monitoring_company_count',
        'end_user_count',
        'device_count',
        'sales_agent_action',
      ],
      installer: ['name', 'address', 'contact_number', 'action'],
    },
  };

  const allColumns = {
    //common col ========================>
    name: {
      title: (role) => {
        switch (role) {
          case 'office':
            return 'Office';
          case 'nurse':
            return 'Nurse Name';
          case 'distributor':
            return 'Distributor Name';
          case 'sales_agent':
            return 'Sales Agent Name';
          case 'nursing_home':
            return 'Nursing Home';
          case 'end_user':
            return 'User Name';
          case 'monitoring_station':
            return 'Control Center';
          case 'support_agent':
            return 'Support Agent';
          case 'installer':
            return 'Installer';
          default:
            return 'Name';
        }
      },
      key: 'id',
      // onCell: (record, rowIndex) => {
      //   return {
      //     onClick: (event) => {
      //       handelClick(record, "distributorId");
      //     }, // click row
      //   };
      // },
      render: (row) =>
        row?.role == ('monitoring_company', 'elderly') ? (
          <button>
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
    elderlyName: {
      title: 'Elderly Name',
      render: (row) => <Elderly data={row} />,
    },
    address: {
      title: (role) => {
        switch (role) {
          case 'sales_agent':
            return 'Address';
          default:
            return 'Address';
        }
      },
      render: (row) => (
        <button style={{ width: '200px', textAlign: 'left' }}>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.address}
          </span>
        </button>
      ),
    },
    installation_address: {
      title: 'Installation Address',
      render: (row) => (
        <button style={{ width: '200px', textAlign: 'left' }}>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.installation_address}
          </span>
        </button>
      ),
    },
    activeAlert: {
      title: 'Active Fall Alerts',
      dataIndex: 'unresolved_alarm_count',
      render: (text) => <span>{text}</span>,
    },
    allergies: {
      title: 'Comments',
      render: (row) => (
        <span>{row?.comments?.map((comment) => comment.comment).join(', ') || 'N/A'}</span>
      ),
    },
    diseases: {
      title: 'Conditions',
      render: (row) => <span>{row?.diseases?.map((d) => d).join(', ') || 'N/A'}</span>,
    },
    medications: {
      title: 'Medications',
      render: (row) => <span>{row.medications?.map((d) => d.name).join(', ')}</span>,
    },
    viewOnMap: {
      title: 'View On Map',
      render: (row) => (
        <span className='flex items-center transition-all duration-300 justify-start gap-2 text-sm font-medium text-text-primary hover:text-primary cursor-pointer p-2 rounded-md w-fit text-center hover:bg-slate-100'>
          <div className='flex items-center gap-2'>
            <a
              href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-base font-medium !text-blue-500'
            >
              View on Map
            </a>
            <LuNavigation size={18} className='text-blue-500' />
          </div>
        </span>
      ),
    },
    email: {
      title: 'Email Address',
      render: (row) => (
        <button style={{ width: '150px', textAlign: 'left' }}>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.email}
          </span>
        </button>
      ),
    },
    expiry: {
      title: 'Is Expire',
      render: (row) => (
        <button style={{ width: '150px', textAlign: 'left' }}>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.expired}
          </span>
        </button>
      ),
    },
    devices: {
      title: 'Total Devices',
      render: (row) => (
        <button style={{ width: '150px', textAlign: 'left' }}>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.devices || 0}x
          </span>
        </button>
      ),
    },
    contact_number: {
      title: 'Contact Number',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.contact_code + ' ' + row.contact_number}
          </span>
        </button>
      ),
    },
    contact_person: {
      title: 'Contact Person',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.contact_person}
          </span>
        </button>
      ),
    },
    date: {
      title: 'Date of Sales',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.date}
          </span>
        </button>
      ),
    },
    created_date: {
      title: 'User Since',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {formatCreatedAt(row.created_at)}
          </span>
        </button>
      ),
    },
    age: {
      title: 'Age',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.age}
          </span>
        </button>
      ),
    },
    external_id: {
      title: 'External ID',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.date}
          </span>
        </button>
      ),
    },
    products: {
      title: 'Products',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.products}
          </span>
        </button>
      ),
    },
    products_price: {
      title: 'Products Price',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.products_price}
          </span>
        </button>
      ),
    },
    addons: {
      title: 'Addons',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.addons}
          </span>
        </button>
      ),
    },
    addons_price: {
      title: 'Addons Price',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.addon_price}
          </span>
        </button>
      ),
    },
    total_price: {
      title: 'Total Price',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.total}
          </span>
        </button>
      ),
    },
    //count related col ===========================>
    alert_count: {
      title: 'Alert Count',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.alert_count}
          </span>
        </button>
      ),
    },
    device_count: {
      title: 'Device Count',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.device_count}
          </span>
        </button>
      ),
    },
    sales_agent_count: {
      title: 'Sales Agents',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.sales_agent_count}
          </span>
        </button>
      ),
    },
    end_user_count: {
      title: 'End Users',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.end_user_count}
          </span>
        </button>
      ),
    },
    nursing_home_count: {
      title: 'Nursing Homes',

      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.nursing_home_count}
          </span>
        </button>
      ),
    },
    monitoring_company_count: {
      title: 'Control Center',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.monitoring_station_count}
          </span>
        </button>
      ),
    },
    assigned_nurse_count: {
      title: 'Assigned Nurse',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row?.nurse_count}
          </span>
        </button>
      ),
    },
    //All Type Of Naming Col ==========================>
    office_name: {
      title: 'Office',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.office_name}
          </span>
        </button>
      ),
    },
    is_default: {
      title: 'Default Agent',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.is_default ? <Tag color='purple'>Default Agent</Tag> : ''}
          </span>
        </button>
      ),
    },
    installer: {
      title: 'Installer Name',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.installer_name}
          </span>
        </button>
      ),
    },
    //Others ==============================================>
    agent_id: {
      title: 'Agent ID',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.agent_id}
          </span>
        </button>
      ),
    },
    //action col =====================================>
    status: {
      title: 'Status',
      render: (row) =>
        row?.role == 'sales_agent' ? <StatusSwitch row={row} /> : <StatusDropdown row={row} />,
    },
    report: {
      title: 'Report',
      render: (row) => (
        <div className='flex justify-center'>
          <ReportActionModal report={row} />
        </div>
      ),
    },
    status2: {
      title: 'Installation Status',
      render: (row) => {
        let bgColor;
        switch (row.status) {
          case 'not started':
            bgColor = 'bg-gray-500';
            break;
          case 'problem':
            bgColor = 'bg-red-500';
            break;
          case 'pending':
            bgColor = 'bg-yellow-500';
            break;
          case 'complete':
            bgColor = 'bg-[#1EB564]';
            break;
        }
        return (
          <button>
            <span
              className={`text-[14px] xl:text-base capitalize font-semibold font-normal text-white p-2 px-3 ${bgColor} rounded-lg`}
            >
              {row.status}
            </span>
          </button>
        );
      },
    },
    action: {
      title: '',
      key: 'id',
      width: 100,
      render: (row) => <AdminSupportAgentTableAction data={row} />,
    },
    nursing_home_action: {
      title: '',
      key: 'id',
      width: 100,
      render: (row) => <NursingHomeTableAction data={row} />,
    },
    sales_agent_action: {
      title: '',
      key: 'id',
      width: 100,
      render: (row) => <SalesAgentAction data={row} />,
    },
  };
  useEffect(() => {
    // Check role and set the columns accordingly
    if (activeTab == 'Offices') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['office'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('office')
              : columnConfig?.title,
        };
      });
      setResult(tableColumns);
    } else if (activeTab == 'Support Agents') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['support_agent'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('support_agent')
              : columnConfig?.title,
        };
      });
      setResult(tableColumns);
    } else if (activeTab == 'Nursing Homes') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['nursing_home'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('nursing_home')
              : columnConfig?.title,
        };
      });
      setResult(tableColumns);
    } else if (activeTab == 'Sales Agents') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['sales_agent'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('sales_agent')
              : columnConfig?.title,
        };
      });
      setResult(tableColumns);
    } else if (activeTab == 'End Users') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['end_user'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('end_user')
              : columnConfig?.title,
        };
      });
      setResult(tableColumns);
    } else if (activeTab == 'Installers') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['installer'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('installer')
              : columnConfig?.title,
        };
      });
      setResult(tableColumns);
    } else if (activeTab == 'Control Centers') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['monitoring_station'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('monitoring_station')
              : columnConfig?.title,
        };
      });
      setResult(tableColumns);
    } else if (activeTab == 'Nurse') {
      console.log(activeTab);

      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['nurse'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('nurse')
              : columnConfig?.title,
        };
      });

      setResult(tableColumns);
    } else if (activeTab == 'Elderly') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['elderly'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('elderly')
              : columnConfig?.title,
        };
      });

      setResult(tableColumns);
    }
  }, [activeTab]); // Run this effect whenever `role` changes

  return result;
};
