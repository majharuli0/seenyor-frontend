import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { RiDashboardFill, RiUserSettingsFill } from 'react-icons/ri';
import { FaUsers } from 'react-icons/fa';
import { SiGoogleanalytics } from 'react-icons/si';
import { IoIosNotifications, IoMdSettings } from 'react-icons/io';
import { getToken, setToken } from '@/utils/auth';
import ls from 'store2';
import { jwtDecode } from 'jwt-decode';
import { ArrowBigLeft, ArrowLeft } from 'lucide-react';
import { usePermission } from '@/MonitoringService/store/usePermission';

export default function SidebarUI() {
  const { can } = usePermission();
  const [loader, setLoader] = useState(false);
  const rootToken = ls.get('rootToken');

  const navigate = useNavigate();
  const navItems = [
    { to: '/ms/dashboard', icon: RiDashboardFill, label: 'Dashboard' },
    { to: '/ms/customers', icon: FaUsers, label: 'Customers' },
    { to: '/ms/analytics', icon: SiGoogleanalytics, label: 'Analytics' },
    // { to: "/ms/component", icon: IoIosNotifications, label: "Alerts" },
    can('manage_agent') && {
      to: '/ms/role-managment',
      icon: RiUserSettingsFill,
      label: 'Manage',
    },
    can('branding_setting_access') && {
      to: '/ms/settings',
      icon: IoMdSettings,
      label: 'Settings',
    },
  ].filter(Boolean);
  const nvto = (active) => {
    if (active == 'super_admin') {
      navigate('/super-admin/users');
    } else {
      navigate('/support-nurnt/dashboard/suspended-user');
    }
  };
  // Restore the original token when switching back
  const restoreOriginalToken = () => {
    const originalToken = ls.get('rootToken');
    if (originalToken) {
      setToken(originalToken);
      ls.remove('rootToken');
    }
  };
  function handleRoleBack() {
    restoreOriginalToken();
    setLoader(true);
    const token = getToken() || ls.get('rootToken');
    const data = jwtDecode(token);
    // setMainRole(data?.role);
    ls.set('user', data);
    ls.set('mainRole', data.role);
    ls.set('role', data.role);
    setTimeout(() => {
      setLoader(false);
      nvto(data?.role);
    }, 1500);
  }
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className='hidden sm:flex w-20 bg-background border-r border-border/50 dark:border-none flex-col items-center relative'>
        <nav className='flex flex-col flex-1 items-center justify-center space-y-6'>
          {navItems.map(({ to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-center h-12 w-12 rounded-full transition-colors 
                ${
                  isActive
                    ? 'bg-text/10 text-text'
                    : 'text-foreground/50 hover:text-foreground hover:bg-text/10'
                }`
              }
            >
              <Icon className='h-5 w-5' />
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Mobile Bottom Bar */}
      <nav className='sm:hidden  scrollbar-thin fixed bottom-0 left-0 right-0 !bg-background/60 border-t border-border/70 flex overflow-x-auto justify-around px-2 py-2 z-50 backdrop-blur-md '>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-shrink-0 mx-1 px-3 py-2 rounded-xl text-xs transition-all duration-300
              ${
                isActive
                  ? 'text-text bg-text/10'
                  : 'text-foreground/60 hover:text-foreground hover:bg-text/10'
              }`
            }
          >
            <Icon className='h-5 w-5 mb-1' />
            <span className='text-[10px]'>{label}</span>
          </NavLink>
        ))}
      </nav>
      {rootToken && (
        <div
          onClick={handleRoleBack}
          className='absolute bottom-2 left-[1%] p-2 bg-text/10 rounded-md hover:bg-white/20 cursor-pointer'
        >
          <ArrowLeft />
        </div>
      )}
    </>
  );
}
