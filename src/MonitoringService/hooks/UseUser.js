import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { QUERY_KEYS } from '@/api/queryKeys';
import {
  addNewUser,
  getMonitoringCompanyConf,
  getUser,
  getUserDetails,
  updateMonitoringCompanyConf,
  updateUserDetails,
  uploadImage,
} from '@/api/Users';
import { useDemoMode } from '@/MonitoringService/Context/DemoModeContext';
import { getDemoQueryResult, getDemoUserDetails } from '@/MonitoringService/data/demoData';

import { toast } from '../Components/common/toast';
import { useQueryWrapper } from './quaryHelper';

export const useUsers = (params = {}, options = {}) =>
  useQueryWrapper([QUERY_KEYS.USERS, params], () => getUser(params), {
    refetchOnMount: true,
    ...options,
  });

export const useUserDetails = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const demoResult = useMemo(() => {
    if (!isDemoMode) return null;
    return getDemoQueryResult(getDemoUserDetails(params?.id));
  }, [isDemoMode, params?.id]);

  const queryResult = useQueryWrapper(
    [QUERY_KEYS.USERS_DETAILS(params?.id), params],
    () => getUserDetails(params),
    { ...options, enabled: !isDemoMode && options.enabled !== false }
  );

  return isDemoMode ? demoResult : queryResult;
};
export const useCreateNewRole = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addNewUser(data),
    onSuccess: (data) => {
      toast.success('Success!', {
        description: 'Your new role has been created successfully.',
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
        refetchType: 'active',
      });
    },
    onError: (err) => {
      console.error('Role Creation failed:', err);
      toast.error('Error!', {
        description: err?.response?.data?.message,
      });
    },
    ...options,
  });
};
export const useUpdateUserRole = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateUserDetails(data.id, data.data),
    onSuccess: (data, variables) => {
      toast.success('Success!', {
        description: 'Updated successfully.',
        closeButton: true,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS_DETAILS(variables.id)],
        refetchType: 'active',
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
        refetchType: 'active',
      });
    },
    onError: (err) => {
      console.error('failed:', err);
      toast.error('Error!', {
        description: err?.response?.data?.message,
      });
    },
    ...options,
  });
};
export const useUploadImage = (options = {}) => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await uploadImage(data);
      return res;
    },
    onSuccess: (data) => {
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (err) => {
      console.error('failed:', err);
      toast.error('Error!', {
        description: err?.response?.data?.message,
      });
    },
    ...options,
  });
};
export const useMonitoringCompanyConf = (params = {}, options = {}) =>
  useQueryWrapper(
    [QUERY_KEYS.GET_MONITORING_COMPANY_CONF(params?.id), params],
    () => getMonitoringCompanyConf(params?.id),
    options
  );

export const useUpdateMonitoringConf = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateMonitoringCompanyConf(data),
    onSuccess: (data) => {
      toast.success('Success!', {
        description: 'Updated successfully.',
        closeButton: true,
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MONITORING_COMPANY_CONF],
        refetchType: 'active',
      });
    },
    onError: (err) => {
      console.error('failed:', err);
      toast.error('Error!', {
        description: err?.response?.data?.message,
      });
    },
    ...options,
  });
};
