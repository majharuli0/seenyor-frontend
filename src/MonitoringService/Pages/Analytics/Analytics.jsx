import BreadcrumbUI from '@/MonitoringService/Components/common/breadcrumb';
import CardUI from '@/MonitoringService/Components/common/card';
import AnalyticsReportPdf from '@/MonitoringService/Components/PDFTemplate/AnalyticsReportPdf';
import { AreaLineChartComponent } from '@/MonitoringService/Components/ui/area';
import { CleanBarGraph } from '@/MonitoringService/Components/ui/bar';
import { Button } from '@/MonitoringService/Components/ui/button';
import { ButtonGroup } from '@/MonitoringService/Components/ui/button-group';
import { Calendar } from '@/MonitoringService/Components/ui/calendar';
import { PieChartComponent } from '@/MonitoringService/Components/ui/pie3';
import { Popover, PopoverContent, PopoverTrigger } from '@/MonitoringService/Components/ui/popover';
import { Scatter } from '@/MonitoringService/Components/ui/scatter';
import {
  useAgentPerformance,
  useAlertTrends,
  useCountStatistics,
  useSLAReport,
  useTotalAlertCount,
} from '@/MonitoringService/hooks/useAnalytics';
import useMediaQuery from '@/MonitoringService/hooks/useMediaQuery';
import { calculateAgentMetrics, formatSLAData } from '@/MonitoringService/Utiles/agentMetrics';
import { formatMilliseconds } from '@/utils/helper';
import dayjs from 'dayjs';
import { ArrowRight, Cable, CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import { FaRegChessQueen } from 'react-icons/fa6';
import { LuCircleFadingArrowUp } from 'react-icons/lu';
import { PiWarningCircleBold } from 'react-icons/pi';
import config from '../../conf.json';
import { useWhiteLabeling } from '@/MonitoringService/hooks/useWhiteLabeling';

export default function Analytics() {
  const { appName, logoUrl, logoDarkUrl } = useWhiteLabeling().branding;

  const [range, setRange] = React.useState({
    from: null,
    to: null,
  });
  const [alertCount, setAlertCount] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [pdfProps, setPdfProps] = useState({});
  const [uptimePercentage, setUptimePercentage] = useState(0);

  const mapping = {
    2: { name: 'Fall Alerts', color: '#ef4444' },
    5: { name: 'Device Offline', color: '#f59e0b' },
  };
  //====> Count Statistics <====//
  const {
    data: countStatistics,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useCountStatistics({
    to_date: range.from || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    from_date: range.to || dayjs().format('YYYY-MM-DD'),
  });
  useEffect(() => {
    const uptime = countStatistics?.data?.device_uptime ?? 0;
    const downtime = countStatistics?.data?.device_downtime ?? 0;
    const total = uptime + downtime;
    const uptimePercentage = total > 0 ? Math.round((uptime / total) * 100) : 0;
    setUptimePercentage(uptimePercentage);
  }, [countStatistics, isSuccess]);

  //====> Total Alert Count <====//
  const {
    data: totalAlertCount,
    isLoading: isAlertLoading,
    isError: isAlertError,
    isSuccess: isAlertSuccess,
    error: alertError,
  } = useTotalAlertCount({
    to_date: range.from || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    from_date: range.to || dayjs().format('YYYY-MM-DD'),
  });
  useEffect(() => {
    const chartData =
      Array.isArray(totalAlertCount?.data) && totalAlertCount?.data?.length > 0
        ? totalAlertCount?.data?.map((item) => ({
            value: item?.count ?? 0,
            name: mapping[item?._id]?.name || 'Unknown',
            itemStyle: { color: mapping[item?._id]?.color || '#9ca3af' },
          }))
        : [
            {
              value: 0,
              name: 'No Data',
              itemStyle: { color: '#9ca3af' },
            },
          ];
    setAlertCount(chartData);
  }, [totalAlertCount, isAlertSuccess]);

  //====> Alert Trends <====//
  const {
    data: alertTrends,
    isLoading: isAlertTrendLoading,
    isError: isAlertTrendError,
    error: alertTrendError,
    isSuccess: alertTrendSuccess,
  } = useAlertTrends({
    to_date: range.from || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    from_date: range.to || dayjs().format('YYYY-MM-DD'),
  });
  //====> Agent Performance <====//
  const {
    data: agentPerformance,
    isLoading: isAgentLoading,
    isError: isAgentError,
    isSuccess: isAgentSuccess,
    error: agentError,
  } = useAgentPerformance({
    to_date: range.from || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    from_date: range.to || dayjs().format('YYYY-MM-DD'),
  });
  useEffect(() => {
    const transformedData = agentPerformance?.data?.map((item) => {
      const total = (item.countLessThan2Min ?? 0) + (item.countGreaterThan2Min ?? 0);
      const p = total > 0 ? ((item.countLessThan2Min ?? 0) / total) * 100 : 0;

      return {
        name: item.closed_by,
        score: Math.round(p),
      };
    });
    setAgentData(transformedData);
  }, [agentPerformance, isAgentSuccess]);

  //====> SLA Report <====//
  const {
    data: SLAReport,
    isLoading: isSLALoading,
    isError: isSLAError,
    isSuccess: isSLASuccess,
    error: slaError,
  } = useSLAReport({
    to_date: range.from || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    from_date: range.to || dayjs().format('YYYY-MM-DD'),
  });
  function calculateCompliancePercentage(data) {
    if (!data || data.length === 0) return 0;

    const compliantAlerts = data.filter((item) => item.sla_status).length;
    const percentage = (compliantAlerts / data.length) * 100;

    return Math.round(percentage * 100) / 100;
  }
  const isSmallScreen = useMediaQuery('(max-width: 1366px)');
  const metrics = calculateAgentMetrics(agentData);
  const formatTooltipDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  useEffect(() => {
    const basicInfo = {
      companyName: appName,
      startDate: range.from || dayjs().format('YYYY-MM-DD'),
      endDate: range.to || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      totalAlerts: totalAlertCount?.data?.reduce((a, b) => a + b.count, 0) || 0,
      avgResponseTime: formatMilliseconds(countStatistics?.data?.avg_res_time || 0),
      slaCompliance:
        (SLAReport?.data && calculateCompliancePercentage(SLAReport?.data))?.toFixed(2) || 0 + '%',
      deviceUptime: Math.round(uptimePercentage) + '%',
    };
    const FallCount = alertCount?.filter((item) => item.name == 'Fall Alerts')[0]?.value || 0;
    const DeviceOfflineCount =
      alertCount?.filter((item) => item.name == 'Device Offline')[0]?.value || 0;

    const totalAlertOverview = {
      fall: FallCount,
      offline: DeviceOfflineCount,
      total: FallCount + DeviceOfflineCount,
    };
    const dateMap = new Map();
    alertTrends?.data?.forEach((item) => {
      const date = new Date(item.year, item.month - 1, item.day);
      const dateKey = date.toISOString().split('T')[0];
      const eventType = item.event === '5' ? 'offline' : 'fall';

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          timestamp: date.getTime(),
          date: formatTooltipDate(date),
          fall: 0,
          offline: 0,
          total: 0,
        });
      }

      const dateData = dateMap.get(dateKey);
      dateData[eventType] += item.count || 0;
      dateData.total = dateData.fall + dateData.offline;
    });

    const alertTrendsSorted = Array.from(dateMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
    alertTrendsSorted.forEach((item) => {
      delete item.timestamp;
    });

    const agentDataWithPercentage = agentData?.map((item) => ({
      ...item,
      score: `${item.score}%`,
    }));
    const slaData = formatSLAData(SLAReport?.data || []);
    setPdfProps({
      basicInfo,
      totalAlertOverview,
      alertTrends: alertTrendsSorted,
      agentPerformance: agentDataWithPercentage,
      slaCompliance: slaData,
    });
  }, [range.to, range.form, totalAlertCount, alertTrends, agentData, isAgentSuccess, SLAReport]);
  return (
    <div className='mb-6'>
      {' '}
      <div
        id='customer_heading'
        className='flex justify-between sm:flex-row flex-col gap-4 items-center mb-6'
      >
        <Navigation />
        <div className='flex gap-2  items-center'>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='tertiary'>
                <CalendarIcon />
                {range?.from && range?.to ? (
                  `${range.from} - ${range.to}`
                ) : (
                  <div className='flex items-center gap-3'>
                    <span>Start Date</span> <ArrowRight /> <span>End Date</span>
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='overflow-hidden p-0' align='end'>
              <Calendar
                className='w-full border-border'
                mode='range'
                selected={range}
                onSelect={(selectedRange) => {
                  if (!selectedRange?.from || !selectedRange?.to) {
                    setRange({ from: null, to: null });
                    return;
                  }

                  setRange({
                    from: dayjs(selectedRange.from).format('YYYY-MM-DD'),
                    to: dayjs(selectedRange.to).format('YYYY-MM-DD'),
                  });
                }}
                captionLayout='dropdown'
                fixedWeeks
                showOutsideDays
              />
            </PopoverContent>
          </Popover>

          <AnalyticsReportPdf pdfProps={pdfProps} />
        </div>
      </div>
      <div className='space-y-4'>
        <div className=' items-center justify-between grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-fr'>
          <TailsCard
            label='Total Alerts'
            value={totalAlertCount?.data?.reduce((a, b) => a + b.count, 0) || 0}
            icon={<PiWarningCircleBold size={20} color='white' />}
          />
          {/* <TailsCard
            label="Avg. Response Time"
            value={formatMilliseconds(countStatistics?.data?.avg_res_time || 0)}
            icon={<FaRegClock size={20} color="white" />}
          /> */}
          <TailsCard
            label='SLA Compliance'
            value={
              ((SLAReport?.data && calculateCompliancePercentage(SLAReport?.data)) || 0) + '%' ||
              0 + '%'
            }
            icon={<FaRegChessQueen size={20} color='white' />}
          />
          <TailsCard
            label='Device Uptime'
            value={Math.round(uptimePercentage) + '%'}
            icon={<LuCircleFadingArrowUp size={20} color='white' />}
          />
        </div>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <div id='Total Alert Overview Graph'>
            <CardUI
              title={<h1 className='text-lg'>Total Alert Overview</h1>}
              headerPadding='p-4 !text-lg border-none'
            >
              <div className='p-4 !h-full flex items-center justify-center'>
                <PieChartComponent
                  data={alertCount}
                  centerLabel=' '
                  width='100%'
                  height={isSmallScreen ? 340 : 400}
                />
              </div>
            </CardUI>
          </div>
          <div id='Agent Performance Graph'>
            <CardUI
              title={<h1 className='text-lg'>Agent Performance</h1>}
              headerPadding='p-4 !text-lg border-none'
            >
              <div className='p-4'>
                <CleanBarGraph data={agentData} height={340} />
                <div className='flex flex-col sm:flex-row sm:flex-wrap items-center gap-4 justify-center mt-4'>
                  <SummaryView title='Total Agent' value={metrics.totalAgents} />
                  <SummaryView title='Avg. Performance' value={metrics.averagePerformance + '%'} />
                  <SummaryView
                    title='Highest Performance'
                    value={metrics.highestPerformance + '%'}
                  />
                  <SummaryView title='Lowest Performance' value={metrics.lowestPerformance + '%'} />
                </div>
              </div>
            </CardUI>
          </div>
          <div id='Alert Trends Graph' className='lg:col-span-2'>
            <CardUI
              title={<h1 className='text-lg'>Alert Trends</h1>}
              headerPadding='p-4 !text-lg border-none'
            >
              <div className='p-4'>
                <AreaLineChartComponent data={alertTrends?.data} />
              </div>
            </CardUI>
          </div>

          {/* <div id="SLA Compliance Report Graph">
            <CardUI
              title={<h1 className="text-lg">SLA Compliance Report</h1>}
              headerPadding="p-4 !text-lg border-none"
            >
              <Scatter width="100%" height={400} data={SLAReport?.data} />
            </CardUI>
          </div> */}
        </div>
      </div>
    </div>
  );
}
const Navigation = () => {
  return (
    <>
      <div className='flex flex-col items-start gap-2 w-full'>
        <h1 className='text-text sm:text-xl text-lg'>Reporting & Analytics</h1>
        <div className='opacity-95'>
          <BreadcrumbUI />
        </div>
      </div>
    </>
  );
};

const TailsCard = ({ label = '', value = '', icon }) => {
  return (
    <div className='bg-card p-4 flex items-center justify-between gap-3 rounded-md w-full'>
      <div>
        <span className='text-sm'>{label}</span>
        <h1 className='text-lg font-semibold'>{value}</h1>
      </div>
      <div className='p-2 bg-primary w-fit rounded-md text-lg'>{icon}</div>
    </div>
  );
};
const SummaryView = ({ title, value }) => {
  return (
    <>
      <div className='flex items-center gap-2 '>
        <div className='p-2 px-3 bg-primary rounded-lg text-white font-medium text-sm'>
          {' '}
          {value}
        </div>
        <div className='rounded-lg text-sm text-wrap'> {title}</div>
      </div>
    </>
  );
};
