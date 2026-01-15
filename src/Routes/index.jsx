import { lazy, Suspense, useMemo } from 'react';

import Orders from '@/Pages/Orders';

// Lazy load components
// const AdminElderly = lazy(() => import("../Pages/Admin/AdminElderly"));
// const AdminElderlySinglePage = lazy(() => import("../Pages/Admin/AdminElderlySinglePage"));

// const SuspendedSuperAdmin = lazy(() => import("../Pages/SuperAdmin/SuspendedSuperAdmin"));

const AdminDashboard = lazy(() => import('@/Pages/AdminDashboard/index'));

const AdminUser = lazy(() => import('../Pages/AdminUser/index'));
const UserProfileView = lazy(() => import('@/Pages/UserProfileView'));
const Supportnursing = lazy(() => import('@/Pages/Supportnursing/index'));
const Supportnuser = lazy(() => import('@/Pages/Supportnuser/index'));
const SupportUserDetail = lazy(() => import('@/Pages/SupportUserDetail/index'));
const NotFound = lazy(() => import('@/Pages/NotFound/index'));
const RecentlyDeleted = lazy(() => import('@/Pages/RecentlyDeleted'));

import MonitoringAgencyDashboard from '@/MonitoringService/Pages/Dashboard/Dashboard';
import MonitoringAgencyRoutes from '@/MonitoringService/Routes/MonitoringAgencyRoutes';
const PasswordResetFlow = lazy(() => import('@/Pages/ForgotPassword/PasswordResetFlow'));
const TransectionHistory = lazy(() => import('@/Pages/TransectionHistory/index'));
// supporter dashboards
const SupportAgentDashboard = lazy(
  () => import('@/Pages/Supportnursing/Dashboards/SupportAgentDashboard')
);
const NurseDashboard = lazy(() => import('@/Pages/Supportnursing/Dashboards/NurseDashboard'));
const EndUserDashboard = lazy(() => import('@/Pages/Supportnursing/Dashboards/EndUserDashboard'));

// Elderly Management
const ElderlyList = lazy(() => import('@/Pages/Elderlies/ElderlyList'));
const ElderlyProfile = lazy(() => import('@/Pages/Elderlies/ElderlyProfile'));

// Alerts
const AlertsList = lazy(() => import('@/Pages/Alerts/AlertsList'));
const AlertDetail = lazy(() => import('@/Pages/Alerts/AlertDetail'));
//Deals
const Deals = lazy(() => import('@/Pages/Deals/index'));
const Installation = lazy(() => import('@/Pages/Installation/index'));
//Auth
const SelectRolePage = lazy(() => import('@/Pages/Login/index'));
//Refunds
const RefundsRequest = lazy(() => import('@/Pages/RefundsRequest/index'));
const SubscribedUsers = lazy(() => import('@/Pages/SubscribedUsers/index'));
import { useEffect } from 'react';

// Create a ProtectedRoute component
const ProtectedRoute = ({ role, children }) => {
  const loggedUserToken = ls.get('token');
  const userRole = useMemo(() => {
    if (loggedUserToken) {
      try {
        return jwtDecode(loggedUserToken)?.role;
      } catch (error) {
        if (error.name === 'InvalidTokenError') {
          window.location.href = '/#/';
        }
      }
    }
    return null;
  }, [loggedUserToken]);
  useEffect(() => {
    const currentPath = window.location.hash;
    // Check if the userRole is included in the role prop
    if (!role?.includes(userRole)) {
      if (userRole === 'support_agent' && !currentPath.includes('support-agent')) {
        window.location.href = '#/supporter/support-agent/dashboard';
      } else if (userRole === 'nurse' && !currentPath.includes('nurse')) {
        window.location.href = '#/supporter/nurse/dashboard';
      } else if (userRole === 'end_user' && !currentPath.includes('end-user')) {
        window.location.href = '#/supporter/end-user/dashboard';
      } else if (userRole === 'super_admin' && !currentPath.includes('super-admin')) {
        window.location.href = '#/super-admin/dashboard';
      } else if (
        (userRole === 'office' ||
          userRole === 'distributor' ||
          userRole === 'monitoring_station' ||
          userRole === 'installer' ||
          userRole === 'sales_agent' ||
          userRole === 'nursing_home') &&
        !currentPath.includes('support-nurnt')
      ) {
        window.location.href = '#/support-nurnt/dashboard';
      } else if (
        (userRole === 'monitoring_agency' || userRole === 'monitoring_agent') &&
        !currentPath.includes('ms')
      ) {
        window.location.href = '#/ms/dashboard';
      }
    }
  }, [userRole, role]);

  return role?.includes(userRole) ? children : null;
};

import { jwtDecode } from 'jwt-decode';
import ls from 'store2';

import { CenteredSkeleton } from '@/Components/Skeleton/SkeletonPage';
import AlarmDetail from '@/Pages/AlarmDetail/AlarmDetail';
import Analytics from '@/Pages/Analytics';
import Customers from '@/Pages/Customers';
import DealDetails from '@/Pages/DealDetails';
import DistributorDeal from '@/Pages/DistributorDeal';
import ExportCompliance from '@/Pages/ExportComplience';
import MonitoringStationConf from '@/Pages/MonitoringStationConf';
import NewDeal from '@/Pages/NewDeal';
import Reviews from '@/Pages/Reviews';
import ReviewDetails from '@/Pages/Reviews/ReviewDetails';
import CRMAdminDashboard from '@/Pages/Supportnursing/Dashboards/CRMAdminDashboard';
import { removeToken } from '@/utils/auth';
const CustomerDetails = lazy(() => import('@/Pages/Customers/CustomerDetails'));
const Devices = lazy(() => import('@/Pages/Devices'));
const CRMOrders = lazy(() => import('@/Pages/CRMOrders'));
const OrderDetails = lazy(() => import('@/Pages/CRMOrders/OrderDetails'));

// --- NEW ARCHITECTURE IMPORTS ---
import { getLayoutForRole } from '@/config/layoutRegistry';
import AppShell from '@/layouts/Core/AppShell';

// Unified RootLayout Component
const RootLayout = () => {
  const token = ls.get('token');
  const role = token ? jwtDecode(token)?.role : null;

  if (!role) return null; // Or redirect to login

  const LayoutComponent = getLayoutForRole(role);

  return (
    <AppShell>
      <LayoutComponent />
    </AppShell>
  );
};
import { clearLocalStorageKeys } from '@/utils/helper';

const loggedUserToken = ls.get('token');
// Function to handle redirection based on role
const redirectToDashboard = (role) => {
  const rolePaths = {
    supports_agent: '#/supporter/support-agent',
    nurse: '#/supporter/nurse',
    end_user: '#/supporter/end-user',
    super_admin: '#/super-admin',
    office: '#/support-nurnt',
    distributor: '#/support-nurnt',
    monitoring_station: '#/support-nurnt',
    monitoring_agency: '#/ms',
    monitoring_agent: '#/ms',
    installer: '#/support-nurnt',
    sales_agent: '#/support-nurnt',
    nursing_home: '#/support-nurnt',
  };

  const basePath = Object.prototype.hasOwnProperty.call(rolePaths, role) ? rolePaths[role] : null;
  const currentPath = window.location.hash;

  if (basePath && !currentPath.startsWith(basePath)) {
    if (
      role === 'end_user' ||
      role === 'nurse' ||
      (role === 'supports_agent' && currentPath.includes('elderlies')) ||
      currentPath.includes('alerts')
    ) {
      console.log('');

      // window.location.href = `${basePath}/dashboard`;
    } else {
      window.location.href = `${basePath}/dashboard`;
    }
  }
};

if (loggedUserToken) {
  try {
    const decodedToken = jwtDecode(loggedUserToken);
    if (decodedToken.role) {
      redirectToDashboard(decodedToken.role);
    } else {
      removeToken();
      window.location.href = '/#/';
    }
  } catch (error) {
    if (error.name === 'InvalidTokenError') {
      console.error('Invalid token:', error.message);
      removeToken();
      window.location.href = '/#/';
    }
  }
} else {
  clearLocalStorageKeys([
    'token',
    'mainRole',
    'role',
    'rootToken',
    'user',
    'elderly_details',
    'sleepData',
  ]);
  // Only redirect if not already at root to avoid loops/flashing
  if (window.location.hash && window.location.hash !== '#/') {
    window.location.href = '/#/';
  }
}
export const Routers = [
  {
    name: 'Auth',
    path: '/',
    router: [
      {
        path: '',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <SelectRolePage />
          </Suspense>
        ),
      },
      {
        path: '/forgot-password',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <PasswordResetFlow />
          </Suspense>
        ),
      },
      {
        path: '*',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
    first: (
      <Suspense fallback={<CenteredSkeleton />}>
        <SelectRolePage />
      </Suspense>
    ),
  },
  {
    name: 'CRM',
    layout: RootLayout,
    path: '/management/',
    router: [
      {
        path: 'dashboard',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            {/* _-<-_ */}
            <ProtectedRoute role='distributor'>
              <CRMAdminDashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'customers',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            {/* _-<-_ */}
            <ProtectedRoute role='distributor'>
              <Customers />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'customers/details/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='distributor'>
              <CustomerDetails />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'orders',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='distributor'>
              <CRMOrders />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'orders/details/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='distributor'>
              <OrderDetails />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'devices',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='distributor'>
              <Devices />
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },
  {
    name: 'Supporter',
    layout: RootLayout,
    path: '/supporter/',
    router: [
      {
        path: 'support-agent/dashboard',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='supports_agent'>
              <SupportAgentDashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'nurse/dashboard',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='nurse'>
              <NurseDashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='nurse'>
              <Analytics />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'compliance',
        Component: () => (
          <Suspense fallback={<div>Loading...</div>}>
            <ProtectedRoute role='nurse'>
              <Analytics />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'export-compliance',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='nurse'>
              <ExportCompliance />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'end-user/dashboard',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='end_user'>
              <EndUserDashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'elderlies',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role={['end_user', 'supports_agent', 'monitoring_agency', 'nurse']}>
              <ElderlyList />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'elderlies/elderly-profile/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role={['end_user', 'supports_agent', 'nurse', 'monitoring_agency']}>
              <ElderlyProfile />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'alerts',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role={['end_user', 'supports_agent', 'nurse', 'monitoring_agency']}>
              <AlertsList />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'alert/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role={['end_user', 'supports_agent', 'nurse']}>
              <AlertDetail />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: '*',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    name: 'Super_Admin',
    layout: RootLayout,
    path: '/super-admin/',
    router: [
      {
        path: 'dashboard',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <AdminDashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'reviews',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <Reviews />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'reviews/details/:elderly_id/:room_id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <ReviewDetails />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'elderly-profile/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role={['super_admin']}>
              <ElderlyProfile />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'users',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <AdminUser />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'user/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <UserProfileView />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'users/distributor-deal/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <DistributorDeal />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'users/monitoring-station-conf/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <MonitoringStationConf />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'users/distributor-deal/details/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <DealDetails />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'users/distributor-deal/new-deal/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <NewDeal />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'refunds-request',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <RefundsRequest />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'subscribed-users',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <SubscribedUsers />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'payment-history',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <TransectionHistory />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'recently-deleted',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='super_admin'>
              <RecentlyDeleted />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: '*',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    name: 'supernurAdmin',
    layout: RootLayout,
    path: '/support-nurnt/dashboard/',
    router: [
      {
        path: 'suspended-user',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute
              role={[
                'office',
                'distributor',
                'monitoring_station',
                'installer',
                'sales_agent',
                'nursing_home',
              ]}
            >
              <Supportnuser />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'suspended-user/:id',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute
              role={[
                'office',
                'distributor',
                'monitoring_station',
                'installer',
                'sales_agent',
                'nursing_home',
              ]}
            >
              <SupportUserDetail />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'installation',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='installer'>
              <Installation />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'alarm-detail',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='monitoring_agency'>
              <AlarmDetail />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'deals',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute
              role={['office', 'distributor', 'monitoring_station', 'installer', 'sales_agent']}
            >
              <Deals />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'orders',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute
              role={['office', 'distributor', 'monitoring_station', 'installer', 'sales_agent']}
            >
              <Orders />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'recently-deleted',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute
              role={[
                'super_admin',
                'office',
                'distributor',
                'monitoring_station',
                'installer',
                'sales_agent',
                'end_user',
                'supports_agent',
                'nurse',
                'nursing_home',
              ]}
            >
              <RecentlyDeleted />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: '*',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
    first: (
      <Suspense fallback={<CenteredSkeleton />}>
        <ProtectedRoute
          role={[
            'office',
            'distributor',
            'monitoring_station',
            'monitoring_agency',
            'installer',
            'sales_agent',
            'nursing_home',
          ]}
        >
          <Supportnursing />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    name: 'Nurse',
    path: '/nurse/',
    layout: RootLayout,
    router: [
      {
        path: 'dashboard',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <ProtectedRoute role='nurse'>
              <>nurse</>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: '*',
        Component: () => (
          <Suspense fallback={<CenteredSkeleton />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    name: 'Monitoring_Agency',
    layout: RootLayout,
    path: '/ms/',
    router: MonitoringAgencyRoutes.map((route) => ({
      path: route.path,
      Component: () => (
        <Suspense fallback={<CenteredSkeleton />}>
          <ProtectedRoute role={['monitoring_agency', 'nurse', 'monitoring_agent']}>
            <route.Component />
          </ProtectedRoute>
        </Suspense>
      ),
    })),
    first: (
      <ProtectedRoute role={['monitoring_agency', 'nurse', 'monitoring_agent']}>
        <MonitoringAgencyDashboard />
      </ProtectedRoute>
    ),
  },
];
