import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import CardUI from '../common/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PieChartComponent } from '../ui/pie2';
import useMediaQuery from '@/MonitoringService/hooks/useMediaQuery';
import { usePerformace } from '@/MonitoringService/hooks/useAlert';

dayjs.extend(isoWeek);

export const AlertOverview = () => {
  const [selectedRange, setSelectedRange] = useState('This Week');

  const { from_date, to_date } = useMemo(() => {
    const today = dayjs();

    switch (selectedRange) {
      case 'Today':
        return {
          from_date: today.format('YYYY-MM-DD'),
          to_date: today.format('YYYY-MM-DD'),
        };

      case 'This Month':
        return {
          from_date: today.startOf('month').format('YYYY-MM-DD'),
          to_date: today.endOf('month').format('YYYY-MM-DD'),
        };

      case 'This Week':
      default:
        return {
          from_date: today.startOf('isoWeek').format('YYYY-MM-DD'),
          to_date: today.endOf('isoWeek').format('YYYY-MM-DD'),
        };
    }
  }, [selectedRange]);

  const { data, isLoading, isSuccess } = usePerformace({
    from_date: to_date,
    to_date: from_date,
  });
  const { chartData, summary } = useMemo(() => {
    if (!data) {
      return {
        chartData: [],
        summary: { resolved: 0, fall: 0, offline: 0 },
      };
    }

    const eventMap = {
      '2': { name: 'Fall Alerts', color: '#ef4444' },
      '5': { name: 'Device Offline', color: '#f59e0b' },
    };

    const chart = [
      {
        value: data?.data?.total_resolved || 0,
        name: 'Resolved Alerts',
        itemStyle: { color: '#10b981' },
      },
    ];

    const summary = {
      resolved: data?.data?.total_resolved || 0,
      fall: 0,
      offline: 0,
    };

    data?.data?.count_by_events?.forEach((item) => {
      const mapped = eventMap[item._id];
      if (mapped) {
        chart.push({
          value: item.count,
          name: mapped.name,
          itemStyle: { color: mapped.color },
        });

        if (item._id === '2') summary.fall = item.count;
        if (item._id === '5') summary.offline = item.count;
      }
    });

    return { chartData: chart, summary };
  }, [data]);
  console.log(chartData);

  const isSmallScreen = useMediaQuery('(max-width: 1366px)');

  return (
    <CardUI
      className='!h-fit'
      title='Alert Overview'
      variant='shine'
      headerPadding='py-2 px-3 border-none'
      actions={
        <Select value={selectedRange} onValueChange={setSelectedRange}>
          <SelectTrigger className='text-text bg-text/10' size='sm'>
            <SelectValue placeholder='Select range' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Today'>Today</SelectItem>
            <SelectItem value='This Week'>This Week</SelectItem>
            <SelectItem value='This Month'>This Month</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className='p-2 flex items-center xl:gap-8 gap-4 flex-col xl:flex-row justify-between h-fit'>
        <div
          className={isSmallScreen ? 'w-max-[180px] w-full h-fit' : 'w-max-[200px] w-full h-fit'}
        >
          <PieChartComponent
            data={chartData}
            centerLabel='Total Alerts'
            width='100%'
            height={isSmallScreen ? 180 : 200}
          />
        </div>

        <div className='pr-4 w-full xl:max-w-60 flex flex-col'>
          <div className='flex flex-col border-b border-border py-2'>
            <h2 className='text-xs font-medium text-muted-foreground'>Resolved Alerts</h2>
            <h2 className='font-bold text-xl text-text'>{summary.resolved}</h2>
          </div>

          <div className='flex flex-col border-b py-2 border-border'>
            <h2 className='text-xs font-medium text-muted-foreground'>Fall Alerts</h2>
            <h2 className='font-bold text-xl text-text'>{summary.fall}</h2>
          </div>

          <div className='flex flex-col py-2'>
            <h2 className='text-xs font-medium text-muted-foreground'>Device Offline</h2>
            <h2 className='font-bold text-xl text-text'>{summary.offline}</h2>
          </div>
        </div>
      </div>
    </CardUI>
  );
};
