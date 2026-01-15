import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { getRoomInfo } from '@/api/deviceConfiguration';
import { elderlyFallPlayback, getResolvedByMe } from '@/api/deviceReports';
import {
  chnagePickedStatus,
  getAlertList,
  getAlertLogs,
  getPerformance,
  markAsResolved,
  sendPushNotification,
  sendSMS,
  setAlertLog,
} from '@/api/elderlySupport';
import { QUERY_KEYS } from '@/api/queryKeys';
import { useNotification } from '@/Context/useNotification';

import { toast } from '../Components/common/toast';
import { useDemoMode } from '../Context/DemoModeContext';
import { useInfiniteQueryWrapper, useQueryWrapper } from './quaryHelper';
export const useAlerts = (params = {}, options = {}) => {
  const { notificationEvent } = useNotification();
  const queryClient = useQueryClient();
  const { isDemoMode, demoAlerts, demoResolvedAlerts } = useDemoMode();

  useEffect(() => {
    if (notificationEvent) {
      queryClient.invalidateQueries([QUERY_KEYS.ALERTS]);
    }
  }, [notificationEvent, queryClient]);

  const query = useInfiniteQueryWrapper(
    [QUERY_KEYS.ALERTS, params],
    async ({ pageParam = 1 }) => {
      const response = await getAlertList({ ...params, page: pageParam });
      return response;
    },
    {
      enabled: !isDemoMode, // Disable real query in demo mode
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage || {};
        if (page < totalPages) return page + 1;
        return undefined;
      },
      staleTime: 5 * 60 * 1000,
      retry: 0,
      ...options,
    }
  );

  const demoResult = useMemo(() => {
    const dataToReturn = params.is_resolved ? demoResolvedAlerts : demoAlerts;
    return getDemoPaginatedResult(dataToReturn);
  }, [demoAlerts, demoResolvedAlerts, params.is_resolved]);

  if (isDemoMode) {
    return demoResult;
  }

  return query;
};
export const usePerformace = (params = {}, options = {}) => {
  const { isDemoMode, demoResolvedAlerts, demoAlerts } = useDemoMode();

  const demoResult = useMemo(
    () => getDemoQueryResult(getDemoPerformanceScore(demoResolvedAlerts, demoAlerts)),
    [demoResolvedAlerts, demoAlerts]
  );

  const query = useQueryWrapper(
    [QUERY_KEYS.PERFORMANCESCORE, params],
    () => getPerformance(params),
    {
      enabled: !isDemoMode && !!params?.from_date && !!params?.to_date,
      ...options,
    }
  );

  return isDemoMode ? demoResult : query;
};

export const useAlertLogs = (params = {}, options = {}) => {
  const { isDemoMode, getDemoLogs } = useDemoMode();

  const query = useQueryWrapper([QUERY_KEYS.ALERTLOG, params], () => getAlertLogs(params?.id), {
    ...options,
    retry: 0,
    enabled: !isDemoMode,
  });

  const demoLogs = getDemoQueryResult({ data: { action_logs: getDemoLogs(params?.id) } });

  return isDemoMode ? demoLogs : query;
};
import {
  getDemoFallPlaybackData,
  getDemoPaginatedResult,
  getDemoPerformanceScore,
  getDemoQueryResult,
  getDemoRoomInfoData,
} from '../data/demoData';

export const usePlayFallback = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const query = useQueryWrapper(
    [QUERY_KEYS.FALLPLAYBACK(params?.id), params],
    () => elderlyFallPlayback(params),
    {
      ...options,
      staleTime: 2 * 60 * 1000,
      enabled: !isDemoMode,
    }
  );

  const demoResult = useMemo(
    () => getDemoQueryResult(getDemoFallPlaybackData(params?.createdAt)),
    [params?.createdAt]
  );

  if (isDemoMode) {
    return demoResult;
  }

  return query;
};

export const useResolvedByMe = (params = {}, options = {}) => {
  const { isDemoMode, demoResolvedAlerts } = useDemoMode();

  const demoResult = useMemo(
    () => getDemoQueryResult({ data: demoResolvedAlerts.length }),
    [demoResolvedAlerts]
  );

  const query = useQueryWrapper(
    [QUERY_KEYS.RESOLVED_BY_ME, params],
    () => getResolvedByMe(params),
    {
      ...options,
      enabled: !isDemoMode,
    }
  );

  return isDemoMode ? demoResult : query;
};

export const useRoomInfo = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  // Devices that should always fetch real configuration, even in demo mode
  const REAL_DEVICE_UIDS = ['414D7418808B', '594B3CD2988B', 'E598A2CB35DF'];
  const targetId = params?.room_id || params?.uid;
  const isRealDevice = targetId && REAL_DEVICE_UIDS.includes(targetId);
  const shouldUseRealApi = !isDemoMode || isRealDevice;

  const paramsString = JSON.stringify(params);

  const demoResult = useMemo(
    () => getDemoQueryResult(getDemoRoomInfoData(params?.alert_id || params?.id, targetId)),
    [paramsString, targetId]
  );

  const query = useQueryWrapper(
    [QUERY_KEYS.FALLPLAYBACK(params?.room_id), params?.room_id],
    () => getRoomInfo({ elderly_id: params?.elderly_id, room_id: params?.room_id }),
    {
      ...options,
      staleTime: 2 * 60 * 1000,
      enabled: shouldUseRealApi && (options?.enabled ?? true),
    }
  );

  return shouldUseRealApi ? query : demoResult;
};
export const useAlertResolve = (options = {}) => {
  const queryClient = useQueryClient();
  const { isDemoMode, resolveDemoAlert, addDemoLog } = useDemoMode();

  const mutation = useMutation({
    mutationFn: (data) => markAsResolved(data),
    onSuccess: () => {
      toast.success('Alert Resolved Successfully!', {
        description: 'The alert has been marked as resolved.',
      });
      const keys = [
        QUERY_KEYS.ALERTLOG,
        QUERY_KEYS.RESOLVED_BY_ME,
        QUERY_KEYS.ALERTS,
        QUERY_KEYS.PERFORMANCESCORE,
      ];

      keys.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
          refetchType: 'active',
        });
      });
    },
    onError: (err) => {
      toast.error('Failed to resolve alert.', {
        description: err?.message || 'An error occurred while resolving the alert.',
      });
      console.log(err);
    },
    ...options,
  });

  const demoMutation = useMutation({
    mutationFn: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake network delay
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      resolveDemoAlert(data.id, data.data?.comment);
      addDemoLog(data.id, {
        ...data.data,
        status: 'resolved',
        action_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
      });
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Demo Alert Resolved!', {
        description: 'This alert has been removed from the demo list.',
      });
    },
    ...options,
  });

  return isDemoMode ? demoMutation : mutation;
};
export const useSendNotification = (options = {}) => {
  const queryClient = useQueryClient();
  const { isDemoMode, addDemoLog } = useDemoMode();

  const mutation = useMutation({
    mutationFn: (data) => sendPushNotification(data),
    onSuccess: () => {
      toast.success('Notification sent successfully!', {
        description: 'The notification has been sent.',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALERTLOG],
        refetchType: 'active',
      });
      //   queryClient.invalidateQueries([QUERY_KEYS.SMS_HISTORY]);
    },
    onError: (err) => {
      toast.error('Failed to send notification!', {
        description: err?.message || 'An error occurred while sending notification.',
      });
      console.log(err);
    },
    ...options,
  });

  const demoMutation = useMutation({
    mutationFn: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      addDemoLog(data.id, {
        ...data.data,
        status: 'notifications',
        action_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
      });
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Notification sent successfully!', {
        description: 'The notification has been sent.',
      });
    },
    ...options,
  });

  return isDemoMode ? demoMutation : mutation;
};

export const useSendSMS = (options = {}) => {
  const queryClient = useQueryClient();
  const { isDemoMode, addDemoLog } = useDemoMode();

  const mutation = useMutation({
    mutationFn: (data) => sendSMS(data),
    onSuccess: () => {
      toast.success('SMS sent successfully', {
        description: 'SMS has been sent to the user.',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALERTLOG],
        refetchType: 'active',
      });
    },
    onError: (err) => {
      console.error('SMS sending failed:', err);
    },
    ...options,
  });

  const demoMutation = useMutation({
    mutationFn: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      addDemoLog(data.id, {
        ...data.data,
        status: 'sms',
        action_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
      });
      return { success: true };
    },
    onSuccess: () => {
      toast.success('SMS sent successfully', {
        description: 'SMS has been sent to the user.',
      });
    },
    ...options,
  });

  return isDemoMode ? demoMutation : mutation;
};
export const useAlertPick = (options = {}) => {
  const queryClient = useQueryClient();
  const { isDemoMode, pickDemoAlert, addDemoLog } = useDemoMode();

  const demoMutation = useMutation({
    mutationFn: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Fake network delay
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      pickDemoAlert(id);
      addDemoLog(id, {
        status: 'picked',
        title: 'Alert Picked',
        action_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
        type: 'picked',
      });
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Demo Alert Picked!', {
        description: 'You have picked this demo alert.',
      });
    },
    ...options,
  });

  const mutation = useMutation({
    mutationFn: (id) => chnagePickedStatus(id),
    onSuccess: () => {
      toast.success('Alert Picked Successfully!', {
        description: 'The alert has been picked.',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALERTS],
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALERTLOG],
        refetchType: 'active',
      });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALERTS],
        refetchType: 'active',
      });
      toast.error('Failed!', {
        description: 'Alert already picked by another agent!',
      });
    },
    ...options,
  });

  return isDemoMode ? demoMutation : mutation;
};
export const useAlertLogSet = (options = {}) => {
  const queryClient = useQueryClient();
  const { isDemoMode, addDemoLog } = useDemoMode();

  const mutation = useMutation({
    mutationFn: (data) => setAlertLog(data),
    onSuccess: () => {
      toast.success('Success!', {
        description: 'Call Note Saved Successfully!.',
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALERTLOG],
        refetchType: 'active',
      });
    },
    onError: (err) => {
      console.error('SMS sending failed:', err);
    },
    ...options,
  });

  const demoMutation = useMutation({
    mutationFn: async (data) => {
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      addDemoLog(data.id, {
        ...data.data,
        action_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
      });
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Success!', {
        description: 'Call Note Saved Successfully!.',
      });
    },
    ...options,
  });

  return isDemoMode ? demoMutation : mutation;
};
const getEmergencyNumbers = async (countryCode = 'BD') => {
  try {
    const res = await fetch('/emergency.json');
    if (!res.ok) throw new Error('Failed to load local emergency data');
    const json = await res.json();
    const country = json.data.find(
      (item) => item.Country.ISOCode.toLowerCase() === countryCode.toLowerCase()
    );
    if (!country) throw new Error(`No emergency data found for ${countryCode}`);

    return country;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const useEmergencyNumbers = (params = {}, options = {}) =>
  useQueryWrapper(
    ['emergency_number', params],
    () => getEmergencyNumbers(params?.countryCode || 'BD'),
    { ...options, retry: 0 }
  );
