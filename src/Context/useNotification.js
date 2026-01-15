import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationEvent, setNotificationEvent] = useState(null);

  return (
    <NotificationContext.Provider
      value={{
        notificationEvent,
        setNotificationEvent,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
