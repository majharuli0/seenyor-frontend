import React, { useState, useCallback, useEffect } from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { useElderlyTableColumns } from './Utiles/utiles';
import { elderlyListTableData } from './mock';
import { SidebarContext } from '@/Context/CustomUsertable';
import { getAlertsGroup } from '@/utils/helper';

import { Segmented, ConfigProvider, Select } from 'antd';
import SearchInput from '@/Shared/Search/SearchInput';
// import { alertHistoryColumns } from "./Utiles/utiles2";
import { getAlertList } from '@/api/elderlySupport';
import dayjs from 'dayjs';
import { useAlertHistoryColumns } from './Utiles/utiles2';
export default function AlertsList() {
  const [search, setSearch] = useState('');
  const columns = useElderlyTableColumns('support_agent');
  const alertHistoryColumns = useAlertHistoryColumns('alertHistory');
  const [loading, setLoading] = useState(true);
  const [page, SetPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [alertQuery, setAlertQuery] = useState({});
  const [alertHistory, setAlertHistory] = useState([]);
  const [alertHistiryQuery, setAlertHistiryQuery] = useState(null);

  const getAlartsHistory = useCallback(() => {
    setLoading(true);
    getAlertList({
      to_date: '2024-11-30',
      from_date: dayjs().format('YYYY-MM-DD'),
      is_resolved: true,
      lookup: false,
      ...page,
      ...alertQuery,
      ...alertHistiryQuery,
    })
      .then((res) => {
        setTotal(res.total);
        setAlertHistory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [page, alertQuery, alertHistiryQuery]);
  useEffect(() => {
    getAlartsHistory();
  }, [getAlartsHistory]);
  function handBlurchange() {
    setAlertQuery({ elderly_name: search.trim() });
  }
  function onAlertHistorySegmantChnage(value) {
    SetPage(1);
    setAlertHistiryQuery(getAlertsGroup(value));
  }
  return (
    <>
      <div
        id='Elderlies'
        className='w-full flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6 mt-8'
      >
        <div id='Elderlies_Header' className='w-full flex justify-between'>
          <h1 className='text-[24px] font-bold'>Alerts</h1>
          <div className='flex gap-4 items-center'>
            {/* <ConfigProvider
              theme={{
                token: {
                  fontFamily: "Baloo2",
                  colorPrimary: "#8086AC",
                  colorLinkActive: "#8086AC",
                  colorLinkHover: "#8086AC",
                  colorLink: "#8086AC",
                },
              }}
            >
              <Select
                size="large"
                options={elderlyListSelectOptions}
                defaultValue={elderlyListSelectOptions[0].value}
                onChange={(value) => console.log(value)}
              />
            </ConfigProvider> */}
            <div>
              <ConfigProvider
              // theme={{
              //   components: {
              //     Segmented: {
              //       itemSelectedBg: "#252F67",
              //       itemSelectedColor: "#fff",
              //       fontFamily: "Baloo2",
              //     },
              //   },
              // }}
              >
                <Segmented
                  options={alertHistorySegmentOptions}
                  onChange={(value) => onAlertHistorySegmantChnage(value)}
                  size='large'
                />
              </ConfigProvider>
            </div>
            <SearchInput
              search={search}
              setSearch={setSearch}
              handBlurchange={handBlurchange}
              placeholder='Search Elderlies'
            />
          </div>
        </div>
        <SidebarContext.Provider
          value={{
            total: total,
            page: page,
            SetPage,
          }}
        >
          <CustomTable columns={alertHistoryColumns} tableData={alertHistory} loading={loading} />
        </SidebarContext.Provider>
      </div>
    </>
  );
}
export const elderlyListSegmentOptions = [
  'All Elderlies',
  'With Alerts',
  'With Diseases',
  'With Allergies',
  'Taking Medications',
];
export const elderlyListSelectOptions = [
  { label: 'All Elderlies', value: 'All Elderlies' },
  { label: 'With Alerts', value: 'With Alerts' },
  { label: 'With Diseases', value: 'With Diseases' },
  { label: 'With Allergies', value: 'With Allergies' },
  { label: 'Taking Medications', value: 'Taking Medications' },
];
export const alertHistorySegmentOptions = [
  {
    label: 'All Alerts',
    value: 'All Alerts',
  },
  {
    label: 'Critical',
    value: 'Critical',
  },
  {
    label: 'Warning',
    value: 'Warning',
  },
  // {
  //   label: "Informational",
  //   value: "Info",
  // },
];
