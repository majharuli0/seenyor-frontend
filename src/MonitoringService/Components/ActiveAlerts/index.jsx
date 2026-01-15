import { AlarmCheck, ChevronRight } from 'lucide-react';
import CardUI from '../common/card';
import { Button } from '../ui/button';
import { LuSiren } from 'react-icons/lu';
import ResolvedAlerts from '../ResolvedAlerts';
import { useState } from 'react';
import { useResolvedByMe } from '@/MonitoringService/hooks/useAlert';
import dayjs from 'dayjs';
import { useAlertStore } from '@/MonitoringService/store/useAlertStore';
import { useUserStore } from '@/MonitoringService/store/useUserStore';

export const ActiveAlerts = ({ className = '' }) => {
  const { totalAlertCount } = useAlertStore();
  const { user } = useUserStore();

  const [isVisible, setIsVisible] = useState(false);
  const { data, isLoading, isSuccess } = useResolvedByMe({
    from_date: dayjs().format('YYYY-MM-DD'),
    to_date: '2000-01-01',
  });
  return (
    <div className={`w-full sm:w-fit ${className}`}>
      <CardUI className={`p-5`}>
        <div
          className={`flex ${
            user?.role !== 'monitoring_agency' ? 'gap-6' : 'gap-12'
          } items-center justify-between w-fill`}
        >
          <div className='size-[110px] relative flex items-center justify-center border-1 border-border rounded-full'>
            <div className='absolute w-[75%] bg-red-500 rounded-full h-[75%] flex items-center justify-center text-destructive-foreground'>
              <LuSiren size={30} />
            </div>
            <div className='relative'>
              <svg
                className='size-full -rotate-90'
                viewBox='0 0 36 36'
                xmlns='http://www.w3.org/2000/svg'
              >
                {/* <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-current text-text/10 dark:text-white/10"
                  strokeWidth="1.5"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-current text-red-600 dark:text-red-500 "
                  strokeWidth="1.5"
                  strokeDasharray="100"
                  strokeDashoffset={100 - v}
                  strokeLinecap="round"
                ></circle> */}
              </svg>
            </div>
          </div>
          <div className='flex flex-col w-fill'>
            <div className='flex items-end flex-col'>
              <h1 className='text-3xl font-black text-red-500'>{totalAlertCount || 0}</h1>
              <span className='text-base font-medium text-text'>Active Alert</span>
            </div>
            {user?.role !== 'monitoring_agency' && (
              <Button
                variant='tertiary'
                size='sm'
                className='font-normal text-text/80 mt-4'
                onClick={() => setIsVisible(!isVisible)}
              >
                <span className='text-text text-lg font-medium'>{data?.data || 0}</span>
                You Resolved
                <ChevronRight />
              </Button>
            )}
          </div>
        </div>
      </CardUI>
      {isVisible && (
        <ResolvedAlerts isVisible={isVisible} setIsVisible={setIsVisible} totalCount={data?.data} />
      )}
    </div>
  );
};
