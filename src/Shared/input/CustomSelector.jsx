import React from 'react';
import { Select, ConfigProvider } from 'antd';

const CustomSelector = ({
  label,
  error,
  options,
  onChange,
  onBlur,
  value,
  defaultValue,
  disabled,
  ...props
}) => {
  return (
    <div className='flex flex-col items-start w-full mt-3'>
      <label className='mb-1 font-medium text-[13px] text-[#1B2559]'>{label}</label>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8086AC',
          },
        }}
      >
        <Select
          size='large'
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '10px !important',
          }}
          onBlur={onBlur}
          onChange={(selectedValue, option) => {
            onChange(option);
          }}
          dropdownMatchSelectWidth={false}
          value={value || defaultValue}
          status={error ? 'error' : ''}
          options={options}
          disabled={disabled}
          {...props}
        />
      </ConfigProvider>
      {error && <p className='mt-1 text-sm text-red-600'>{error.message}</p>}
    </div>
  );
};

export default CustomSelector;
