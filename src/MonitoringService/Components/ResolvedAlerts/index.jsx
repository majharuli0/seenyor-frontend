import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerOverlay,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '../ui/drawer';
import AlertList from './AlertsList';
import { alerts } from '@/MonitoringService/Pages/Dashboard/data';
import { Badge } from '../ui/badge';
import { useAlerts } from '@/MonitoringService/hooks/useAlert';
import { Button } from '../ui/button';
import { useUserStore } from '@/MonitoringService/store/useUserStore';
import { Empty, EmptyHeader, EmptyMedia } from '../ui/empty';
import { TableSkeleton } from '../AlertTableState';

export default function ResolvedAlerts({ isVisible, setIsVisible, totalCount = 0 }) {
  const { getUser } = useUserStore();
  const [userData, setUserData] = useState({});
  const currentPath = location.pathname;

  useEffect(() => {
    setUserData(getUser());
  }, [currentPath]);
  const {
    data: alertsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useAlerts(
    {
      event: '2,5',
      is_online: '1',
      is_resolved: true,
      closed_by_id: userData?._id,
    },
    {
      enabled: userData?._id ? true : false,
    }
  );
  const alerts = alertsData?.pages.flatMap((page) => page.data) || [];
  return (
    <Drawer
      shouldScaleBackground={true}
      onOpenChange={setIsVisible}
      direction='bottom'
      dismissible
      open={isVisible}
    >
      <DrawerContent className='w-full sm:w-[95%] mx-auto h-full border-border border-r border-l '>
        <div className='p-4 text-text h-full '>
          <DrawerHeader className='pt-0'>
            <DrawerTitle className='text-text text-lg flex items-center mx-auto gap-2'>
              Alerts You’ve Resolved{' '}
              <Badge variant='outline' className='border-card-400'>
                {totalCount}
              </Badge>
            </DrawerTitle>
          </DrawerHeader>

          <AlertList alerts={alerts} loading={isLoading} />
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
      </DrawerContent>
    </Drawer>
  );
}
