import React, { useState, useContext } from 'react';
import Room1 from '@/Components/RoomMap/RoomMap3';
import Room2 from '@/Components/RoomMap/RoomMap4';
import { CustomContext } from '@/Context/UseCustomContext';
import useWebSocket from '@/hook/useWebSoket';
import { decodePosition } from '@/utils/helper';
import { FaUser } from 'react-icons/fa6';
import { Tooltip } from 'antd';
import CurrentPeoples from './CurrentPeoples';

export default function LiveMapTab() {
  const context = useContext(CustomContext);
  const { elderlyDetails } = context || {};

  return (
    <div className='flex flex-col gap-4 mt-6 overflow-hidden'>
      {elderlyDetails?.rooms &&
        elderlyDetails?.rooms
          ?.filter((room) => room.device_no)
          .map((room, indx) => {
            return (
              <div key={indx} className='flex flex-col gap-4 bg-white rounded-2xl p-4 h-[700px]'>
                <h1 className='text-2xl font-bold'>{room?.name}</h1>
                <div className='flex h-full'>
                  <CurrentPeoples data={room} />
                  <div id='roomMap' className='w-fit h-full mt-14 mx-auto'>
                    {room?.mount_type === 2 && <Room2 roomInfo={room} />}
                    {room?.mount_type === 1 && <Room1 roomInfo={room} />}
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
}
