import React, { useState } from 'react';
import { Select, ConfigProvider } from 'antd';

const { Option } = Select;

const CustomMultiSelect = ({ label, options, value = [], onChange, placeholder, error }) => {
  const [option, setOptions] = useState(options);
  function handleChange(value) {
    setOptions(value);
  }
  return (
    <div className='custom-multi-select flex flex-col items-start w-full mt-3'>
      <label className='mb-1 font-medium text-[13px] text-[#1B2559]'>{label}</label>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8086AC',
          },
        }}
      >
        <Select
          mode='tags'
          size='large'
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '10px !important',
          }}
          dropdownMatchSelectWidth={false}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange();
            handleChange(e);
          }}
          tokenSeparators={[',']}
        >
          {option.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </ConfigProvider>
      {error && <span className='error'>{error.message}</span>}
    </div>
  );
};

export default CustomMultiSelect;
