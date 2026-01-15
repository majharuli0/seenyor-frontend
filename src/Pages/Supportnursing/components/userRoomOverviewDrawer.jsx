import React, { useState } from 'react';
import { Drawer, Empty } from 'antd';
import { IoIosArrowForward } from 'react-icons/io';
import RoomMapBox from './Room';
import { WebSocketProvider } from '@/Context/WebSoketHook';
import { useNavigate } from 'react-router-dom';
import AlermLogs from './AlarmLogs';
import ActiveCriticalAlerts from './ActiveCriticalAlerts';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const RoomOverviewDrawer = ({ open, setOpen, data }) => {
  const onClose = () => setOpen(false);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setIsScrolled(scrollTop > 100);
  };

  return (
    <WebSocketProvider
      deviceId={
        data?.details?.length > 0
          ? data?.details
              ?.filter((item) => item.device_no)
              .map((item) => item.device_no)
              .join(',')
          : ''
      }
    >
      <Drawer
        title={
          isScrolled ? (
            <div className='flex items-center gap-3'>
              <div
                className='w-9 h-9 rounded-full flex items-center justify-center bg-white font-semibold text-sm shadow-sm'
                style={{
                  color: '#000',
                }}
              >
                {getInitials(data?.name || 'User')}
              </div>
              <div>
                <h3 className='font-semibold text-base text-white m-0'>
                  {data?.name || 'Name not found'}
                </h3>
              </div>
            </div>
          ) : null
        }
        onClose={onClose}
        closeIcon={<MdKeyboardDoubleArrowRight size={24} className='text-white' />}
        size='large'
        className='relative'
        open={open}
        styles={{
          header: {
            background: '#514EB5',
            borderBottom: 'none',
            transition: 'all 0.3s ease',
          },
          body: {
            padding: 0,
            overflow: 'hidden',
          },
        }}
      >
        <div className='h-full overflow-y-auto' onScroll={handleScroll}>
          <div className='relative bg-[#514EB5] pb-6 pt-2 overflow-hidden'>
            <style>
              {`
                @keyframes wave1 {
                  0% { transform: translateX(0) translateY(0) rotate(0deg); }
                  50% { transform: translateX(30px) translateY(-20px) rotate(10deg); }
                  100% { transform: translateX(0) translateY(0) rotate(0deg); }
                }
                @keyframes wave2 {
                  0% { transform: translateX(0) translateY(0) rotate(0deg); }
                  50% { transform: translateX(-25px) translateY(15px) rotate(-8deg); }
                  100% { transform: translateX(0) translateY(0) rotate(0deg); }
                }
                @keyframes wave3 {
                  0% { transform: scale(1) rotate(0deg); }
                  50% { transform: scale(1.1) rotate(5deg); }
                  100% { transform: scale(1) rotate(0deg); }
                }
                .animate-wave1 {
                  animation: wave1 12s ease-in-out infinite;
                }
                .animate-wave2 {
                  animation: wave2 15s ease-in-out infinite;
                }
                .animate-wave3 {
                  animation: wave3 10s ease-in-out infinite;
                }
              `}
            </style>

            <svg
              className='absolute top-0 right-0 w-64 h-64 opacity-5 animate-wave1'
              viewBox='0 0 200 200'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill='#ffffff'
                d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.9,76.4C26,83.8,9.2,86,-7.3,86.2C-23.8,86.4,-47.6,84.6,-63.7,75.4C-79.8,66.2,-88.2,49.6,-91.4,32.4C-94.6,15.2,-92.6,-2.6,-86.8,-18.4C-81,-34.2,-71.4,-48,-58.9,-56.8C-46.4,-65.6,-31,-69.4,-16.3,-73.8C-1.6,-78.2,12.4,-83.2,26.7,-83.6C41,-84,55.6,-79.8,44.7,-76.4Z'
                transform='translate(100 100)'
              />
            </svg>

            <svg
              className='absolute bottom-0 left-0 w-56 h-56 opacity-5 animate-wave2'
              viewBox='0 0 200 200'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill='#ffffff'
                d='M39.5,-65.5C51.4,-58.1,61.3,-47.3,68.4,-34.8C75.5,-22.3,79.8,-8.1,79.3,6.1C78.8,20.3,73.5,34.5,64.8,46.3C56.1,58.1,44,67.5,30.4,72.8C16.8,78.1,1.7,79.3,-13.3,77.8C-28.3,76.3,-43.2,72.1,-55.8,64.2C-68.4,56.3,-78.7,44.7,-83.8,31.2C-88.9,17.7,-88.8,2.3,-84.9,-11.8C-81,-25.9,-73.3,-38.7,-62.5,-47.3C-51.7,-55.9,-38.8,-60.3,-26.1,-67.3C-13.4,-74.3,-0.9,-83.9,11.3,-82.1C23.5,-80.3,27.6,-72.9,39.5,-65.5Z'
                transform='translate(100 100)'
              />
            </svg>

            <svg
              className='absolute top-1/2 right-1/4 w-48 h-48 opacity-5 animate-wave3'
              viewBox='0 0 200 200'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill='#ffffff'
                d='M41.3,-71.8C53.1,-63.9,62.3,-52.2,68.9,-39.2C75.5,-26.2,79.5,-11.9,79.8,2.6C80.1,17.1,76.7,31.8,69.4,44.3C62.1,56.8,50.9,67.1,37.8,73.8C24.7,80.5,9.7,83.6,-5.1,82.9C-19.9,82.2,-34.6,77.7,-47.4,70.2C-60.2,62.7,-71.1,52.2,-77.8,39.2C-84.5,26.2,-87,10.7,-85.3,-4.3C-83.6,-19.3,-77.7,-33.8,-68.9,-45.8C-60.1,-57.8,-48.4,-67.3,-35.4,-74.8C-22.4,-82.3,-8.1,-87.8,4.9,-86.4C17.9,-85,29.5,-79.7,41.3,-71.8Z'
                transform='translate(100 100)'
              />
            </svg>

            <div className='relative z-10 px-6'>
              <div
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate(`/supporter/elderlies/elderly-profile/${data.id}?tab=overview`);
                }}
                className='group cursor-pointer bg-white hover:bg-gray-50 rounded-lg p-5 transition-all duration-300 shadow-lg hover:shadow-xl'
              >
                <div className='flex items-center gap-4'>
                  <div className='relative flex-shrink-0'>
                    <div
                      className='w-16 h-16 rounded-full flex items-center justify-center bg-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-300 border-2'
                      style={{
                        color: '#514EB5',
                        borderColor: '#514EB5',
                      }}
                    >
                      {getInitials(data?.name || 'User')}
                    </div>
                  </div>

                  <div className='flex-1 min-w-0'>
                    <h2 className='text-xl font-bold text-gray-900 transition-colors duration-200 truncate'>
                      {data?.name || 'Name not found'}
                    </h2>
                    <div className='flex items-center gap-2 mt-1.5'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200'>
                        Room No: {data?.room || 'Not Found'}
                      </span>
                    </div>
                    <p className='text-xs text-gray-500 mt-2 flex items-center gap-1.5'>
                      <span className='text-[#514EB5] font-medium'>Tap to view details</span>
                      <IoIosArrowForward className='text-[#514EB5] group-hover:translate-x-1 transition-transform duration-200' />
                    </p>
                  </div>

                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 rounded-full bg-[#514EB5] group-hover:bg-[#6159c4] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300'>
                      <IoIosArrowForward className='text-white text-2xl group-hover:translate-x-1 transition-transform duration-200' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 min-h-screen px-6 pt-6'>
            <ActiveCriticalAlerts elderlyId={data?.id} />
            <div className='mb-8 mt-12'>
              <div className='flex items-center justify-center gap-2'>
                <h3 className='text-base font-medium text-nowrap'>Room Map</h3>
                <hr className='w-full m-0' />
              </div>
              {data?.details
                ?.filter((item) => item?.device_no)
                .map((item, indx) => {
                  return <RoomMapBox key={indx} data={item} elderlyId={data?.id} />;
                })}

              {data?.details?.filter((item) => item?.device_no)?.length == 0 && (
                <Empty description='No Room' className='mt-4'></Empty>
              )}
            </div>
            <div className='mb-8 mt-8'>
              <AlermLogs id={data?.details?.filter((item) => item?.room_type == 2)[0]?._id} />
            </div>
          </div>
        </div>
      </Drawer>
    </WebSocketProvider>
  );
};

export default React.memo(RoomOverviewDrawer);
