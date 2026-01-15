import { lazy } from 'react';

// Lazy load layouts to avoid bundle bloat
const MainLayout = lazy(() => import('@/layouts/Main/MainLayout'));
const MonitoringLayout = lazy(() => import('@/layouts/Monitoring/MonitoringLayout'));
// Future: const NurseLayout = lazy(() => import("@/layouts/Nurse/NurseLayout"));

export const LAYOUTS = {
  MAIN: 'MainLayout',
  MONITORING: 'MonitoringLayout',
};

/**
 * Maps User Roles to Layout Components.
 * This is the single source of truth for which layout a user sees.
 */
export const ROLE_LAYOUT_MAP = {
  // Main Dashboard Users
  super_admin: LAYOUTS.MAIN,
  distributor: LAYOUTS.MAIN,
  office: LAYOUTS.MAIN,
  sales_agent: LAYOUTS.MAIN,
  nursing_home: LAYOUTS.MAIN,
  support_agent: LAYOUTS.MAIN,
  nurse: LAYOUTS.MAIN, // or LAYOUTS.NURSE if you split it
  end_user: LAYOUTS.MAIN,
  installer: LAYOUTS.MAIN,
  monitoring_station: LAYOUTS.MAIN,

  // Monitoring Agency Users (The sub-app)
  monitoring_agency: LAYOUTS.MONITORING,
  monitoring_agent: LAYOUTS.MONITORING,
};

export const getLayoutForRole = (role) => {
  const layoutKey = ROLE_LAYOUT_MAP[role] || LAYOUTS.MAIN; // Default to Main

  switch (layoutKey) {
    case LAYOUTS.MONITORING:
      return MonitoringLayout;
    case LAYOUTS.MAIN:
    default:
      return MainLayout;
  }
};
