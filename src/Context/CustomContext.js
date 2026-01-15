import { jwtDecode } from 'jwt-decode';
import { createContext, useState } from 'react';
import ls from 'store2';
export const SidebarContext = createContext();
let globalIncrementVisit;
const SidebarContextProvider = ({ children }) => {
  // -------------handle elderly back button and elderly trends click------------
  const [innerOverView, setinnerOverView] = useState(true);
  const [activeTrend, setActiveTrend] = useState({
    title: 'Fall Detection',
    index: 1,
  });

  // --------------show notification tab------------
  const [showNotificationTab, setShowNotificationTab] = useState(false);

  // -------------inner device show---------------
  const [deviceInner, setDeviceInner] = useState('');

  const [show, setShow] = useState(false);
  const [sidebarShow, setSidebarShow] = useState(false);
  const [overView, setOverView] = useState(true);
  const [overViewActive, setOverViewActive] = useState('');
  const [BreadCrumbData, setBreadCrumb] = useState({ title: '', url: '' });
  const [role, setRole] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [totalResident, setTotalResident] = useState(0);
  const [activeAlerts, setActiveAlerts] = useState(false);
  const [notVisitedRoom, setNotVisitedRoom] = useState(false);
  const [notVisitRoomCount, setNotVisitRoomCount] = useState(-1);

  const [offlineRoomCount, setOfflineRoomCount] = useState(0);
  const [allRoles, setAllRoles] = useState({
    superAdmin: 'super_admin',
    distributor: 'distributor',
    office: 'office',
    officManager: 'office_manager',
    salesAgent: 'sales_agent',
    nursingHome: 'nursing_home',
    nurse: 'nurse',
    installer: 'installer',
    monitoringStation: 'monitoring_station',
    monitoringAgency: 'monitoring_agency',
    supportsAgent: 'supports_agent',
    endUser: 'end_user',
    elderly: 'elderly',
  });
  const [rolesFormatter, setRolesFormatter] = useState({
    super_admin: 'Super Admin',
    distributor: 'Distributor',
    office: 'Office',
    sales_agent: 'Sales Agent',
    nursing_home: 'Nursing Home',
    nurse: 'Nurse',
    monitoring_station: 'Control Center',
    monitoring_agency: 'Monitoring Agency',
    installer: 'Installer',
    supports_agent: 'Supports Agent',
    end_user: 'End User',
    elderly: 'Elderly',
    user: 'User',
  });
  const [isAsssingInstaller, setIsAsssingInstaller] = useState(false);
  const [userDeleted, setUserDeleted] = useState(false);
  const [modalDataList, setModalDataList] = useState([]);
  const [resolvedAlarm, setResolvedAlarm] = useState(null);
  const [activeMemu, setActiveMenu] = useState('dashboard');
  let isLogin = null;
  const loggedUserToken = ls.get('token');
  if (loggedUserToken) {
    try {
      isLogin = jwtDecode(loggedUserToken)?.role;
    } catch (error) {
      if (error.name === 'InvalidTokenError') {
        window.location.href = '/#/auth/login';
      }
    }
  }
  const [visitCountMap, setVisitCountMap] = useState({});

  const setInitialCount = (deviceCode, count) => {
    setVisitCountMap((prev) => ({ ...prev, [deviceCode]: count }));
  };

  const incrementVisit = (deviceCode) => {
    console.log('Entered');

    setVisitCountMap((prev) => ({
      ...prev,
      [deviceCode]: (prev[deviceCode] || 0) + 1,
    }));
  };

  globalIncrementVisit = incrementVisit;
  // --------------sleep events type mapping------------
  const [sleepEventsType, setSleepEventsType] = useState({
    0: 'Deep Sleep',
    1: 'Light Sleep',
    2: 'Awake',
    3: 'Out of Bed',
    4: 'Offline',
    5: 'Fell Asleep',
    7: 'REM',
    13: 'Breathing Pauses',
    12: 'Slow Breathing',
    11: 'Fast Breathing',
    14: 'Elevated Activity Rhythm',
    15: 'Relaxed Activity Rhythm',
    32: 'Others',
    31: 'Walking',
    30: 'Still',
  });
  // --------------sleep events color mapping------------
  const [sleepEventsColor, setSleepEventsColor] = useState({
    'Deep Sleep': '#7F87FC',
    'Light Sleep': '#4285F4',
    Awake: '#F1A605',
    REM: '#A0C878',
    'Out of Bed': '#FF725E',
    'Fell Asleep': '#34CECE',
    'Breathing Pauses': '#E416EB',
    'Fast Breathing': '#9A7E6F',
    'Elevated Activity Rhythm': '#D91656',
    'Relaxed Activity Rhythm': '#FC8F54',
    'Slow Breathing': '#A19AD3',
    Offline: '#4DA1A9',
    Still: '#55FFEF',
    Walking: '#3AA0FF',
    Others: '#FCC575',
  });
  const [dailyRepDate, setDailyRepDate] = useState(null);
  const contextInfo = {
    sleepEventsType,
    modalDataList,
    setModalDataList,
    dailyRepDate,
    setDailyRepDate,
    setSleepEventsType,
    sleepEventsColor,
    setSleepEventsColor,
    activeMemu,
    setActiveMenu,
    isLogin,
    userDeleted,
    setUserDeleted,
    allRoles,
    rolesFormatter,
    isAsssingInstaller,
    setIsAsssingInstaller,
    show,
    setShow,
    overView,
    setOverView,
    overViewActive,
    setOverViewActive,
    setinnerOverView,
    innerOverView,
    activeTrend,
    setActiveTrend,
    sidebarShow,
    setSidebarShow,
    setDeviceInner,
    deviceInner,
    setShowNotificationTab,
    showNotificationTab,
    setBreadCrumb,
    BreadCrumbData,
    role,
    setRole,
    selectedEvents,
    setSelectedEvents,
    totalResident,
    setTotalResident,
    setResolvedAlarm,
    resolvedAlarm,
    activeAlerts,
    setActiveAlerts,
    notVisitedRoom,
    setNotVisitedRoom,
    notVisitRoomCount,
    setNotVisitRoomCount,
    offlineRoomCount,
    setOfflineRoomCount,
    visitCountMap,
    setInitialCount,
    incrementVisit,
  };

  return <SidebarContext.Provider value={contextInfo}>{children}</SidebarContext.Provider>;
};
export { globalIncrementVisit };
export default SidebarContextProvider;
