import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { LuHeartPulse } from 'react-icons/lu';
import { RiLungsLine } from 'react-icons/ri';
import LiveRateChart from './LiveRateChart';
import { decodeHeartBreath } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';
import { WebSocketContext } from '@/Context/WebSoketHook';
import { IoMdInformationCircle } from 'react-icons/io';
import { Tooltip } from 'antd';
export default function LiveHeartAndBreathRate() {
  const { elderlyDetails } = useContext(CustomContext);
  // const deviceCode = elderlyDetails?.deviceId;
  const { deviceData } = useContext(WebSocketContext);
  const deviceCodes = elderlyDetails?.deviceId
    ? elderlyDetails.deviceId.split(',').map((code) => code.trim())
    : [];
  const [data, setData] = useState({
    time: [],
    heartRate: [],
    breathRate: [],
  });

  const [liveRateData, setLiveRateData] = useState(null);
  const lastBase64Ref = useRef(null);
  const lastUpdateRef = useRef(Date.now());

  const handleDecode = useCallback((base64Input) => {
    if (lastBase64Ref.current === base64Input) {
      return;
    }
    lastBase64Ref.current = base64Input;
    const decoded = decodeHeartBreath(base64Input);
    setLiveRateData(decoded);
    lastUpdateRef.current = Date.now();

    const newTime = new Date().toLocaleTimeString();

    setData((prevData) => {
      let updatedTime = [...prevData.time];
      let updatedHeart = [...prevData.heartRate];
      let updatedBreath = [...prevData.breathRate];

      if (updatedHeart.length === 0) {
        const fakeHeart = Math.max(0, decoded.heartRateValue + (Math.random() < 0.5 ? 0 : 0));
        updatedTime.push('');
        updatedHeart.push(fakeHeart);
      }

      if (updatedBreath.length === 0) {
        const fakeBreath = Math.max(0, decoded.breathingValue + (Math.random() < 0.5 ? 0 : 0));
        if (updatedTime.length === 0) updatedTime.push('');
        updatedBreath.push(fakeBreath);
      }

      updatedTime.push(newTime);
      updatedHeart.push(decoded.heartRateValue);
      updatedBreath.push(decoded.breathingValue);

      return {
        time: updatedTime.slice(-30),
        heartRate: updatedHeart.slice(-30),
        breathRate: updatedBreath.slice(-30),
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastUpdateRef.current > 5000) {
        setData({ time: [], heartRate: [], breathRate: [] });
        setLiveRateData(null);
        lastBase64Ref.current = null;
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!deviceCodes.length) {
      setLiveRateData(null);
      return;
    }

    for (const code of deviceCodes) {
      if (!deviceData[code]) continue;
      const { heartBreath } = deviceData[code];
      if (heartBreath) {
        handleDecode(heartBreath);
        return;
      }
    }

    setLiveRateData(null);
  }, [deviceData]);

  return (
    <div className='w-full flex gap-4'>
      <div className='w-full flex flex-col bg-[#6e77eb] pb-0 gap-4 justify-between rounded-xl pt-2'>
        <div className='flex items-center justify-between px-4 text-white'>
          <p className='text-base font-medium flex items-center gap-2'>
            <LuHeartPulse size={20} /> Current Heart Activity{' '}
            <Tooltip title='This feature functions only if the user is in the monitoring bed.'>
              <IoMdInformationCircle />
            </Tooltip>
          </p>
          <h1 className='text-2xl font-bold'>
            {liveRateData?.heartRateValue ?? '--'}{' '}
            <span className='text-sm text-white/70 font-normal'>/BPM</span>
          </h1>
        </div>
        <LiveRateChart data={data} name='Heart Rate' />
      </div>
      <div className='w-full flex flex-col bg-[#32c1c1] pb-0 gap-4 justify-between rounded-xl pt-2'>
        <div className='flex items-center justify-between px-4 text-white'>
          <p className='text-base font-medium flex items-center gap-2'>
            <RiLungsLine size={20} /> Current Breathing Pattern{' '}
            <Tooltip title='This feature functions only if the user is in the monitoring bed.'>
              <IoMdInformationCircle />
            </Tooltip>
          </p>
          <h1 className='text-2xl font-bold'>
            {liveRateData?.breathingValue ?? '--'}{' '}
            <span className='text-sm text-white/70 font-normal'>/BPM</span>
          </h1>
        </div>
        <LiveRateChart data={data} name='Breath Rate' />
      </div>
    </div>
  );
}
