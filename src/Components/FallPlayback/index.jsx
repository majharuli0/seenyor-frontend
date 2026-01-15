import { Modal, Button, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { elderlyFallPlayback, fallPlayback } from '../../api/deviceReports';
import { getRoomInfo } from '../../api/deviceConfiguration';
import Room1 from '../RoomMap/RoomMap3';
import Room2 from '../RoomMap/RoomMap4';
import { countryCodeToTimzone } from '@/utils/helper';
import { useDeviceStore } from '@/MonitoringService/store/useDeviceStore';

export default function FallPlayback({ isvisible, setVisible, data }) {
  const onClose = () => {
    setVisible(false);
  };
  const user = JSON.parse(localStorage.getItem('user'));
  const [roomInfo, setRoomInfo] = useState({});
  const [playbackArray, setPlaybackArray] = useState([]);
  const [rawPlaybackData, setRawPlaybackData] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const getDeviceByUID = useDeviceStore((state) => state.getDeviceByUID);

  const postureColorMap = {
    1: '#34CECE',
    2: '#FFCB33',
    3: '#91B4FF',
    4: '#A7E2FE',
    5: '#FC4A4A',
    6: '#252F67',
  };

  const transformPlayback = (data) => {
    return data?.map((frame, idx) => {
      return frame.map((entry) => ({
        id: idx,
        targetId: entry.groupStr,
        coordinates: { x: entry.xaxis, y: entry.yaxis },
        color:
          postureColorMap[data?.length - 2 === idx && entry.posture == '2' ? 5 : entry.posture],
        postureIndex: data?.length - 2 === idx && entry.posture == '2' ? 5 : entry.posture,
      }));
    });
  };
  const timezone = countryCodeToTimzone[user?.contact_code];
  function formatToAlarmTime(createdAt, timeZone = 'Asia/Dhaka') {
    const date = new Date(createdAt);

    // minus one second if you want
    date.setSeconds(date.getSeconds() - 1);

    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone,
    });
  }

  const device = getDeviceByUID(data?.uid);

  const fetchPlayback = () => {
    setLoading(true);
    getRoomInfo({
      elderly_id: data?.elderly_id,
      room_id: data?.uid,
    })
      .then((res) => {
        setRoomInfo(res?.data);
        // elderlyFallPlayback()
        //   .then((res) => {
        //     const rawData = res[0]?.frames;
        //     console.log(rawData);

        //     setRawPlaybackData(rawData);
        //     const transformed = transformPlayback(rawData);
        //     console.log(rawData);

        //     setPlaybackArray(transformed);
        //     setCountdown(transformed?.length);
        //   })
        //   .catch((err) => console.log(err));
        fallPlayback({
          uid: data?.uid,
          alarmTime: formatToAlarmTime(data?.created_at, device.timezone || timezone),
        })
          .then((res) => {
            const rawData = res?.data?.data;
            setRawPlaybackData(rawData);
            const transformed = transformPlayback(rawData);
            setPlaybackArray(transformed);
            setCountdown(transformed?.length);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isvisible) {
      fetchPlayback();
    }
  }, [isvisible]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleReplay = () => {
    setPlaybackArray([]);
    setCountdown(0);
    setTimeout(() => {
      const transformed = transformPlayback(rawPlaybackData);
      setPlaybackArray(transformed);
      setCountdown(transformed?.length); // Reset countdown
    }, 100);
  };

  return (
    <Modal
      open={isvisible}
      onCancel={onClose}
      footer={null}
      centered
      className='h-[70vh] !w-[60vw] bg-white !border-none overflow-hidden rounded-lg'
    >
      <div className='flex flex-col h-[70vh] w-full p-4 gap-4 overflow-hidden rounded-lg'>
        <div className='text-lg font-semibold text-center'>Fall Playback</div>

        <div className='flex-1 flex items-center justify-center rounded-2xl overflow-hidden relative border border-gray-200'>
          {/* Countdown Timer */}
          {countdown > 0 && (
            <div className='absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-base font-medium z-10'>
              {countdown}s
            </div>
          )}
          {loading && !roomInfo?.mount_type && <Spin />}
          {roomInfo?.mount_type === 2 && <Room2 roomInfo={roomInfo} playbackData={playbackArray} />}
          {roomInfo?.mount_type === 1 && <Room1 roomInfo={roomInfo} playbackData={playbackArray} />}
        </div>

        <div className='flex justify-center mt-4'>
          <Button className='' sixe='large' onClick={handleReplay} size='large'>
            Re-Play
          </Button>
        </div>
      </div>
    </Modal>
  );
}
