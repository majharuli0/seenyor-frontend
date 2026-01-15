import { getaAlarmsState } from '@/api/elderly';
import { SidebarContext } from '@/Context/CustomContext';
import { useNotification } from '@/Context/useNotification';
import { formatMilliseconds } from '@/utils/helper';
import { Skeleton, Tooltip } from 'antd';
import dayjs from 'dayjs';

import { useContext, useEffect, useState } from 'react';
import { FaPersonFalling } from 'react-icons/fa6';
import { RiWifiOffLine } from 'react-icons/ri';
import ActiveAlertsView from '../ActiveAlertsView';
export default function AlertsTails({ disableOnClikc = false }) {
  const [alarmsCounts, setAlarmsCounts] = useState(null);
  const [open, setOpen] = useState(false);
  const {
    resolvedAlarm,
    setResolvedAlarm,
    selectedEvents,
    activeAlerts,
    setActiveAlerts,
    setNotVisitedRoom,
    notVisitRoomCount,
    setSelectedEvents,
    notVisitedRoom,
  } = useContext(SidebarContext);
  const { notificationEvent } = useNotification();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getaAlarmsState({
      to_date: '2025-01-01',
      from_date: dayjs().format('YYYY-MM-DD'),
    })
      .then((res) => {
        setAlarmsCounts(res?.data || {});
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [resolvedAlarm, notificationEvent]);
  return (
    <div className='bg-[#fff] w-full h-full  flex justify-between rounded-lg !border !border-[#E5E7EB] '>
      <div
        className='flex cursor-pointer flex-col items-center gap-1 justify-center w-full p-4 rounded-md bg-red-600 text-white shadow-xl shadow-red-100 shrink'
        // onClick={() => setActiveAlerts(!activeAlerts)}
      >
        <div
          className='flex items-center flex-col gap-1  h-full rounded-md w-full justify-center '
          // style={{
          //   background: activeAlerts ? "#00000030" : "",
          // }}
          onClick={() => setOpen(true)}
        >
          {loading ? (
            <Skeleton.Button
              active={true}
              size={'small'}
              shape={'default'}
              className='h-[20px] overflow-hidden '
            />
          ) : (
            <div className='text-[24px] font-medium text-color-primary opacity-95 m-0 leading-none mt-1 '>
              {(() => {
                const fallCount = alarmsCounts?.fall?.unresolvedCount ?? 0;

                const offlineCount = Array.isArray(alarmsCounts?.device_offline)
                  ? 0
                  : (alarmsCounts?.device_offline?.unresolvedCount ?? 0);

                return fallCount + offlineCount;
              })()}
            </div>
          )}
          <div className='text-color-primary text-nowrap leading-none'>Active Alerts</div>
        </div>
      </div>
      <div className='flex items-center gap-2 w-full p-2 rounded-md shrink py-2'>
        {/* <span className="w-[8px] h-[8px] rounded-[2px] mt-1 bg-blue-500" /> */}
        <div
          className={`flex flex-col items-center  gap-1 justify-center w-full h-full rounded-md cursor-pointer ${
            disableOnClikc || (disableOnClikc && notVisitedRoom)
              ? '!cursor-default hover:bg-transparent bg-transparent'
              : ''
          } `}
          onClick={() => {
            if (!disableOnClikc) {
              setNotVisitedRoom(!notVisitedRoom);
              setSelectedEvents([]);
            }
          }}
          style={{
            background: notVisitedRoom ? '#00000010' : '',
          }}
        >
          {notVisitRoomCount >= 0 ? (
            <div className='text-[24px] font-medium text-[#2463EB] opacity-75 mt-1 leading-none'>
              {notVisitRoomCount || 0}
            </div>
          ) : (
            <Skeleton.Button
              active={true}
              size={'small'}
              shape={'default'}
              className='h-[20px] overflow-hidden '
            />
          )}

          <div className='text-color-primary text-nowrap leading-none'>Not Visited Rooms</div>
        </div>
      </div>
      <div className='flex items-center gap-1 w-full p-2 rounded-md col-span-2'>
        <div className='flex flex-col items-center gap-1 justify-center w-full'>
          <div className='flex items-center gap-2'>
            <div className='text-[24px] font-medium text-[#9333EA] opacity-75 mt-1 leading-none'>
              {loading ? (
                <Skeleton.Button
                  active={true}
                  size={'small'}
                  shape={'default'}
                  className='h-[20px] overflow-hidden '
                />
              ) : (
                <>
                  {(() => {
                    const fallResponse = alarmsCounts?.fall?.avgResTime ?? 0;

                    // const offlineResponse = Array.isArray(
                    //   alarmsCounts?.device_offline
                    // )
                    //   ? 0
                    //   : alarmsCounts?.device_offline?.avgResTime ?? 0;

                    return '2m 32s';
                    // return formatMilliseconds(fallResponse);
                  })()}
                </>
              )}
            </div>
          </div>
          <div className='text-color-primary text-nowrap leading-none'>Avg. Response Time</div>
        </div>
      </div>
      <ActiveAlertsView setOpen={setOpen} open={open} />
    </div>
  );
}
