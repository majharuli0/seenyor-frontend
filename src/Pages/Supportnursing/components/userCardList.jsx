import React, { useContext, useEffect, useMemo, useState } from 'react';
import { WebSocketContext } from '../../../Context/WebSoketHook';
import UserCard from './userCard';
import { Skeleton, Tooltip } from 'antd';
import { decodeMinuteSleepStats } from '@/utils/helper';
import { getCriticalAlarmCount } from '@/api/elderly';
import dayjs from 'dayjs';
import { BsInfoCircle } from 'react-icons/bs';
import { SidebarContext } from '@/Context/CustomContext';

const UserCardList = ({ users, selectedEvents, notVisitedRoom, isActiveAlertsSelect, loading }) => {
  const { deviceData } = useContext(WebSocketContext);
  const [criticalAlarmCounts, setCriticalAlarmCounts] = useState([]);
  const CRITICAL_ALARM_CACHE_KEY = 'criticalAlarmCountsCache';

  useEffect(() => {
    const cached = localStorage.getItem(CRITICAL_ALARM_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        setCriticalAlarmCounts(parsed.data);
      }
    }

    getCriticalAlarmCount({
      to_date: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
      from_date: dayjs()?.format('YYYY-MM-DD'),
      limit: 1000,
    })
      .then((res) => {
        const fresh = res?.data || [];
        setCriticalAlarmCounts(fresh);

        localStorage.setItem(
          CRITICAL_ALARM_CACHE_KEY,
          JSON.stringify({ data: fresh, timestamp: Date.now() })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const riskMap = useMemo(() => {
    const map = {};
    for (const alarm of criticalAlarmCounts) {
      if (!map[alarm.room_id]) map[alarm.room_id] = {};
      const eventId = alarm.event; // '2', '5', etc.
      map[alarm.room_id][eventId] = (map[alarm.room_id][eventId] || 0) + alarm.count;
    }
    return map;
  }, [criticalAlarmCounts]);

  const thresholds = {
    2: 3, // event 2 >= 3
    // 6: 6, // event 6 >= 6
    // add more events/thresholds here
  };

  const isHighRiskRoom = (room_id) => {
    const roomEvents = riskMap[room_id];
    if (!roomEvents) return false;
    return Object.entries(thresholds).some(([eventId, limit]) => {
      return (roomEvents[eventId] || 0) >= limit;
    });
  };

  // Helper function to check if user has activity in any room
  const hasActivityInAnyRoom = (user) => {
    if (!user.rooms || user.rooms.length === 0) return false;

    return user.rooms.some((room) => {
      if (!room.device_no) return false;
      const roomDeviceData = deviceData[room.device_no];
      return roomDeviceData?.position && roomDeviceData.position.length > 0;
    });
  };

  const visibleUsers = useMemo(() => {
    if (!selectedEvents || selectedEvents.length === 0) {
      return users;
    }

    // Handle "Out of Room" filter
    if (selectedEvents.includes('outOfRoom')) {
      return users.filter(
        (user) =>
          // must be device bound (online)
          user.is_device_bind !== false &&
          // but has no activity
          !hasActivityInAnyRoom(user)
      );
    }

    return users.filter((user) => {
      // Check if user has activity in any room
      if (!hasActivityInAnyRoom(user)) return false;

      // Find the active room with priority (bedroom first)
      const roomTypePriority = { 2: 1, 1: 2, 3: 3, 4: 4, 5: 5 };
      const sortedRooms = [...(user.rooms || [])].sort((a, b) => {
        const priorityA = roomTypePriority[a.room_type] || 999;
        const priorityB = roomTypePriority[b.room_type] || 999;
        return priorityA - priorityB;
      });

      let activeRoom = null;
      for (const room of sortedRooms) {
        if (!room.device_no) continue;
        const roomDeviceData = deviceData[room.device_no];
        if (roomDeviceData?.position && roomDeviceData.position.length > 0) {
          activeRoom = { room, deviceData: roomDeviceData };
          break;
        }
      }

      if (!activeRoom) return false;

      const peopleData = activeRoom.deviceData.position || [];
      if (peopleData.length === 0) return false;

      const device = activeRoom.deviceData;
      let sleepState = null;
      if (device?.hbstatics && device?.hbstaticsTimestamp) {
        const diffInSeconds = (Date.now() - device.hbstaticsTimestamp) / 1000;
        if (diffInSeconds <= 90) {
          sleepState =
            decodeMinuteSleepStats(device.hbstatics)?.statusEvents?.sleepState?.label || null;
        }
      }

      return peopleData.every((p) => {
        const firstPerson = peopleData[0];
        if (!firstPerson) return false;

        if (firstPerson.postureIndex === 6) {
          const hasSleepFilter = selectedEvents.some((e) => ['awake', 'asleep'].includes(e));

          if (hasSleepFilter) {
            if (!sleepState) return false;

            if (selectedEvents.includes('awake')) {
              return sleepState === 'Awake';
            }

            if (selectedEvents.includes('asleep')) {
              return ['Light Sleep', 'Deep Sleep'].includes(sleepState);
            }
          }

          return selectedEvents.includes(6);
        }

        return selectedEvents.includes(firstPerson.postureIndex);
      });
    });
  }, [deviceData, selectedEvents, users, isActiveAlertsSelect, notVisitedRoom]);

  const [highRiskUsers, normalUsers, offlineUsers] = useMemo(() => {
    const high = [];
    const normal = [];
    const offline = [];
    visibleUsers.forEach((user) => {
      if (user.is_device_bind === false) {
        offline.push(user);
        return;
      }
      const roomId = user.room_id;

      if (isHighRiskRoom(roomId)) {
        high.push(user);
      } else {
        normal.push(user);
      }
    });

    if (notVisitedRoom) {
      return [
        high.filter((u) => !u.visit_count || u.visit_count == 0),
        normal.filter((u) => !u.visit_count || u.visit_count == 0),
        offline.filter((u) => !u.visit_count || u.visit_count == 0),
      ];
    }
    // if (isActiveAlertsSelect) {
    //   return [
    //     high.filter((u) => u.priority === 1),
    //     normal.filter((u) => u.priority === 1),
    //   ];
    // }
    return [high, normal, offline];
  }, [visibleUsers, riskMap, isActiveAlertsSelect, notVisitedRoom]);

  return (
    <div className='flex flex-col gap-6'>
      {loading && users?.length == 0 && (
        <div className='flex gap-2 flex-wrap'>
          {Array.from({ length: 8 }).map((_, indx) => (
            <UserCardSkeleton key={indx} />
          ))}
        </div>
      )}
      {highRiskUsers.length > 0 && (
        <div>
          <div className='w-full flex items-center justify-center gap-3 mb-4'>
            <h2 className='text-sm text-primary/90 text-nowrap flex items-center'>
              High Risk Residents{' '}
              <Tooltip
                className='ml-2'
                title='A room is marked as high risk if a resident has fallen 3 or more times in the last 2 weeks.'
              >
                <BsInfoCircle className='text-sm text-primary cursor-pointer' />
              </Tooltip>
            </h2>
            <hr className='w-full' />
          </div>
          <div className='flex flex-wrap gap-2'>
            {highRiskUsers.map((user, ind) => (
              <UserCard
                key={user.id}
                name={user.name}
                room={user.room}
                // room={"0" + (ind + 1)}
                sleepScore={user.sleepScore}
                deviceCode={user.deviceCode}
                selectedEvents={selectedEvents}
                currentAlertDetails={user?.currentAlertDetails}
                emergencyContacts={user.emergency_contacts}
                rooms={user.rooms}
                priority={user.priority}
                user={user}
              />
            ))}
          </div>
        </div>
      )}

      {/* Normal Section */}
      {normalUsers.length > 0 && (
        <div>
          <div className='w-full flex items-center justify-center gap-3 mb-4'>
            <h2 className='text-sm text-primary/90 text-nowrap'>All Residents</h2>
            <hr className='w-full' />
          </div>
          <div className='flex flex-wrap gap-2'>
            {normalUsers.map((user, ind) => (
              <UserCard
                key={user.id}
                name={user.name}
                // room={"0" + (highRiskUsers.length + ind + 1)}
                room={user.room}
                sleepScore={user.sleepScore}
                deviceCode={user.deviceCode}
                selectedEvents={selectedEvents}
                currentAlertDetails={user?.currentAlertDetails}
                emergencyContacts={user.emergency_contacts}
                rooms={user.rooms}
                priority={user.priority}
                user={user}
              />
            ))}
          </div>
        </div>
      )}
      {/* Offline Rooms Section */}
      {offlineUsers.length > 0 && (
        <div>
          <div className='w-full flex items-center justify-center gap-3 mb-4'>
            <h2 className='text-sm text-primary/90 text-nowrap'>Offline Rooms</h2>
            <hr className='w-full' />
          </div>
          <div className='flex flex-wrap gap-2'>
            {offlineUsers.map((user) => (
              <UserCard
                key={user.id}
                name={user.name}
                room={user.room}
                sleepScore={user.sleepScore}
                deviceCode={user.deviceCode}
                selectedEvents={selectedEvents}
                currentAlertDetails={user?.currentAlertDetails}
                emergencyContacts={user.emergency_contacts}
                rooms={user.rooms}
                priority={user.priority}
                user={user}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCardList;

// Skeleton remains same

const UserCardSkeleton = () => {
  return (
    <div className='relative rounded-[9px] min-w-[220px] max-w-[280px] w-fit flex-grow h-fit cursor-pointer border-2'>
      <div className='bg-white/90 rounded-[7px]  p-[10px] flex flex-col gap-4 h-full relative'>
        <div className='bg-[linear-gradient(to_bottom,_#fef2f2_20%,_#ffffff_80%)] absolute inset-[1px] rounded-[6px] -z-10'></div>

        {/* Header (status + room) */}
        <div className='flex flex-col justify-between items-center w-full'>
          <div className='text-[14px] font-semibold text-gray-500 leading-none w-full flex items-center gap-2'>
            <div className='size-3 rounded-full bg-gray-300'></div>
            <Skeleton.Input active size='small' style={{ width: 80 }} />
          </div>

          <div className='text-[16px] font-medium text-primary text-center mt-1 w-full'>
            <Skeleton.Input active size='small' style={{ width: 100 }} />
          </div>

          <div className='mt-4 mb-1'>
            <Skeleton.Button active size='small' style={{ width: 120 }} />
          </div>
        </div>

        {/* Notification Icon Skeleton */}
        <div className='flex justify-between z-10 absolute top-2 right-2'>
          <Skeleton.Avatar active size='small' shape='circle' />
        </div>
      </div>
    </div>
  );
};
