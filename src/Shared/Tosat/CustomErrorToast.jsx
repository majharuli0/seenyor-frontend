import React from 'react';
import { toast } from 'react-hot-toast';
import img1 from '@/assets/icon/Cross.png';
import image2 from '@/assets/icon/error2.png';

const CustomErrorToast = ({ t, text, title }) => {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-[#FFE9E9] shadow-lg rounded-lg pointer-events-auto flex items-center justify-between ring-1 ring-black ring-opacity-5`}
    >
      <div className='flex-1 w-0 p-4'>
        <div className='flex items-center'>
          <div className='flex-shrink-0 pt-0.5 h-[40px] w-[40px] bg-[#FFDFDF] rounded-[16px] flex items-center justify-center'>
            <img src={image2} alt='' />
          </div>
          <div className='ml-3 flex-1'>
            <p className='text-[19px] font-medium text-[#0D1A29]'>{title ? title : 'Success'}</p>
            <p className='text-[13px] font-[400] text-[#0D1A29]'>{text}</p>
          </div>
        </div>
      </div>
      <button className='py-2 px-3' onClick={() => toast.remove(t.id)}>
        <img src={img1} alt='' />
      </button>
    </div>
  );
};

export default CustomErrorToast;
