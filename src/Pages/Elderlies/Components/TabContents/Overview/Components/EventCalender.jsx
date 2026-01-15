import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, DatePicker, List, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import locale from 'antd/es/date-picker/locale/en_US';
import { IoIosArrowBack } from 'react-icons/io';
import { GrFormAdd } from 'react-icons/gr';
import { IoIosArrowForward } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { Tooltip } from 'antd';
import { ConfigProvider } from 'antd';
import { WiTime4 } from 'react-icons/wi';
import CreateAndEditModal from '@/Components/CreateAndEditModal/CreateAndEditModal';
const { WeekPicker } = DatePicker;
const { Text } = Typography;
import { getEventList } from '@/api/elderlySupport';

import { SmileOutlined } from '@ant-design/icons';
const MiniEventViewer = () => {
  const [selectedWeek, setSelectedWeek] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([
    {
      title: 'Doctor Appointment For Whooping Cough',
      time: '2024-11-14T12:20',
      location: '30 Pitt Street, Sydney Harbour Marriott.',
      date: dayjs('2024-11-14'),
    },
    {
      title: "Seniors' Week Photography",
      time: '2024-11-14T19:00',
      location: '19 Woronora Ave., Leumeah NSW 2560, AUS',
      date: dayjs('2024-11-14'),
    },
  ]);
  const [eventList, setEventList] = useState([]);
  const getEventsList = useCallback(() => {
    getEventList({ event_status: 'pending' })
      .then((res) => {
        setEventList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    getEventsList();
  }, [getEventsList]);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekPickerRef = useRef(null);

  const handleWeekChange = (date) => {
    setSelectedWeek(date.startOf('week'));
    setSelectedDay(date.startOf('week'));
  };

  const changeWeek = (direction) => {
    const newWeek =
      direction === 'prev' ? selectedWeek.subtract(1, 'week') : selectedWeek.add(1, 'week');
    setSelectedWeek(newWeek);
    setSelectedDay(newWeek.startOf('week'));
  };

  const [isWeekPickerOpen, setIsWeekPickerOpen] = useState(false);

  const openWeekPicker = () => {
    setIsWeekPickerOpen(true);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  function renderWeekDays() {
    return daysOfWeek.map((day, index) => {
      const currentDate = selectedWeek.startOf('week').add(index, 'day');
      const isSelected = currentDate.isSame(selectedDay, 'day');
      return (
        <div
          key={day}
          onClick={() => handleDayClick(currentDate)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.625rem',
            width: '100%',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backgroundColor: isSelected ? '#7F87FC' : 'transparent',
            color: isSelected ? '#fff' : 'var(--text-text-primary)',
            justifyContent: 'center',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            userSelect: 'none', // Add transition for smooth effect
          }}
        >
          <span className='text-xs'>{day}</span>
          <span className='text-sm font-bold'>{currentDate.date()}</span>
        </div>
      );
    });
  }

  const filteredEvents = eventList?.filter((event) => {
    // Convert event.date_time and selectedDay to the same day format
    return dayjs(event?.date_time).isSame(dayjs(selectedDay), 'day');
  });

  useEffect(() => {
    console.log('selected Day', selectedDay.format('YYYY-MM-DD'));
  }, [selectedDay]);

  return (
    <div className='bg-[#fff] relative p-5 rounded-2xl w-full'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-bold text-text-primary leading-none flex items-center gap-2 '>
          Events
        </h1>
        {/* <Tooltip title="Add New Event">
          <Button
            onClick={() => setIsModalOpen(true)}
            shape="circle"
            icon={<GrFormAdd />}
          />
        </Tooltip> */}
      </div>

      <div className='flex justify-center gap-3.5 items-center mb-3.5 cursor-pointer mt-2'>
        <Button
          type='link'
          onClick={() => changeWeek('prev')}
          className='p-0'
          icon={<IoIosArrowBack size={20} />}
        ></Button>
        <span className='text-lg font-bold' onClick={openWeekPicker}>
          {selectedWeek.format('MMMM YYYY')}
        </span>
        <Button
          type='link'
          className='p-0'
          onClick={() => changeWeek('next')}
          icon={<IoIosArrowForward size={20} />}
        ></Button>
      </div>

      <WeekPicker
        open={isWeekPickerOpen}
        onOpenChange={(open) => setIsWeekPickerOpen(open)}
        ref={weekPickerRef}
        onChange={handleWeekChange}
        locale={locale}
        picker='week'
        style={{
          position: 'absolute',
          top: '16%',
          width: '50px',
          opacity: 1,
          zIndex: -1,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      <div className='flex justify-around mb-5  rounded-lg p-1.25 !px-0'>{renderWeekDays()}</div>

      <div className=' p-2.5 rounded-md text-gray-800'>
        <h3 className='text-sm font-semibold'>{selectedDay.format('dddd, DD')}</h3>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <List
            itemLayout='horizontal'
            dataSource={filteredEvents}
            renderItem={(event) => (
              <div className='mt-3'>
                <div className='flex flex-col gap-1.5 items-start justify-between p-2.5 py-0 border-l-[3px] border-l-[#7F87FC]'>
                  <div className='text-base font-medium'>{event.event_name}</div>
                  <div className='flex items-center gap-1 text-sm text-text-secondary font-medium'>
                    <WiTime4 size={16} />
                    {dayjs(event.date_time).format('hh:mm A')}
                  </div>
                </div>
              </div>
            )}
          />
        </ConfigProvider>
      </div>
      <CreateAndEditModal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        type='event'
        elderlyLatLng={{ lat: 42.3601, lng: -71.0589 }}
      />
    </div>
  );
};

export default MiniEventViewer;
const customizeRenderEmpty = () => (
  <div
    style={{
      textAlign: 'center',
    }}
  >
    <SmileOutlined
      style={{
        fontSize: 20,
      }}
    />
    <p>No Events Found</p>
  </div>
);
