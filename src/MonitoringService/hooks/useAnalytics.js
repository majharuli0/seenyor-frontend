import { useMemo } from 'react';

import {
  getAgentCountStatistics,
  getAgentPerformance,
  getCountStatistics,
  getSLAReport,
  getTotalAlertCounts,
  getTotalAlertTrends,
  getTrueFalseAlertCountByAgent,
} from '@/api/Dashboard';
import { QUERY_KEYS } from '@/api/queryKeys';

import { useDemoMode } from '../Context/DemoModeContext';
import {
  getDemoAgentCountStatistics,
  getDemoAgentPerformance,
  getDemoAlertTrends,
  getDemoCountStatistics,
  getDemoQueryResult,
  getDemoSLAReport,
  getDemoTotalAlertCount,
} from '../data/demoData';
import { useQueryWrapper } from './quaryHelper';

export const useCountStatistics = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const demoResult = useMemo(() => {
    if (!isDemoMode) return null;
    return getDemoQueryResult(getDemoCountStatistics());
  }, [isDemoMode]);

  const queryResult = useQueryWrapper(
    [QUERY_KEYS.COUNT_STATISTICS, params],
    () => getCountStatistics(params),
    { ...options, retry: 0, enabled: !isDemoMode && options.enabled !== false }
  );

  return isDemoMode ? demoResult : queryResult;
};

export const useAgentCountStatistics = (params = {}, options = {}) =>
  useQueryWrapper(
    [QUERY_KEYS.AGENT_COUNT_STATISTICS, params],
    () => getAgentCountStatistics(params),
    { ...options, retry: 1 }
  );

export const useTotalAlertCount = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const demoResult = useMemo(() => {
    if (!isDemoMode) return null;
    // We can pass params if needed for filtering in the future
    return getDemoQueryResult(getDemoTotalAlertCount());
  }, [isDemoMode]);

  const queryResult = useQueryWrapper(
    [QUERY_KEYS.TOTAL_ALERTS, params],
    () => getTotalAlertCounts(params),
    { ...options, retry: 0, enabled: !isDemoMode && options.enabled !== false }
  );

  return isDemoMode ? demoResult : queryResult;
};

export const useAlertTrends = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const demoResult = useMemo(() => {
    if (!isDemoMode) return null;
    return getDemoQueryResult(getDemoAlertTrends());
  }, [isDemoMode]);

  const queryResult = useQueryWrapper(
    [QUERY_KEYS.TOTAL_ALERTS_TREND, params],
    () => getTotalAlertTrends(params),
    { ...options, retry: 0, enabled: !isDemoMode && options.enabled !== false }
  );

  return isDemoMode ? demoResult : queryResult;
};

export const useAgentPerformance = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const demoResult = useMemo(() => {
    if (!isDemoMode) return null;
    return getDemoQueryResult(getDemoAgentPerformance());
  }, [isDemoMode]);

  const queryResult = useQueryWrapper(
    [QUERY_KEYS.AGENT_PERFORMANCE, params],
    () => getAgentPerformance(params),
    { ...options, retry: 0, enabled: !isDemoMode && options.enabled !== false }
  );

  return isDemoMode ? demoResult : queryResult;
};

export const useSLAReport = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const demoResult = useMemo(() => {
    if (!isDemoMode) return null;
    return getDemoQueryResult(getDemoSLAReport());
  }, [isDemoMode]);

  const queryResult = useQueryWrapper(
    [QUERY_KEYS.SLA_STATISTICS, params],
    () => getSLAReport(params),
    { ...options, retry: 0, enabled: !isDemoMode && options.enabled !== false }
  );

  return isDemoMode ? demoResult : queryResult;
};

export const useTrueFalseAlertsCount = (params = {}, options = {}) =>
  useQueryWrapper(
    [QUERY_KEYS.TRUE_FALSE_ALERTS, params],
    () => getTrueFalseAlertCountByAgent(params),
    { ...options, retry: 0 }
  );

export const useStatisticsCountByAgent = (params = {}, options = {}) => {
  const { isDemoMode } = useDemoMode();

  const demoResult = useMemo(() => {
    if (!isDemoMode) return null;
    return getDemoQueryResult(getDemoAgentCountStatistics(params));
  }, [isDemoMode, params]);

  const queryResult = useQueryWrapper(
    [QUERY_KEYS.STATISTICS_BY_ID(params.agent_id), params],
    () => getAgentCountStatistics(params),
    { ...options, retry: 0, enabled: !isDemoMode && options.enabled !== false }
  );

  return isDemoMode ? demoResult : queryResult;
};
