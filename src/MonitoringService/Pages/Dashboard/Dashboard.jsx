import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AlertTable from '@/MonitoringService/Components/AlertTable';
import { Button } from '@/MonitoringService/Components/ui/button';
import useMediaQuery from '@/MonitoringService/hooks/useMediaQuery';
import { alerts } from './data';
import { DashboardHeading } from '@/MonitoringService/Components/DashboardHeading';
import CardUI from '@/MonitoringService/Components/common/card';
import { ActiveAlerts } from '@/MonitoringService/Components/ActiveAlerts';
import CircularGauge from '@/MonitoringService/Components/CircleGauge';
import { PerformanceScore } from '@/MonitoringService/Components/PerformanceScore';
import { ArrowBigDown, ArrowBigRight } from 'lucide-react';
import { PiArrowBendRightUpBold } from 'react-icons/pi';
import { AvgResponseTime } from '@/MonitoringService/Components/AvgResponseTime';
import { PieChart, Pie, Cell } from 'recharts';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/MonitoringService/Components/ui/select';
import { PieChartComponent } from '@/MonitoringService/Components/ui/pie';
import { AlertOverview } from '@/MonitoringService/Components/AlertOverview';
import MapView from '@/MonitoringService/Components/MapView';
import AlertDetails from '@/MonitoringService/Components/AlertDetails';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import { useAlerts, usePerformace } from '@/MonitoringService/hooks/useAlert';
import { useAlertStore } from '@/MonitoringService/store/useAlertStore';
import dayjs from 'dayjs';
import { useNotification } from '@/Context/useNotification';
import { useUserStore } from '@/MonitoringService/store/useUserStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setTotalAlert, setSelectedAlert, selectedAlert } = useAlertStore();
  const [user, serUser] = useState(null);
  const { getUser } = useUserStore();
  const token = localStorage.getItem('token');

  useEffect(() => {
    serUser(getUser);
  }, [token]);
  const selectedId = id ? id : null;
  const {
    data: performanceScore,
    isLoading: isPerformLoading,
    isSuccess,
  } = usePerformace({
    to_date: '2000-10-30',
    from_date: dayjs().format('YYYY-MM-DD'),
  });
  const {
    data: alertsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useAlerts({ event: '2,5', is_online: '1', is_resolved: false });
  const alerts = alertsData?.pages.flatMap((page) => page.data) || [];
  const cords = alerts?.map((item) => {
    return {
      event: item?.event,
      alert_id: item?._id,
      latitude: item?.latitude,
      longitude: item?.longitude,
    };
  });
  useEffect(() => {
    setTotalAlert(alertsData?.pages?.[0]?.total);
  }, [alertsData]);
  const isSmallScreen = useMediaQuery('(max-width: 1200px)');
  const isPhone = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    if (selectedId && alertsData?.pages[0]?.data?.length > 0) {
      const selectedAlert = alertsData?.pages[0]?.data?.filter((item) => item?._id == selectedId);
      if (selectedAlert?.length) {
        setSelectedAlert(selectedAlert[0]);
      }
    }
  }, [selectedId]);
  return (
    <div className='h-full w-full '>
      <div className='flex flex-col lg:flex-row gap-4 h-full transition-all duration-300 '>
        <div
          id='left_side'
          className={`transition-all duration-300 scrollbar-thin lg:overflow-y-auto overflow-y-visible lg:h-full pb-10 ${
            selectedId
              ? isSmallScreen
                ? 'hidden'
                : 'lg:w-[30%]'
              : `w-full ${user?.role == 'monitoring_agency' ? 'lg:w-[100%]' : 'lg:w-[70%]'}`
          }`}
        >
          <div
            id='heading'
            className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:gap-6  pt-4 pb-2'
          >
            {!selectedId && <DashboardHeading />}
            <ActiveAlerts className={!selectedId ? '' : '!w-full'} />
          </div>

          <div className='max-h-[60vh] overflow-y-auto lg:max-h-none lg:overflow-visible lg:border-none rounded-xl'>
            <AlertTable
              alerts={alerts}
              selectedId={selectedId}
              loading={isLoading}
              refetch={() => refetch()}
            />

            {hasNextPage && (
              <div className='flex justify-center mt-4'>
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant='outline'
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>

          {!selectedId && user?.role !== 'monitoring_agency' && (
            <div
              id='right_side_mobile'
              className={`grid gap-4 mt-6 lg:hidden h-fit pb-10 sm:pb-0 ${
                isPhone ? 'grid-cols-1' : 'grid-cols-2'
              }`}
            >
              <PerformanceScore data={performanceScore?.data} loading={isPerformLoading} />
              {/* <AvgResponseTime
                data={performanceScore?.data}
                loading={isPerformLoading}
              /> */}
              <AlertOverview />
              <MapView data={{ location: cords }} loading={isPerformLoading} />
            </div>
          )}
        </div>

        {(user?.role !== 'monitoring_agency' || selectedId) && (
          <div className='relative hidden lg:block w-[1.5px] h-full bg-gradient-to-b from-text/5 via-text/60 to-text/0 '>
            {selectedId && (
              <Button
                className=' rounded-xl absolute top-0 -right-3 hover:bg-text/20'
                size='icon'
                variant='outline'
                onClick={() => navigate('/ms/dashboard')}
              >
                <MdOutlineKeyboardDoubleArrowRight />
              </Button>
            )}
          </div>
        )}

        {!selectedId && user?.role !== 'monitoring_agency' && (
          <div
            id='right_side_desktop'
            className='hidden lg:block overflow-y-auto scrollbar-thin w-[30%] space-y-3 pb-6'
          >
            <PerformanceScore data={performanceScore?.data} loading={isPerformLoading} />
            {/* <AvgResponseTime
              data={performanceScore?.data}
              loading={isPerformLoading}
            /> */}
            <AlertOverview />
            <MapView data={{ location: cords }} loading={isPerformLoading} />
          </div>
        )}

        {selectedId && (
          <div
            id='alert_details'
            className={`transition-all duration-300 overflow-y-auto scrollbar-thin ${
              isSmallScreen ? 'w-full' : 'w-[70%]'
            }`}
          >
            <AlertDetails alerts={alerts} selectedId={selectedId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
