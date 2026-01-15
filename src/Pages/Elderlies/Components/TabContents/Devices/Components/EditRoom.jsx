import React, { useCallback, useState, useEffect } from 'react';
import CeilingMountRoom from '@/Pages/Elderlies/Components/TabContents/Devices/Components/CeilingMountRoom2';
import { getRoomInfo } from '@/api/deviceConfiguration';
import CeillingMountRoom from './CeilingMountRoom';
import WallMount from './WallMountRoom';
import RoomCanvas from './RoomCanvas';
import { Spin } from 'antd';
export default function EditRoom({ elderly_id, device_id, isActive }) {
  const [roomInfo, setRoomInfo] = useState(null);

  const getRoomInformation = useCallback(() => {
    if (!isActive) return;

    setRoomInfo(null);

    getRoomInfo({ room_id: device_id, elderly_id })
      .then((res) => setRoomInfo(res.data))
      .catch((error) => console.error(error));
  }, [device_id, elderly_id, isActive]);

  useEffect(() => {
    getRoomInformation();
  }, [getRoomInformation]);
  return (
    <Spin tip='Fetching Data...' spinning={!roomInfo?.mount_type}>
      <div className='min-h-[400px]'>
        {roomInfo && roomInfo?.mount_type == 2 && (
          <RoomCanvas
            elderly_id={elderly_id}
            device_id={device_id}
            mountType='wall'
            roomType={
              roomInfo?.room_type === 3
                ? 'bathroom'
                : roomInfo?.room_type === 2
                  ? 'bedroom'
                  : 'livingroom'
            }
          />
          // <WallMount elderly_id={elderly_id} device_id={device_id} />
        )}
        {roomInfo && roomInfo?.mount_type == 1 && (
          // <CeillingMountRoom elderly_id={elderly_id} device_id={device_id} />
          <RoomCanvas
            elderly_id={elderly_id}
            device_id={device_id}
            mountType='ceiling'
            roomType={
              roomInfo?.room_type === 3
                ? 'bathroom'
                : roomInfo?.room_type === 2
                  ? 'bedroom'
                  : 'livingroom'
            }
          />
        )}
      </div>
    </Spin>
  );
}
