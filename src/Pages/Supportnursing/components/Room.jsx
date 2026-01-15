import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import Room1 from '@/Components/RoomMap/RoomMap3';
import Room2 from '@/Components/RoomMap/RoomMap4';
import useWebSocket from '@/hook/useWebSoket';
import { decodePosition } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';
import { FaUser } from 'react-icons/fa6';
import { Button, Spin, Tooltip } from 'antd';
import { WebSocketContext } from '@/Context/WebSoketHook';
import CurrentPeoples from './CurrentPeoples';
import { IoMdCall } from 'react-icons/io';
import { LuSettings } from 'react-icons/lu';
import { getTokenToCall } from '@/api/deviceCall';
import DeviceConfigurationModal from '@/Components/Modal';
import { initiateCall } from '@/utils/makeDeviceCall';
import { getRoomInfo } from '@/api/deviceConfiguration';
import { RiWifiOffLine } from 'react-icons/ri';

export default function RoomMapBox({ data = {}, elderlyId }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const getRoomInformation = useCallback(() => {
    setLoading(true);
    getRoomInfo({ room_id: data?.device_no, elderly_id: elderlyId })
      .then((roomInfo) => {
        setRoomInfo(roomInfo.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  }, [data?.device_no, elderlyId]);

  useEffect(() => {
    getRoomInformation();
  }, [getRoomInformation]);
  // Get token and make the call
  function handleClick(id) {
    if (id) {
      initiateCall(id);
    }
  }

  // // Request a new token if necessary and make the call
  // function getToken(id) {
  //   getTokenToCall()
  //     .then((token) => {
  //       const accessToken = token?.data?.token;

  //       makeACall(id, accessToken);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching token:", error);
  //     });
  // }

  // function makeACall(uid, accessToken) {
  //   openPopup(uid, accessToken);
  // }

  // // Open a popup with the specified URL and query parameters
  // function openPopup(uid, accessToken) {
  //   const data = {
  //     uid: uid,
  //     token: accessToken,
  //     // freshToken: refreshToken,
  //     lang: "en_US",
  //   };

  //   const popupUrl = `https://console.elderlycareplatform.com/metting?${new URLSearchParams(
  //     data
  //   ).toString()}`;

  //   // Window features for customization
  //   const windowFeatures =
  //     "width=500,height=600,scrollbars=no,resizable=no,location=no,toolbar=no,status=no,menubar=no";

  //   // Open the window with the custom features
  //   const popup = window.open(popupUrl, "Device Calling", windowFeatures);

  //   if (popup) {
  //     popup.focus(); // Focus on the new popup window
  //   } else {
  //     console.error("Popup window could not be opened");
  //   }
  // }
  return (
    <div className='flex flex-col gap-2 h-full mt-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h2 className='text-[20px] font-medium'>{data?.name}</h2>
          <CurrentPeoples data={data} />
        </div>
        <div className='flex items-center gap-3'>
          <Button icon={<IoMdCall />} onClick={() => handleClick(data?.device_no)}>
            {' '}
            Call
          </Button>
          <Button icon={<LuSettings />} onClick={() => setVisible(true)}>
            {' '}
            Settings
          </Button>
        </div>
      </div>
      <Spin spinning={loading} className='relative'>
        {data?.is_device_bind == false && (
          <div className='w-full h-full absolute bg-slate-400/20 top-0 z-10 backdrop-blur-sm flex items-center justify-center rounded-2xl'>
            <RiWifiOffLine size={40} color='red' />
          </div>
        )}
        <div className='flex items-center justify-center gap-4 h-full w-full border border-gray-200 rounded-2xl overflow-hidden relative z-1'>
          {data?.mount_type === 2 && <Room2 roomInfo={roomInfo} />}
          {data?.mount_type === 1 && <Room1 roomInfo={roomInfo} />}
        </div>
      </Spin>
      <DeviceConfigurationModal
        isvisible={visible}
        setVisible={setVisible}
        elderly_id={elderlyId}
        device_id={data?.device_no}
        room_id={data?._id}
      />
    </div>
  );
}
