import React from 'react';
import { Modal, Button, ConfigProvider } from 'antd';
import { RotateCcw } from 'lucide-react';

const HardwareResetModal = ({ open, onCancel }) => {
  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
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
          <h3 className='text-[18px] font-semibold mb-6'>Hardware restart</h3>

          <div className='flex flex-wrap gap-4 mb-6'>
            <Button className='flex items-center gap-2 text-[#514EB5] border-[#514EB5] h-10 px-6'>
              <RotateCcw size={16} /> Restart Radar
            </Button>
            <Button className='flex items-center gap-2 text-[#514EB5] border-[#514EB5] h-10 px-6'>
              <RotateCcw size={16} /> Restart MCU
            </Button>
            <Button className='flex items-center gap-2 text-[#514EB5] border-[#514EB5] h-10 px-6'>
              <RotateCcw size={16} /> Restart Accessory
            </Button>
            <Button type='primary' className='flex items-center gap-2 bg-[#514EB5] h-10 px-6'>
              <RotateCcw size={16} /> Restart All
            </Button>
          </div>
        </div>
      </ConfigProvider>
    </Modal>
  );
};

export default HardwareResetModal;
