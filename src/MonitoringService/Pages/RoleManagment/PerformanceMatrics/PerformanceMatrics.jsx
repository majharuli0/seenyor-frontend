import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ArrowRight, CalendarIcon, Edit2, InfoIcon, MailCheck, Phone } from 'lucide-react';
import BreadcrumbUI from '@/MonitoringService/Components/common/breadcrumb';
import CardUI from '@/MonitoringService/Components/common/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/MonitoringService/Components/ui/avatar';
import { Button } from '@/MonitoringService/Components/ui/button';
import { Calendar } from '@/MonitoringService/Components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/MonitoringService/Components/ui/popover';
import AnalyticsReportPdf from '@/MonitoringService/Components/PDFTemplate/AnalyticsReportPdf';
import { LuCircleFadingArrowUp } from 'react-icons/lu';
import { FaRegChessQueen, FaRegClock } from 'react-icons/fa6';
import { PiWarningCircleBold } from 'react-icons/pi';
import useMediaQuery from '@/MonitoringService/hooks/useMediaQuery';
import { PieChartComponent } from '@/MonitoringService/Components/ui/pie';
import { MultibarBarChart } from '@/MonitoringService/Components/ui/multibar';
import { Scatter } from '@/MonitoringService/Components/ui/scatter';
import {
  useAgentCountStatistics,
  useAgentPerformance,
  useSLAReport,
  useTrueFalseAlertsCount,
} from '@/MonitoringService/hooks/useAnalytics';
import { AgentPerformanceLineChart } from '@/MonitoringService/Components/ui/multi-line-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/MonitoringService/Components/ui/tooltip';
import { formatMilliseconds } from '@/utils/helper';
import MatricsReportPdf from '@/MonitoringService/Components/PDFTemplate/MatricsReportPdf';
import config from '../../../conf.json';
import { formatSLAData } from '@/MonitoringService/Utiles/agentMetrics';
import { useWhiteLabeling } from '@/MonitoringService/hooks/useWhiteLabeling';

export default function PerformanceMatrics() {
  const { appName, logoUrl, logoDarkUrl } = useWhiteLabeling().branding;

  const [range, setRange] = React.useState({
    from: null,
    to: null,
  });
  const [pdfProps, setPdfProps] = useState({});
  const isSmallScreen = useMediaQuery('(max-width: 1366px)');
  const [agentData, setAgentData] = useState([]);
  const [sla, setSLA] = useState(0);

  //====> Agent Total Alert Count True/False <====//
  const {
    data: totalAlertCount,
    isLoading: isAlertLoading,
    isError: isAlertError,
    isSuccess: isAlertSuccess,
    error: alertError,
  } = useTrueFalseAlertsCount({
    to_date: range.from || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    from_date: range.to || dayjs().format('YYYY-MM-DD'),
  });
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
    // const transformedData = [
    //   {
    //     _id: "68fa20d3455a9fa33b334eed",
    //     avgResTime: 939795.6666666666,
    //     minResTime: 76105,
    //     maxResTime: 2644299,
    //     countLessThan2Min: 2,
    //     countGreaterThan2Min: 1,
    //     closed_by: "Maj Agent",
    //     closed_by_role: "monitoring_agent",
    //   },
    // ]?.map((item) => {
    const transformedData = agentPerformance?.data?.map((item) => {
      const total = (item.countLessThan2Min ?? 0) + (item.countGreaterThan2Min ?? 0);
      const slaCompliance = total > 0 ? ((item.countLessThan2Min ?? 0) / total) * 100 : 0;

      let responseRate;
      const avgResponseTimeSeconds = item.avgResTime / 1000;

      if (avgResponseTimeSeconds <= 30) {
        responseRate = 95 + Math.random() * 5;
      } else if (avgResponseTimeSeconds <= 60) {
        responseRate = 85 + Math.random() * 10;
      } else if (avgResponseTimeSeconds <= 120) {
        responseRate = 75 + Math.random() * 10;
      } else if (avgResponseTimeSeconds <= 300) {
        responseRate = 60 + Math.random() * 15;
      } else {
        responseRate = 40 + Math.random() * 20;
      }

      return {
        agent_name: item.closed_by,
        response_rate: Math.round(responseRate),
        sla_compliance: Math.round(slaCompliance),
      };
    });
    setAgentData(transformedData || []);
  }, [agentPerformance, isAgentSuccess]);
  //====> Count Statistics <====//
  const {
    data: countStatistics,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useAgentCountStatistics({
    to_date: range.from || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    from_date: range.to || dayjs().format('YYYY-MM-DD'),
  });
  useEffect(() => {
    const total =
      (countStatistics?.data.count_less_sla ?? 0) + (countStatistics?.data.count_more_sla ?? 0);
    const p = total > 0 ? ((countStatistics?.data.count_less_sla ?? 0) / total) * 100 : 0;
    setSLA(p);
  }, [countStatistics, isSuccess]);

  useEffect(() => {
    const basicInfo = {
      companyName: appName,
      startDate: range.from || dayjs().format('YYYY-MM-DD'),
      endDate: range.to || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      totalAlerts:
        countStatistics?.data?.total_true || 0 + countStatistics?.data?.total_false || 0 || 0,
      avgResponseTime: formatMilliseconds(countStatistics?.data?.avg_res_time || 0),
      slaCompliance: sla + '%',
      falseAlerts: countStatistics?.data?.total_false || 0,
    };
    const alertsCountByagent = totalAlertCount?.data?.map((item) => {
      return {
        name: item?.agent_name || ' ',
        true_count: item?.total_false,
        false_count: item?.total_true,
      };
    });

    const agentPerformanceWithSLA = agentData?.map((item) => {
      return {
        agent_name: item.agent_name,
        response_rate: item.response_rate + '%',
        sla_compliance: item.sla_compliance + '%',
      };
    });

    const slaData = formatSLAData(SLAReport?.data || []);
    setPdfProps({
      basicInfo,
      agentResolvingAlerts: alertsCountByagent,
      agentPerformanceWithSLA,
      slaCompliance: slaData,
    });
  }, [
    range.to,
    range.form,
    totalAlertCount,
    agentData,
    isAgentSuccess,
    SLAReport,
    countStatistics,
    sla,
  ]);
  return (
    <div className='mb-6'>
      <div
        id='customer_heading'
        className='flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-6'
      >
        <Navigation />

        <div className='flex gap-2 items-center w-full sm:w-auto'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='tertiary'
                className='w-full sm:w-auto flex justify-between items-center'
              >
                <CalendarIcon className='mr-2' />
                {range?.from && range?.to ? (
                  `${range.from} - ${range.to}`
                ) : (
                  <div className='flex items-center gap-2 text-sm'>
                    <span>Start Date</span>
                    <ArrowRight className='w-4 h-4' />
                    <span>End Date</span>
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='overflow-hidden p-0 !w-[300px] sm:w-auto' align='end'>
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
          <MatricsReportPdf pdfProps={pdfProps} />
        </div>
      </div>
      <div className='space-y-4'>
        <div className=' items-center justify-between grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-fr'>
          <TailsCard
            label='Total Alerts Handled'
            value={countStatistics?.data?.total_true + countStatistics?.data?.total_false || 0}
            icon={<PiWarningCircleBold size={20} color='white' />}
          />
          {/* <TailsCard
            label="Avg. Response Time"
            value={formatMilliseconds(countStatistics?.data?.avg_res_time || 0)}
            icon={<FaRegClock size={20} color="white" />}
          /> */}
          <TailsCard
            label='SLA Compliance'
            value={sla.toFixed(2) + '%'}
            icon={<FaRegChessQueen size={20} color='white' />}
          />
          <TailsCard
            label='False Alerts'
            value={countStatistics?.data?.total_false || 0}
            icon={<LuCircleFadingArrowUp size={20} color='white' className='rotate-180' />}
          />
        </div>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-5'>
          <div className='col-span-1 lg:col-span-2 w-full h-fit'>
            <CardUI
              title={<h1 className='text-lg'>Agent Alert Summary</h1>}
              headerPadding='p-4 !text-lg border-none'
            >
              <MultibarBarChart
                data={totalAlertCount?.data || []}
                centerLabel=' '
                width='100%'
                height={isSmallScreen ? '600px' : '900px'}
              />
            </CardUI>
          </div>

          <div className='flex flex-col gap-4 col-span-1 lg:col-span-3'>
            <CardUI
              title={
                <h1 className='text-lg flex gap-2 items-center'>
                  Agent Performance{' '}
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className='opacity-60 hover:opacity-100' size={20} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <PerformanceMetricsI />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h1>
              }
              headerPadding='p-4 !text-lg border-none'
            >
              <div className='pb-4'>
                <AgentPerformanceLineChart width='100%' height={400} data={agentData} />
              </div>
            </CardUI>

            <CardUI
              title={<h1 className='text-lg'>SLA Compliance Report</h1>}
              headerPadding='p-4 !text-lg border-none'
            >
              <div className='pb-4'>
                <Scatter width='100%' height={400} data={SLAReport?.data} />
              </div>
            </CardUI>
          </div>
        </div>
      </div>
    </div>
  );
}
const Navigation = () => {
  return (
    <>
      <div className='flex flex-col items-start gap-2 w-full'>
        <h1 className='text-text sm:text-xl text-lg'>Role Managment</h1>
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
export const PerformanceMetricsI = () => {
  return (
    <div className='max-w-xs p-3 text-sm'>
      <div className='space-y-2 text-text/70 text-xs'>
        <div>
          <span className='font-medium text-[#7086FD]'>Response Rate:</span>
          <div className='mt-1 text-text/60'>
            Based on avg response time: ≤30s(95-100%), ≤1min(85-95%), ≤2min(75-85%), ≤5min(60-75%),
            &gt;5min(40-60%)
          </div>
        </div>
        <div>
          <span className='font-medium text-[#6FD195]'>SLA Compliance:</span>
          <div className='mt-1 text-text/60'>% of alerts within SLA threshold (2min)</div>
        </div>
      </div>
    </div>
  );
};
