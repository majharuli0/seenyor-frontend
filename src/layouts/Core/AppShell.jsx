import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AppShell
 *
 * The Core wrapper for the entire application.
 * All layouts (Main, Monitoring, etc.) should be rendered inside this.
 *
 * Responsibilities:
 * - Global Theme Provider
 * - Global Toast/Notification Layer
 * - Global Modals (e.g. Logout, Session Expired)
 * - WebSocket/MQTT connection management (Future)
 */
const AppShell = ({ children }) => {
  return (
    <>
      {/* Global Utilities */}

      {/* The specific Layout + Page content */}
      {children || <Outlet />}
    </>
  );
};

export default AppShell;
