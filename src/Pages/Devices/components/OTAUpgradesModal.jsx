import React from 'react';
import { Modal, Table, Button, ConfigProvider } from 'antd';

const OTAUpgradesModal = ({ open, onCancel }) => {
  const columns = [
    {
      title: 'Version number',
      dataIndex: 'versionNumber',
      key: 'versionNumber',
      align: 'center',
    },
    {
      title: 'Firmware name',
      dataIndex: 'firmwareName',
      key: 'firmwareName',
      align: 'center',
    },
    {
      title: 'Hardware version',
      dataIndex: 'hardwareVersion',
      key: 'hardwareVersion',
      align: 'center',
    },
    {
      title: 'Device class',
      dataIndex: 'deviceClass',
      key: 'deviceClass',
      align: 'center',
    },
    {
      title: 'Communication version',
      dataIndex: 'communicationVersion',
      key: 'communicationVersion',
      align: 'center',
    },
    {
      title: 'Radar version',
      dataIndex: 'radarVersion',
      key: 'radarVersion',
      align: 'center',
    },
  ];

  const data = [
    {
      key: '6',
      versionNumber: '6',
      firmwareName: '202502',
      hardwareVersion: '1',
      deviceClass: '60G_wifi',
      communicationVersion: 'WIFI-HC2',
      radarVersion: 'Radar-S',
    },
    {
      key: '9',
      versionNumber: '9',
      firmwareName: '202506',
      hardwareVersion: '1',
      deviceClass: '60G_wifi',
      communicationVersion: 'WIFI-HC2',
      radarVersion: 'Radar-S',
    },
    {
      key: '10',
      versionNumber: '10',
      firmwareName: '202506-Radar S',
      hardwareVersion: '1',
      deviceClass: '60G_wifi',
      communicationVersion: '',
      radarVersion: 'Radar-S',
    },
    {
      key: '11',
      versionNumber: '11',
      firmwareName: 'MCU-202506',
      hardwareVersion: '1',
      deviceClass: '60G_wifi',
      communicationVersion: 'WIFI-HC2',
      radarVersion: '',
    },
    {
      key: '13',
      versionNumber: '13',
      firmwareName: '202509Radar',
      hardwareVersion: '1',
      deviceClass: '60G_wifi',
      communicationVersion: 'WIFI-HC2',
      radarVersion: 'Radar-S',
    },
    {
      key: '17',
      versionNumber: '17',
      firmwareName: '0911Test',
      hardwareVersion: '1',
      deviceClass: '60G_wifi',
      communicationVersion: 'WIFI-HC2',
      radarVersion: 'Radar-S',
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
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#514EB5',
          },
        }}
      >
        <div className='mt-6 p-6'>
          <h3 className='text-[18px] font-semibold mb-6'>Select OTA version.</h3>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowSelection={{
              type: 'checkbox',
            }}
            className='mb-6'
          />
          <div className='flex justify-end gap-3'>
            <Button type='primary' className='bg-[#514EB5]'>
              Confirm
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      </ConfigProvider>
    </Modal>
  );
};

export default OTAUpgradesModal;
