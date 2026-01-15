import { formatMilliseconds } from '@/utils/helper';
import CircularGauge from '../CircleGauge';
import CardUI from '../common/card';

export const PerformanceScore = ({ data = {}, loading = true }) => {
  const p =
    ((data?.count_less_sla ?? 0) / ((data?.count_less_sla ?? 0) + (data?.count_more_sla ?? 0))) *
    100;
  return (
    <CardUI className='!h-fit'>
      <div className='p-3 w-full'>
        <p className='text-text/70 text-sm font-medium'>Performance Score</p>
        <div className='w-full h-fit flex items-center justify-center'>
          <CircularGauge
            width={220}
            height={180}
            percentage={Math.round(p) || 0}
            primaryColor='#10b981'
          />
        </div>
        <div className='flex w-full gap-2 '>
          <div className='w-full bg-green-500/10 p-2 rounded-lg flex flex-col items-center justify-center'>
            <span className='text-base text-text font-medium'>
              {formatMilliseconds(data?.min_res_time || 0)}
            </span>
            <p className='text-xs text-text/80 '>Fastest Response</p>
          </div>
          <div className='w-full bg-red-500/10 p-2 rounded-lg flex flex-col items-center justify-center'>
            <span className='text-base text-text font-medium'>
              {' '}
              {formatMilliseconds(data?.max_res_time || 0)}
            </span>
            <p className='text-xs text-text/80 '>Slowest Response</p>
          </div>
        </div>
      </div>
    </CardUI>
  );
};
