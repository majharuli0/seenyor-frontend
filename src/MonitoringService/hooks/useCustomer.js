import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getDetails, getElderliesPriorityList } from '@/api/elderly';
import { QUERY_KEYS } from '@/api/queryKeys';
import { deactivatedUser } from '@/api/Users';

import { toast } from '../Components/common/toast';
import { useDemoMode } from '../Context/DemoModeContext';
import { getDemoCustomerDetails, getDemoCustomers, getDemoQueryResult } from '../data/demoData';
import { useQueryWrapper } from './quaryHelper';

export const useCustomers = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const paramsString = JSON.stringify(params);

  const demoResult = useMemo(() => getDemoQueryResult(getDemoCustomers(params)), [params]);

  const query = useQueryWrapper(
    [QUERY_KEYS.CUSTOMER, params],
    () => getElderliesPriorityList(params),
    {
      refetchOnMount: true,
      enabled: !isDemoMode,
      ...options,
    }
  );

  return isDemoMode ? demoResult : query;
};

export const useCustomersDetails = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const query = useQueryWrapper(
    [QUERY_KEYS.CUSTOMER_DETAILS(params?.id), params],
    () => getDetails(params),
    { ...options, enabled: !isDemoMode && options.enabled }
  );

  const demoResult = useMemo(() => getDemoCustomerDetails(params?.id), [params?.id]);

  return isDemoMode ? demoResult : query;
};
export const useDeactivatedCustomer = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => deactivatedUser(data),
    onSuccess: () => {
      toast.success('Customer Deactivated successfully!', {
        description: 'Customer has been moved to deactivated list.',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER],
        refetchType: 'active',
      });
      //   queryClient.invalidateQueries([QUERY_KEYS.SMS_HISTORY]);
    },
    onError: (err) => {
      toast.error('Failed to deactivated the customer!', {
        description: err?.message || 'An error occurred while deactivating customer.',
      });
      console.log(err);
    },
    ...options,
  });
};
