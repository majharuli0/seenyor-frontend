import { useEffect, useState } from 'react';
import { PiArrowBendRightUpBold } from 'react-icons/pi';
import CardUI from '../common/card';
import { formatMilliseconds } from '@/utils/helper';
import { usePerformace } from '@/MonitoringService/hooks/useAlert';
import dayjs from 'dayjs';

export const AvgResponseTime = ({ data = {}, loading: parentLoading }) => {
  const [compareInfo, setCompareInfo] = useState({
    text: '',
    color: '',
    iconRotate: '',
  });

  const today = dayjs();
  const lastWeekEnd = today.subtract(today.day() + 1, 'day').format('YYYY-MM-DD');

  const {
    data: prevData,
    isLoading: prevLoading,
    isSuccess: prevSuccess,
  } = usePerformace({
    from_date: lastWeekEnd,
    to_date: '2000-01-02',
  });

  useEffect(() => {
    if (!parentLoading && prevSuccess && data?.avg_res_time !== undefined) {
      const currentAvg = data?.avg_res_time || 0;
      const previousAvg = prevData?.data?.avg_res_time || 0;
      const diff = previousAvg - currentAvg;
      const diffAbs = Math.abs(diff);

      if (diff > 0) {
        setCompareInfo({
          text: `${formatMilliseconds(diffAbs)} Reduced from last week`,
          color: 'text-green-500',
          iconRotate: 'rotate-180',
        });
      } else if (diff < 0) {
        setCompareInfo({
          text: `${formatMilliseconds(diffAbs)} Increased from last week`,
          color: 'text-red-500',
          iconRotate: '',
        });
      } else {
        setCompareInfo({
          text: 'No change from last week',
          color: 'text-muted-foreground',
          iconRotate: '',
        });
      }
    }
  }, [data, parentLoading, prevSuccess, prevData]);

  const loading = parentLoading || prevLoading;

  return (
    <CardUI className='!h-fit'>
      <div className='p-3 w-full'>
        <p className='text-text/70 text-sm font-medium'>Avg. Response Time</p>

        <div className='w-full flex gap-12 items-end justify-between mt-4'>
          <h1 className='text-text text-xl font-bold text-nowrap'>
            {formatMilliseconds(data?.avg_res_time || 0)}
          </h1>

          {!loading && compareInfo.text && (
            <div className='flex items-center gap-1'>
              <PiArrowBendRightUpBold
                className={`${compareInfo.color} !text-[16px] ${compareInfo.iconRotate}`}
              />
              <span className={`${compareInfo.color} font-medium text-xs`}>{compareInfo.text}</span>
            </div>
          )}
        </div>
      </div>
    </CardUI>
  );
};
