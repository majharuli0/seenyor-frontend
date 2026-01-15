import React, { useEffect, useRef, useState, useContext } from 'react';
import AdminSupportAgentTableAction from '@/Components/PubTable/AdminSupportAgentTableAction';
import AdminFiled from '@/Shared/AdminFiled/AdminFiled';
import { Select, Space, Table, Tag, Switch, Modal, ConfigProvider, Tooltip } from 'antd';
import ls from 'store2';
import { useCountStore } from '@/store/index';
import { useNavigate } from 'react-router-dom';
import { updateUserDetails } from '@/api/Users';
import OwnershipStructure from '../../Components/ActionManu/OwnershipStructure';
import { TbRefreshDot } from 'react-icons/tb';
import { FireTwoTone, StopOutlined, SyncOutlined } from '@ant-design/icons';
import QuickDeviceInfo from '../../Components/ActionManu/QuickDeviceInfo';
import SubscriptionDetailsModal from '../../Components/ActionManu/SubscriptionDetails';
import LoginsSessions from '@/Components/ActionManu/LoginsSessions';
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
          optionSelectedColor='#8086AC'
          dropdownMatchSelectWidth={false}
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
  const handelClick = (row, name) => {
    setUserDetil(row);

    navigate(
      `/super-admin/user/${activeTab == 'Users' ? row.end_user_id + '-' + row._id : row._id}`,
      {
        state: { role: row.role },
      }
    );
  };
  const roleBasedColumns = {
    super_admin: {
      distributor: [
        'name',
        'address',
        'contact_person',
        'contact_number',
        'office_count',
        'seles_agent_count',
        'nursing_home_count',
        'monitoring_company_count',
        'end_user_count',
        'action',
      ],
      office: [
        'name',
        // "distributor_name",
        'address',
        'contact_person',
        'contact_number',
        'seles_agent_count',
        'nursing_home_count',
        'monitoring_company_count',
        'end_user_count',
        'action',
      ],
      sales_agent: [
        'name',
        // "distributor_name",
        // "office_name",
        'address',
        'contact_number',
        'agent_id',
        'nursing_home_count',
        'monitoring_company_count',
        'end_user_count',
        'action',
      ],
      nursing_home: [
        'name',
        // "distributor_name",
        // "office_name",
        // "sales_agent_name",
        'address',
        'contact_person',
        'contact_number',
        'elderly_count',
        'device_count',
        'alert_count',
        'assigned_nurse_count',
        'action',
      ],
      monitoring_station: ['name', 'address', 'contact_number', 'action'],
      control_center: [
        'name',
        // "distributor_name",
        'address',
        'contact_person',
        'contact_number',
        'elderly_count',
        'device_count',
        'action',
      ],
      support_agent: [
        'name',
        // "distributor_name",
        'address',
        'contact_number',
        'action',
      ],
      installer: [
        'name',
        // "distributor_name",
        // "office_name",
        'address',
        'contact_number',
        'elderly_count',
        'action',
      ],
      super_admin: ['name', 'contact_number', 'action'],
      end_user: [
        'name',
        // "distributor_name",
        // "office_name",
        // "sales_agent_name",
        // "installer",
        'address',
        'contact_number',
        'elderly_count',
        'alert_count',
        'device_count',
        // "subscription_status",
        // "subscription_plan",
        // "subscription_ex_date",
        // "last_login",
        'action',
      ],
      elderly: [
        'name',
        'age',
        'email',
        'contact_number',
        'address',
        'alert_count',
        'device_count',
        // "ownership_str",
        'action',
      ],
      nurse: ['name', 'contact_number', 'action'],
    },
  };
  const roleMapping = {
    distributor_id: 'distributor',
    office_id: 'office',
    sales_agent_id: 'sales_agent',
    nursing_home_id: 'nursing_home',
    monitoring_station_id: 'monitoring_station',
    support_agent_id: 'support_agent',
  };
  function handleClick(id, n) {
    navigate(`/super-admin/user/${n}`, {
      state: { role: roleMapping[id] },
    });
  }
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
            return 'End User';
          case 'monitoring_station':
            return 'Monitoring Station';
          case 'control_center':
            return 'Control Center';
          case 'support_agent':
            return 'Support Agent';
          case 'installer':
            return 'Installer';
          case 'elderly':
            return 'User Name';
          default:
            return 'Name';
        }
      },
      // key: "id",
      onCell: (record, rowIndex) => {
        return {
          onClick: (event) => {
            handelClick(record);
          },
        };
      },
      render: (row) => {
        const getRole = activeTab === 'Users' ? 'elderly' : null;
        return (
          // row?.role == ("monitoring_company", "elderly") ? (
          //   <button>
          //     <span className=" text-[14px] xl:text-base  font-normal text-text-secondary">
          //       {row.name}
          //     </span>
          //   </button>
          // ) : (
          <button>
            <AdminFiled data={row} role={getRole} />
          </button>
        );
      },
      // ),
    },
    address: {
      title: (role) => {
        switch (role) {
          case 'elderly':
            return 'Caregiver Address';
          default:
            return 'Address';
        }
      },
      render: (row) => (
        <button style={{ width: '200px', textAlign: 'left' }}>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {activeTab === 'Users' ? row.end_user_address : row.address}
          </span>
        </button>
      ),
    },
    email: {
      title: (role) => {
        switch (role) {
          case 'elderly':
            return 'Caregiver Email';
          default:
            return 'Email Address';
        }
      },
      render: (row) => (
        <span className=' text-[14px] xl:text-base  font-normal text-text-secondar text-nowrapy'>
          {activeTab === 'Users' ? row.end_user_email : row.email}
        </span>
      ),
    },
    contact_number: {
      title: (role) => {
        switch (role) {
          case 'elderly':
            return 'Caregiver Number';
          default:
            return 'Contact Number';
        }
      },
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {activeTab === 'Users'
              ? `${
                  row.end_user_contact_code ? row.end_user_contact_code : ''
                } ${row.end_user_contact_number}`
              : `${row.contact_code ? row.contact_code : ''} ${row.contact_number}`}
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
    parents: {
      title: 'Ownership Structure',
      render: (row) => <OwnershipStructure data={row} />,
    },
    ownership_str: {
      title: 'Ownership Structure',
      render: (row) => {
        if (!row.hierarchy) return;
        // Mapping for titles of each hierarchy level
        const hierarchyTitles = {
          distributor_id: 'Distributor',
          office_id: 'Office',
          sales_agent_id: 'Sales Agent',
          nursing_home_id: 'Nursing Home',
          monitoring_station_id: 'Monitoring Station',
          support_agent_id: 'Support Agent',
          end_user_id: 'End User',
          caregiver_id: 'Caregiver', // Additional ID not in hierarchy
        };

        // Manually define the hierarchy levels in the desired order
        const filteredHierarchy = [
          {
            id: 'distributor_id',
            title: hierarchyTitles['distributor_id'],
            value: row.hierarchy['distributor_id'] || 'N/A',
          },
          {
            id: 'office_id',
            title: hierarchyTitles['office_id'],
            value: row.hierarchy['office_id'] || 'N/A',
          },
          {
            id: 'sales_agent_id',
            title: hierarchyTitles['sales_agent_id'],
            value: row.hierarchy['sales_agent_id'] || 'N/A',
          },

          {
            id: 'monitoring_station_id',
            title: hierarchyTitles['monitoring_station_id'],
            value: row.hierarchy['monitoring_station_id'] || 'N/A',
          },
          {
            id: 'nursing_home_id',
            title: hierarchyTitles['nursing_home_id'],
            value: row.hierarchy['nursing_home_id'] || 'N/A',
          },
        ].filter((level) => level.value !== 'N/A'); // Optional: Remove levels with no value

        return (
          <div className='ownership-str'>
            {filteredHierarchy.map((level, index) => (
              <button
                key={level.id}
                onClick={() => handleClick(level.id, level.value)}
                className='ownership-button'
              >
                {/* Display Title */}
                <span className='text-[14px] xl:text-base font-normal text-text-secondary hover:text-text-primary'>
                  {level.title}{' '}
                </span>
                {index < filteredHierarchy.length - 1 && ' / '}
              </button>
            ))}
          </div>
        );
      },
    },
    external_id: {
      title: 'External ID',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.external_id}
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
    avg_sales: {
      title: 'Average Sales',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.aleravg_salest_count}
          </span>
        </button>
      ),
    },
    alert_count: {
      title: 'Active Alerts',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.unresolved_alarm_count || 0}
          </span>
        </button>
      ),
    },
    subscription_plan: {
      title: 'Subscription Plan',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
            <FireTwoTone /> AI Monitoring
          </span>
        </button>
      ),
    },
    last_login: {
      title: 'Last Login',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
            12-05-2025; 10: 23 PM
          </span>
        </button>
      ),
    },
    subscription_ex_date: {
      title: 'Subscription Expire Date',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
            1 July, 2026
          </span>
        </button>
      ),
    },
    subscription_status: {
      title: 'Subscription Status',
      render: (row) => {
        const isActive = crypto.getRandomValues(new Uint8Array(1))[0] / 255 < 0.5; // 50% chance
        return (
          <button>
            <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
              {isActive ? (
                <Tag icon={<SyncOutlined spin />} color='success' className='font-semibold'>
                  Active
                </Tag>
              ) : (
                <Tag icon={<StopOutlined />} className='font-semibold'>
                  Canceled
                </Tag>
              )}
            </span>
          </button>
        );
      },
    },

    device_count: {
      title: 'Devices',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary flex gap-3'>
            {/* {row?.device_count} */}
            <Tooltip title='Online Devices'>
              <div className='flex items-center gap-1 border px-2 py-1 rounded-2xl hover:bg-slate-100'>
                <div className='size-2 bg-success rounded-full '></div>{' '}
                <span className='leading-3 font-semibold'>{row?.online_device_count}</span>
              </div>
            </Tooltip>
            <Tooltip title='Offline Devices'>
              <div className='flex items-center gap-1 border px-2 py-1 rounded-2xl hover:bg-slate-100'>
                <div className='size-2 bg-Critical rounded-full '></div>{' '}
                <span className='leading-3 font-semibold'> {row?.offline_device_count}</span>
              </div>
            </Tooltip>
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
      title: 'Monitoring Stations',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.monitoring_station_count}
          </span>
        </button>
      ),
    },
    office_count: {
      title: 'Offices',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.office_count}
          </span>
        </button>
      ),
    },
    elderly_count: {
      title: 'Elderly',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.elderly_count}
          </span>
        </button>
      ),
    },
    assigned_nurse_count: {
      title: 'Assigned Nurse',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.nurse_count}
          </span>
        </button>
      ),
    },
    //All Type Of Naming Col ==========================>
    office_name: {
      title: 'Office Name',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.office_name}
          </span>
        </button>
      ),
    },
    distributor_name: {
      title: 'Distributor Name',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.distributor_name}
          </span>
        </button>
      ),
    },
    sales_agent_name: {
      title: 'Sales Agent Name',
      render: (row) => (
        <button>
          <span className=' text-[14px] xl:text-base  font-normal text-text-secondary'>
            {row.sales_agent_name}
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
    action: {
      title: '',
      key: 'id',
      fixed: 'right',
      width: 150,
      render: (row) => (
        <div className='flex items-center gap-2'>
          {activeTab?.includes('End User') && (
            <button disabled={!row?.subscription_id} className='disabled:opacity-20'>
              <SubscriptionDetailsModal data={row} />
            </button>
          )}
          {!activeTab?.includes('Monitoring Station') && !activeTab?.includes('Distributors') && (
            <button disabled={row?.parents?.length === 0} className='disabled:opacity-20'>
              <OwnershipStructure data={row} />
            </button>
          )}

          {mainRole == 'super_admin' && <LoginsSessions data={row} />}

          {/* {activeTab?.includes("Users") && <QuickDeviceInfo data={row} />} */}
          <AdminSupportAgentTableAction
            // getlist={() => getList(query)}
            data={activeTab == 'Users' ? { ...row, role: 'user' } : row}
          />
        </div>
      ),
    },
  };
  useEffect(() => {
    // Check role and set the columns accordingly
    if (activeTab == 'Super Admins') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['super_admin'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('super_admin')
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
    } else if (activeTab == 'Distributors') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['distributor'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('distributor')
              : columnConfig?.title,
        };
      });
      setResult(tableColumns);
    } else if (activeTab == 'Offices') {
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
    } else if (activeTab == 'Monitoring Stations') {
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
    } else if (activeTab == 'Control Centers') {
      // Get the columns to show based on loginRole and userRole
      const columnsToShow = roleBasedColumns[mainRole]?.['control_center'] || [];
      // Map the column keys to actual Ant Design column objects
      const tableColumns = columnsToShow.map((colKey) => {
        const columnConfig = allColumns[colKey];
        return {
          ...columnConfig,
          title:
            columnConfig && (typeof columnConfig.title || columnConfig.address) === 'function'
              ? columnConfig.title('control_center')
              : columnConfig?.title,
        };
      });
      setResult(tableColumns);
    } else if (activeTab == 'Nurses') {
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
    } else if (activeTab == 'Users') {
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
