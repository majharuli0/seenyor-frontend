import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import Room1 from '@/Components/RoomMap/RoomMap3';
import Room2 from '@/Components/RoomMap/RoomMap4';
import useWebSocket from '@/hook/useWebSoket';
import { decodePosition } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';
import { FaUser } from 'react-icons/fa6';
import { Tooltip } from 'antd';
import { WebSocketContext } from '@/Context/WebSoketHook';
import CurrentPeoples from './CurrentPeoples';
import { getRoomInfo } from '@/api/deviceConfiguration';

export default function RoomMapBox({ data = [], elderly_id }) {
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const getRoomInformation = useCallback(() => {
    setLoading(true);
    getRoomInfo({ room_id: data?.device_no, elderly_id: elderly_id })
      .then((roomInfo) => {
        setRoomInfo(roomInfo.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  }, [data?.device_no, elderly_id]);

  useEffect(() => {
    getRoomInformation();
  }, [getRoomInformation]);
  return (
    <div className='flex flex-col gap-2 h-full'>
      <div className='flex items-center justify-between'>
        <span className='font-bold text-[20px] text-nowrap'>{data?.name}</span>
        <CurrentPeoples data={data} />
      </div>
      <div className='flex items-center justify-center gap-4 h-full w-full border border-gray-200 rounded-2xl overflow-hidden relative'>
        {data?.mount_type === 2 && <Room2 roomInfo={data} />}
        {data?.mount_type === 1 && <Room1 roomInfo={data} />}
      </div>
    </div>
  );
}
