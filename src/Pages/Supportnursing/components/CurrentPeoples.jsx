import React, { useContext, useEffect, useMemo } from 'react';
import { WebSocketContext } from '@/Context/WebSoketHook';
import { CustomContext } from '@/Context/UseCustomContext';
import { Tooltip } from 'antd';
import { FaUser } from 'react-icons/fa6';
import { FaBedPulse } from 'react-icons/fa6';
import { decodeMinuteSleepStats } from '@/utils/helper';
export default function CurrentPeoples({ data = {} }) {
  const { deviceData } = useContext(WebSocketContext);
  const context = useContext(CustomContext);
  const { elderlyDetails } = context || {};
  const deviceCode = data?.device_no || elderlyDetails?.deviceId;
  const peopleData = useMemo(() => {
    return (
      (Object.prototype.hasOwnProperty.call(deviceData, deviceCode)
        ? deviceData[deviceCode]?.position
        : []) || []
    );
  }, [
    Object.prototype.hasOwnProperty.call(deviceData, deviceCode)
      ? deviceData[deviceCode]?.position
      : undefined,
  ]);
  const currentState = useMemo(() => {
    const device = deviceData[deviceCode];
    const lastUpdate = device?.hbstaticsTimestamp;
    const now = Date.now();

    if (!device?.hbstatics || !lastUpdate) return null;

    const diffInSeconds = (now - lastUpdate) / 1000;
    if (diffInSeconds > 90) return null;

    return device.hbstatics;
  }, [deviceData[deviceCode]]);

  return (
    <div className='flex gap-2'>
      <div className='top-2 left-2 border-2 p-0 rounded-full flex items-center gap-1 pr-2 h-fit w-fit'>
        {peopleData?.length > 0 ? (
          <Tooltip
            color='white'
            overlayInnerStyle={{ color: 'black', padding: '10px' }}
            title={peopleData?.map((people, indx) => (
              <div key={indx} className='flex items-center gap-2 mb-2'>
                <div style={{ backgroundColor: people?.color }} className='p-2 rounded-full'>
                  <FaUser size={14} color='white' />
                </div>
                <div>
                  <p className='text-[14px] m-0'>{people?.posture}</p>
                </div>
              </div>
            ))}
          >
            <div className='flex -space-x-4 cursor-pointer'>
              {peopleData?.map((people, indx) => (
                <div
                  key={indx}
                  style={{ backgroundColor: people?.color }}
                  className={`p-1 rounded-full border-2 border-white`}
                >
                  <FaUser size={16} color='white' />
                </div>
              ))}
            </div>
          </Tooltip>
        ) : (
          <div className={`bg-primary p-1 rounded-full border-2 border-white`}>
            <FaUser size={16} color='white' />
          </div>
        )}
        <span className='font-bold text-[14px]'>{peopleData ? peopleData?.length : 0}</span>
      </div>
      {data?.room_type == 2 && currentState && (
        <div className='top-2 left-2 border-2 p-0 rounded-full flex items-center gap-1 pr-2 h-fit w-fit px-2 py-1'>
          <div className='pr-1'>
            <FaBedPulse
              size={20}
              color={`${decodeMinuteSleepStats(currentState)?.statusEvents?.sleepState?.color}`}
            />
          </div>
          <span className='font-semibold'>
            {decodeMinuteSleepStats(currentState)?.statusEvents?.sleepState?.label || '--'}
          </span>
        </div>
      )}
    </div>
  );
}
