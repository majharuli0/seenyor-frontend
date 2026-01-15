import React, { useCallback, useContext, useEffect, useState } from 'react';
import CurrentActivityOverview from '../Supportnursing/components/CurrentActivityOverview';
import { WebSocketProvider } from '@/Context/WebSoketHook';
import {
  getaAlarmsState,
  getAllUIDs,
  getResponseTimeAnalysis,
  getShiftSummary,
} from '@/api/elderly';
import { AlarmLogsTable } from '@/Components/AlarmLogsTable';
import { Card, Col, ConfigProvider, DatePicker, Row, Skeleton, Statistic, Tooltip } from 'antd';
import AlertsOverview from '../Supportnursing/Dashboards/Components/AlertsOverview/alertsOverview';
import AlertsTails from '@/Components/AlarmsState';
import dayjs from 'dayjs';
import { formatMilliseconds } from '@/utils/helper';
import { FaPersonFalling } from 'react-icons/fa6';
import { RiWifiOffLine } from 'react-icons/ri';
import AlertsOverviewBar from '../Supportnursing/Dashboards/Components/AlertsOverview/alertsOverviewBar';
import VisitLogsTable from '../Supportnursing/components/VisitLogs';
import { CustomContext } from '@/Context/UseCustomContext';
import { SidebarContext } from '@/Context/CustomContext';
const { RangePicker, DatePicker: SingleDatePicker } = DatePicker;
export default function Analytics() {
  const [allDevicesList, setAllDevicesList] = useState('');
  const [alarmsCounts, setAlarmsCounts] = useState(null);
  const [toDate, setToDate] = useState('');
  const [query, setQuery] = useState(null);
  const [page, setPage] = React.useState(1);
  const [fromDate, setFromDate] = useState('');
  const ROOM_LIST_CACHE_KEY = 'roomListCache';
  const ALL_UIDS_CACHE_KEY = 'allUIDsCache';
  const { totalResident, setTotalResident, notVisitRoomCount, setNotVisitRoomCount } =
    useContext(SidebarContext);
  const [deviceUIDs, setDeviceUIDs] = useState('');
  useEffect(() => {
    const roomCache = localStorage.getItem(ROOM_LIST_CACHE_KEY);
    if (roomCache) {
      const parsed = JSON.parse(roomCache);
      setTotalResident(parsed.totalResident || 0);
      setNotVisitRoomCount(parsed.notVisitRoomCount || 0);
    }

    const uidsCache = localStorage.getItem(ALL_UIDS_CACHE_KEY);
    if (uidsCache) {
      const parsed = JSON.parse(uidsCache);
      setDeviceUIDs(parsed.data || '');
    }
  }, []);
  function handleDatePicker(value, dateStr) {
    setPage(1);
    setToDate(dateStr[0]);
    setFromDate(dateStr[1]);
  }
  function handleOnclick(q) {
    setPage(1);
    setQuery(q);
  }
  return (
    <div className='w-full bg-slate-100 h-[calc(100svh-100px)] flex flex-col items-start font-poppins relative'>
      <WebSocketProvider deviceId={deviceUIDs}>
        <CustomContext.Provider
          value={{
            totalResident,
            notVisitRoomCount,
          }}
        >
          <div className='p-[20px] px-0 w-full flex lg:flex-nowrap flex-wrap gap-2 lg:gap-8 bg-gradient-to-b from-[#F4F4F4] via-[#F4F4F4]/70 to-[#F4F4F4]/10 z-50'>
            <div className='lg:w-[60%] w-[100%]'>
              <CurrentActivityOverview disableOnClikc={true} />
            </div>
            <div className='lg:w-[40%] w-[100%]'>
              <AlertsTails disableOnClikc={true} />
            </div>
          </div>
        </CustomContext.Provider>
      </WebSocketProvider>

      <div className='w-full flex flex-col gap-6'>
        <div className='flex gap-6 w-full h-[320px]'>
          <div className='w-[60%] flex gap-6'>
            <div className='w-full'>
              <ResponseTimeAnalytics />
            </div>
            <div className='w-full'>
              <PastShiftSummary />
            </div>
          </div>
          <div className='w-[40%]'>
            <div className='bg-white w-full  rounded-[12px] p-6 h-full overflow-hidden'>
              <AlertsOverviewBar />
            </div>
          </div>
        </div>
        <div className='flex gap-6 w-full'>
          <div className='bg-white !w-[67%] p-6 rounded-[12px] h-fit overflow-hidden'>
            <div className='pb-6 flex justify-between'>
              <div className='text-[22px] font-semibold'>Alarm Logs</div>
              <ConfigProvider theme={{ token: { colorPrimary: '#64748b' } }}>
                <RangePicker
                  key='range'
                  showTime={false}
                  style={{ width: '250px', borderRadius: '10px' }}
                  size='large'
                  placeholder={['Start Date', 'End Date']}
                  format='YYYY-MM-DD'
                  onChange={(value, dateString) => {
                    handleDatePicker(value, dateString);
                  }}
                  allowClear={true}
                />
              </ConfigProvider>
            </div>
            <div
              className='pb-6 w-full grid gap-3 
                grid-cols-2
                sm:grid-cols-2
                md:grid-cols-2
                lg:grid-cols-3
                lg2:grid-cols-5
                '
            >
              <AlarmLogsCard
                value={
                  alarmsCounts?.fall_total +
                    alarmsCounts?.device_offline_total +
                    alarmsCounts?.off_bed_total || 0
                }
                color={'#2463EB'}
                title={'Total Alarms'}
                onClick={() => {
                  // handleOnclick(null);
                }}
                // clickable={true}
              />
              {/* <AlarmLogsCard
                value={alarmsCounts?.fall_total || 0}
                color={"#F4631E"}
                title={"Critical Alarms"}
                onClick={() => {
                  // handleOnclick([
                  //   { event: "2" },
                  //   { event: "5", is_online: "1" },
                  // ]);
                }}
                // clickable={true}
              /> */}
              <AlarmLogsCard
                value={alarmsCounts?.fall_total || 0}
                color={'#FC4A4A'}
                title={'Fall Alarms'}
                onClick={() => {
                  // handleOnclick([{ event: "2" }]);
                }}
                // clickable={true}
              />
              <AlarmLogsCard
                value={alarmsCounts?.device_offline_total || 0}
                color={'#F4631E'}
                title={'Device Offline'}
                onClick={() => {
                  // handleOnclick([{ event: "5", is_online: "1" }]);
                }}
                // clickable={true}
              />
              <AlarmLogsCard
                value={alarmsCounts?.off_bed_total || 0}
                color={'#9333EA'}
                title={'Wandering'}
                onClick={() => {
                  // handleOnclick([{ event: "9", alarm_type: "1" }]);
                }}
                // clickable={true}
              />
              <AlarmLogsCard
                value={'2m 32s'}
                // value={formatMilliseconds(alarmsCounts?.fall || 0)}
                color={'#34CECE'}
                title={'Response Rate'}
              />
            </div>

            <AlarmLogsTable
              toDate={toDate}
              fromDate={fromDate}
              page={page}
              setPage={setPage}
              query={query}
              setAlarmsCounts={setAlarmsCounts}
            />
          </div>
          <div className=' w-[32%]'>
            <VisitLogsTable />
          </div>
        </div>
      </div>
    </div>
  );
}

const PastShiftSummary = () => {
  const [shiftSummary, setShiftSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getShiftSummary()
      .then((res) => {
        setShiftSummary(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className='rounded-[12px]  bg-white p-6 border border-[#E2E8F0] h-full'>
      <h2 className='text-[18px] font-bold '>Previous Night Check-up </h2>
      <div className='flex flex-col justify-between text-sm mt-5 gap-2'>
        <div className='flex justify-between items-center bg-gray-50 rounded-x[8px] px-4 py-5 mb-3'>
          <span className='text-[#64748B] font-medium'>Falls</span>
          {loading ? (
            <Skeleton.Button
              active={true}
              size={'small'}
              shape={'default'}
              className='h-[20px] overflow-hidden '
            />
          ) : (
            <span className='text-[#515151] font-bold text-[16px]'>
              {shiftSummary?.fallCount || 0} Incidents
            </span>
          )}
        </div>
        <div className='flex justify-between items-center bg-gray-50 rounded-x[8px] px-4 py-5 mb-3'>
          <span className='text-[#64748B] font-medium'>Avg. Response Time</span>
          {loading ? (
            <Skeleton.Button
              active={true}
              size={'small'}
              shape={'default'}
              className='h-[20px] overflow-hidden '
            />
          ) : (
            <span className='text-[#515151] font-bold text-[16px]'>
              {/* {formatMilliseconds(shiftSummary?.avgResTime || 0)} */}
              3m 45s
            </span>
          )}
        </div>
        <div className='flex justify-between items-center bg-gray-50 rounded-x[8px] px-4 py-5 mb-3'>
          <span className='text-[#64748B] font-medium'>Night Wanderings</span>
          {loading ? (
            <Skeleton.Button
              active={true}
              size={'small'}
              shape={'default'}
              className='h-[20px] overflow-hidden '
            />
          ) : (
            <span className='text-[#515151] font-bold text-[16px]'>
              {shiftSummary?.wandering || 0} Events
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ResponseTimeAnalytics = () => {
  const [responseTimeAnalysis, setResponseTimeAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getResponseTimeAnalysis({
      to_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      from_date: dayjs()?.format('YYYY-MM-DD'),
    })
      .then((res) => {
        setResponseTimeAnalysis(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className='rounded-[12px]  bg-white p-6 h-full border border-[#E2E8F0]'>
      <h2 className='text-[18px] font-bold '>Response Time Analytics</h2>
      <div className='flex flex-col justify-between text-sm mt-5 gap-2'>
        <div className='flex justify-between items-center bg-gray-50 rounded-[8px] px-4 py-5 mb-3'>
          <span className='text-[#64748B] font-medium'>This Week Average</span>
          {loading ? (
            <Skeleton.Button
              active={true}
              size={'small'}
              shape={'default'}
              className='h-[20px] overflow-hidden '
            />
          ) : (
            <span className='text-[#10B981] font-bold text-[16px]'>
              {/* {formatMilliseconds(responseTimeAnalysis?.fall_avg_res_time || 0)} */}
              6m 2s
            </span>
          )}

          {/* <div className="flex items-center gap-2">
          <Tooltip
            title="Avg. Fall Alarm Response Time"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <FaPersonFalling className="mt-1.5 text-red-500" />
              <div className="text-[16px]  text-nowrap font-medium text-color-primary  mt-1.5 leading-none">
                {formatMilliseconds(
                  responseTimeAnalysis?.fall_avg_res_time || 0
                )}
              </div>
            </div>
          </Tooltip>
          {/* <hr className="w-4 h-[3px] bg-slate-100 mt-2" />
          <Tooltip
            title="Avg. Device Offline Alarm Response Time"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <RiWifiOffLine className="mt-1.5 text-red-500" />
              <div className="text-[16px]  text-nowrap font-medium text-color-primary  mt-1.5 leading-none">
                {formatMilliseconds(
                  responseTimeAnalysis?.offline_avg_res_time || 0
                )}
              </div>
            </div>
          </Tooltip>
        </div> */}
        </div>

        <div className='flex justify-between items-center bg-gray-50 rounded-[8px] px-4 py-5 mb-3'>
          <span className='text-[#64748B] font-medium'>Day Shift</span>
          {loading ? (
            <Skeleton.Button
              active={true}
              size={'small'}
              shape={'default'}
              className='h-[20px] overflow-hidden '
            />
          ) : (
            <span className='text-[#3B82F6] font-bold text-[16px]'>
              {' '}
              {/* {formatMilliseconds(
                responseTimeAnalysis?.fall_day_shift_avg_time || 0
              )} */}
              3m 44s
            </span>
          )}
          {/* <div className="flex items-center gap-2">
          <Tooltip
            title="Avg. Fall Alarm Response Time"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <FaPersonFalling className="mt-1.5 text-red-500" />
              <div className="text-[16px]  text-nowrap font-medium text-color-primary  mt-1.5 leading-none">
                {formatMilliseconds(
                  responseTimeAnalysis?.fall_day_shift_avg_time || 0
                )}
              </div>
            </div>
          </Tooltip>
          {/* <hr className="w-4 h-[3px] bg-slate-100 mt-2" />
          <Tooltip
            title="Avg. Device Offline Alarm Response Time"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <RiWifiOffLine className="mt-1.5 text-red-500" />
              <div className="text-[16px]  text-nowrap font-medium text-color-primary  mt-1.5 leading-none">
                {formatMilliseconds(
                  responseTimeAnalysis?.offline_day_shift_avg_time || 0
                )}
              </div>
            </div>
          </Tooltip>
        </div> */}

          {/* </Tooltip>  */}
        </div>

        <div className='flex justify-between items-center bg-gray-50 rounded-[8px] px-4 py-5 mb-3'>
          <span className='text-[#64748B] font-medium'>Night Shift</span>
          {loading ? (
            <Skeleton.Button
              active={true}
              size={'small'}
              shape={'default'}
              className='h-[20px] overflow-hidden '
            />
          ) : (
            <span className='text-[#F59E0B] font-bold text-[16px]'>
              {' '}
              {/* {formatMilliseconds(
                responseTimeAnalysis?.fall_night_shift_avg_time || 0
              )} */}
              2m 20s
            </span>
          )}
          {/* <div className="flex items-center gap-2">
          <Tooltip
            title="Avg. Fall Alarm Response Time"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <FaPersonFalling className="mt-1.5 text-red-500" />
              <div className="text-[16px]  text-nowrap font-medium text-color-primary  mt-1.5 leading-none">
                {formatMilliseconds(
                  responseTimeAnalysis?.fall_night_shift_avg_time || 0
                )}
              </div>
            </div>
          </Tooltip>
          {/* <hr className="w-4 h-[3px] bg-slate-100 mt-2" />
          <Tooltip
            title="Avg. Device Offline Alarm Response Time"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <RiWifiOffLine className="mt-1.5 text-red-500" />
              <div className="text-[16px]  text-nowrap font-medium text-color-primary  mt-1.5 leading-none">
                {formatMilliseconds(
                  responseTimeAnalysis?.offline_night_shift_avg_time || 0
                )}
              </div>
            </div>
          </Tooltip>
        </div> */}
        </div>
      </div>
    </div>
  );
};

const AlarmLogsCard = ({ value = 0, color, title, onClick, clickable = false }) => {
  return (
    <div
      className=' p-4 py-2 rounded-[4px]  flex flex-col items-center justify-center gap-0  w-full'
      style={{
        backgroundColor: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
          color.slice(3, 5),
          16
        )}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`,
        cursor: clickable ? 'pointer' : 'auto',
      }}
      onClick={onClick}
    >
      <h2 className='text-[20px] font-semibold' style={{ color: color }}>
        {value}
      </h2>
      <p className='text-[14px] font-medium text-center' style={{ color: color }}>
        {title}
      </p>
    </div>
  );
};
