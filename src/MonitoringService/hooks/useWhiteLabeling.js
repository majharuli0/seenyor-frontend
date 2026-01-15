// hooks/useWhiteLabeling.js
import { useEffect } from 'react';

import { useUserDetails } from '@/MonitoringService/hooks/UseUser';
import { useBrandingStore } from '@/MonitoringService/store/useBrandingStore';
import { useUserStore } from '@/MonitoringService/store/useUserStore';


export function useWhiteLabeling() {
  const { branding, theme, setBranding, initBranding } = useBrandingStore();
  const { getUser } = useUserStore();
  const user = getUser();

  // Fetch user settings (if logged in)
  const { data: fetchedUser, isFetched } = useUserDetails(
    { id: user?._id },
    { enabled: !!user?._id }
  );

  useEffect(() => {
    initBranding();
  }, []);

  // Merge remote data once loaded
  useEffect(() => {
    const settings = fetchedUser?.data?.settings;
    if (isFetched && settings) {
      const mergedBranding = {
        branding: {
          ...settings.branding,
          ...(fetchedUser.branding || {}),
        },
        theme: {
          ...settings.theme,
          ...(fetchedUser.theme || {}),
        },
      };
      setBranding(mergedBranding.branding, mergedBranding.theme);
    }
  }, [isFetched, fetchedUser]);

  return { branding, theme };
}
