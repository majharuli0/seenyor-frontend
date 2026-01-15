import React, { useEffect, useCallback, useState, useRef } from 'react';
import './style.css';
import Room1 from '@/Components/RoomMap/RoomMap3';
import Room2 from '@/Components/RoomMap/RoomMap4';

import {
  transformDateAndTime,
  transformDateAndTimeToDuration,
  getAlertInfoViaEvent,
  decodePosition,
} from '@/utils/helper';
import AutoUpdatingDuration from '@/Components/AutoUpdatingDuration/AutoUpdatingDuration';
import { WebSocketProvider } from '@/Context/WebSoketHook';

import { useNavigate } from 'react-router-dom';
import { subscribeToMqtt, unsubscribeFromMqtt } from '@/api/deviceReports';
import useWebSocket from '@/hook/useWebSoket';
export default function RoomAndDetails({ data: roomData = {} }) {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const previousDeviceRef = useRef(null);
  const heartBreathRateRef = useRef(false);
  const [heartBreathRateActive, setHeartBreathRateActive] = useState(false);
  const timeoutRef = useRef;
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'Info':
        return 'bg-blue-500';
      case 'Critical':
        return 'bg-red-500';
      case 'Warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  // useEffect(() => {
  //   const deviceCode = roomData?.rooms?.device_no;
  //   if (deviceCode) {
  //     if (
  //       previousDeviceRef.current &&
  //       previousDeviceRef.current !== deviceCode
  //     ) {
  //       unsubscribeFromMqtt({
  //         uid: previousDeviceRef.current,
  //         messageType: ["1", "2", "3", "4"],
  //       })
  //         .then(() => {})
  //         .catch((err) => console.error(`Error unsubscribing: ${err}`));
  //     }

  //     // Subscribe to the new device
  //     subscribeToMqtt({
  //       uid: deviceCode,
  //       messageType: ["1", "2", "3", "4"],
  //       topics: {
  //         pub: [deviceCode],
  //       },
  //     })
  //       .then(() => {})
  //       .catch((err) => console.error(`Error subscribing: ${err}`));

  //     // Update the reference to the current device
  //     previousDeviceRef.current = deviceCode;
  //   }

  //   // Cleanup function for unmount or page exit
  //   return () => {
  //     if (previousDeviceRef.current) {
  //       unsubscribeFromMqtt({
  //         uid: previousDeviceRef.current,
  //         messageType: ["1", "2", "3", "4"],
  //       })
  //         .then(() => {})
  //         .catch((err) =>
  //           console.error(`Error during cleanup unsubscribe: ${err}`)
  //         );
  //     }
  //   };
  // }, [roomData]);

  // function handleDecode(code) {
  //   const data = decodePosition(code);
  //   const modifiedPeopleData = [...data];

  //   if (
  //     modifiedPeopleData[0]?.postureIndex === 4 &&
  //     heartBreathRateRef.current
  //   ) {
  //     // Modify the first person (index 0) posture
  //     modifiedPeopleData[0].postureIndex = 6;
  //     modifiedPeopleData[0].posture = "Resident on Bed";
  //     modifiedPeopleData[0].color = "#252F67";
  //   }

  //   setPosition(modifiedPeopleData);
  // }
  // function handleHeartBreathUpdate() {
  //   setHeartBreathRateActive(true);
  //   heartBreathRateRef.current = true;

  //   clearTimeout(timeoutRef.current); // Clear any existing timeout
  //   timeoutRef.current = setTimeout(() => {
  //     setHeartBreathRateActive(false);
  //     heartBreathRateRef.current = false;
  //   }, 5000);
  // }
  // useWebSocket({
  //   onMessage: (data) => {
  //     const payload = JSON.parse(data?.message)?.payload;
  //     if (
  //       payload?.deviceCode === roomData?.rooms?.device_no &&
  //       (payload?.position || payload?.heartbreath)
  //     ) {
  //       if (payload?.position) {
  //         handleDecode(payload.position);
  //       }
  //       if (payload?.heartbreath) {
  //         handleHeartBreathUpdate();
  //       }
  //     }
  //   },
  //   dependencies: [roomData],
  // });
  return (
    <div className='w-full flex flex-col gap-4 p-4 pr-0 h-full pt-0'>
      <div
        id='roomAlertHeader'
        className={`alert-header !h-[75px] flex justify-between items-center relative px-4 overflow-hidden rounded-lg ${getBackgroundColor(
          getAlertInfoViaEvent(roomData)?.label
        )}`}
      >
        <div className='loader'></div>
        <div className='text-container flex flex-col gap-0 h-full justify-center text-white'>
          <p className='text-sm text-gray-100 m-0 font-medium'>{roomData.room_name}</p>
          <h2 className='text-lg font-bold m-0 leading-none '>
            {getAlertInfoViaEvent(roomData)?.title}
          </h2>
        </div>
        <span
          onClick={() => {
            navigate(`/supporter/elderlies/elderly-profile/${roomData?.elderly_id}`);
          }}
          className='text-sm text-gray-100 cursor-pointer p-3 py-2 bg-white/0 rounded-lg hover:bg-white/10 transition-all duration-300'
        >
          View Elderly
        </span>
      </div>
      <div>
        <div className='flex flex-col gap-0 border-b border-gray-200 pb-2 '>
          <h2 className='text-lg font-bold m-0 leading-none'>{roomData.elderly_name}</h2>
          <p className='text-sm text-gray-500 m-0'>{roomData.address}</p>
        </div>
        <div></div>
      </div>

      <div id='roomMapAndDetails' className='flex gap-4 h-full overflow-hidden'>
        <WebSocketProvider deviceId={roomData?.rooms?.device_no}>
          <div className='map-container w-full border overflow-hidden h-full flex items-center justify-center'>
            {roomData?.rooms?.mount_type === 1 && roomData?.rooms?.is_device_bind && (
              <Room1 roomInfo={roomData?.rooms} />
            )}
            {roomData?.rooms?.mount_type === 2 && roomData?.rooms?.is_device_bind && (
              <Room2 roomInfo={roomData?.rooms} />
            )}
            {!roomData?.rooms?.is_device_bind && (
              <span className='w-full h-full flex items-center justify-center'>
                <p> No Device Data Available</p>
              </span>
            )}
          </div>
        </WebSocketProvider>
        {/* <div className="details-container w-1/3 ">
          <div className="flex flex-col gap-0 p-3">
            <h2 className="text-xl font-bold m-0 leading-none">
              {transformDateAndTime(roomData.created_at)}
            </h2>
            <p className="text-sm text-gray-500 m-0 font-medium">
              Time of Incident
            </p>
          </div>
          <div className="flex flex-col gap-0 p-3">
            <h2 className="text-xl font-bold m-0 leading-none">
              <AutoUpdatingDuration date={roomData.created_at} />
            </h2>
            <p className="text-sm text-gray-500 m-0 font-medium">Alert Life</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
