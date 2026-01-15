import React, { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@/MonitoringService/Components/ThemeProvider'; // hook
import SidebarUI from '@/MonitoringService/Components/layout/sidebar';
import HeaderUI from '@/MonitoringService/Components/layout/header';
import config from '@/MonitoringService/conf.json';
import { Toaster } from '@/MonitoringService/Components/ui/sonner';
import { DrawerCSSProvider } from '@/MonitoringService/Components/DrawerCSSProvider';
import { useNotification } from '@/Context/useNotification';
import { toast } from '@/MonitoringService/Components/common/toast';
import { useUserStore } from '@/MonitoringService/store/useUserStore';
import { useCustomersDetails } from '@/MonitoringService/hooks/useCustomer';
import { useUserDetails } from '@/MonitoringService/hooks/UseUser';
import { useFavicon } from '@/MonitoringService/hooks/useFavicon';
import { useDeviceStore } from '@/MonitoringService/store/useDeviceStore';
import { DemoModeProvider } from '@/MonitoringService/Context/DemoModeContext';

const MonitoringAgencyLayoutContent = () => {
  const { notificationEvent } = useNotification();
  const [faviconUrl, setFaviconUrl] = useState(null);
  const fetchDevices = useDeviceStore((state) => state.fetchDevices);

  useEffect(() => {
    if (notificationEvent) {
      switch (notificationEvent?.event) {
        case '5':
          toast.warning(notificationEvent?.title);
          break;
        case '2':
          toast.error(notificationEvent?.title, {
            description: notificationEvent?.body,
          });
          break;
        default:
          break;
      }
    }
  }, [notificationEvent]);

  const { getUser, setUserDetails } = useUserStore();

  const payload_id = getUser()?._id;
  const { data: fetchedUser, isFetched } = useUserDetails(
    { id: payload_id },
    { enabled: !!payload_id }
  );

  useEffect(() => {
    if (isFetched && fetchedUser) {
      setUserDetails(fetchedUser?.data);
    }
  }, [isFetched, fetchedUser]);
  return (
    <div className='h-screen w-screen flex flex-col overflow-x-hidden'>
      <HeaderUI
      // toggleTheme={toggleTheme}
      // theme={theme}
      />
      <div className='flex flex-1 overflow-hidden'>
        <SidebarUI />
        <main className='flex-1 overflow-y-auto bg-background pb-[75px] sm:pb-0 p-3 sm:p-6'>
          <Suspense
            fallback={
              <div className='w-full mx-auto h-full flex items-center justify-center'>
                <div className='loader '></div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Toaster richColors={true} position='top-right' />
    </div>
  );
};

const MonitoringAgencyLayout = () => {
  return (
    <DemoModeProvider>
      <ThemeProvider>
        <DrawerCSSProvider>
          <MonitoringAgencyLayoutContent />
        </DrawerCSSProvider>
      </ThemeProvider>
    </DemoModeProvider>
  );
};

export default MonitoringAgencyLayout;
