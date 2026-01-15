import React from 'react';

const daysOfWeek = [
  { value: 'sunday', label: 'Sun' },
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
];

function DaySelector({ label, value = [], onChange, error }) {
  const handleDayChange = (day) => {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day]);
    }
  };

  return (
    <div className='flex flex-col items-start w-full mt-3'>
      <label className='mb-1 font-medium text-[13px] text-[#1B2559]'>{label}</label>
      <div className='w-full flex gap-3'>
        {daysOfWeek.map((day) => (
          <button
            key={day.value}
            type='button'
            onClick={() => handleDayChange(day.value)}
            style={{
              backgroundColor: value.includes(day.value) ? '#1B2559' : '#fff',
              color: value.includes(day.value) ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
            className='flex items-center justify-center w-full'
          >
            {day.label}
          </button>
        ))}
      </div>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
}

export default DaySelector;
