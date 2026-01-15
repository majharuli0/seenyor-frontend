import { lazy, Suspense, useEffect, useRef } from 'react';
const DailyRoutineDistribution = lazy(() => import('./Components/DailyRoutineDistribution'));
import ActivityOverviewTails from './Components/ActivityOverviewTails';
import AverageRoutineTime from './Components/AverageRoutineTime';
import DataAnalysisSlider from './Components/DataAnalysisSlider';
import { useRefContext } from '@/Context/RefContext';
const BodyMovementIndexStatistic = lazy(() => import('./Components/BodyMovementIndexStatistic'));
const WalkStepsStatistic = lazy(() => import('./Components/WalkStepsStatistic'));
const DurationSpentInRoom = lazy(() => import('./Components/DurationSpentInRoom'));
const NumberOfRoomEntriesAndExit = lazy(() => import('./Components/NumberOfRoomEntriesAndExit'));
const WalkSpeedStatistic = lazy(() => import('./Components/WalkSpeedStatistic'));
const BodyMovementIndexDistribution = lazy(
  () => import('./Components/BodyMovementIndexDistribution')
);

function ChartWrapper({ height = 480, children, className }) {
  return (
    <div className={`h-[${height}px] ${className} w-full`}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
export default function ActivityTab() {
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
        registerRef('tab_activity_' + key, stepsRef[key]);
      }
    });
  }, [registerRef]);
  return (
    <div className='flex flex-col gap-6 mt-6 w-full'>
      <div ref={stepsRef.step1}>
        <ActivityOverviewTails />
      </div>
      <div className='flex gap-6 w-full h-[400px]'>
        <div className='w-[67%] h-full' ref={stepsRef.step2}>
          <Suspense fallback={<div className='h-full'>Loading...</div>}>
            <DailyRoutineDistribution />
          </Suspense>
        </div>
        <div className='w-[33%] h-full' ref={stepsRef.step3}>
          <AverageRoutineTime />
        </div>
      </div>
      {/* <DataAnalysisSlider /> */}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
        <div className='col-span-2' ref={stepsRef.step4}>
          <ChartWrapper>
            <DurationSpentInRoom />
          </ChartWrapper>
        </div>
        {/* <ChartWrapper>
          <BodyMovementIndexStatistic />
        </ChartWrapper> */}
        <ChartWrapper>
          <WalkStepsStatistic />
        </ChartWrapper>
        <ChartWrapper>
          <NumberOfRoomEntriesAndExit />
        </ChartWrapper>
        <ChartWrapper>
          <WalkSpeedStatistic />
        </ChartWrapper>
        {/* <ChartWrapper>
          <BodyMovementIndexDistribution />
        </ChartWrapper> */}
      </div>
    </div>
  );
}
