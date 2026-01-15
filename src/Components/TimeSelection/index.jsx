import React, { useState, useEffect, useRef } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

const TimeSelection = (props) => {
  const { handleClick = () => {}, name, setLoading } = props;
  const [date, setDate] = useState({
    text: 'Today',
    value: dayjs(),
    endvalue: '',
  });
  const isMounted = useRef(true);

  const handleLeftClick = () => {
    if (name == 'Day' || name == 'Daily') {
      const newDate = date.value.subtract(1, 'day');
      if (newDate.isBefore(dayjs(), 'day')) {
        setDate({
          text: newDate.isSame(dayjs(), 'day')
            ? 'Today'
            : newDate.isSame(dayjs().subtract(1, 'day'), 'day')
              ? 'Yesterday'
              : newDate.format('YYYY-MM-DD'),
          value: newDate,
        });
      }
    } else if (name == 'Week') {
      let start = date.value.subtract(1, 'week');
      let end = date.endvalue.subtract(1, 'week');

      setDate({
        value: start,
        endvalue: end,
        text: `Week ${start.week()}`,
      });
    } else {
      let startOfMonth = date.value.subtract(1, 'month');
      let endOfMonth = date.endvalue.subtract(1, 'month');
      startOfMonth = dayjs(startOfMonth).startOf('month');
      endOfMonth = dayjs(endOfMonth).endOf('month');
      console.log('startOfMonth.month()', startOfMonth.month());
      setDate({
        value: startOfMonth,
        endvalue: endOfMonth,
        text: `Month ${startOfMonth.month() + 1}`,
      });
    }
  };

  const handleRightClick = () => {
    if (name == 'Day' || name == 'Daily') {
      let newDate = date.value;
      if (newDate.isBefore(dayjs(), 'day')) {
        newDate = date.value.add(1, 'day');
        setDate({
          text: newDate.isSame(dayjs(), 'day')
            ? 'Today'
            : newDate.isSame(dayjs().subtract(1, 'day'), 'day')
              ? 'Yesterday'
              : newDate.format('YYYY-MM-DD'),
          value: newDate,
        });
      }
    } else if (name == 'Week') {
      const nextWeekStart = date.value.add(1, 'week');
      const nextWeekEnd = date.endvalue.add(1, 'week');
      // 不允许超过本周
      if (nextWeekStart.isAfter(dayjs().startOf('isoWeek'))) {
        return;
      }
      let str = `Week ${nextWeekStart.week()}`;

      setDate({
        value: nextWeekStart,
        endvalue: nextWeekEnd,
        text: str,
      });
      return;
    } else {
      let startOfMonth = date.value.add(1, 'month');
      let endOfMonth = date.endvalue.add(1, 'month');
      startOfMonth = dayjs(startOfMonth).startOf('month');
      endOfMonth = dayjs(endOfMonth).endOf('month');

      if (endOfMonth.isAfter(dayjs(), 'month')) {
        return;
      }

      setDate({
        value: startOfMonth,
        endvalue: endOfMonth,
        text: `Month ${startOfMonth.month() + 1}`,
      });
    }
  };
  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      return;
    }

    handleClick(date);
  }, [date]);
  useEffect(() => {
    if (name == 'Day' || name == 'Daily') {
      setDate({
        value: dayjs(),
        endvalue: '',
        text: `Today`,
      });
    } else if (name == 'Week') {
      let start = dayjs().startOf('isoWeek');

      setDate({
        value: start,
        endvalue: dayjs().endOf('isoWeek'),
        text: `Week ${start.week()}`,
      });
    } else {
      const startOfMonth = dayjs().startOf('month');
      const endOfMonth = dayjs().endOf('month');
      setDate({
        value: startOfMonth,
        endvalue: endOfMonth,
        text: `Month ${startOfMonth.month() + 1}`,
      });
    }
  }, [name]);

  return (
    <div className='flex w-[200px] justify-between items-center'>
      <div
        className='w-[32px] h-[32px] bg-OnButtonNormal rounded-[100px] flex items-center justify-center mr-[5px] '
        onClick={handleLeftClick}
      >
        {' '}
        <LeftOutlined className='text-white' />
      </div>
      <div className=' text-[16px] text-cblock font-semibold'>{date.text}</div>
      <div
        className='w-[32px] h-[32px] bg-OnButtonNormal rounded-[100px] flex items-center justify-center '
        onClick={handleRightClick}
      >
        {' '}
        <RightOutlined className='text-white' />
      </div>
    </div>
  );
};

export default TimeSelection;
