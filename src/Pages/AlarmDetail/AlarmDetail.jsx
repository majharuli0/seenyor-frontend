import { Button, ConfigProvider, Segmented } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import ActiveAlertsCards from './components/ActiveAlertsCards';
import RoomMap from '../Elderlies/Components/TabContents/Overview/Components/RoomMap';
import { getDetails } from '@/api/elderly';
import { CustomContext } from '@/Context/UseCustomContext';
import { subscribeToMqtt } from '@/api/deviceReports';
import ElderlyOverview from './components/ElderlyOverview';
import { SidebarContext } from '@/Context/CustomUsertable';
import CustomTable from '@/Shared/Table/CustomTable';
import useAlertTableColumns from '../Supportnursing/Utiles/utiles';
import { getAlertList } from '@/api/elderlySupport';
import dayjs from 'dayjs';
import { getAlertsGroup } from '@/utils/helper';
import { WebSocketProvider } from '@/Context/WebSoketHook';

export default function AlarmDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, SetPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { alertData, id } = location.state || {};
  const [alertHistory, setAlertHistory] = useState([]);
  const [alertHistoryLoading, setAlertHistoryLoading] = useState(true);
  const recentlyClosedAlertTableColumns = useAlertTableColumns('recentlyClosedAlert');
  const [alertHistiryQuery, setAlertHistiryQuery] = useState(getAlertsGroup('Critical'));
  const [uids, setUids] = useState();
  // const id = "68358cc3f87906a4b81e17d9";
  const [elderlyDetails, setElderlyDetails] = useState({});
  useEffect(() => {
    getDetails({ id: id })
      .then((res) => {
        setElderlyDetails(res.data);
        setUids(
          res?.data?.rooms?.length > 0
            ? res.data.rooms
                .filter((item) => item.device_no)
                .map((item) => item.device_no)
                .join(',')
            : ''
        );
        subscribesToMqtt({
          uids:
            res?.data?.rooms?.length > 0
              ? res.data.rooms
                  .filter((item) => item.device_no)
                  .map((item) => item.device_no)
                  .join(',')
              : '',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  const getAlartsHistory = useCallback(() => {
    setAlertHistoryLoading(true);
    getAlertList({
      to_date: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
      from_date: dayjs().format('YYYY-MM-DD'),
      is_resolved: true,
      lookup: false,
      page: page,
      ...alertHistiryQuery,
    })
      .then((res) => {
        setTotal(res.total);
        setAlertHistoryLoading(false);
        setAlertHistory(res.data);
      })
      .catch((err) => {
        setAlertHistoryLoading(false);

        console.log(err);
      });
  }, [page, alertHistiryQuery]);
  // }, [page, alertHistiryQuery]);
  useEffect(() => {
    getAlartsHistory();
  }, [getAlartsHistory]);

  function onAlertHistorySegmantChnage(value) {
    setAlertHistiryQuery(getAlertsGroup(value));
  }

  return (
    <div>
      <Button
        onClick={() => {
          navigate(-1);
        }}
        icon={<LeftOutlined />}
        className='my-4'
      >
        Back
      </Button>
      {alertData ? (
        <ActiveAlertsCards alertData={alertData} />
      ) : (
        <ActiveAlertsCards elderlyId={id} />
      )}
      <CustomContext.Provider value={{ elderlyDetails }}>
        <div className='flex gap-8 w-full mt-4'>
          <div className='w-[70%] flex flex-col gap-8'>
            <WebSocketProvider deviceId={uids}>
              <RoomMap />
            </WebSocketProvider>
            <div
              id='Recently_Closed_Alerts'
              className='flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6'
            >
              <div id='Recently_Closed_Alerts_Header' className='w-full flex justify-between'>
                <h1 className='text-[24px] font-bold'>Past Notifications</h1>
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
                    <Segmented
                      options={activeAlertSegmentOptions}
                      onChange={(value) => onAlertHistorySegmantChnage(value)}
                      defaultValue='Critical'
                    />
                  </ConfigProvider>
                </div>
              </div>
              <div id='Recently_Closed_Alerts_Table' className='w-full'>
                <SidebarContext.Provider
                  value={{
                    total: total,
                    page: 1,
                    SetPage,
                    limit: 6,
                  }}
                >
                  <CustomTable
                    loading={alertHistoryLoading}
                    pageSize={6}
                    tableData={alertHistory}
                    columns={recentlyClosedAlertTableColumns}
                  />
                </SidebarContext.Provider>
              </div>
            </div>
          </div>
          <div className='w-[35%]'>
            <ElderlyOverview elderlyDetails={elderlyDetails} />
          </div>
        </div>
      </CustomContext.Provider>
    </div>
  );
}
export const activeAlertSegmentOptions = [
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
  {
    label: 'Info',
    value: 'Info',
  },
];
