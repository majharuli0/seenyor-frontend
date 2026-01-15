// src/components/userCard.js

import React, { useState } from 'react';
import { CallButton } from './callButton'; // Assuming path is correct
import CurrentPosture from './currentPosture'; // Assuming path is correct
import { Progress, Skeleton, Tooltip } from 'antd';
import CurrentEvent from './currentEvent';
import {
  formatCreatedAt,
  getAlertInfoViaEventDetails,
  transformDateAndTimeToDuration,
} from '@/utils/helper';
import RoomOverviewDrawer from './userRoomOverviewDrawer';
import CurrentStatus from './CurrentState';
import './style.css';
import VisitLogsByRoom from '@/Components/VisitLogsByRoom';
import VisitCount from './VisitCount';

const NotificationIcon = ({ children }) => (
  <div className='w-[32px] h-[32px] rounded-full flex items-center justify-center text-white'>
    {children}
  </div>
);

const UserCard = ({
  name,
  room,
  deviceCode,
  selectedEvents,
  sleepScore,
  emergencyContacts = [],
  rooms = [],
  isDanger = true,
  currentAlertDetails,
  priority = 0,
  user,
}) => {
  const [open, setOpen] = useState(false);
  const [openVisitLogs, setOpenVisitLogs] = useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState(null);

  const deviceStatus = rooms?.some((room) => room?.is_device_bind);
  // Normal state
  return (
    <>
      {priority == 1 ? (
        <div
          className='relative rounded-[10px] min-w-[220px] max-w-[220px] w-full flex-grow h-fit cursor-pointer border-2 p0 card_UI'
          onClick={() => setOpen(true)}
          style={{ borderColor: '#FCA5A5' }}
        >
          <div className='bg-white/90 rounded-[7px] border border-gray-200 p-[10px] flex flex-col gap-4 h-full '>
            {/* <div className="bg-[linear-gradient(to_bottom,_#fef2f2_20%,_#ffffff_80%)] absolute inset-[1px] rounded-[6px] -z-10"></div> */}

            <div className='flex flex-col justify-between items-center'>
              <div className='text-[13px] font-medium font-roboto text-gray-500 leading-none w-full justify-center flex items-center gap-2'>
                <div
                  className='size-3 rounded-full'
                  style={{ backgroundColor: !deviceStatus ? 'red' : 'green' }}
                ></div>
                Room {room}
              </div>

              <div className='text-[16px] font-medium text-primary text-center mt-[10px] w-full'>
                {name}
              </div>
              <div className='mt-[5px] flex flex-col items-center'>
                <CurrentStatus
                  deviceCode={deviceCode}
                  rooms={rooms}
                  visit_count={user?.visit_count}
                  deviceOnline={deviceStatus}
                />
                <VisitCount
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenVisitLogs(true);
                    setSelectedRoom(rooms[0]?.room_no);
                  }}
                  deviceCode={deviceCode}
                  visit_count={user?.visit_count}
                />
                {/* <div
                  className="text-[12px] text-[#6B7280] font-medium cursor-pointer hover:text-slate-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenVisitLogs(true);
                    setSelectedRoom(rooms[0]?.room_no);
                  }}
                >
                  {user?.visit_count} Visits
                </div> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className='relative bg-white rounded-[10px]  cursor-pointer border-2 border-[#8BD1A5] p-[10px] min-w-[220px] max-w-[220px] card_UI w-fit flex-grow flex flex-col h-fit'
          onClick={() => setOpen(true)}
          style={{ borderColor: deviceStatus ? '#8BD1A5' : '#00000010' }}
        >
          <div className='flex flex-col justify-between items-center'>
            <div className='text-[13px] font-semibold text-[#6B7280] leading-none w-full flex justify-center items-center gap-2'>
              <div
                className='size-3 rounded-full'
                style={{ backgroundColor: !deviceStatus ? 'red' : 'green' }}
              ></div>
              Room {room}
            </div>
            <div className='text-[16px] font-medium text-primary text-center mt-[10px] w-full'>
              {name}
            </div>
            <div className='mt-[5px] flex flex-col items-center'>
              <CurrentStatus
                deviceCode={deviceCode}
                rooms={rooms}
                visit_count={user?.visit_count}
              />
              <VisitCount
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenVisitLogs(true);
                  setSelectedRoom(rooms[0]?.room_no);
                }}
                deviceCode={deviceCode}
                visit_count={user?.visit_count}
              />
            </div>
          </div>
          {/* <div className="flex justify-between">
            {currentAlertDetails && currentAlertDetails?.icon && (
              <NotificationIcon>
                <Tooltip
                  title={currentAlertDetails?.title}
                  className="cursor-pointer"
                >
                  <img
                    className="size-[26px]"
                    src={currentAlertDetails?.icon}
                    alt=""
                  />
                </Tooltip>
              </NotificationIcon>
            )}
          </div> */}
        </div>
      )}
      {openVisitLogs && (
        <VisitLogsByRoom open={openVisitLogs} setOpen={setOpenVisitLogs} room_id={selectedRoom} />
      )}

      {open && <RoomOverviewDrawer open={open} setOpen={setOpen} data={user} />}
    </>
  );
};

// Wrap with React.memo to prevent re-renders if props are unchanged.
export default React.memo(UserCard);
