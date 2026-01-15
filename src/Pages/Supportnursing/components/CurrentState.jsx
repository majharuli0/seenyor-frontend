// src/components/CurrentStatus.js
import { Tooltip } from 'antd';
import React, { useContext, useMemo } from 'react';
import walking from '../../../assets/icon/room/events/walking.svg';
import suspected_fall from '../../../assets/icon/room/events/suspected_fall.svg';
import squatting from '../../../assets/icon/room/events/squatting.svg';
import standing from '../../../assets/icon/room/events/standing.svg';
import fall_confirm from '../../../assets/icon/room/events/fall_confirm.svg';
import laying_down from '../../../assets/icon/room/events/laying_down.svg';
import { FaBed, FaChair, FaUser, FaWalking } from 'react-icons/fa';
import {
  FaBedPulse,
  FaPersonFalling,
  FaPersonFallingBurst,
  FaRegCircleQuestion,
} from 'react-icons/fa6';
import { RxShadowNone } from 'react-icons/rx';
import { WebSocketContext } from '@/Context/WebSoketHook';
import { decodeMinuteSleepStats } from '@/utils/helper';

import { PiQuestionLight } from 'react-icons/pi';
import { BsPersonStanding } from 'react-icons/bs';
import { TbCircuitGround } from 'react-icons/tb';
import { RiWifiOffLine } from 'react-icons/ri';
import { ImExit } from 'react-icons/im';
import VisitLogsByRoom from '@/Components/VisitLogsByRoom';
export default function CurrentStatus({
  deviceCode = '',
  selectedEvents = [],
  group = 'all',
  rooms = [],
  deviceOnline,
  visit_count,
}) {
  const { deviceData } = useContext(WebSocketContext);
  const postureIconMap = useMemo(
    () => ({
      0: null,
      1: FaWalking,
      2: FaPersonFallingBurst,
      3: FaChair,
      4: BsPersonStanding,
      5: FaPersonFalling,
      6: FaBed,
      9: FaBed,
      10: FaBed,
      11: FaBed,
      7: TbCircuitGround,
      8: TbCircuitGround,
    }),
    []
  );

  // Room type priority mapping
  const roomTypePriority = useMemo(
    () => ({
      2: 1, // Bedroom - highest priority
      1: 2, // Living room
      3: 3, // Bathroom
      4: 4, // Other room
    }),
    []
  );

  // Get room display name - use custom name if available, otherwise fallback to type name
  const getRoomDisplayName = (room) => {
    // For bedroom, always show detailed activity, so we don't need room name in display
    if (room.room_type === 2) {
      return 'Bedroom';
    }

    // For other rooms, use custom name if available, otherwise use generic type name
    if (room.name && room.name.trim() !== '') {
      return room.name;
    }
    // Fallback to generic room type names
    const roomTypeNames = {
      1: 'Living Room',
      2: 'Bedroom',
      3: 'Bathroom',
      4: 'Other Room',
    };
    return roomTypeNames[room.room_type] || 'Unknown Room';
  };

  // Find active room with priority system
  const activeRoomData = useMemo(() => {
    if (!rooms || rooms.length === 0) return null;

    // Sort rooms by priority (bedroom first)
    const sortedRooms = [...rooms].sort((a, b) => {
      const priorityA = roomTypePriority[a.room_type] || 999;
      const priorityB = roomTypePriority[b.room_type] || 999;
      return priorityA - priorityB;
    });

    // Check each room for activity in priority order
    for (const room of sortedRooms) {
      if (!room.device_no) continue;

      const roomDeviceData = deviceData[room.device_no];
      const positionData = roomDeviceData?.position || [];

      if (positionData.length > 0) {
        return {
          room,
          deviceData: roomDeviceData,
          positionData,
          deviceCode: room.device_no,
        };
      }
    }

    return null;
  }, [rooms, deviceData, roomTypePriority]);

  // Get sleep state for the active room
  const sleepState = useMemo(() => {
    if (!activeRoomData) return null;

    const device = activeRoomData.deviceData;
    const lastUpdate = device?.hbstaticsTimestamp;
    if (!device?.hbstatics || !lastUpdate) return null;

    const diffInSeconds = (Date.now() - lastUpdate) / 1000;
    if (diffInSeconds > 90) return null;

    return decodeMinuteSleepStats(device.hbstatics)?.statusEvents?.sleepState;
  }, [activeRoomData]);

  // Filter people data by selected events
  const peopleData = useMemo(() => {
    if (!activeRoomData) return [];
    const { positionData } = activeRoomData;
    if (!selectedEvents || selectedEvents.length === 0) return positionData;

    return positionData.filter((p) => selectedEvents.includes(p.posture));
  }, [activeRoomData, selectedEvents]);

  // No activity detected in any room - "Out of Room" state
  if (!activeRoomData) {
    return (
      <div className='w-full flex flex-col justify-center items-center'>
        <div
          className='text-[#6B7280] w-fit p-[16px] bg-[#F3F4F6] rounded-full'
          style={{
            backgroundColor: !rooms[0]?.is_device_bind ? '#FCA5A520' : '#F3F4F6',
          }}
        >
          <Tooltip title={rooms[0]?.is_device_bind ? 'Out of Room' : ' Device Offline'}>
            {rooms[0]?.is_device_bind ? (
              <ImExit size={20} />
            ) : (
              <RiWifiOffLine size={20} color='red' />
            )}
          </Tooltip>
        </div>
        <div className='flex flex-col w-full items-center justify-center mt-[10px]'>
          <div className='text-[14px] font-medium text-primary/85'>
            {rooms[0]?.is_device_bind ? 'Out of Room' : ' Device Offline'}
          </div>
          {/* <div
            className="text-[12px] text-[#6B7280] font-medium cursor-pointer hover:text-slate-800"
            onClick={(e) => {
              console.log("ddd");

              e.stopPropagation();
              setOpen(true);
              // setSelectedRoom(rooms[0]?.room_no);
            }}
          >
            {visit_count} Visits
          </div> */}
        </div>
      </div>
    );
  }

  // Determine display text based on room type
  const getDisplayText = () => {
    const { room } = activeRoomData;
    const firstPerson = peopleData[0];

    // For bedroom (type 2), show the actual activity/sleep state
    if (room.room_type === 2) {
      if (firstPerson.postureIndex === 6 && sleepState) {
        return sleepState.label;
      }
      return firstPerson.posture;
    }

    // For other rooms, show "In [Custom Room Name]"
    return `In ${getRoomDisplayName(room)}`;
  };

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div>
        <Tooltip
          color='white'
          className='flex -space-x-3 cursor-pointer'
          overlayInnerStyle={{ color: 'black', padding: '10px' }}
          title={peopleData.map((people, indx) => {
            let label = people?.posture;
            const { room } = activeRoomData;
            let isSleep = false;
            let sleepColor = null;

            // Only show sleep state for bedroom
            // if (room.room_type === 2 && people.postureIndex === 6 && sleepState) {
            //   isSleep = true;
            //   sleepColor = sleepState.color2;
            // }
            // For bedroom, show detailed state
            if (room.room_type === 2 && people.postureIndex === 6 && sleepState) {
              label = sleepState.label;
              isSleep = true;
              sleepColor = sleepState.color2;
            } else if (room.room_type !== 2) {
              // For other rooms, show room location with custom name
              label = `In ${getRoomDisplayName(room)}`;
            }

            return (
              <div
                key={indx}
                className='flex items-center gap-2 w-fit'
                style={{
                  marginBottom: indx === peopleData.length - 1 ? '0' : '8px',
                }}
              >
                <div
                  style={{
                    backgroundColor: isSleep ? sleepColor : people?.color2,
                  }}
                  className='p-2 rounded-full'
                >
                  <FaUser size={14} color='white' />
                </div>
                <div>
                  <p className='text-sm m-0'>{label}</p>
                </div>
              </div>
            );
          })}
        >
          {peopleData.map((people, indx) => {
            let Icon = postureIconMap[people.postureIndex];
            let isSleep = false;
            let sleepColor = null;
            const { room } = activeRoomData;

            // Only show sleep state for bedroom
            if (room.room_type === 2 && people.postureIndex === 6 && sleepState) {
              isSleep = true;
              sleepColor = sleepState.color2;
            }

            return (
              <div
                key={indx}
                style={{
                  backgroundColor: !isSleep ? `${people?.color2}30` : `${sleepColor}30`,
                }}
                className='rounded-full p-[15px] flex items-center justify-center border-2 border-white'
              >
                {isSleep ? (
                  <FaBed size={20} color={sleepColor} />
                ) : (
                  Icon && <Icon size={20} color={people?.color2} />
                )}
              </div>
            );
          })}
        </Tooltip>
      </div>

      {peopleData.length > 0 && (
        <div className='flex flex-col w-full items-center justify-center mt-[10px]'>
          <div className='text-[14px] text-[#4B5563] font-medium'>{getDisplayText()}</div>
          {/* <div
            className="text-[12px] text-[#6B7280] font-medium  cursor-pointer hover:text-slate-800"
            onClick={(e) => {
              console.log("ddd");

              e.stopPropagation();
              setOpen(true);
              // setSelectedRoom(rooms[0]?.room_no);
            }}
          >
            {visit_count} Visits
          </div> */}
        </div>
      )}
    </div>
  );
}
