import React, { lazy, Suspense, useEffect, useRef } from 'react';

const ApneaIndexStatistic = lazy(() => import('./Components/ApneaIndexStatistic'));
const ApneaIndexDistribution = lazy(() => import('./Components/ApneaIndexDistribution'));
const RespiratoryRate = lazy(() => import('./Components/RespiratoryRate'));
const HeartRate = lazy(() => import('./Components/HeartRate'));
const HeartRateAnnomalyStatistic = lazy(() => import('./Components/HeartRateAnnomalyStatistic'));
const HeartRateDistribution = lazy(() => import('./Components/HeartRateDistribution'));
const BreathRateDistribution = lazy(() => import('./Components/BreathRateDistribution'));
const BioVitalDataAnalysis = lazy(() => import('./Components/BioVitalDataAnalysis'));
const HealthEvent = lazy(() => import('./Components/HealthEvent'));
const LiveHeartRate = lazy(() => import('./Components/LiveHeartRate'));
const LiveBreathRate = lazy(() => import('./Components/LiveBreathRate'));
import HealthOverviewTails from './Components/HealthOverviewTails';
import { useRefContext } from '@/Context/RefContext';
function ChartWrapper({ children, height = '480px', width = '100%' }) {
  return (
    <div className={`w-[${width}] h-[${height}]`}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}

export default function HealthTab() {
  const { registerRef } = useRefContext();

  const stepsRef = {
    step1: useRef(null),
    step2: useRef(null),
    step3: useRef(null),
    step4: useRef(null),
    step5: useRef(null),
  };

  useEffect(() => {
    Object.keys(stepsRef).forEach((key) => {
      if (stepsRef[key].current) {
        registerRef('tab_health_' + key, stepsRef[key]);
      }
    });
  }, [registerRef]);
  return (
    <div className='flex flex-col gap-6 mt-6 w-full'>
      <div ref={stepsRef.step1}>
        <HealthOverviewTails />
      </div>
      <div className='flex gap-6 w-full' ref={stepsRef.step2}>
        <ChartWrapper height='auto'>
          <LiveHeartRate />
        </ChartWrapper>
        <ChartWrapper height='auto'>
          <LiveBreathRate />
        </ChartWrapper>
      </div>

      {/* <ChartWrapper height="auto">
        <HealthEvent />
      </ChartWrapper> */}
      <div ref={stepsRef.step3}>
        <ChartWrapper>
          <RespiratoryRate />
        </ChartWrapper>
      </div>
      <div ref={stepsRef.step4}>
        <ChartWrapper>
          <HeartRate />
        </ChartWrapper>
      </div>
      {/* <ChartWrapper>
        <BioVitalDataAnalysis />
      </ChartWrapper> */}
      {/* <div className="flex gap-6 w-full" ref={stepsRef.step5}>
        <ChartWrapper>
          <ApneaIndexStatistic />
        </ChartWrapper>
        <ChartWrapper>
          <ApneaIndexDistribution />
        </ChartWrapper>
      </div> */}
      <div className='flex gap-6 w-full'>
        {/* <ChartWrapper>
          <HeartRateAnnomalyStatistic />
        </ChartWrapper> */}
        <ChartWrapper>
          <HeartRateDistribution />
        </ChartWrapper>
        <ChartWrapper>
          <BreathRateDistribution />
        </ChartWrapper>
      </div>
      {/* <div className="flex gap-6 w-full">
        <ChartWrapper>
          <BreathRateDistribution />
        </ChartWrapper>
        <ChartWrapper></ChartWrapper>
      </div> */}
    </div>
  );
}
