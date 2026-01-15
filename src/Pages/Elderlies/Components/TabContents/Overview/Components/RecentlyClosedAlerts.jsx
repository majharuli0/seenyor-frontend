import React, { useEffect, useState, useCallback, useContext } from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
import { useAlertTableColumns } from '@/Pages/Elderlies/Utiles/utiles';
import { Button, ConfigProvider, Segmented } from 'antd';
import { MdOutlineHistory } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAlertList } from '@/api/elderlySupport';
import dayjs, { Dayjs } from 'dayjs';
import { getAlertsGroup } from '@/utils/helper';
import { CustomContext } from '@/Context/UseCustomContext';

export default function RecentlyClosedAlerts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { elderlyDetails } = useContext(CustomContext) || [];

  const recentlyClosedAlertTableColumns = useAlertTableColumns('recentlyAlerts');

  const handleViewAlertHistory = () => {
    navigate(`${location.pathname}?tab=alertHistory`, { replace: true });
  };
  const [alertHistiryQuery, setAlertHistiryQuery] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);
  const [page, SetPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const getAlartsHistory = useCallback(() => {
    setLoading(true);
    getAlertList({
      to_date: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
      from_date: dayjs().format('YYYY-MM-DD'),
      lookup: false,
      ...page,
      ...alertHistiryQuery,
      elderly_id: elderlyDetails?._id,
    })
      .then((res) => {
        setLoading(false);
        setTotal(res.total);
        setAlertHistory(res.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [page, alertHistiryQuery, elderlyDetails?._id]);
  useEffect(() => {
    getAlartsHistory();
  }, [getAlartsHistory]);
  function onAlertHistorySegmantChnage(value) {
    SetPage(1);
    setAlertHistiryQuery(getAlertsGroup(value));
  }

  return (
    <>
      <div
        id='Recently_Closed_Alerts'
        className='w-full flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6'
      >
        <div id='Recently_Closed_Alerts_Header' className='w-full flex justify-between'>
          <h1 className='text-lg font-bold'>Recent Activites</h1>
          <div>
            <ConfigProvider
              theme={{
                components: {
                  Segmented: {
                    itemSelectedBg: '#252F67',
                    itemSelectedColor: '#fff',
                    fontFamily: 'Baloo2',
                  },
                },
              }}
            >
              {/* <Segmented
                options={activeAlertSegmentOptions}
                onChange={(value) => onAlertHistorySegmantChnage(value)}
              /> */}
            </ConfigProvider>
            {/* <Button
            </ConfigProvider>
            {/* <Button
              onClick={handleViewAlertHistory}
              className=""
              size="large"
              icon={<MdOutlineHistory />}
            >
              View All History
            </Button> */}
          </div>
        </div>
        <div id='Recently_Closed_Alerts_Table' className='w-full'>
          <SidebarContext.Provider
            value={{
              total: total,
              page: 1,
              SetPage,
            }}
          >
            <CustomTable
              loading={loading}
              tableData={alertHistory}
              columns={recentlyClosedAlertTableColumns}
              pageSize={5}
              showPagination={false}
              scroll={{ x: 'fit-content' }}
            />
          </SidebarContext.Provider>
        </div>
      </div>
    </>
  );
}
export const activeAlertSegmentOptions = [
  {
    label: 'All',
    value: 'All Activity',
  },
  {
    label: 'Critical',
    value: 'Critical',
  },
  {
    label: 'Warning',
    value: 'Warning',
  },
  {
    label: 'Info',
    value: 'Info',
  },
];
