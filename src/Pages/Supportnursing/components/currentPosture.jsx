import { Tooltip } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import walking from '../../../assets/icon/room/events/walking.svg';
import suspected_fall from '../../../assets/icon/room/events/suspected_fall.svg';
import squatting from '../../../assets/icon/room/events/squatting.svg';
import standing from '../../../assets/icon/room/events/standing.svg';
import fall_confirm from '../../../assets/icon/room/events/fall_confirm.svg';
import laying_down from '../../../assets/icon/room/events/laying_down.svg';
import { FaUser } from 'react-icons/fa';
import { WebSocketContext } from '@/Context/WebSoketHook';
import { RxShadowNone } from 'react-icons/rx';
export default function CurrentPosture({ deviceCode = '', selectedEvents, setShowCard }) {
  const { deviceData } = useContext(WebSocketContext);
  const postureIconMap = useMemo(
    () => ({
      0: null,
      1: walking,
      2: suspected_fall,
      3: squatting,
      4: standing,
      5: fall_confirm,
      6: laying_down,
    }),
    []
  );

  const peopleData = useMemo(() => {
    return deviceData[deviceCode]?.position || [];
  }, [deviceData, deviceCode]);

  // Check conditions & update card visibility
  //   useEffect(() => {
  //     const timeout = setTimeout(() => {
  //       const shouldShow = peopleData.every((p) =>
  //         selectedEvents?.includes(p.postureIndex)
  //       );
  //       setShowCard(shouldShow);
  //     }, 100); // 100ms delay

  //     return () => clearTimeout(timeout);
  //   }, [peopleData, selectedEvents, setShowCard]);
  if (peopleData.length === 0) {
    return (
      <Tooltip title='No User Detected'>
        <div className='text-gray-500 w-4 h-4'>
          <RxShadowNone size={20} />
        </div>
      </Tooltip>
    );
  }
  return (
    <Tooltip
      color='white'
      overlayInnerStyle={{ color: 'black', padding: '10px' }}
      title={peopleData.map((people, indx) => (
        <div
          key={indx}
          className='flex items-center gap-2 w-fit'
          style={{ marginBottom: indx === peopleData.length - 1 ? '0' : '8px' }}
        >
          <div style={{ backgroundColor: people?.color }} className='p-2 rounded-full'>
            <FaUser size={14} color='white' />
          </div>
          <div>
            <p className='text-sm m-0'>{people?.posture}</p>
          </div>
        </div>
      ))}
    >
      <div className='flex -space-x-3 cursor-pointer w-fit'>
        {peopleData.map((people, indx) => {
          const imageIcon = postureIconMap[people.postureIndex];
          return (
            <div
              key={indx}
              style={{ backgroundColor: people?.color }}
              className='p-1 rounded-full border-2 border-white'
            >
              <img src={imageIcon} alt='' className='w-4 h-4' />
            </div>
          );
        })}
      </div>
    </Tooltip>
  );
}
