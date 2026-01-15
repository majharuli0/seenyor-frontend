// NurseAlertContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { changeAlertStatus } from '@/api/Users';

const NurseAlertContext = createContext();

export const NurseAlertProvider = ({ user, children }) => {
  const [dashboardAlerts, setDashboardAlerts] = useState(false);
  const location = useLocation();
  const [manualOverride, setManualOverride] = useState(
    () => localStorage.getItem('nurseManualOverride') === 'true'
  );

  useEffect(() => {
    if (!user || user.role !== 'nurse') {
      setManualOverride(false);
      localStorage.removeItem('nurseManualOverride');
    }
  }, [user, user?.role]);

  useEffect(() => {
    localStorage.setItem('nurseManualOverride', manualOverride);
  }, [manualOverride]);
  const toggleAlert = async (active) => {
    try {
      await changeAlertStatus({ active });
      setDashboardAlerts(active);

      // if turning off manually → set override true
      // if turning on manually → clear override
      setManualOverride(!active);
    } catch (err) {
      console.error('toggleAlert error:', err);
    }
  };

  useEffect(() => {
    if (!user) return;

    const isNurse = user.role === 'nurse';
    const onNursePage = location.pathname.includes('/supporter/');

    if (isNurse && onNursePage && !manualOverride) {
      if (!dashboardAlerts) {
        changeAlertStatus({ active: true })
          .then((res) => res && setDashboardAlerts(true))
          .catch(console.error);
      }
    } else {
      if (dashboardAlerts) {
        changeAlertStatus({ active: false })
          .then(() => setDashboardAlerts(false))
          .catch(console.error);
      }
    }
  }, [location.pathname, user?.role, dashboardAlerts, manualOverride]);

  const deactivateAlert = React.useCallback(async () => {
    if (user?.role === 'nurse' && dashboardAlerts) {
      try {
        await changeAlertStatus({ active: false });
        setDashboardAlerts(false);
      } catch (err) {
        console.error('Failed to deactivate nurse alert:', err);
      }
    }
  }, [user?.role, dashboardAlerts]);

  useEffect(() => {
    if (user?.role === 'nurse') {
      const handleBeforeUnload = () => {
        const url = import.meta.env.VITE_APP_BASE_API + '/users/active-nurse';
        const body = JSON.stringify({ active: false });
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [user?.role]);

  return (
    <NurseAlertContext.Provider
      value={{
        dashboardAlerts,
        setDashboardAlerts,
        deactivateAlert,
        setManualOverride,
        manualOverride,
        toggleAlert,
      }}
    >
      {children}
    </NurseAlertContext.Provider>
  );
};

export const useNurseAlert = () => useContext(NurseAlertContext);
