import React from 'react';
import { TimePicker, ConfigProvider } from 'antd';

const CustomTimePicker = ({ label, error, ...rest }) => {
  return (
    <div className='flex flex-col items-start w-full mt-3'>
      <label className='mb-1 font-medium text-[13px] text-[#1B2559]'>{label}</label>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8086AC',
            colorLink: '#8086AC',
            colorLinkHover: '#A0A4C1',
            colorLinkActive: '#6A6E8E',
          },
          components: {
            DatePicker: {
              cellActiveWithRangeBg: '#8086AC',
              cellHoverWithRangeBg: '#A0A4C1',
              timeColumnWidth: 56,
              timeColumnHeight: 224,
              timeLineHeight: 28,
              buttonBg: '#8086AC',
              buttonHoverBg: '#A0A4C1',
              buttonActiveBg: '#6A6E8E',
            },
          },
        }}
      >
        <TimePicker
          style={{ width: '100%', height: '50px', borderRadius: '10px' }}
          size='large'
          {...rest}
        />
      </ConfigProvider>
      {error && <span style={{ color: 'red' }}>{error.message}</span>}
    </div>
  );
};

export default CustomTimePicker;
