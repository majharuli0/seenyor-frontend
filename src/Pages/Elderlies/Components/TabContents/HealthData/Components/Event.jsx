import React, { useState, useContext, useCallback, useEffect } from 'react';
import CustomButton from '@/Shared/button/CustomButton';
import CreateAndEditModal from '@/Components/CreateAndEditModal/CreateAndEditModal';
import { Popover } from 'antd';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import DeleteModal from '@/Shared/delete/DeleteModal';
import SuccessModal from '@/Shared/Success/SuccessModal';
import dayjs from 'dayjs';
import { CustomContext } from '@/Context/UseCustomContext';
import { addEvent, getEventList, updateEvent } from '@/api/elderlySupport';
import CustomErrorToast from '@/Shared/Tosat/CustomErrorToast';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import { transformDateAndTime } from '@/utils/helper';

export default function Event() {
  const { elderlyDetails } = useContext(CustomContext);
  const [eventList, setEventList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function createEvent(eventData) {
    if (eventData) {
      addEvent({
        event_name: eventData?.event_name,
        date_time: eventData?.datetime,
        place: eventData?.place?.name,
        longitude: eventData?.place?.lng,
        latitude: eventData?.place?.lat,
        note: eventData?.textarea,
        event_status: 'pending',
        elderly_id: elderlyDetails?._id,
      })
        .then((res) => {
          toast.custom((t) => <CustomToast t={t} text={'Event Added Successfully!'} />);
          getEventsList();
        })
        .catch((err) => {
          toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
        });
    }
  }
  const getEventsList = useCallback(() => {
    getEventList({ elderly_id: elderlyDetails?._id })
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

  return (
    <>
      <div className='flex flex-col gap-4 bg-white rounded-2xl p-4'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-2xl font-bold'>Events</h1>
          <CustomButton onClick={() => setIsModalOpen(true)}>Add New Event</CustomButton>
        </div>
        <div id='elderlyEvents' className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {eventList.map((event, index) => (
            <EventCard key={index} event={event} getList={getEventsList} />
          ))}
        </div>
      </div>
      <CreateAndEditModal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        type='event'
        onSubmitData={createEvent}
        elderlyLatLng={{
          lat: elderlyDetails?.latitude || 0,
          lng: elderlyDetails?.longitude || 0,
        }}
      />
    </>
  );
}

export const EventCard = ({ event, getList }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const onCloseEvent = () => {
    setCloseModal(true);
  };
  const onDoneEvent = () => {
    setSuccessModal(true);
  };
  const onMark = (inf) => {
    updateEvent({
      id: inf.id,
      data: {
        event_status: inf.event_status,
      },
    })
      .then((res) => {
        toast.custom((t) => <CustomToast t={t} text={'Event Added Successfully!'} />);
        getList();
      })
      .catch((err) => {
        toast.custom((t) => <CustomErrorToast t={t} title='Error' text={err.message} />);
      });
  };
  const calculateRemainingTime = (time) => {
    const now = dayjs();
    const eventDate = dayjs(time); // Day.js can parse ISO 8601 directly
    const diffSeconds = eventDate.diff(now, 'second');

    if (diffSeconds <= 0) {
      return ''; // Event already occurred
    }

    const diffDays = Math.floor(diffSeconds / (24 * 3600));
    const diffHours = Math.floor((diffSeconds % (24 * 3600)) / 3600);
    const diffMinutes = Math.floor((diffSeconds % 3600) / 60);
    const diffSecs = diffSeconds % 60;

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ${diffSecs}s`;
    } else {
      return `${diffSecs}s`;
    }
  };
  const formatEventDate = (date) => {
    const today = dayjs();
    const givenDate = dayjs(date);

    return today.isSame(givenDate, 'day')
      ? givenDate.format('hh:mm A') // 12-hour format without seconds and with AM/PM
      : givenDate.format('YYYY-MM-DD hh:mm A'); // Full date with 12-hour format without seconds
  };
  return (
    <>
      <div id='eventCard'>
        <div
          id='header'
          className='flex  justify-between items-center bg-[#6AC198] rounded-t-xl p-4'
        >
          <div id='titleAndRemainingTime' className='flex flex-col gap-2'>
            <h1 className='text-xl font-bold text-white'>{event.event_name}</h1>
            {(event.event_status === 'closed' || event.event_status === 'open') && (
              <p className='text-primary/80 text-[15px] leading-none bg-white rounded-full p-2 py-2 w-fit'>
                {event.event_status === 'closed' ? 'Closed' : 'Done'}
              </p>
            )}
            {event.event_status === 'pending' && (
              <p className='text-primary/80 text-[15px] leading-none bg-white rounded-full p-2 py-2 w-fit'>
                {event.date_time && calculateRemainingTime(event.date_time) !== ''
                  ? `Remaining Time: ${calculateRemainingTime(event.date_time)}`
                  : 'Out of Date'}
              </p>
            )}
          </div>
          <Popover
            content={
              <div className='flex flex-col p-2 '>
                <p
                  className={`text-base text-primary/80 leading-none p-2 rounded-md hover:bg-primary/5 cursor-pointer`}
                  onClick={() => {
                    setIsPopoverOpen(false);
                    setSuccessModal(true);
                  }}
                >
                  Mark As Done
                </p>
                <p
                  className={`text-base text-red-500 leading-none p-2 rounded-md hover:bg-red-500/5 cursor-pointer`}
                  onClick={() => {
                    setIsPopoverOpen(false);
                    setCloseModal(true);
                  }}
                >
                  Close Event
                </p>
              </div>
            }
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            placement='leftTop'
            trigger='click'
          >
            <div className='cursor-pointer p-2 rounded-full hover:bg-white/10'>
              <HiOutlineDotsVertical
                size={20}
                onClick={() => setIsPopoverOpen(true)}
                className='text-white'
              />
            </div>
          </Popover>
        </div>
        <div
          id='body'
          className='flex flex-col gap-2 p-4 border-b border-l border-r border-b-primary/5 rounded-b-xl'
        >
          <div id='eventDescription'>
            <span className='font-bold'>Date:</span>
            <p className='text-primary/80 text-[17px]'>{formatEventDate(event.date_time)}</p>
          </div>
          <div id='eventLocation' className='flex flex-col'>
            <span className='font-bold'>Place:</span>
            <a
              href={
                event.latitude && event.longitude
                  ? `https://www.google.com/maps?q=${event.latitude},${event.longitude}`
                  : null
              }
              target='_blank'
              className='text-primary/80 text-[17px] hover:underline hover:text-primary'
            >
              {event.place}
            </a>
          </div>
          <div id='note'>
            <span className='font-bold'>Note:</span>
            <p className='text-primary/80 text-[17px]'>{event.note ? event.note : 'No Note'}</p>
          </div>
        </div>
      </div>
      <DeleteModal
        onDelete={() => onMark({ id: event?._id, event_status: 'closed' })}
        modalOPen={closeModal}
        setModalOpen={setCloseModal}
        title={`Are you sure you want to mark this event as close?`}
        title2={'This process cannot be undone.'}
        okText={'Close Event'}
      />
      <SuccessModal
        modalOPen={successModal}
        setModalOpen={setSuccessModal}
        onOk={() => onMark({ id: event?._id, event_status: 'open' })}
        title={'Are you sure you want to mark this event as completed?'}
        title2={'This process cannot be undone.'}
      />
    </>
  );
};

const eventData = [
  {
    title: 'Appointment With Dr. Smith',
    date: '28-10-2024, 10:00 AM',
    cordinates: [45.25, -71.0589],
    place: '123 Main St, Anytown, USA',
    note: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  },
  {
    title: 'Check Up',
    date: '26-10-2024, 10:00 AM',
    cordinates: [],
    place: '123 Main St, Anytown, USA',
    note: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  },
];
