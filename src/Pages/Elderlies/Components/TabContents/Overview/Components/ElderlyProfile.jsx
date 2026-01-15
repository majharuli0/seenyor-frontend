import { useState, useEffect, useContext, useRef } from 'react';
import CreateAndEditModal from '@/Components/CreateAndEditModal/CreateAndEditModal';
import HealthConditionModal from '@/Components/HealthConditionModal/HealthConditionModal';
import LiveRateChart from './LiveRateChart';
import { LuHeartPulse } from 'react-icons/lu';
import { RiLungsLine } from 'react-icons/ri';
import { Tooltip, Button, Empty, Skeleton } from 'antd'; // Added Skeleton
import { MdEdit } from 'react-icons/md';
import EventCalender from './EventCalender';
import { GaugeComponent } from 'react-gauge-component';
import GaugeChart from './Gauge';
import { getHealthScore } from '@/api/deviceReports';
import ls from 'store2';
import { formatTimeToHoursAndMinutes, getStatus } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';
import { useRefContext } from '@/Context/RefContext';
import { FiExternalLink } from 'react-icons/fi';
import RecentlyClosedAlerts from './RecentlyClosedAlerts';

export default function ElderlyProfile() {
  const { sleepData, elderlyDetails, sleepDataLoading } = useContext(CustomContext);
  const { registerRef } = useRefContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const labelMapping = {
    合格: 'Pass',
    不合格: 'Fail',
    睡眠时长偏少: 'Sleep duration is too short',
  };
  const healthConditionMapping = {
    Allergy: 'Environmental Sensitivities',
    Disability: 'Movement Adaptations',
  };
  const [comments, setComments] = useState([]);
  const categorizeData = (data) => {
    const categorizedData = {};
    data?.forEach((item) => {
      const { category } = item;
      if (!categorizedData[category]) {
        categorizedData[category] = [];
      }
      categorizedData[category].push(item);
    });
    return categorizedData;
  };
  const stepsRef = {
    step4: useRef(null),
    step5: useRef(null),
    step8: useRef(null),
  };

  useEffect(() => {
    Object.keys(stepsRef).forEach((key) => {
      if (stepsRef[key].current) {
        registerRef('tab_overview_' + key, stepsRef[key]);
      }
    });
  }, [registerRef]);
  useEffect(() => {
    setComments(categorizeData(elderlyDetails.comments));
  }, [elderlyDetails]);

  const getInitials = (name = '') => {
    const splitName = name?.split(' ');
    return `${splitName[0]?.[0]?.toUpperCase() || ''}${splitName[1]?.[0]?.toUpperCase() || ''}`;
  };

  return (
    <>
      <div className='flex flex-col gap-5'>
        <div
          ref={stepsRef.step4}
          className='overflow-hidden relative flex flex-col gap-0 !text-text-primary rounded-2xl'
        >
          {sleepDataLoading ? (
            <div className='flex flex-col gap-4 bg-white p-6 rounded-2xl'>
              {/* Profile Header Skeleton */}
              <div className='flex items-start gap-4'>
                <Skeleton.Avatar active size={80} shape='circle' />
                <div className='flex flex-col gap-2 pt-4 w-full'>
                  <Skeleton active title={{ width: '40%' }} paragraph={false} />
                  <Skeleton active title={false} paragraph={{ rows: 1, width: '60%' }} />
                </div>
              </div>
              {/* Gauge Skeleton */}
              <div className='flex justify-center'>
                <Skeleton.Avatar active size={200} shape='circle' />
              </div>
              {/* Health Score Items Skeleton */}
              <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 mt-4'>
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className='flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl'
                    >
                      <Skeleton
                        active
                        title={false}
                        paragraph={{ rows: 2, width: ['40%', '60%'] }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div
                id='profileHeader'
                className='z-50 flex flex-col items-start justify-start gap-4 rounded-t-2xl p-6 w-full bg-white'
              >
                <div className='flex items-start gap-4 w-full'>
                  <span className='relative flex h-[80px] w-[80px]'>
                    <span
                      className={`relative rounded-full h-[80px] w-[80px] flex items-center justify-center overflow-hidden border-0 bg-[#80CAA7] font-semibold text-3xl text-white`}
                    >
                      {getInitials(elderlyDetails?.name)}
                    </span>
                    <div id='age' className='absolute -bottom-1 -right-1'>
                      <p
                        className='text-sm text-text-white/70 px-1.5 py-1.5 rounded-full font-semibold leading-none border-2 border-white/20 border-inner'
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid #E0E0E0',
                        }}
                      >
                        {elderlyDetails?.age}
                      </p>
                    </div>
                  </span>
                  <div id='elderlyNameAndAddress' className='pt-4'>
                    <h1 className='text-[24px] font-bold'>{elderlyDetails?.name}</h1>
                    <div
                      id='addresandGoogleMapButton'
                      className='flex items-center gap-2 md:flex-row flex-col'
                    >
                      {elderlyDetails.latitude && elderlyDetails.longitude ? (
                        <a className='cursor-default font-normal hover:text-text-primary transition-all duration-300 text-[17px] text-text-primary/80 flex items-center gap-2'>
                          <span>{elderlyDetails?.address}</span>
                        </a>
                      ) : (
                        <p className='font-normal hover:text-text-primary transition-all duration-300 text-[17px] text-text-primary/80 flex items-center gap-2'>
                          <span>{elderlyDetails?.address}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Health Score Gauge */}
              <div
                id='healthScoreGauge'
                className='items-center justify-center flex flex-col bg-white rounded-b-2xl'
              >
                <div className='w-[340px] relative'>
                  <GaugeChart percentage={sleepData?.score} />
                </div>
              </div>
              {/* Health Score Items */}
              <div className='w-full grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 mt-4'>
                <HealthScoreItem
                  score={sleepData?.ahi || '--'}
                  label={'Sleep Consistency Indicator'}
                  color={getStatus('ahiIndex', sleepData?.ahi || 0).color}
                  status={getStatus('ahiIndex', sleepData?.ahi || 0).title}
                />
                <HealthScoreItem
                  score={formatTimeToHoursAndMinutes(sleepData?.sleep_total_time)}
                  label={'Sleep Duration'}
                  color={getStatus('sleepScore', sleepData?.score || 0).color}
                  status={getStatus('sleepScore', sleepData?.score || 0).title}
                />
                <HealthScoreItem
                  score={sleepData?.sleep_quality ? sleepData?.sleep_quality + '%' : '--'}
                  label={'Deep Sleep (%)'}
                  color={getStatus('deepSleep', sleepData?.sleep_quality || 0).color}
                  status={getStatus('deepSleep', sleepData?.sleep_quality || 0).title}
                />
                <HealthScoreItem
                  score={sleepData?.leave_bed_count >= 0 ? sleepData?.leave_bed_count + 'x' : '--'}
                  label={'Bed-Exit After Sleep'}
                  color={
                    getStatus(
                      'outOfBed',
                      sleepData?.leave_bed_count >= 0 ? sleepData?.leave_bed_count : 0
                    ).color
                  }
                  status={
                    getStatus(
                      'outOfBed',
                      sleepData?.leave_bed_count >= 0 ? sleepData?.leave_bed_count : 0
                    ).title
                  }
                />
                <HealthScoreItem
                  score={
                    sleepData?.breath_rate_vo?.avg ? sleepData?.breath_rate_vo?.avg + ' BPM' : '--'
                  }
                  label={'Avg. Breath Rate'}
                  color={
                    getStatus(
                      'respiratoryRate',
                      sleepData?.breath_rate_vo?.avg ? sleepData?.breath_rate_vo?.avg : 0
                    ).color
                  }
                  status={
                    getStatus(
                      'respiratoryRate',
                      sleepData?.breath_rate_vo?.avg ? sleepData?.breath_rate_vo?.avg : 0
                    ).title
                  }
                />
                <HealthScoreItem
                  score={
                    sleepData?.heart_rate_vo?.avg ? sleepData?.heart_rate_vo?.avg + ' BPM' : '--'
                  }
                  label={'Avg. Heart Rate'}
                  color={
                    getStatus(
                      'heartRate',
                      sleepData?.heart_rate_vo?.avg ? sleepData?.heart_rate_vo?.avg : 0
                    ).color
                  }
                  status={
                    getStatus(
                      'heartRate',
                      sleepData?.heart_rate_vo?.avg ? sleepData?.heart_rate_vo?.avg : 0
                    ).title
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* Wellness Concerns Section */}
        <div
          ref={stepsRef.step5}
          id='elderlyDiseasesAllergies'
          className='flex flex-col gap-6 bg-white rounded-2xl p-4'
        >
          <div className='flex items-center justify-between'>
            <h1 className='text-lg font-bold text-text-primary leading-none flex items-center gap-2'>
              Wellness Concerns
            </h1>
            <Tooltip title='Edit Health Conditions'>
              <Button onClick={() => setIsModalOpen(true)} shape='circle' icon={<MdEdit />} />
            </Tooltip>
          </div>
          <div id='elderlyDiseasesAllergiesMedications' className='mt-3 flex flex-col gap-6'>
            {elderlyDetails && elderlyDetails?.diseases?.length === 0 && comments?.length === 0 && (
              <p>
                <Empty />
              </p>
            )}
            {elderlyDetails?.diseases?.length !== 0 && (
              <div id='elderlyDiseases' className='flex flex-col gap-2'>
                <p className='text-base font-semibold text-[#7E60BF] leading-none flex items-center gap-2'>
                  <div id='dot' className='w-2 h-2 bg-[#7E60BF] rounded-full'></div>
                  Conditions
                </p>
                <ul className='list-none list-inside flex flex-wrap gap-2'>
                  {elderlyDetails?.diseases?.map((disease, index) => (
                    <li
                      key={index}
                      className='text-base font-medium p-1 px-3 bg-[#F5F3FF] rounded-lg'
                    >
                      {disease}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Object.keys(comments).map((category, index) => (
              <div key={index} id='elderlyDiseases' className='flex flex-col gap-2'>
                <p
                  className={`text-base font-semibold ${
                    category === 'Sensitivity'
                      ? 'text-[#4ca6cf]'
                      : category === 'Special Needs'
                        ? 'text-[#f37f13]'
                        : 'text-[#0a0a2b]'
                  } leading-none flex items-center gap-2 mb-2`}
                >
                  <div
                    id='dot'
                    className={`w-2 h-2 ${
                      category === 'Sensitivity'
                        ? 'bg-[#4ca6cf]'
                        : category === 'Special Needs'
                          ? 'bg-[#f37f13]'
                          : 'bg-[#0a0a2b]'
                    } rounded-full`}
                  ></div>
                  {healthConditionMapping[category] ?? category}
                </p>
                <ul className='list-none list-inside flex flex-wrap gap-2'>
                  {Array.isArray(comments[category]) ? (
                    comments[category].map((comment, index) => (
                      <li
                        key={index}
                        className={`text-base font-medium p-1 px-3 ${
                          category === 'Sensitivity'
                            ? 'bg-[#4ca6cf]/10'
                            : category === 'Special Needs'
                              ? 'bg-[#f37f13]/10'
                              : 'bg-[#0a0a2b]/10'
                        } rounded-lg`}
                      >
                        {comment.comment}
                      </li>
                    ))
                  ) : (
                    <p>No Comments</p>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div ref={stepsRef.step8}>
          <RecentlyClosedAlerts />
        </div>
      </div>
      <HealthConditionModal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        mode='edit'
        diseases={elderlyDetails?.diseases}
        custom_condition={elderlyDetails?.comments}
        elderly_id={elderlyDetails?._id}
      />
    </>
  );
}

export const HealthScoreItem = ({ score, label, status, color = '#494949' }) => {
  return (
    <div
      id='score'
      className='relative flex items-center rounded-2xl p-4 gap-1 justify-center overflow-hidden bg-white'
    >
      <div
        id='lineBar'
        style={{ backgroundColor: color }}
        className={`size-4 rounded-full absolute -top-[6px] left-[50%] transform -translate-x-[50%]`}
      ></div>
      <div className='flex flex-col justify-center gap-1 items-center'>
        <div
          id='score'
          className='text-text-primary text-[20px] font-bold leading-none text-center'
        >
          {score}
        </div>
        <span className='text-text-primary/70 text-[14px] leading-none font-normal text-center'>
          {label}
        </span>
      </div>
    </div>
  );
};
