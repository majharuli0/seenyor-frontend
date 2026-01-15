import { Modal } from 'antd';
import React from 'react';
import CustomButton from '../button/CustomButton';

const CustomModal = ({
  modalOPen,
  setModalOpen,
  width,
  className,
  title,
  children,
  handleSubmit = (e) => {
    e.preventDefault();
  },
  buttonText,
  cstatus,
  isBottomButtomShow = true,
  handalDelete,
  Foot,
  customPadding = 0,
  onclose,
  loading,
}) => {
  const modalStyle = {
    padding: 0, // Set padding to 0 for the Modal component
  };

  return (
    <div>
      <Modal
        centered
        cancelText
        cancelButtonProps
        footer={null}
        open={modalOPen}
        closeIcon={null}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        width={width}
        className={` ${className}`}
        maskClosable={false}
        style={modalStyle}
      >
        <div className='z-[50000000] my-4'>
          <div className={`flex items-center justify-between px-9 pt-6 pb-5`}>
            <h2 className=' text-[24px] font-[700] text-text-primary'>{title}</h2>
            <button
              onClick={() => {
                setModalOpen(false);
                // onclose();
              }}
              className=' w-[40px] text-[30px] h-[40px] rounded-lg flex items-center justify-center hover:bg-[#FDEEEE] hover:text-[#FF5959] text-[#969BB3]'
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
          <div className='w-full relative top-0 left-0 mb-3  h-[2px] bg-[#E8E9EE] mr-[-520px]'></div>
          <form
            onSubmit={handleSubmit}
            className={`w-full mt-[0px] ${
              customPadding != 0 ? '[px-' + customPadding + ']' : 'px-9'
            } pb-9`}
          >
            <div className=''>{children}</div>
            {isBottomButtomShow == true ? (
              <div className='mt-[38px] flex items-center gap-5'>
                <CustomButton loading={loading} className={'w-full'}>
                  {buttonText}
                </CustomButton>
                <button
                  type='button'
                  onClick={() => {
                    setModalOpen(false);
                    // onclose();
                  }}
                  className='font-[500] text-[14px] h-[40px] w-full hover:border-primary hover:text-primary duration-300 px-5 rounded-[10px] bg-transparent text-[#666D90] border border-gray-300'
                >
                  Cancel
                </button>
              </div>
            ) : null}

            {cstatus == 'update' && (
              <div
                onClick={() => handalDelete()}
                className='hover:brightness-110 duration-300  cursor-pointer mt-[7px] w-full text-center pt-[12px] pb-[12px]  pt-[7px] text-onBackWarring rounded-[10px] border border-onBackWarring pt-[7px] '
              >
                Delete {title.replace('Edit', '')}
              </div>
            )}
            {Foot}
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CustomModal;
