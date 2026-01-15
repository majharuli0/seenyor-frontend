import { useMemo } from 'react';

import { useUserStore } from './useUserStore';

export const usePermission = () => {
  const user = useUserStore((state) => state.user);
  const permissions = useUserStore((state) => state.permissions) || {};
  const isMonitoringAgent = user?.role === 'monitoring_agent';

  const can = useMemo(
    () => (key) => (isMonitoringAgent ? !!permissions[key] : true),
    [permissions, isMonitoringAgent]
  );
  const cannot = useMemo(
    () => (key) => (isMonitoringAgent ? !permissions[key] : false),
    [permissions, isMonitoringAgent]
  );
  const hasAny = useMemo(
    () =>
      (keys = []) =>
        isMonitoringAgent ? keys.some((key) => !!permissions[key]) : true,
    [permissions, isMonitoringAgent]
  );
  const hasAll = useMemo(
    () =>
      (keys = []) =>
        isMonitoringAgent ? keys.every((key) => !!permissions[key]) : true,
    [permissions, isMonitoringAgent]
  );

  return { can, cannot, hasAny, hasAll, permissions, isMonitoringAgent };
};
