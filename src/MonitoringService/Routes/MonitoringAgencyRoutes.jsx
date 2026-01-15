import { lazy } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import CustomersDetails from '../Pages/Customers/Details/Details';
import RoleManagment from '../Pages/RoleManagment/RoleManagment';
import Settings from '../Pages/Settings/Settings';
import RoleManagmentDetails from '../Pages/RoleManagment/Details/Details';
import PerformanceMatrics from '../Pages/RoleManagment/PerformanceMatrics/PerformanceMatrics';
import ShiftCalendar from '../Pages/RoleManagment/ShiftCalendar/ShiftCalendar';

const MonitoringAgencyDashboard = lazy(() => import('../Pages/Dashboard/Dashboard'));
const NotFound = lazy(() => import('../Pages/NotFound'));
const ComponentPage = lazy(() => import('../Pages/Component/Component'));
const CustomersPage = lazy(() => import('../Pages/Customers/Customers'));
const Analytics = lazy(() => import('../Pages/Analytics/Analytics'));
const CustomersWrapper = () => {
  const { type } = useParams();
  const allowedTypes = ['active', 'paused', 'deactivated'];

  if (!type || !allowedTypes.includes(type)) {
    return <Navigate to='/ms/customers/active' replace />;
  }

  return <CustomersPage />;
};
const MonitoringAgencyRoutes = [
  {
    path: 'dashboard',
    Component: MonitoringAgencyDashboard,
  },
  {
    path: 'customers',
    Component: () => <Navigate to='/ms/customers/active' replace />,
  },
  {
    path: 'customers/:type',
    Component: CustomersWrapper,
  },
  {
    path: 'customers/:type/:id',
    Component: CustomersDetails,
  },
  {
    path: 'dashboard/alert/:id',
    Component: MonitoringAgencyDashboard,
  },
  // {
  //   path: "component",
  //   Component: ComponentPage,
  // },
  {
    path: 'analytics',
    Component: Analytics,
  },
  {
    path: 'role-managment',
    Component: RoleManagment,
  },
  {
    path: 'role-managment/:id',
    Component: RoleManagmentDetails,
  },
  {
    path: 'role-managment/performance-matrics',
    Component: PerformanceMatrics,
  },
  {
    path: 'role-managment/shift-calendar',
    Component: ShiftCalendar,
  },
  {
    path: 'settings',
    Component: Settings,
  },
  {
    path: '*',
    Component: NotFound,
  },
];

export default MonitoringAgencyRoutes;
