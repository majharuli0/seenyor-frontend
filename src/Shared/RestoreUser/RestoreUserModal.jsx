import { Modal } from 'antd';
import React from 'react';
import { LuInfo } from 'react-icons/lu';
const RestoreUserModal = ({
  modalOPen,
  setModalOpen,
  className,
  title,
  title2,
  onDelete,
  onOfficeDisable,
  role,
}) => {
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
        className={` bg-blue-500 pt-3 rounded-[30px]`}
      >
        <div className='bg-blue-500 pt-10 rounded-[30px] h-14  -z-20 relative left-0 top-[-10px]'></div>
        <div className=' rounded-[30px] mt-[-40px] font-baloo'>
          <div className=' flex items-center justify-end mr-5'>
            <button
              onClick={() => setModalOpen(false)}
              className=' w-[40px] text-3xl h-[40px] rounded-lg flex items-center justify-center hover:bg-[#FDEEEE] hover:text-[#FF5959] text-[#969BB3]'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                aria-hidden='true'
                role='img'
                class='iconify iconify--material-symbols'
                width='1em'
                height='1em'
                viewBox='0 0 24 24'
              >
                <path
                  fill='currentColor'
                  d='M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z'
                ></path>
              </svg>
            </button>
          </div>

          <div
            style={{ borderRadius: '16px' }}
            className=' w-full flex items-center justify-center py-3 pb-[40px]'
          >
            <div className=' w-[110px] h-[110px] rounded-full border-[5px] border-dashed border-blue-100 bg-blue-50 flex items-center justify-center'>
              <LuInfo size={42} className='text-blue-500' />
            </div>
          </div>

          <div>
            <h2 className=' text-[25px] text-center font-[500] text-text-primary'>Are You Sure?</h2>
            <p className='text-[16px] font-[400] text-[#707EAE] text-center px-4'>
              Are you sure you want to restore this user account? This action will reactivate the
              account and allow the user to log in again.
            </p>
          </div>
        </div>

        <div className=' flex items-center justify-center gap-5 pt-[40px] pb-9'>
          <button
            onClick={() => {
              onDelete();
              setModalOpen(false);
            }}
            className='font-bold  h-[40px] px-6 rounded-[10px] bg-blue-500 hover:bg-blue-700 duration-300 border border-blue-500 text-white '
          >
            Yes, Restore
          </button>

          <button
            onClick={() => setModalOpen(false)}
            className='font-bold  h-[40px] px-6 hover:text-blue-500 hover:border-blue-500 duration-300 rounded-[10px] bg-transparent text-secondary border border-secondary'
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RestoreUserModal;
