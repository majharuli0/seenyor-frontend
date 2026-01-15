// src/components/CurrentActivityOverview.js

import React, { useContext, useMemo } from 'react';
import { Card, CardContent } from '../../../Shared/shadncn-ui/card';
import { WebSocketContext } from '../../../Context/WebSoketHook';
import { CustomContext } from '@/Context/UseCustomContext';
import { decodeMinuteSleepStats } from '@/utils/helper';
import { SidebarContext } from '@/Context/CustomContext';

// --- Configuration for Groups ---
const groupConfig = {
  outOfBed: { label: 'Out of Bed', color: '#9333EA' },
  inBed: { label: 'In Bed', color: '#16A34A' },
  awake: { label: 'Awake', color: '#D89200' },
  asleep: { label: 'Asleep', color: '#2563EB' },
  outOfRoom: { label: 'Out of Room', color: 'black' },
  total: { label: 'Total Residents', color: 'black' },
};

export default function CurrentActivityOverview({ disableOnClikc = false }) {
  const { deviceData } = useContext(WebSocketContext);
  const {
    totalResident,
    setTotalResident,
    setActiveAlerts,
    selectedEvents,
    setSelectedEvents,
    notVisitRoomCount,
    setNotVisitedRoom,
    offlineRoomCount,
  } = useContext(SidebarContext);

  const { activities } = useMemo(() => {
    let outOfBedCount = 0;
    let inBedCount = 0;
    let awakeCount = 0;
    let asleepCount = 0;
    let outOfRoomCount = 0;

    // Track which devices have activity
    const devicesWithActivity = new Set();

    // loop through all devices
    for (const deviceCode in deviceData) {
      const device = deviceData[deviceCode];
      const positionData = device?.position;

      if (positionData && positionData.length > 0) {
        devicesWithActivity.add(deviceCode);
        const currentPosture = positionData[0].postureIndex;

        if (currentPosture === 6) {
          // in bed
          inBedCount += 1;

          // check sleep stage if available + recent
          if (device?.hbstatics && device?.hbstaticsTimestamp) {
            const diffInSeconds = (Date.now() - device.hbstaticsTimestamp) / 1000;
            if (diffInSeconds <= 90) {
              const decoded = decodeMinuteSleepStats(device.hbstatics);
              const sleepLabel = decoded?.statusEvents?.sleepState?.label;

              if (sleepLabel === 'Awake') {
                awakeCount += 1;
                inBedCount -= 1; // remove from generic InBed
              } else if (sleepLabel === 'Light Sleep' || sleepLabel === 'Deep Sleep') {
                asleepCount += 1;
                inBedCount -= 1; // remove from generic InBed
              }
            }
          }
        } else {
          // out of bed
          outOfBedCount += 1;
        }
      }
    }

    // Calculate out of room count
    // This would be total residents minus those with detected activity
    // Note: This assumes totalResident includes all residents and deviceData contains all possible devices
    const totalWithActivity = devicesWithActivity.size;

    outOfRoomCount = Math.max(0, totalResident - offlineRoomCount - totalWithActivity);

    return {
      activities: [
        {
          label: groupConfig.total.label,
          count: totalResident,
          color: groupConfig.total.color,
          type: 'total',
        },
        {
          label: groupConfig.inBed.label,
          count: inBedCount,
          color: groupConfig.inBed.color,
          type: 'inBed',
        },
        {
          label: groupConfig.asleep.label,
          count: asleepCount,
          color: groupConfig.asleep.color,
          type: 'asleep',
        },
        {
          label: groupConfig.awake.label,
          count: awakeCount,
          color: groupConfig.awake.color,
          type: 'awake',
        },
        {
          label: groupConfig.outOfBed.label,
          count: outOfBedCount,
          color: groupConfig.outOfBed.color,
          type: 'outOfBed',
        },
        {
          label: groupConfig.outOfRoom.label,
          count: outOfRoomCount,
          color: groupConfig.outOfRoom.color,
          type: 'outOfRoom',
        },
      ],
    };
  }, [deviceData, totalResident]);

  const handleSelect = (type) => {
    if (type === 'outOfBed') {
      setSelectedEvents([1, 2, 3, 4, 5]);
      setNotVisitedRoom(false);
    } else if (type === 'inBed') {
      setSelectedEvents([6]);
      setNotVisitedRoom(false);
    } else if (type === 'awake') {
      setSelectedEvents(['awake']);
      setNotVisitedRoom(false);
    } else if (type === 'asleep') {
      setSelectedEvents(['asleep']);
      setNotVisitedRoom(false);
    } else if (type === 'outOfRoom') {
      setSelectedEvents(['outOfRoom']);
      setNotVisitedRoom(false);
    } else if (type === 'total') {
      setSelectedEvents([]);
      setNotVisitedRoom(false);
      setActiveAlerts(false);
    }
  };

  return (
    <Card className='p-2 w-full rounded-[10px] !border !border-[#E5E7EB]'>
      {/* <Card className="p-2 border-none w-full max-w-[750px] "> */}
      {/* Horizontal activity bar */}
      {/* <div className="flex h-fit w-full items-center justify-between rounded-full overflow-hidden">
        {activities
          .filter((a) => a.type !== "total") // skip total in bar
          .map((activity, i) => (
            <div
              key={i}
              style={{
                flexGrow: activity.count,
                backgroundColor: activity.color,
              }}
            />
          ))}
      </div> */}

      {/* Stats */}
      <CardContent className='flex overflow-x-auto lg:overflow-x-none text-sm p-0 gap-2 items-start justify-between'>
        {activities.map((activity, i) => {
          // Determine if this activity is currently selected
          let isActive = false;

          if (activity.type === 'total') {
            isActive = !selectedEvents || selectedEvents.length === 0;
          } else if (activity.type === 'inBed') {
            isActive = selectedEvents?.includes(6);
          } else if (activity.type === 'outOfBed') {
            isActive = selectedEvents?.some((e) => [1, 2, 3, 4, 5].includes(e));
          } else if (activity.type === 'awake') {
            isActive = selectedEvents?.includes('awake');
          } else if (activity.type === 'asleep') {
            isActive = selectedEvents?.includes('asleep');
          } else if (activity.type === 'outOfRoom') {
            isActive = selectedEvents?.includes('outOfRoom');
          }

          return (
            <div
              key={i}
              className={`flex items-center justify-center gap-2 cursor-pointer w-full p-2 rounded-md ${
                isActive ? 'bg-slate-100' : 'hover:bg-slate-100/50'
              } ${
                disableOnClikc || (disableOnClikc && isActive)
                  ? '!cursor-default hover:bg-transparent bg-transparent'
                  : ''
              } `}
              onClick={() => {
                if (!disableOnClikc) {
                  handleSelect(activity.type);
                }
              }}
            >
              {/* <span
                className="w-[8px] h-[8px] rounded-[2px] mt-1.5"
                style={{ backgroundColor: activity.color }}
              /> */}
              <div className='flex items-center justify-center flex-col gap-1'>
                <div
                  className='text-[24px] font-medium text-color-primary opacity-75 mt-1'
                  style={{ color: activity.color }}
                >
                  {String(activity.count).padStart(1, '0')}
                </div>
                <div className='text-color-primary text-nowrap text-[14px]'>{activity.label}</div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
