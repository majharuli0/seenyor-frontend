import { Modal } from 'antd';
import React, { useState } from 'react';
import SupportAgent from '@/assets/SupportAgent.png';
import { useCountStore } from '@/store/index';
import WarningIcon from '../../assets/warning.gif';
import CustomButton from '../button/CustomButton';
const LogOutModal = ({ modalOPen, setModalOpen, className, onDelete }) => {
  const user = useCountStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  return (
    <div className=''>
      <Modal
        centered
        cancelText
        cancelButtonProps
        footer={null}
        open={modalOPen}
        closeIcon={null}
        styles={{ borderRadius: 30 }}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        width={520}
        className={` bg-primary pt-3 rounded-[30px]`}
      >
        <div className=' rounded-[18px] mt-[-40px] w-[658px] bg-[#fff] p-10 '>
          <div className='w-full flex flex-col items-center justify-center gap-4 mb-10'>
            <img src={WarningIcon} alt='' />
            <div className='flex flex-col items-center gap-1'>
              <h1 className='text-2xl font-bold text-text-primary'>Sign Out!</h1>
              <p className='text-base font-normal text-text-secondary'>
                Are you sure you would like to sign out of your account?
              </p>
            </div>
          </div>
          <div className='w-[70%] flex justify-center gap-3 items-center mx-auto'>
            <CustomButton
              className='bg-text-primary/5 !text-text-primary hover:bg-text-primary/10  w-full'
              disabled={loading}
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              className='bg-red-600 hover:bg-red-700 w-full'
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await onDelete();
                // setModalOpen(false); // Do not close. Page will redirect.
              }}
            >
              Yes, Logout
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LogOutModal;
