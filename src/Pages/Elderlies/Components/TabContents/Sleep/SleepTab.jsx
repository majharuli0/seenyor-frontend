import React, { lazy, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { Cascader, ConfigProvider } from 'antd';
const { SHOW_CHILD } = Cascader;
const SleepingTimeline = lazy(() => import('./Components/SleepingTimeline'));
const SleepEvents = lazy(() => import('./Components/SleepEvents'));
const DurationStatistic = lazy(() => import('./Components/DurationStatistic'));
const DurationDistribution = lazy(() => import('./Components/DurationDistribution'));
const EfficiencyStatistic = lazy(() => import('./Components/EfficiencyStatistic'));
const DeepSleepPercentageDistribution = lazy(
  () => import('./Components/DeepSleepPercentageDistribution')
);
const DeepSleepPercentageStatistic = lazy(
  () => import('./Components/DeepSleepPercentageStatistic')
);
const EfficiencyDistribution = lazy(() => import('./Components/EfficiencyDistribution'));
const ApneaIndexStatistic = lazy(() => import('./Components/ApneaIndexStatistic'));
const ApneaIndexDistribution = lazy(() => import('./Components/ApneaIndexDistribution'));
const BedExitDurationStatistic = lazy(() => import('./Components/BedExitDurationStatistic'));
const NumberOfBedExitStatistic = lazy(() => import('./Components/NumberOfBedExitStatistic'));
const DistributionOfBedExitTimes = lazy(() => import('./Components/DistributionOfBedExitTimes'));
const TimeToFallAsleepStatistic = lazy(() => import('./Components/TimeToFallAsleepStatistic'));
const DistributionOfTimeToFallAsleep = lazy(
  () => import('./Components/DistributionOfTimeToFallAsleep')
);
const DistributionOfDailyRoutine = lazy(() => import('./Components/DistributionOfDailyRoutine'));
const DataAnalysisSlider = lazy(() => import('./Components/DataAnalysisSlider'));
const SleepScoreTails = lazy(() => import('./Components/SleepScoreTails'));
const PieChart = lazy(() => import('@/Components/GraphAndChart/PieChart'));
import { CustomContext } from '@/Context/UseCustomContext';
import { useRefContext } from '@/Context/RefContext';

function ChartWrapper({ height = 480, children, className }) {
  return (
    <div className={`h-[${height}px] ${className}`}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
export default function SleepTab() {
  const options = [
    {
      label: 'Light and Deep Sleep',
      value: 'a',
      children: [
        {
          label: 'Sleep Duration Overview',
          value: 'duration',
        },
        {
          label: 'Sleep Duration Trends',
          value: 'durationDistribution',
        },
        {
          label: 'Sleep Quality Overview',
          value: 'efficiencyStatistic',
        },
        {
          label: 'Sleep Quality Trends',
          value: 'efficiencyDistribution',
        },
        {
          label: 'Deep Sleep Proportion Overview',
          value: 'deepSleepPercentageStatistic',
        },
        {
          label: 'Deep Sleep Proportion Trends',
          value: 'deepSleepPercentageDistribution',
        },
      ],
    },
    {
      label: 'Sleep Apnea',
      value: 'b',
      children: [
        {
          label: 'Sleep Disturbances Index Statistic',
          value: 'apneaIndexStatistic',
        },
        {
          label: 'Sleep Disturbances Index Trends',
          value: 'apneaIndexDistribution',
        },
      ],
    },
    {
      label: 'Bed Exit',
      value: 'c',
      children: [
        {
          label: 'Bed Exit Duration Overview',
          value: 'numberOfBedExitStatistic',
        },
        {
          label: 'Bed Exit Frequency Overview',
          value: 'bedExitDurationStatistic',
        },
        {
          label: 'Bed Exit Time Trends',
          value: 'distributionOfBedExitTimes',
        },
      ],
    },
    {
      label: 'Daily Routine',
      value: 'd',
      children: [
        {
          label: 'Daily Routine Trends',
          value: 'distributionOfDailyRoutine',
        },
      ],
    },
    {
      label: 'Fell Asleep',
      value: 'e',
      children: [
        {
          label: 'Time to Fall Asleep Trends',
          value: 'distributionOfTimeToFallAsleep',
        },
        {
          label: 'Time to Fall Asleep Overview',
          value: 'timeToFallAsleepStatistic',
        },
      ],
    },
  ];
  const [selectedValues, setSelectedValues] = useState([]);
  const handleCascaderChange = (value) => {
    const flattenedValues = value.map((path) => path[path.length - 1]);
    console.log('Flattened selected values:', flattenedValues);
    setSelectedValues(flattenedValues);
  };
  const { registerRef } = useRefContext();

  const { sleepData, sleepDataLoading } = useContext(CustomContext);
  const isSelected = (value) => {
    // Show all charts if no specific selections are made
    if (selectedValues.length === 0) return true;
    const result = selectedValues.includes(value);
    return result;
  };
  const stepsRef = {
    step1: useRef(null),
    step2: useRef(null),
    step3: useRef(null),
    step4: useRef(null),
  };

  useEffect(() => {
    Object.keys(stepsRef).forEach((key) => {
      if (stepsRef[key].current) {
        registerRef('tab_sleep_' + key, stepsRef[key]);
      }
    });
  }, [registerRef, stepsRef]);
  return (
    <div className='flex flex-col gap-6 mt-6 h-full'>
      <div id='sleepOverview' className='flex gap-6 flex-col md:flex-row lg:flex-row h-full'>
        <div id='sleepscoreGraph' ref={stepsRef.step1} className='w-full md:w-[33%]'>
          {sleepDataLoading ? (
            <SkeletonSleepScoreGraph />
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <div className='w-full h-full bg-white rounded-lg p-5 flex flex-col gap-0'>
                <h1 className='text-primary text-2xl font-bold leading-none'>Sleep Duration</h1>
                <PieChart
                  sleepData={sleepData?.sleep_index_common_list}
                  sleepScore={sleepData?.score}
                />
              </div>
            </Suspense>
          )}
        </div>
        <div
          id='dataanalysisSleepTails'
          className='w-full md:w-[67%] flex flex-col gap-6 !h-full justify-between'
        >
          <div ref={stepsRef.step2} className='h-full'>
            <SleepEvents />
          </div>
          {/* <SleepScoreTails /> */}
          {/* <div id="dataAnalysis" className="h-full">
             <DataAnalysisSlider /> 
          </div> */}
        </div>
      </div>
      <div ref={stepsRef.step3}>
        <ChartWrapper className={'!h-[auto]'}>
          <SleepingTimeline />
        </ChartWrapper>
      </div>
      {/* <div ref={stepsRef.step3}>
        <ChartWrapper height={"auto"}>
          <SleepEvents />
        </ChartWrapper>
      </div> */}
      <div
        ref={stepsRef.step4}
        className='flex justify-between items-center gap-6 mt-3 bg-[#7F87FC] rounded-lg p-5 '
      >
        <h1 className='text-white text-2xl font-bold leading-none'>Reports Analysis</h1>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Baloo2',
              colorPrimary: '#8086AC',
              colorLinkActive: '#8086AC',
              colorLinkHover: '#8086AC',
              colorLink: '#8086AC',
            },
          }}
        >
          <Cascader
            style={{
              width: '300px',
            }}
            options={options}
            placeholder='Select Specific Analysis'
            multiple
            maxTagCount='responsive'
            size='large'
            showCheckedStrategy={SHOW_CHILD}
            onChange={handleCascaderChange}
            defaultValue={selectedValues}
          />
        </ConfigProvider>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
        {isSelected('duration') && (
          <ChartWrapper>
            <DurationStatistic />
          </ChartWrapper>
        )}
        {isSelected('durationDistribution') && (
          <ChartWrapper>
            <DurationDistribution />
          </ChartWrapper>
        )}
        {isSelected('efficiencyStatistic') && (
          <ChartWrapper>
            <EfficiencyStatistic />
          </ChartWrapper>
        )}
        {isSelected('efficiencyDistribution') && (
          <ChartWrapper>
            <EfficiencyDistribution />
          </ChartWrapper>
        )}
        {/* Bed Exit graphs moved here - higher priority */}
        {isSelected('bedExitDurationStatistic') && (
          <ChartWrapper>
            <BedExitDurationStatistic />
          </ChartWrapper>
        )}
        {isSelected('numberOfBedExitStatistic') && (
          <ChartWrapper>
            <NumberOfBedExitStatistic />
          </ChartWrapper>
        )}
        {isSelected('deepSleepPercentageStatistic') && (
          <ChartWrapper>
            <DeepSleepPercentageStatistic />
          </ChartWrapper>
        )}
        {isSelected('deepSleepPercentageDistribution') && (
          <ChartWrapper>
            <DeepSleepPercentageDistribution />
          </ChartWrapper>
        )}
        {isSelected('apneaIndexStatistic') && (
          <ChartWrapper>
            <ApneaIndexStatistic />
          </ChartWrapper>
        )}
        {isSelected('apneaIndexDistribution') && (
          <ChartWrapper>
            <ApneaIndexDistribution />
          </ChartWrapper>
        )}
        {isSelected('distributionOfBedExitTimes') && (
          <ChartWrapper className='col-span-2'>
            <DistributionOfBedExitTimes />
          </ChartWrapper>
        )}
        {isSelected('distributionOfDailyRoutine') && (
          <ChartWrapper className='col-span-2'>
            <DistributionOfDailyRoutine />
          </ChartWrapper>
        )}
        {isSelected('timeToFallAsleepStatistic') && (
          <ChartWrapper>
            <TimeToFallAsleepStatistic />
          </ChartWrapper>
        )}
        {isSelected('distributionOfTimeToFallAsleep') && (
          <ChartWrapper>
            <DistributionOfTimeToFallAsleep />
          </ChartWrapper>
        )}
      </div>
    </div>
  );
}

export const SleepScoreTailsData = [
  {
    title: 'Avg. Deep Sleep',
    value: 67,
    dataType: 'percentage',
  },
  {
    title: 'Avg. Sleep Efficiency',
    value: 60,
    dataType: 'percentage',
  },
  {
    title: 'Avg. Apnea Index ',
    value: 6,
    dataType: 'index',
  },
  {
    title: 'Avg. Bed Exit Frequency',
    value: 5,
    dataType: 'index',
  },
];
const SkeletonSleepScoreGraph = () => {
  return (
    <div className='w-full h-full bg-white rounded-lg p-5 flex flex-col gap-4 skeleton-wrapper'>
      {/* Title placeholder */}
      <h1 className='text-primary text-2xl font-bold leading-none'>Sleep Score</h1>
      {/* Pie chart placeholder */}
      <div
        className='skeleton-pie'
        style={{
          width: '200px',
          height: '200px',
          backgroundColor: '#e0e0e0',
          border: '1px solid #b0b0b0',
          borderRadius: '50%',
          alignSelf: 'center',
        }}
      />
    </div>
  );
};
