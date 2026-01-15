import React, { useContext, useEffect, useRef } from 'react';
import ActiveAlertsCards from './Components/ActiveAlertsCards';
import ElderlyProfile from './Components/ElderlyProfile';
import ElderlyActivityGraph from './Components/ElderlyActivityGraph';
import RecentlyClosedAlerts from './Components/RecentlyClosedAlerts';
import RoomMap from './Components/RoomMap';
import LiveHeartAndBreathRate from './Components/LiveHeartAndBreathRate';
import TodayRoutine from './Components/TodayRoutine';
import { CustomContext } from '@/Context/UseCustomContext';
import { useRefContext } from '@/Context/RefContext';

export default function OverviewTab() {
  const { elderlyDetails } = useContext(CustomContext);
  const { registerRef } = useRefContext();

  const stepsRef = {
    step2: useRef(null),
    step3: useRef(null),
    step6: useRef(null),
    step7: useRef(null),
    step9: useRef(null),
  };

  // In OverviewTab.jsx
  useEffect(() => {
    Object.entries(stepsRef).forEach(([key, ref]) => {
      if (ref.current) {
        registerRef('tab_overview_${key}', ref);
      }
    });
  }, [registerRef]);
  return (
    <>
      <div className='flex flex-col gap-2 mt-4 w-full'>
        <ActiveAlertsCards elderlyId={elderlyDetails?._id} />
        <div className='flex gap-6 w-full'>
          <div id='ElderlyActivities' className='w-[67%] flex flex-col gap-6 '>
            <div ref={stepsRef.step2}>
              <TodayRoutine />
            </div>
            <div ref={stepsRef.step3}>
              <LiveHeartAndBreathRate />
            </div>

            <div ref={stepsRef.step6}>
              <ElderlyActivityGraph />
            </div>
            <div ref={stepsRef.step7}>
              <RoomMap />
            </div>
            {/* <div ref={stepsRef.step9}>
              <RecentlyClosedAlerts />
            </div> */}
          </div>
          <div id='elderlyProfile' className='w-[45%] md:w-[33%] lg:w-[33%]'>
            <ElderlyProfile />
          </div>
        </div>
      </div>
    </>
  );
}
