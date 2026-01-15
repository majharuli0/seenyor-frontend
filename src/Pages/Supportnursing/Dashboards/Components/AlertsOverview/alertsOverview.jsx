import React, { useCallback, useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import WeeklyPicker from '@/Components/WeeklyPicker/WeeklyPicker';
import MultiLineChart from '../../Components/3xLineChart/MultiLineChart';
import { getAlertsOverviewGraph } from '@/api/elderlySupport';
import dayjs from 'dayjs';

export default function AlertsOverview() {
  const [fromDate, setFromDate] = useState(dayjs().subtract(6, 'days').format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [overviewData, setoverviewData] = useState([]);
  const getAlersOverview = useCallback(() => {
    getAlertsOverviewGraph({
      from_date: toDate,
      to_date: fromDate,
    })
      .then((res) => {
        setoverviewData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [toDate]);
  useEffect(() => {
    getAlersOverview();
  }, [getAlersOverview]);

  function handleWeeklyMonthly(e) {
    if (e) {
      setFromDate(e.start);
      setToDate(e.end);
    } else {
      setFromDate(dayjs().subtract(6, 'days').format('YYYY-MM-DD'));
      setToDate(dayjs().format('YYYY-MM-DD'));
    }
  }

  return (
    <div className='w-full h-full'>
      <div id='ChartHeader' className='w-full flex justify-between'>
        <h1 className='text-[22px] font-semibold'>Alarms Overview</h1>
        <div id='chartController' className='flex gap-4'>
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
            <WeeklyPicker
              style={{ height: 'fit-content' }}
              handleChange={(e) => handleWeeklyMonthly(e)}
            />
          </ConfigProvider>
        </div>
      </div>
      <div className='w-full h-full'>
        <MultiLineChart data={overviewData} fromDate={fromDate} toDate={toDate} />
      </div>
    </div>
  );
}
