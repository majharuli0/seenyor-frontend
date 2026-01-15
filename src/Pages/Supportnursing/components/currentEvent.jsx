import { Tooltip } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { FaUser } from 'react-icons/fa';
import { WebSocketContext } from '@/Context/WebSoketHook';
import { RxShadowNone } from 'react-icons/rx';
import { FaBedPulse } from 'react-icons/fa6';
import { decodeMinuteSleepStats } from '@/utils/helper';
export default function CurrentEvent({ deviceCode = '', selectedEvents, setShowCard }) {
  const { deviceData } = useContext(WebSocketContext);

  const currentState = useMemo(() => {
    const device = deviceData[deviceCode];
    const lastUpdate = device?.hbstaticsTimestamp;
    const now = Date.now();

    if (!device?.hbstatics || !lastUpdate) return null;

    const diffInSeconds = (now - lastUpdate) / 1000;
    if (diffInSeconds > 90) return null;

    return device.hbstatics;
  }, [deviceData[deviceCode]]);

  if (currentState) {
    return (
      <Tooltip
        color='white'
        overlayInnerStyle={{ color: 'black', padding: '10px' }}
        title={
          <div className='flex items-center gap-2 mb-0 w-fit'>
            <p className='text-sm m-0'>
              {decodeMinuteSleepStats(currentState)?.statusEvents?.sleepState?.label}
            </p>
          </div>
        }
      >
        <div className='flex -space-x-3 cursor-pointer w-fit'>
          <div className='pr-1'>
            <FaBedPulse
              size={20}
              color={`${decodeMinuteSleepStats(currentState)?.statusEvents?.sleepState?.color}`}
            />
          </div>
        </div>
      </Tooltip>
    );
  }
  return null;
}
