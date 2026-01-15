import React, { useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { ChevronDown } from 'lucide-react';
import DeviceStats from './components/DeviceStats';
import DeviceTable from './components/DeviceTable';
import DeviceHeader from './components/DeviceHeader';
import BatchOTAModal from './components/BatchOTAModal';
import SetAttributeModal from './components/SetAttributeModal';
import OTARecordsModal from './components/OTARecordsModal';
import OTAUpgradesModal from './components/OTAUpgradesModal';
import HardwareResetModal from './components/HardwareResetModal';
import { SidebarContext } from '@/Context/CustomUsertable';

const mockDevices = [
  { key: '1', uid: 'FGFD354FHFDH68', status: 'Online', type: 'Sensor', binded: true },
  { key: '2', uid: 'FGFD354FHFDH68', status: 'Offline', type: 'Sensor', binded: true },
  { key: '3', uid: 'FGFD354FHFDH68', status: 'Offline', type: 'Speaker', binded: true },
  { key: '4', uid: 'FGFD354FHFDH68', status: 'Not Binded', type: 'Sensor', binded: false },
  { key: '5', uid: 'FGFD354FHFDH68', status: 'Not Binded', type: 'Sensor', binded: false },
  { key: '6', uid: 'FGFD354FHFDH68', status: 'Not Binded', type: 'Speaker', binded: false },
  { key: '7', uid: 'FGFD354FHFDH68', status: 'Not Binded', type: 'Sensor', binded: false },
  { key: '8', uid: 'FGFD354FHFDH68', status: 'Not Binded', type: 'Sensor', binded: false },
];

const Devices = () => {
  const [filter, setFilter] = useState('All');
  const [page, SetPage] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({});
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('By Name');
  const [filterModel, setFilterModel] = useState('Device Model');
  const [isBatchOTAOpen, setIsBatchOTAOpen] = useState(false);
  const [isSetAttributeOpen, setIsSetAttributeOpen] = useState(false);
  const [isOTARecordsOpen, setIsOTARecordsOpen] = useState(false);
  const [isOTAUpgradesOpen, setIsOTAUpgradesOpen] = useState(false);
  const [isHardwareResetOpen, setIsHardwareResetOpen] = useState(false);

  const sortData = ['By Name', 'By Date'];

  const getList = () => {
    console.log('Fetching devices with:', { page, query, search, selected, filter });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online':
        return 'text-green-500';
      case 'Offline':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const columns = [
    {
      title: 'Device UID',
      dataIndex: 'uid',
      key: 'uid',
      render: (text) => <span className='text-gray-600 font-medium'>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <span className={`font-medium ${getStatusColor(text)}`}>{text}</span>,
    },
    {
      title: 'Device Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span className='text-gray-600'>{text}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className='flex items-center gap-6'>
          <Button
            type='text'
            className='text-gray-500 hover:text-indigo-600'
            onClick={() => setIsSetAttributeOpen(true)}
          >
            Set Attribute
          </Button>
          <Button
            type='text'
            className='text-gray-500 hover:text-indigo-600'
            onClick={() => setIsHardwareResetOpen(true)}
          >
            Hardware Reset
          </Button>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key='1' onClick={() => setIsOTAUpgradesOpen(true)}>
                  OTA Upgrades
                </Menu.Item>
                <Menu.Item key='2' onClick={() => setIsOTARecordsOpen(true)}>
                  OTA Records
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button
              type='text'
              className='text-gray-500 hover:text-indigo-600 flex items-center gap-1'
            >
              OTA <ChevronDown size={14} />
            </Button>
          </Dropdown>

          <Button type='text' className='text-[#514EB5] font-medium hover:bg-transparent'>
            View User
          </Button>
        </div>
      ),
    },
  ];

  const filteredDevices = mockDevices.filter((device) => {
    if (filter === 'All') return true;
    return device.status === filter;
  });

  return (
    <div className='p-6 bg-[#F8F9FA] min-h-screen font-poppins'>
      <div className='mb-6'>
        <DeviceStats
          currentFilter={filter}
          onFilterChange={setFilter}
          onBatchOTAClick={() => setIsBatchOTAOpen(true)}
        />
      </div>

      <BatchOTAModal open={isBatchOTAOpen} onCancel={() => setIsBatchOTAOpen(false)} />
      <SetAttributeModal open={isSetAttributeOpen} onCancel={() => setIsSetAttributeOpen(false)} />
      <OTARecordsModal open={isOTARecordsOpen} onCancel={() => setIsOTARecordsOpen(false)} />
      <OTAUpgradesModal open={isOTAUpgradesOpen} onCancel={() => setIsOTAUpgradesOpen(false)} />
      <HardwareResetModal
        open={isHardwareResetOpen}
        onCancel={() => setIsHardwareResetOpen(false)}
      />

      <div className='bg-white rounded-[10px]'>
        <DeviceHeader
          search={search}
          setSearch={setSearch}
          query={query}
          setQuery={setQuery}
          selected={selected}
          setSelected={setSelected}
          sortData={sortData}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
        />

        <SidebarContext.Provider
          value={{
            total: filteredDevices.length,
            page,
            SetPage,
            getlist: getList,
            query,
          }}
        >
          <DeviceTable data={filteredDevices} loading={loading} columns={columns} />
        </SidebarContext.Provider>
      </div>
    </div>
  );
};

export default Devices;
