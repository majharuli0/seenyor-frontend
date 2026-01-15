import React from 'react';
import { Modal, Table, ConfigProvider } from 'antd';

const OTARecordsModal = ({ open, onCancel }) => {
  const columns = [
    {
      title: 'uid',
      dataIndex: 'uid',
      key: 'uid',
      align: 'center',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      align: 'center',
    },
    {
      title: 'Error message',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      align: 'center',
    },
    {
      title: 'Firmware name',
      dataIndex: 'firmwareName',
      key: 'firmwareName',
      align: 'center',
    },
    {
      title: 'MCU version',
      dataIndex: 'mcuVersion',
      key: 'mcuVersion',
      align: 'center',
    },
    {
      title: 'Radar version',
      dataIndex: 'radarVersion',
      key: 'radarVersion',
      align: 'center',
    },
    {
      title: 'Creation time',
      dataIndex: 'creationTime',
      key: 'creationTime',
      align: 'center',
    },
  ];

  const data = [
    {
      key: '1',
      uid: 'E598A2CBB63F',
      progress: '100',
      errorMessage: '',
      firmwareName: '202509Radar',
      mcuVersion: 'Jun 5 2025 16:11:16',
      radarVersion: 'Jan 6 2025 15:03:16',
      creationTime: '2025-09-03 19:08:40',
    },
    {
      key: '2',
      uid: 'E598A2CBB63F',
      progress: '100',
      errorMessage: '',
      firmwareName: 'MCU-202506',
      mcuVersion: 'Jan 17 2025 10:59:34',
      radarVersion: 'Jan 6 2025 15:03:16',
      creationTime: '2025-09-03 19:05:07',
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
          <h3 className='text-[18px] font-semibold mb-6'>OTA records</h3>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              total: 2,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `Total ${total}  ${range[0]}/${range[1]}`,
            }}
          />
        </div>
      </ConfigProvider>
    </Modal>
  );
};

export default OTARecordsModal;
