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
  field, // Field props for contact_number
}) => {
  useEffect(() => {
    // Set default country code if none is provided
    if (!selectedCode && countryCodes.length > 0) {
      onCodeChange(countryCodes[0].value?.split('_')[0]);
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
        <Select
          showSearch
          value={selectedCode}
          onChange={(e) => onCodeChange(e?.split('_')[0])}
          disabled={disabled}
          options={countryCodes}
          style={{
            minWidth: '160px',
            height: '50px',
            borderRadius: '10px !important',
          }}
          dropdownMatchSelectWidth={false}
          className='!placeholder:text-[#A3Aed0]'
        />
        <Input
          type='number'
          placeholder={placeholder}
          disabled={disabled}
          style={{
            height: '50px',
            borderRadius: '10px !important',
          }}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          {...field}
        />
      </Space.Compact>
      {error && <span className='text-sm mt-1 text-red-500'>{error.message}</span>}
    </div>
  );
};

export default CustomPhoneInput;
