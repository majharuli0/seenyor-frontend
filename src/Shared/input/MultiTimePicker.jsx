import React, { useState } from 'react';
import { TimePicker, Button, Input, Space } from 'antd';
import dayjs from 'dayjs';

function MultiTimePicker({ label, value = [], onChange, error }) {
  const [currentTime, setCurrentTime] = useState(null);
  const [tabletCount, setTabletCount] = useState('');

  const handleAddTime = () => {
    if (currentTime && tabletCount) {
      const newEntry = {
        time: dayjs(currentTime).format('hh:mm A'),
        tablet_count: parseInt(tabletCount, 10),
      };
      onChange([...value, newEntry]);
      setCurrentTime(null);
      setTabletCount('');
    }
  };

  const handleRemoveTime = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className='flex flex-col items-start w-full mt-3'>
      <label className='mb-1 font-medium text-[13px] text-[#1B2559]'>{label}</label>
      <Space.Compact style={{ width: '100%' }}>
        <TimePicker
          use12Hours
          value={currentTime}
          onChange={(time) => setCurrentTime(time)}
          format='hh:mm A'
          style={{ width: '50%' }}
          size='large'
        />
        <Input
          style={{ width: '50%' }}
          size='large'
          type='number'
          placeholder='Tablet Count (eg: 2)'
          value={tabletCount}
          onChange={(e) => setTabletCount(e.target.value)}
        />
        <Button
          onClick={handleAddTime}
          disabled={!currentTime || !tabletCount}
          size='large'
          style={{ width: '15%' }}
        >
          Add
        </Button>
      </Space.Compact>
      <ul style={{ width: '100%', padding: 0, listStyle: 'none' }}>
        {value.map((entry, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
            <span>
              Time: {entry.time}, Tablets: {entry.tablet_count}
            </span>
            <Button
              type='link'
              onClick={() => handleRemoveTime(index)}
              style={{ marginLeft: '10px' }}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
}

export default MultiTimePicker;
