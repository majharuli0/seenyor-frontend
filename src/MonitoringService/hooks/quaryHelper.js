import { useInfiniteQuery,useQuery } from '@tanstack/react-query';

import { getToken } from '@/utils/auth';
/**
 * Normal query helper
 * @param {Array} key - Base query key
 * @param {Function} queryFn - Function returning a promise
 * @param {Object} options - Additional query options
 */

const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000,
  onError: (err) => console.log(err),
  onSuccess: (data) => console.log('Query success:', data),
};
export const useQueryWrapper = (key, queryFn, options = {}) => {
  return useQuery({
    queryKey: [...key, getToken()],
    queryFn,
    ...defaultQueryOptions,
    ...options,
  });
};

/**
 * Infinite query helper
 * @param {Array} key - Base query key
 * @param {Function} queryFn - Function receiving { pageParam } and returning a promise
 * @param {Object} options - Additional query options including getNextPageParam
 */
export const useInfiniteQueryWrapper = (key, queryFn, options = {}) => {
  return useInfiniteQuery({
    queryKey: [...key, getToken()],
    queryFn,
    ...defaultQueryOptions,
    ...options,
  });
};
