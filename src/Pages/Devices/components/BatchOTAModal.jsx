import React from 'react';
import { Modal, Input, Select, Button, Table, ConfigProvider } from 'antd';
import { Search, RotateCcw } from 'lucide-react';

const { Option } = Select;

const BatchOTAModal = ({ open, onCancel }) => {
  const columns = [
    {
      title: 'Affiliated department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Serial number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Firmware name',
      dataIndex: 'firmwareName',
      key: 'firmwareName',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
    },
    {
      title: 'Upgrade results',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Creation time',
      dataIndex: 'creationTime',
      key: 'creationTime',
    },
  ];

  const data = [
    {
      key: '1',
      department: 'Seenyor Devices',
      serialNumber: '9923003A4B6F',
      firmwareName: '202506',
      progress: '100',
      result: 'Success',
      creationTime: '2025-09-11 14:00:39',
    },
    {
      key: '2',
      department: 'Seenyor Devices',
      serialNumber: 'BD39520983A3',
      firmwareName: 'MCU-202505',
      progress: '100',
      result: 'Success',
      creationTime: '2025-09-04 17:39:36',
    },
    {
      key: '3',
      department: 'Seenyor Devices',
      serialNumber: '992300030457',
      firmwareName: '202508_Speaker_EN',
      progress: '100',
      result: 'Success',
      creationTime: '2025-09-04 14:35:12',
    },
    {
      key: '4',
      department: 'Seenyor Devices',
      serialNumber: '992300030457',
      firmwareName: 'test',
      progress: '100',
      result: 'Success',
      creationTime: '2025-09-04 14:26:02',
    },
    {
      key: '5',
      department: 'Seenyor Devices',
      serialNumber: '992300030457',
      firmwareName: '202508_Speaker_EN',
      progress: '40',
      result: 'Failed',
      creationTime: '2025-09-04 13:54:28',
    },
  ];

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1000}
      centered
      className='batch-ota-modal'
    >
      <div className='mt-6 p-6'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#514EB5',
            },
          }}
        >
          <h3 className='text-[18px] font-semibold mb-6'>Batch OTA result</h3>
          {/* Filters */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div className='flex items-center gap-2'>
              <span className='text-gray-600 w-[140px]'>Affiliated department</span>
              <Select placeholder='Please select affiliated dep' className='w-full'>
                <Option value='dept1'>Seenyor Devices</Option>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-600 w-[100px]'>Device class</span>
              <Select placeholder='Please select the device class' className='w-full'>
                <Option value='class1'>Class 1</Option>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div className='flex items-center gap-2'>
              <span className='text-gray-600 w-[140px]'>Serial number</span>
              <Input placeholder='Serial number' className='w-full' />
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-600 w-[100px]'>Upgrade results</span>
              <Select placeholder='Upgrade results' className='w-full'>
                <Option value='success'>Success</Option>
                <Option value='failed'>Failed</Option>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-3 mb-6'>
            <Button
              type='primary'
              className='bg-[#514EB5] hover:!bg-[#403D94] flex items-center gap-2'
            >
              <Search size={16} /> Search
            </Button>
            <Button className='flex items-center gap-2'>
              <RotateCcw size={16} /> Reset
            </Button>
            <Button className='text-[#52C41A] border-[#52C41A] bg-[#F6FFED]'>
              Batch OTA upgrade
            </Button>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              total: 66,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            }}
            rowSelection={{
              type: 'checkbox',
            }}
          />
        </ConfigProvider>
      </div>
    </Modal>
  );
};

export default BatchOTAModal;
