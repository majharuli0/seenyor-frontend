import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);

const WeeklyMonthlyPicker = ({ placeholder, style, handleChnage, value }) => {
  const [format, setFormat] = useState(''); // "week" or "month"
  const [activePicker, setActivePicker] = useState('weekly'); // for UI highlighting
  const [internalValue, setInternalValue] = useState(null); // DatePicker controlled value

  useEffect(() => {
    if (!value) {
      // reset internal state if parent clears the value
      setInternalValue(null);
      setFormat('');
      setActivePicker('weekly');
    } else if (value.start && value.end) {
      setInternalValue(dayjs(value.start));
      // optionally determine format from value
      if (value.month) {
        setFormat('month');
        setActivePicker('monthly');
      } else {
        setFormat('week');
        setActivePicker('weekly');
      }
    }
  }, [value]);

  const formatMonth = (val) => {
    const start = dayjs(val).startOf('month').format('YYYY-MM-DD');
    const end = dayjs(val).endOf('month').format('YYYY-MM-DD');
    return { month: dayjs(val).format('MMMM-YY'), start, end };
  };

  const formatWeek = (val) => {
    const start = dayjs(val).startOf('week').format('YYYY-MM-DD');
    const end = dayjs(val).endOf('week').format('YYYY-MM-DD');
    return { week: dayjs(val).week(), start, end };
  };

  const displayFormat = (val) => {
    if (!val) return '';
    return format === 'month' ? formatMonth(val).month : `Week ${formatWeek(val).week}`;
  };

  return (
    <DatePicker
      style={style}
      placeholder={placeholder}
      size='large'
      value={internalValue}
      format={displayFormat}
      picker={format === 'month' ? 'month' : 'week'}
      onChange={(val) => {
        if (val) {
          const formatted = format === 'month' ? formatMonth(val) : formatWeek(val);
          handleChnage(formatted);
        } else {
          handleChnage(null); // clear parent value
        }
        setInternalValue(val);
      }}
      renderExtraFooter={() => (
        <div className='flex items-center gap-2 w-full justify-center'>
          <div
            onClick={() => {
              setFormat('week');
              setActivePicker('weekly');
              setInternalValue(null);
              handleChnage(null); // clear parent
            }}
            className={`cursor-pointer font-medium text-text-primary ${
              activePicker === 'weekly' ? 'bg-text-primary text-white' : 'bg-white'
            } h-8 px-3 flex items-center justify-center rounded`}
          >
            Weekly
          </div>
          <div
            onClick={() => {
              setFormat('month');
              setActivePicker('monthly');
              setInternalValue(null);
              handleChnage(null); // clear parent
            }}
            className={`cursor-pointer font-medium text-text-primary ${
              activePicker === 'monthly' ? 'bg-text-primary text-white' : 'bg-white'
            } h-8 px-3 flex items-center justify-center rounded`}
          >
            Monthly
          </div>
        </div>
      )}
    />
  );
};

export default WeeklyMonthlyPicker;
