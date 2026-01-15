import React from 'react';
import { Select, ConfigProvider, Input } from 'antd';

const CustomMedicationStrengthPicker = ({
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
    <div className='flex items-center w-full'>
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
            dropdownMatchSelectWidth={false}
            onBlur={onBlur}
            onChange={(selectedValue, option) => {
              onChange(option);
            }}
            value={value || defaultValue}
            status={error ? 'error' : ''}
            options={options}
            disabled={disabled}
            {...props}
          />
        </ConfigProvider>
        {error && <p className='mt-1 text-sm text-red-600'>{error.message}</p>}
      </div>
    </div>
  );
};

export default CustomMedicationStrengthPicker;
