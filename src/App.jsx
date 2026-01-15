import './App.css';
import { Outlet, Route, HashRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
import React, { useContext, useEffect, useState, Suspense } from 'react';
import CustomRoutes from '@/Routes/CustomRoutes';
import { publicRoutes } from '@/Routes/publicRoutes';
import toast, { Toaster } from 'react-hot-toast';
import ScrollToTop from '@/Shared/ScrollToTop/index';
import { Routers } from './Routes/index';

import NetworkErrorModal from './Components/NetworkLostHandler';
import { ConfigProvider } from 'antd';
// import { onMessageListener, requestPermission } from "./firebase.js";
import { getAlertInfoViaEvent, speak } from './utils/helper';
import { IoMdCall } from 'react-icons/io';
import { getDetails, getDeviceReports } from './api/elderly';
import { getTokenToCall } from './api/deviceCall';
import { LuPhoneCall } from 'react-icons/lu';
import { PiEyeBold } from 'react-icons/pi';
import { getUserDetails, updateUserDetails } from './api/Users';
import ls from 'store2';
import { Button, Dropdown } from 'antd';
import FallAlarmModal from './Components/FallModal/fallModal';
import { SidebarContext } from './Context/CustomContext';
import { useNotification } from '@/Context/useNotification';
import BugReportModal from './Components/BugReports';
import { generateToken, messaging } from './firebase/firebase';
import { onMessage } from 'firebase/messaging';
import { NurseAlertProvider } from './Context/AlertToggleContext';
import { useLanguage } from './Context/LanguageProvider';
import { getAllDeviceInfo } from './api/deviceConfiguration';
import { useDeviceStore } from './MonitoringService/store/useDeviceStore';
const svgs = import.meta.glob('@/assets/icon/alarm/*.svg', { eager: true });
// Map the SVGs into an object for easy access by name
let icons = {};
for (const key in svgs) {
  if (Object.hasOwnProperty.call(svgs, key)) {
    const iconName = key.split('/').pop().replace('.svg', '');
    icons[iconName] = svgs[key].default;
  }
}

// Toast Component for Other Notifications
const SimpleAlertToast = ({ icon, title, message, id, t }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white hover:bg-gray-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 cursor-pointer`}
    >
      <div
        className='flex-1 w-0 p-4'
        onClick={() => navigate(`/supporter/elderlies/elderly-profile/${id}?tab=overview`)}
      >
        <div className='flex items-start'>
          <div className='flex-shrink-0 pt-0.5'>
            <img className='h-8 w-8 rounded-full' src={icon} alt='' />
          </div>
          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium text-gray-900'>{title}</p>
            <p className='mt-1 text-sm text-gray-500'>{message}</p>
          </div>
        </div>
      </div>
      <div className='flex border-l border-gray-100'>
        <button
          onClick={() => toast.dismiss(t.id)}
          className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary/90 hover:text-primary focus:outline-none focus:ring-2 focus:ring-prmary'
        >
          Close
        </button>
      </div>
    </div>
  );
};
function App() {
  const user = ls.get('user');
  const log_token = ls.get('token');
  const location = useLocation();
  const currentPath = location.pathname;
  const { modalDataList, setModalDataList } = useContext(SidebarContext);
  const { setNotificationEvent } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [audio, setAudio] = useState(null);
  const { language, changeLanguage } = useLanguage();
  const fetchDevices = useDeviceStore((state) => state.fetchDevices);
  useEffect(() => {
    // Initialize audio once after first user interaction
    const initAudio = () => {
      const a = new Audio('/nt.mp3');
      a.preload = 'auto';
      setAudio(a);
      window.removeEventListener('click', initAudio);
    };

    window.addEventListener('click', initAudio);
  }, []);
  const handleNotification = () => {
    if (audio) {
      audio.play().catch((err) => console.log('Audio failed:', err));
    }
  };
  const updateUserDetailsWithFCMToken = (id, token) => {
    if (!token) return;
    updateUserDetails(id, { fcm_token_web: token })
      .then((res) => {
        console.log('Token Updated');
      })
      .catch((err) => console.log(err));
  };

  const handleCallRoom = (data) => {
    console.log('Calling room for:', data);
  };

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);
  const handleSelectContact = (contact, data) => {
    console.log('Selected contact:', contact, 'for:', data);
    // Add your contact logic here
  };

  const showSimpleAlertToast = (data) => {
    toast.custom((t) => (
      <SimpleAlertToast
        icon={getAlertInfoViaEvent(data)?.icon}
        title={data.title}
        message={data.body}
        id={data?.elderly_id}
        t={t}
      />
    ));
  };

  useEffect(() => {
    async function setupFCMToken() {
      const token = await generateToken();
      if (token) {
        updateUserDetailsWithFCMToken(user?._id, token);
      }
    }
    setupFCMToken();
    onMessage(messaging, (payload) => {
      const eventData = payload.data;

      const alertInfo = {
        ...payload?.notification,
        ...payload?.data,
      };
      console.log(alertInfo);

      setNotificationEvent(alertInfo);
      if (!(user?.role == 'monitoring_agency' || user?.role == 'monitoring_agent')) {
        if (alertInfo) {
          handleNotification();
          if (eventData.event === '2') {
            setModalDataList((prev) => [...prev, alertInfo]);
            speak(alertInfo.title);
          } else {
            showSimpleAlertToast(alertInfo);
          }
        }
      }
    });
  }, [currentPath]);
  const closeModal = (index) => {
    setModalDataList((prev) => prev.filter((_, i) => i !== index));
  };
  useEffect(() => {
    const html = document.documentElement;

    if (user?.role === 'monitoring_agency' || user?.role === 'monitoring_agent') {
      html.classList.add('monitoring-agency-theme');
    } else {
      html.classList.remove('monitoring-agency-theme', 'dark');
    }

    // optional cleanup
    return () => html.classList.remove('monitoring-agency-theme', 'dark');
  }, [user?.role]);
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: user?.role == 'nurse' ? 'Poppins' : 'Baloo2',
            colorPrimary: '#001529',
            colorLinkActive: '#001529',
            colorLinkHover: '#001529',
            colorLink: '#001529',
          },
        }}
      >
        <NurseAlertProvider user={user}>
          <QueryClientProvider client={queryClient}>
            <div data-vaul-drawer-wrapper=''>
              {/* <button
              onClick={() => {
                fakeAlarm();
              }}
            >
              Trigger Multiple Falls
            </button> */}
              <ScrollToTop />
              <CustomRoutes>
                {Routers.map((item, index1) => (
                  <Route
                    key={index1}
                    path={item.path}
                    element={item.layout ? <item.layout /> : <Outlet />}
                  >
                    <Route index element={item.first} />
                    {item.router.map(({ path, Component }, index) => {
                      return (
                        <Route
                          key={index1 + index}
                          path={path}
                          element={
                            <Suspense
                              fallback={
                                <div className='h-screen w-full flex items-center justify-center'>
                                  Loading...
                                </div>
                              }
                            >
                              <Component />
                            </Suspense>
                          }
                        />
                      );
                    })}
                  </Route>
                ))}
              </CustomRoutes>
              <NetworkErrorModal />
              <Toaster position='top-right' reverseOrder={false} />
              {modalDataList.map((data, index) => (
                <FallAlarmModal
                  key={index}
                  isOpen={true}
                  onClose={() => closeModal(index)}
                  data={data}
                  onCallRoom={handleCallRoom}
                  onSelectContact={handleSelectContact}
                  index={index} // Pass index for stacking
                />
              ))}
              {/* <BugReportModal /> */}
              {/* <UpdateModal
              show={showModal}
              onReloadNow={handleReloadNow}
              onReloadLater={handleReloadLater}
            /> */}
            </div>
          </QueryClientProvider>
        </NurseAlertProvider>
      </ConfigProvider>
    </>
  );
}

export default App;

export const UpdateModal = ({ show, onReloadNow, onReloadLater }) => {
  if (!show) return null;

  return (
    <div className='modal z-100'>
      <div className='modal-content'>
        <div className='modal-header'>New Version Available!</div>
        <p>A new version of the app is available. Would you like to reload now?</p>
        <div className='modal-buttons'>
          <button className='btn btn-reload' onClick={onReloadNow}>
            Reload Now
          </button>
          <button className='btn btn-later' onClick={onReloadLater}>
            I'll Reload Later
          </button>
        </div>
      </div>
    </div>
  );
};
