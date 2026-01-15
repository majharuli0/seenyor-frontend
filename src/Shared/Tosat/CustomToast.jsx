import React from 'react';
import { toast } from 'react-hot-toast';
import image from '@/assets/icon/new/Icon.png';
import image2 from '@/assets/icon/new/Cross.png';

const CustomToast = ({ t, text }) => {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-Average shadow-lg relative overflow-hidden rounded-lg pointer-events-auto flex items-center justify-between ring-1 ring-black ring-opacity-5`}
    >
      <div className=' absolute top-[-5px] left-[-10px]'>
        <img src={image} alt='' className=' w-[65px] h-[65px] opacity-30' />
      </div>
      <div className='flex-1 w-0 p-4'>
        <div className='flex items-center gap-1'>
          <div className='flex-shrink-0 pt-0.5 h-[20px] ml-2 w-[20px] rounded-[16px] flex items-center justify-center'>
            <img src={image} alt='' className=' w-[20px] h-[20px]' />
          </div>
          <div className='ml-3 flex-1'>
            <p className='text-[19px] mb-[-5px] font-medium text-white'>Success</p>
            <p className='text-[13px] font-[400] text-white'>{text}</p>
          </div>
        </div>
      </div>
      <button className='py-2 px-3' onClick={() => toast.remove(t.id)}>
        <img src={image2} alt='' />
      </button>
    </div>
  );
};

export default CustomToast;
