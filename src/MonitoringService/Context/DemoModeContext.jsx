import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import {
  generateDemoAlerts,
  generateDemoResolvedAlerts,
  generateMockLogsForAlert,
} from '../data/demoData';

const DemoModeContext = createContext();

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

export const DemoModeProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoAlerts, setDemoAlerts] = useState([]);
  const [demoResolvedAlerts, setDemoResolvedAlerts] = useState([]);
  const [demoLogs, setDemoLogs] = useState({});

  const addDemoLog = (alertId, logEntry) => {
    const newLog = {
      _id: `log_${Date.now()}`,
      ...logEntry,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDemoLogs((prev) => ({
      ...prev,
      [alertId]: [newLog, ...(prev[alertId] || [])],
    }));

    return { status: true, message: 'Log added to demo' };
  };

  const getDemoLogs = (alertId) => {
    return demoLogs[alertId] || [];
  };

  const toggleDemoMode = (enable) => {
    setIsDemoMode(enable);
    if (enable) {
      const activeAlerts = generateDemoAlerts();
      setDemoAlerts(activeAlerts);

      const resolvedAlerts = generateDemoResolvedAlerts();
      setDemoResolvedAlerts(resolvedAlerts);

      // Generate logs for ALL alerts
      const allAlerts = [...activeAlerts, ...resolvedAlerts];
      const initialLogs = {};

      // Generate logs only for resolved alerts initially
      resolvedAlerts.forEach((alert) => {
        initialLogs[alert._id] = generateMockLogsForAlert(alert._id, alert.created_at);
      });

      // For the active picked alert (alert3), add just the picked log
      const pickedAlert = activeAlerts.find((a) => a._id === 'demo_alert_3');
      if (pickedAlert) {
        const fullLogs = generateMockLogsForAlert(pickedAlert._id, pickedAlert.created_at);
        // Only take the first log (picked)
        if (fullLogs.length > 0) {
          initialLogs[pickedAlert._id] = [fullLogs[0]];
        }
      }

      setDemoLogs(initialLogs);

      toast.success('Demo Mode Enabled', { description: 'You are now viewing simulation data.' });
    } else {
      setDemoAlerts([]);
      setDemoResolvedAlerts([]);
      setDemoLogs({});
      toast.info('Demo Mode Disabled', { description: 'Returning to live data.' });
    }
  };

  const resolveDemoAlert = (id, resolutionData) => {
    // Find the alert
    const alert = demoAlerts.find((a) => a._id === id);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (alert) {
      // Remove from active
      setDemoAlerts((prev) => prev.filter((a) => a._id !== id));

      const isTrueAlert = resolutionData?.status === true;
      const newStatus = !isTrueAlert; // True Alert -> status false, False Alert -> status true

      // Add to resolved
      setDemoResolvedAlerts((prev) => [
        {
          ...alert,
          is_resolved: true,
          comment: resolutionData?.comment || '',
          closed_at: new Date().toISOString(),
          closed_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
          closed_by_id: user?._id || 'demo_user',
          closed_by_role: user?.role || 'monitoring_agent',
          status: newStatus,
        },
        ...prev,
      ]);
    }
  };

  const pickDemoAlert = (id) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setDemoAlerts((prev) =>
      prev.map((alert) => {
        if (alert._id === id) {
          return {
            ...alert,
            picked_by: {
              picked_by_id: user?._id || 'demo_user',
              picked_by: user?.name || 'You',
              picked_at: new Date().toISOString(),
            },
          };
        }
        return alert;
      })
    );
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        demoAlerts,
        resolveDemoAlert,
        pickDemoAlert,
        addDemoLog,
        getDemoLogs,
        demoResolvedAlerts,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};
