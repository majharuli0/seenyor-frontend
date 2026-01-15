import { disable } from 'ol/rotationconstraint';
import React from 'react';

const CustomInput = ({ label, type, step, register, error, placeholder, disabled = false }) => {
  return (
    <div className='flex flex-col items-start w-full mt-3'>
      <label htmlFor='otp' className='mb-1 font-medium text-[13px] text-[#1B2559]'>
        {label}
      </label>
      <input
        className='py-[18px] px-4 text-text-primary placeholder:text-[#A3AED0] h-[50px]  rounded-[16px] w-full text-base outline-none   border-[1px] focus:border-primary'
        type={type}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        id='otp'
        {...register}
      />
      <label className='label'>
        {error && <span className=' text-sm mt-1 text-red-500'>{error.message}</span>}
      </label>
    </div>
  );
};

export default CustomInput;
