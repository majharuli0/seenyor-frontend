import { Modal } from 'antd';
import React from 'react';
import { IoIosCheckmark } from 'react-icons/io';
const SuccessModal = ({
  modalOPen,
  setModalOpen,
  className,
  title,
  title2,
  onOk,
  okText = 'Yes, Confirm',
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
      className={` pt-3 rounded-[30px]`}
    >
      <div className='bg-[#18BA2A] pt-10 rounded-[30px] h-14  -z-20 relative left-0 top-[-10px]'></div>
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
              className='iconify iconify--material-symbols'
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
          <div className=' w-[110px] h-[110px] rounded-full border-[5px] border-dashed border-[#b6e8bf] bg-[#f6fff6] flex items-center justify-center'>
            <IoIosCheckmark size={80} color='#18BA2A' />
          </div>
        </div>

        <div className='font-baloo'>
          <h2 className=' text-[25px] text-center font-[600] text-text-primary'>Are You Sure?</h2>
          <p className='text-[16px] font-[400] text-[#707EAE] text-center px-4'>
            {title} <br /> {title2}
          </p>
        </div>
      </div>

      <div className=' flex items-center justify-center gap-5 pt-[40px] pb-9'>
        <button
          onClick={() => {
            onOk();
            setModalOpen(false);
          }}
          className='font-bold  h-[40px] px-6 disabled:bg-red-100 rounded-[10px] bg-[#18BA2A] hover:bg-[#1b8b28] duration-300 text-white '
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
          className='font-bold  h-[40px] px-6 hover:text-red-500 hover:border-red-500 duration-300 rounded-[10px] bg-transparent text-secondary border border-secondary'
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
