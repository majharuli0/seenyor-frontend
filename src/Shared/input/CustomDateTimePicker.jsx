import React from 'react';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
const CustomDateTimePicker = ({ label, error, value, onChange, ...rest }) => {
  const handleChange = (date, dateString) => {
    const formattedDate = date
      ? dayjs(date).format('YYYY-MM-DD HH:mm')
      : dayjs().format('YYYY-MM-DD HH:mm');
    onChange(formattedDate);
  };

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
        <DatePicker
          style={{ width: '100%', height: '50px', borderRadius: '10px' }}
          size='large'
          showTime
          format='YYYY-MM-DD HH:mm A'
          onChange={handleChange}
          {...rest}
        />
      </ConfigProvider>
      {error && <span style={{ color: 'red' }}>{error.message}</span>}
    </div>
  );
};

export default CustomDateTimePicker;
