import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import LiveRateChart from '@/Components/GraphAndChart/LiveRateChart';
import { FaHeartbeat } from 'react-icons/fa';
import { CustomContext } from '@/Context/UseCustomContext';
import { decodeHeartBreath } from '@/utils/helper';
import { Tooltip } from 'antd';
import { IoMdInformationCircle } from 'react-icons/io';
import { WebSocketContext } from '@/Context/WebSoketHook';

export default function LiveHeartRate() {
  const { elderlyDetails, sleepData } = useContext(CustomContext);
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
    lastUpdateRef.current = Date.now();

    const decoded = decodeHeartBreath(base64Input);
    setLiveRateData(decoded);

    const newTime = new Date().toLocaleTimeString();

    setData((prevData) => {
      let updatedTime = [...prevData.time];
      let updatedHeart = [...prevData.heartRate];

      if (updatedHeart.length === 0) {
        const fakeHeart = Math.max(0, decoded.heartRateValue + (Math.random() < 0.5 ? 0 : 0));
        updatedTime.push(newTime);
        updatedHeart.push(fakeHeart);
      }

      updatedTime.push(newTime);
      updatedHeart.push(decoded.heartRateValue);

      return {
        time: updatedTime.slice(-30),
        heartRate: updatedHeart.slice(-30),
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastUpdateRef.current > 5000) {
        setData({ time: [], heartRate: [] });
        setLiveRateData(null);
        lastBase64Ref.current = null;
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!deviceCodes?.length) {
      setLiveRateData(null);
      return;
    }

    // Find the first device with postureIndex: 6 and non-null heartBreath
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
    <div className='w-full bg-white rounded-2xl p-6 flex flex-col gap-6 h-auto'>
      <div className='text-2xl font-bold text-primary flex items-center gap-2'>
        Current Heart Activity{' '}
        <Tooltip
          title='This feature functions only if the user is in the monitoring bed.'
          className='cursor-pointer'
        >
          <IoMdInformationCircle size='18px' />
        </Tooltip>
      </div>
      <div id='LiveRate' className='flex flex-col gap-1 pl-3 mb-2'>
        <div
          className={`text-4xl font-bold flex items-center gap-2`}
          style={{
            color: '#D76C82',
          }}
        >
          {liveRateData?.heartRateValue ?? '--'} <span className='text-secondary/40'>BPM</span>
          <FaHeartbeat color='#D76C82' size={24} />
        </div>
      </div>
      <LiveRateChart data={data} color='#D76C82' type='heartRate' />
      <div id='footer'>
        <div className='flex justify-evenly items-center'>
          <div id='avgRate' className='flex flex-col items-center justify-center gap-0'>
            <div className='text-3xl text-primary font-bold'>
              {sleepData?.heart_rate_vo?.avg ?? '--'}
            </div>
            <div className='text-sm text-gray-500 font-semibold'>Average</div>
          </div>
          <div id='minRate' className='flex flex-col items-center justify-center gap-0'>
            <div className='text-3xl text-primary font-bold'>
              {' '}
              {sleepData?.heart_rate_vo?.min ?? '--'}
            </div>
            <div className='text-sm text-gray-500 font-semibold'>Minimum</div>
          </div>
          <div id='maxRate' className='flex flex-col items-center justify-center gap-0'>
            <div className='text-3xl text-primary font-bold'>
              {' '}
              {sleepData?.heart_rate_vo?.max ?? '--'}
            </div>
            <div className='text-sm text-gray-500 font-semibold'>Maximum</div>
          </div>
        </div>
      </div>
    </div>
  );
}
