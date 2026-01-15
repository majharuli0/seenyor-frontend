import React, { useState, useEffect } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear); // Extend dayjs to use week of year

const WeeklyMonthlyPicker = ({ placeholder, style, handleChange, value }) => {
  const [placeholderText, setPlaceholderText] = useState('This Week');
  // Function to format the selected week
  const formatWeek = (value) => {
    const start = dayjs(value).startOf('week').format('YYYY-MM-DD'); // Get start date of week
    const end = dayjs(value).endOf('week').format('YYYY-MM-DD'); // Get end date of week
    return {
      week: dayjs(value).week(),
      start,
      end,
    }; // e.g., { week: 42, start: "2024-10-15", end: "2024-10-21" }
  };

  // Function to display the formatted string in the DatePicker
  const displayFormat = (value) => {
    return `Week ${formatWeek(value).week}`; // Return week number for display
  };
  useEffect(() => {
    if (value) {
      const currentWeek = dayjs().week();
      const selectedWeek = dayjs(value.start).week();

      if (selectedWeek === currentWeek - 1) {
        setPlaceholderText('Last Week');
      } else {
        setPlaceholderText(`Week ${selectedWeek}`);
      }
    } else {
      setPlaceholderText('This Week');
    }
  }, [value]);
  return (
    <DatePicker
      style={style}
      placeholder={placeholderText}
      size='large'
      format={displayFormat} // Use the display format function
      picker={'week'}
      onChange={(selectedDate) => {
        if (selectedDate) {
          const formatted = formatWeek(selectedDate);
          handleChange(formatted);
        } else {
          handleChange('');
          setPlaceholderText('This Week');
        }
      }}
    />
  );
};

export default WeeklyMonthlyPicker;
