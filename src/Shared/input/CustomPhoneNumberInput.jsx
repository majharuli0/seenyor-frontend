import React, { useEffect } from 'react';
import { Space, Select, Input } from 'antd';

const CustomPhoneInput = ({
  label,
  error,
  placeholder,
  countryCodes,
  selectedCode,
  onCodeChange,
  disabled = false,
  ...field // This will receive `value`, `onChange`, `onBlur` from Controller
}) => {
  console.log(error);

  useEffect(() => {
    // Automatically set the first option as selected if no value is provided
    if (!selectedCode && countryCodes.length > 0) {
      onCodeChange(countryCodes[0].value);
    }
  }, [selectedCode, countryCodes, onCodeChange]);

  return (
    <div className='flex flex-col items-start w-full mt-3'>
      {/* Label */}
      <label className='mb-1 font-medium text-[13px] text-[#1B2559]'>{label}</label>
      {/* Compact Input */}
      <Space.Compact
        style={{
          width: '100%',
        }}
      >
        {/* Country Code Dropdown */}
        <Select
          showSearch
          value={selectedCode}
          onChange={onCodeChange}
          disabled={disabled}
          options={countryCodes}
          style={{
            minWidth: '160px',
            height: '50px',
            borderRadius: '10px !important',
          }}
          classNa
          dropdownMatchSelectWidth={false}
          me='!placeholder:text-[#A3AED0]'
        />

        {/* Phone Number Input */}
        <Input
          type='number'
          placeholder={placeholder}
          disabled={disabled}
          style={{
            height: '50px',
            borderRadius: '10px !important',
          }}
          {...field}
        />
      </Space.Compact>

      {/* Error Message */}
      {(error?.type === 'required' || error?.type === 'pattern') && (
        <span className='text-sm mt-1 text-red-500'>{error.message}</span>
      )}
    </div>
  );
};

export default CustomPhoneInput;
