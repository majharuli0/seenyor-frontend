import { Modal } from 'antd';
import React from 'react';
import CustomInput from '../input/CustomInput';

const DeleteModal = ({
  modalOPen,
  setModalOpen,
  className,
  title,
  title2,
  onDelete,
  onOfficeDisable,
  role,
  okText = 'Delete',
}) => {
  return (
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
      className={`  pt-3 rounded-[30px] z-[5000]`}
    >
      <div className='bg-red-500 pt-10 rounded-[30px] h-14  -z-20 relative left-0 top-[-10px]'></div>
      <div className=' rounded-[30px] mt-[-40px]'>
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
          <div className=' w-[110px] h-[110px] rounded-full border-[5px] border-dashed border-[#FFE5E5] bg-[#FFF6F6] flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
              aria-hidden='true'
              role='img'
              class='text-[45px] text-red-500 iconify iconify--basil'
              width='1em'
              height='1em'
              viewBox='0 0 24 24'
            >
              <path
                fill='currentColor'
                d='M10 2.25a.75.75 0 0 0-.75.75v.75H5a.75.75 0 0 0 0 1.5h14a.75.75 0 0 0 0-1.5h-4.25V3a.75.75 0 0 0-.75-.75zM13.06 15l1.47 1.47a.75.75 0 1 1-1.06 1.06L12 16.06l-1.47 1.47a.75.75 0 1 1-1.06-1.06L10.94 15l-1.47-1.47a.75.75 0 1 1 1.06-1.06L12 13.94l1.47-1.47a.75.75 0 1 1 1.06 1.06z'
              ></path>
              <path
                fill='currentColor'
                fillRule='evenodd'
                d='M5.991 7.917a.75.75 0 0 1 .746-.667h10.526a.75.75 0 0 1 .746.667l.2 1.802c.363 3.265.363 6.56 0 9.826l-.02.177a2.853 2.853 0 0 1-2.44 2.51a27.04 27.04 0 0 1-7.498 0a2.853 2.853 0 0 1-2.44-2.51l-.02-.177a44.489 44.489 0 0 1 0-9.826zm1.417.833l-.126 1.134a42.99 42.99 0 0 0 0 9.495l.02.177a1.353 1.353 0 0 0 1.157 1.191c2.35.329 4.733.329 7.082 0a1.353 1.353 0 0 0 1.157-1.19l.02-.178c.35-3.155.35-6.34 0-9.495l-.126-1.134z'
                clipRule='evenodd'
              ></path>
            </svg>
          </div>
        </div>

        <div className='font-baloo'>
          <h2 className=' text-[25px] text-center font-[600] text-text-primary'>Are You Sure?</h2>
          <p className='text-[16px] font-[400] text-[#707EAE] text-center px-4'>
            {title} {title && <br />} {title2}
          </p>
        </div>
      </div>

      <div className=' flex items-center justify-center gap-5 pt-[40px] pb-9'>
        <button
          onClick={() => {
            onDelete();
            setModalOpen(false);
          }}
          className='font-bold  h-[40px] px-6 disabled:bg-red-100 rounded-[10px] bg-red-500 hover:bg-red-700 duration-300 text-white '
        >
          {okText}
        </button>
        {/* {role == "office" ? (
            <button
              onClick={() => {
                onOfficeDisable();
                setModalOpen(false);
              }}
              className="font-bold  h-[40px] px-6 hover:text-red-500 hover:border-red-500 duration-300 rounded-[10px] bg-transparent text-secondary border border-secondary"
            >
              Disable Office
            </button>
          ) : null} */}
        <button
          onClick={() => setModalOpen(false)}
          className='font-bold  h-[40px] px-6 hover:text-red-500 hover:border-red-500 duration-300 rounded-[10px] bg-transparent text-[#707EAE]  border border-[#707EAE] '
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
