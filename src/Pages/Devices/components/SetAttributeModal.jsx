import React from 'react';
import { Modal, Table, Input, Button, ConfigProvider } from 'antd';

const SetAttributeModal = ({ open, onCancel }) => {
  const columns = [
    {
      title: 'Attribute ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: 'Attribute name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Attribute value',
      dataIndex: 'value',
      key: 'value',
      render: (text, record) => <Input defaultValue={text} className='w-full' />,
    },
    {
      title: 'Default value',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
    },
    {
      title: 'Attribute identifier',
      dataIndex: 'identifier',
      key: 'identifier',
    },
    {
      title: 'Option value list',
      dataIndex: 'optionList',
      key: 'optionList',
    },
    {
      title: 'Whether to issue or not',
      dataIndex: 'issue',
      key: 'issue',
      align: 'center',
    },
  ];

  const data = [
    {
      key: 1,
      id: 1,
      name: 'radar_install_height',
      value: '16',
      defaultValue: '',
      identifier: 'radar_install_height',
      optionList: '',
      issue: 0,
    },
    {
      key: 3,
      id: 3,
      name: 'fall',
      value: '',
      defaultValue: '',
      identifier: 'fall',
      optionList: '',
      issue: 1,
    },
    {
      key: 5,
      id: 5,
      name: 'rectangle',
      value: '[-9.0,22.0,-9.20,22.20]',
      defaultValue: '',
      identifier: 'rectangle',
      optionList: '',
      issue: 0,
    },
    {
      key: 6,
      id: 6,
      name: 'radar_install_style',
      value: '1',
      defaultValue: '',
      identifier: 'radar_install_style',
      optionList: '0,1',
      issue: 0,
    },
    {
      key: 7,
      id: 7,
      name: 'radar_install_angel',
      value: '',
      defaultValue: '',
      identifier: 'radar_install_angel',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 18,
      id: 18,
      name: 'app_compile_time',
      value: 'Jun 5 2025 16:11:15',
      defaultValue: '',
      identifier: 'app_compile_time',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 19,
      id: 19,
      name: 'radar_compile_time',
      value: 'Sep 1 2025 10:20:18',
      defaultValue: '',
      identifier: 'radar_compile_time',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 20,
      id: 20,
      name: 'declare_area',
      value: '[1.5,-9.0,9.0,-9.8,9.8],[2.4,-12.8,-7.8,-12.20]',
      defaultValue: '',
      identifier: 'declare_area',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 21,
      id: 21,
      name: 'suspected_fall_time(Device storage)',
      value: '6',
      defaultValue: '',
      identifier: 'suspected_fall_time',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 22,
      id: 22,
      name: 'accelera',
      value: '0.10:-66.80:-66.80:1',
      defaultValue: '',
      identifier: 'accelera',
      optionList: 'null',
      issue: 1,
    },
    {
      key: 23,
      id: 23,
      name: 'capability',
      value: '15',
      defaultValue: '',
      identifier: 'capability',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 24,
      id: 24,
      name: 'radar_func_ctrl',
      value: '15',
      defaultValue: '',
      identifier: 'radar_func_ctrl',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 26,
      id: 26,
      name: 'detect_human_count',
      value: '',
      defaultValue: '',
      identifier: 'detect_human_count',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 27,
      id: 27,
      name: 'light_lux',
      value: '',
      defaultValue: '',
      identifier: 'light_lux',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 52,
      id: 52,
      name: 'heart_breath_param',
      value: '[24, 80, 8, 60, 0, 5, 1, 10, 0, 0, 0, 0, 0, 0, 0]',
      defaultValue: '',
      identifier: 'heart_breath_param',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 54,
      id: 54,
      name: 'wifi_rssi',
      value: '-59',
      defaultValue: '',
      identifier: 'wifi_rssi',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 58,
      id: 58,
      name: 'voice_end_tip',
      value: '',
      defaultValue: '',
      identifier: 'voice_end_tip',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 57,
      id: 57,
      name: 'rssi_threshold',
      value: '',
      defaultValue: '',
      identifier: 'rssi_threshold',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 59,
      id: 59,
      name: 'accela_threshold',
      value: '',
      defaultValue: '',
      identifier: 'accela_threshold',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 61,
      id: 61,
      name: 'fall_param',
      value: '[0, 0, 0, 6, 2, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0]',
      defaultValue: '',
      identifier: 'fall_param',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 63,
      id: 63,
      name: 'ip_port',
      value: '3.104.3.162:1060',
      defaultValue: '',
      identifier: 'ip_port',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 64,
      id: 64,
      name: 'ssid_password',
      value: 'TS-XQz3 sifonjer',
      defaultValue: '',
      identifier: 'ssid_password',
      optionList: 'null',
      issue: 0,
    },
    {
      key: 65,
      id: 65,
      name: 'mqtt',
      value: 'mqtt:E598A28DD9EB:frozen wombat.lmq.c',
      defaultValue: '',
      identifier: 'mqtt',
      optionList: 'null',
      issue: 0,
    },
  ];

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1200}
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
          <h3 className='text-[18px] font-semibold mb-6'>Set attribute</h3>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ y: 600 }}
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

export default SetAttributeModal;
