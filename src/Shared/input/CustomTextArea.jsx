import React from 'react';

const CustomTextArea = ({ label, placeholder, error, ...props }) => {
  return (
    <div className='flex flex-col items-start w-full mt-3'>
      <label className='mb-1 font-medium text-[13px] text-[#1B2559]'>{label}</label>
      <textarea
        className='py-[18px] h-[100px] px-4 text-text-primary placeholder:text-[#A3AED0] rounded-[16px] w-full text-base outline-none   border-[1px] focus:border-primary'
        rows='4'
        placeholder={placeholder}
        {...props}
      />
      {error && <p className='mt-1 text-sm text-red-500'>{error.message}</p>}
    </div>
  );
};

export default CustomTextArea;
