import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import LiveRateChart from '@/Components/GraphAndChart/LiveRateChart';
import { FaLungs } from 'react-icons/fa';
import { CustomContext } from '@/Context/UseCustomContext';
import { decodeHeartBreath } from '@/utils/helper';
import { Tooltip } from 'antd';
import { IoMdInformationCircle } from 'react-icons/io';
import { WebSocketContext } from '@/Context/WebSoketHook';
export default function BreathRate() {
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
      let updatedBreath = [...prevData.breathRate];

      if (updatedBreath.length === 0) {
        const fakeBreath = Math.max(0, decoded.breathingValue + (Math.random() < 0.5 ? 0 : 0));
        updatedTime.push(newTime);
        updatedBreath.push(fakeBreath);
      }

      updatedTime.push(newTime);
      updatedBreath.push(decoded.breathingValue);

      return {
        time: updatedTime.slice(-30),
        breathRate: updatedBreath.slice(-30),
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastUpdateRef.current > 5000) {
        setData({ time: [], breathRate: [] });
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
    for (const code of deviceCodes) {
      if (!deviceData[code]) continue;
      const { heartBreath } = deviceData[code];
      if (heartBreath) {
        handleDecode(heartBreath);
        return;
      }
    }

    setLiveRateData(null);
  }, [deviceCodes, deviceData]);
  return (
    <div className='w-full bg-white rounded-2xl p-6 flex flex-col gap-6 h-auto'>
      <div className='text-2xl font-bold text-primary flex items-center gap-2'>
        Current Breathing Pattern
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
            color: '#FFA54D',
          }}
        >
          {liveRateData?.breathingValue ?? '--'} <span className='text-secondary/40'>BPM</span>
          <FaLungs color='#FFA54D' size={24} />
        </div>
      </div>
      <LiveRateChart data={data} color='#FFA54D' type='breathRate' />
      <div id='footer'>
        <div className='flex justify-evenly items-center'>
          <div id='avgRate' className='flex flex-col items-center justify-center gap-0'>
            <div className='text-3xl text-primary font-bold'>
              {sleepData?.breath_rate_vo?.avg ?? '--'}
            </div>
            <div className='text-sm text-gray-500 font-semibold'>Avgerage</div>
          </div>
          <div id='minRate' className='flex flex-col items-center justify-center gap-0'>
            <div className='text-3xl text-primary font-bold'>
              {' '}
              {sleepData?.breath_rate_vo?.min ?? '--'}
            </div>
            <div className='text-sm text-gray-500 font-semibold'>Minimum</div>
          </div>
          <div id='maxRate' className='flex flex-col items-center justify-center gap-0'>
            <div className='text-3xl text-primary font-bold'>
              {' '}
              {sleepData?.breath_rate_vo?.max ?? '--'}
            </div>
            <div className='text-sm text-gray-500 font-semibold'>Maximum</div>
          </div>
        </div>
      </div>
    </div>
  );
}
