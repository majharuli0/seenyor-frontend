import { createContext, useCallback, useEffect, useMemo,useRef, useState } from 'react';

import useWebSocket from '@/hook/useWebSoket';
import { decodePosition } from '@/utils/helper';

export const WebSocketContext = createContext({
  deviceData: {},
});

export const WebSocketProvider = ({ children, deviceId = '' }) => {
  console.log('========>soket context');

  const [deviceData, setDeviceData] = useState({});
  const pendingUpdatesRef = useRef({});
  const deviceCodes = useMemo(
    () => (deviceId ? deviceId.split(',').map((d) => d.trim()) : []),
    [deviceId]
  );

  const handleMessage = useCallback(
    (data) => {
      try {
        const parsedData = JSON.parse(data.message);
        const payload = parsedData?.payload;

        if (payload?.deviceCode && deviceCodes.includes(payload.deviceCode)) {
          pendingUpdatesRef.current[payload.deviceCode] = {
            ...(pendingUpdatesRef.current[payload.deviceCode] || {}),
            ...payload,
          };
        }
      } catch (error) {
        console.error('Error parsing socket message:', error);
      }
    },
    [deviceCodes]
  );

  useWebSocket({
    onMessage: handleMessage,
    dependencies: [deviceId],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const updatesSnapshot = { ...pendingUpdatesRef.current };

      if (Object.keys(updatesSnapshot).length > 0) {
        pendingUpdatesRef.current = {};

        setDeviceData((prev) => {
          const newData = { ...prev };

          Object.entries(updatesSnapshot).forEach(([deviceCode, rawPayload]) => {
            const updates = {};

            if (rawPayload.position) {
              const decodedPosition = decodePosition(rawPayload.position, deviceCode);

              if (decodedPosition) {
                const modifiedPosition = decodedPosition.map((pos) => {
                  if (pos.postureIndex === 4 && rawPayload.heartbreath) {
                    return {
                      ...pos,
                      postureIndex: 6,
                      posture: 'In Bed',
                      color: '#252F67',
                    };
                  }
                  return pos;
                });

                updates.position = modifiedPosition;
              }
            }

            if (rawPayload.heartbreath) {
              updates.heartBreath = rawPayload.heartbreath;
            }

            if (rawPayload.hbstatics) {
              updates.hbstatics = rawPayload.hbstatics;
              updates.hbstaticsTimestamp = Date.now();
            }

            // Only update if we have new data, otherwise keep previous
            newData[deviceCode] = {
              position: updates.position || prev[deviceCode]?.position || [],
              heartBreath: updates.heartBreath || prev[deviceCode]?.heartBreath || null,
              hbstatics: updates.hbstatics || prev[deviceCode]?.hbstatics || null,
              hbstaticsTimestamp:
                updates.hbstaticsTimestamp || prev[deviceCode]?.hbstaticsTimestamp || null,
            };
          });

          return newData;
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [deviceCodes]);

  return <WebSocketContext.Provider value={{ deviceData }}>{children}</WebSocketContext.Provider>;
};
