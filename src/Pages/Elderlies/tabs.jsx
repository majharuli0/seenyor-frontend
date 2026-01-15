import {
  HomeOutlined,
  MoonOutlined,
  HeartOutlined,
  PullRequestOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  LineChartOutlined,
  MessageOutlined,
  DatabaseOutlined,
  AlertOutlined,
  ContactsOutlined,
  MobileOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import React, {
  useState,
  lazy,
  Suspense,
  useLayoutEffect,
  useMemo,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react';
// Lazy load components
const OverviewTab = lazy(() => import('./Components/TabContents/Overview/OverviewTab'));
const ReportsTab = lazy(() => import('./Components/TabContents/Reports/ReportsTab'));
const SleepTab = lazy(() => import('./Components/TabContents/Sleep/SleepTab'));
const HealthTab = lazy(() => import('./Components/TabContents/Health/HealthTab'));
const EmergencyContactsTab = lazy(
  () => import('./Components/TabContents/EmergencyContacts/EmergencyContactsTab')
);
const DevicesTab = lazy(() => import('./Components/TabContents/Devices/DevicesTab'));
const DataAnalyzeTab = lazy(() => import('./Components/TabContents/DataAnalyze/DataAnalyzeTab'));
const TrendTab = lazy(() => import('./Components/TabContents/Trends/TrendTab'));
const ActivityTab = lazy(() => import('./Components/TabContents/Activity/ActivityTab'));
const LiveMapTab = lazy(() => import('./Components/TabContents/LiveMap/LiveMapTab'));
const CommunicationTab = lazy(
  () => import('./Components/TabContents/Communication/CommunicationTab')
);
const HealthDataTab = lazy(() => import('./Components/TabContents/HealthData/HealthDataTab'));
const AlertHistoryTab = lazy(() => import('./Components/TabContents/Alerts/AlertsHistoryTab'));
export const tabItems = [
  {
    label: 'Overview',
    key: 'overview',
    icon: <HomeOutlined />,
    component: <OverviewTab />,
  },
  {
    label: 'Sleep',
    key: 'sleep',
    icon: <MoonOutlined />,
    component: <SleepTab />,
  },
  {
    label: 'Wellness Insights',
    key: 'health',
    icon: <HeartOutlined />,
    component: <HealthTab />,
  },
  {
    label: 'Activity',
    key: 'activity',
    icon: <PullRequestOutlined />,
    component: <ActivityTab />,
  },
  // {
  //   label: "Data Analyze",
  //   key: "dataAnalyze",
  //   icon: <BarChartOutlined />,
  //   component: <DataAnalyzeTab />,
  // },
  {
    label: 'Live Map',
    key: 'liveMap',
    icon: <EnvironmentOutlined />,
    component: <LiveMapTab />,
  },
  // {
  //   label: "Trends",
  //   key: "trends",
  //   icon: <LineChartOutlined />,
  //   component: <TrendTab />,
  // },
  // {
  //   label: "Communication",
  //   key: "communication",
  //   icon: <MessageOutlined />,
  //   component: <CommunicationTab />,
  // },
  {
    label: 'Personal Records',
    key: 'healthData',
    icon: <DatabaseOutlined />,
    component: <HealthDataTab />,
  },
  {
    label: 'Trusted Contacts',
    key: 'emergencyContacts',
    icon: <ContactsOutlined />,
    component: <EmergencyContactsTab />,
  },
  {
    label: 'Activity History',
    key: 'alertHistory',
    icon: <AlertOutlined />,
    component: <AlertHistoryTab />,
  },
  {
    label: 'Devices',
    key: 'devices',
    icon: <MobileOutlined />,
    component: <DevicesTab />,
  },
  {
    label: 'Reports',
    key: 'reports',
    icon: <FileTextOutlined />,
    component: <ReportsTab />,
  },
];
