import { getAllCountry } from '@/api/countries-v1';
import { QUERY_KEYS } from '@/api/queryKeys';

import { useQueryWrapper } from './quaryHelper';

export const useCountry = (params = {}, options = {}) =>
  useQueryWrapper([QUERY_KEYS.GET_COUNTRY], () => getAllCountry(), {
    refetchOnMount: true,
    ...options,
  });
