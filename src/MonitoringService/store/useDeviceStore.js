import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getAllDeviceInfo } from '@/api/deviceConfiguration';

export const useDeviceStore = create(
  persist(
    (set, get) => ({
      devices: [],
      isLoaded: false,
      lastFetchedAt: null,

      fetchDevices: async (force = false) => {
        const { devices, isLoaded, lastFetchedAt } = get();
        // Always fetch fresh data

        try {
          const res = await getAllDeviceInfo();
          if (res?.status && Array.isArray(res.data)) {
            const transformed = res.data.map((item) => {
              let timezone = null;
              let ip = null;
              if (item.timezone2Ip) {
                const parts = item.timezone2Ip.split('|');
                timezone = parts[0] || null;
                ip = parts[1] || null;
              }
              return { ...item, timezone, ip };
            });
            console.log(transformed);

            set({
              devices: transformed,
              isLoaded: true,
              lastFetchedAt: Date.now(),
            });
          }
        } catch (err) {
          console.error('Error fetching devices:', err);
        }
      },

      getDeviceByUID: (uid) => {
        const { devices } = get();
        return devices.find((d) => d.uid === uid);
      },
    }),
    {
      name: 'device-storage',
    }
  )
);
