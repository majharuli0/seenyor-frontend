import React, { useContext, useEffect, useState } from 'react';
import { CustomContext } from '@/Context/UseCustomContext';
import SkeletonTile from '@/Components/Skeleton/SkeletonTile';
import { FaLungs, FaHeartbeat } from 'react-icons/fa';
import { IoBarcodeOutline } from 'react-icons/io5';
import { Tooltip } from 'antd';
import { Eye, Info } from 'lucide-react';

export default function HealthOverviewTails() {
  const { sleepData, sleepDataLoading } = useContext(CustomContext);

  return (
    <div className='flex justify-between gap-6 w-full'>
      {sleepDataLoading ? (
        <>
          <SkeletonTile />
          <SkeletonTile />
          <SkeletonTile />
        </>
      ) : (
        <>
          <HeartRateComponent heartRate={sleepData?.heart_rate_vo?.avg} />
          <BreathingRateComponent breathingRate={sleepData?.breath_rate_vo?.avg || '--'} />
          <EventSummary eventData={sleepData?.alarm_events} />
        </>
      )}
    </div>
  );
}

export const HeartRateComponent = ({ heartRate }) => {
  const getHeartRateZone = (rate) => {
    if (rate < 50) {
      return {
        zone: 'Low',
        color: 'text-red-500',
        tooltip: 'Heart rate is abnormally low (bradycardia). Consult a doctor if persistent.',
        dotColor: 'bg-red-400',
        dotPing: 'bg-red-500',
        showDot: true,
      };
    } else if (rate >= 50 && rate <= 65) {
      return {
        zone: 'Normal',
        color: 'text-text-primary',
        tooltip: 'This heart rate is within the normal range. Keep up the good work!',
        showDot: false,
      };
    } else if (rate > 65 && rate <= 85) {
      return {
        zone: 'Elevated',
        color: 'text-yellow-500',
        tooltip: 'Heart rate is slightly elevated. Consider monitoring and reducing stress.',
        dotColor: 'bg-yellow-400',
        dotPing: 'bg-yellow-500',
        showDot: true,
      };
    } else {
      return {
        zone: 'High',
        color: 'text-red-500',
        tooltip: 'Heart rate is high. Consult a doctor if this persists.',
        dotColor: 'bg-red-400',
        dotPing: 'bg-red-500',
        showDot: true,
      };
    }
  };

  const { zone, color, tooltip, showDot, dotColor, dotPing } = getHeartRateZone(heartRate);

  return (
    <div
      id='avgHeartRate'
      className='flex justify-between gap-1 items-center bg-white rounded-2xl p-6 w-full'
    >
      <div className='flex gap-3 items-center'>
        <div id='icon' className='p-3 bg-[#D76C82]/10 rounded-md'>
          <FaHeartbeat className='text-[#D76C82] text-[24px]' />
        </div>
        <div className='flex flex-col gap-0'>
          <div className='text-base font-bold text-primary/80'>Average</div>
          <div className='text-2xl font-bold text-primary'>Pulse Rhythm</div>
        </div>
      </div>
      <div className='text-4xl font-bold text-primary'>
        {heartRate ? heartRate : '--'} <span className='text-[17px]'>/bpm</span>
      </div>
    </div>
  );
};

export const BreathingRateComponent = ({ breathingRate }) => {
  const getBreathingRateZone = (rate) => {
    if (rate < 12) {
      return {
        zone: 'Low',
        color: 'text-blue-500',
        tooltip: 'Breathing rate is abnormally low (Bradypnea). Consult a doctor if persistent.',
        dotColor: 'bg-blue-400',
        dotPing: 'bg-blue-500',
        showDot: true,
      };
    } else if (rate >= 12 && rate <= 20) {
      return {
        zone: 'Normal',
        color: 'text-primary',
        tooltip: 'This breathing rate is within the normal range. Keep up the good work!',
        showDot: false,
      };
    } else if (rate > 20 && rate <= 25) {
      return {
        zone: 'Elevated',
        color: 'text-yellow-500',
        tooltip:
          'Breathing rate is slightly elevated. Consider monitoring for signs of stress or infection.',
        dotColor: 'bg-yellow-400',
        dotPing: 'bg-yellow-500',
        showDot: true,
      };
    } else {
      return {
        zone: 'High',
        color: 'text-red-500',
        tooltip: 'Breathing rate is high (Tachypnea). Immediate medical attention is advised.',
        dotColor: 'bg-red-400',
        dotPing: 'bg-red-500',
        showDot: true,
      };
    }
  };

  const { zone, color, tooltip, showDot, dotColor, dotPing } = getBreathingRateZone(breathingRate);

  return (
    <div
      id='avgBreathingRate'
      className='flex justify-between gap-1 items-center bg-white rounded-2xl p-6 w-full'
    >
      <div className='flex gap-3 items-center'>
        <div id='icon' className='p-3 bg-[#FFA54D]/10 rounded-md'>
          <FaLungs className='text-[#FFA54D] text-[24px]' />
        </div>
        <div className='flex flex-col gap-0'>
          <div className='text-base font-bold text-primary/80'>Average</div>
          <div className='text-2xl font-bold text-primary'>Breathing Rhythm</div>
        </div>
      </div>
      <div className='text-4xl font-bold text-primary'>
        {breathingRate ? breathingRate : '--'} <span className='text-[17px]'>/bpm</span>
      </div>
    </div>
  );
};

const eventTypes = {
  11: { name: 'Fast Breathing', category: 'Warning', priority: 2 },
  12: { name: 'Slow Breathing', category: 'Warning', priority: 2 },
  13: { name: 'Breathing Pauses', category: 'Normal', priority: 3 },
  14: { name: 'Elevated Activity Rhythm', category: 'Critical', priority: 1 },
  15: { name: 'Relaxed Activity Rhythm', category: 'Critical', priority: 1 },
};

export const EventSummary = ({ eventData = [] }) => {
  const eventCounts = eventData.reduce((acc, event) => {
    // Only count events that have a valid event_type
    if (event?.event_type !== undefined && event?.event_type !== null) {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    }
    return acc;
  }, {});

  console.log(eventCounts);

  const totalEvents = Object?.values(eventCounts || [])?.reduce((sum, count) => sum + count, 0);

  const calculateZone = () => {
    if (!eventTypes || !eventCounts) {
      return 'Unknown';
    }

    let abnormalCount = 0;
    let criticalCount = 0;
    let warningCount = 0;

    Object.entries(eventTypes).forEach(([eventType, { priority }]) => {
      const count = eventCounts[eventType] || 0;
      if (priority === 1) {
        criticalCount += count;
      } else if (priority === 2) {
        warningCount += count;
      } else if (priority === 3) {
        abnormalCount += count;
      }
    });

    if (criticalCount >= 5) {
      return 'Critical';
    } else if (abnormalCount >= 16) {
      return 'Abnormal';
    } else if (warningCount >= 25) {
      return 'Warning';
    } else {
      return 'Normal';
    }
  };

  const zone = calculateZone();

  return (
    <div
      id='healthEvents'
      className='flex justify-between gap-1 items-center bg-white rounded-2xl p-6 w-full'
    >
      <div className='flex gap-3 items-center'>
        <div id='icon' className='p-3 bg-[#772ADF]/10 rounded-md'>
          <IoBarcodeOutline className='text-[#772ADF] text-[24px]' />
        </div>
        <div className='flex flex-col gap-0'>
          <div className='text-base font-bold text-primary/80'>Total</div>
          <div className='text-2xl font-bold text-primary'>Wellness Events</div>
        </div>
      </div>
      <Tooltip
        title={
          <>
            {Object.entries(eventCounts).map(([eventType, count]) => (
              <div key={eventType}>
                {eventTypes[eventType]?.name || eventType}: {count}
              </div>
            ))}
          </>
        }
        className='flex items-center'
      >
        <div className='text-4xl font-bold text-primary cursor-pointer'>
          {eventData?.length > 0 ? totalEvents : '--'}
          {eventData?.length > 0 ? 'x' : ''}
          <Info size='16px' className='ml-1' />
        </div>
      </Tooltip>
    </div>
  );
};
