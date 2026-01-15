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
import { Tabs, ConfigProvider, Tour, Button } from 'antd';
import { useParams } from 'react-router-dom';

import './style.css';
import SkeletonView from './Utiles/Skeleton';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

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
import ls from 'store2';
import { getSleepData, subscribeToMqtt } from '@/api/deviceReports';
import { getDetails } from '@/api/elderly';
import { CustomContext } from '@/Context/UseCustomContext';
import { SidebarContext } from '@/Context/CustomContext';
import dayjs from 'dayjs';
import { RefProvider, useRefContext } from '@/Context/RefContext';
import { getAlertInfoViaEvent } from '@/utils/helper';
import { speak } from '@/utils/helper';
import { useNotification } from '@/Context/useNotification';
import { tabItems } from './tabs';
import { WebSocketProvider } from '@/Context/WebSoketHook';
export default function ElderlyProfile() {
  const { dailyRepDate, setModalDataList } = useContext(SidebarContext);
  const { setElderlyDetails: setParentElderlyDetails } = useOutletContext();
  const [elderlyDetails, setElderlyDetails] = useState({});
  const [sleepData, setSleepData] = useState([]);
  const [size, setSize] = useState('small');
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [tourOpen, setTourOpen] = useState(false);
  const memoizedTabItems = useMemo(() => tabItems, []);
  const [allRefs, setAllRefs] = useState({});
  const [seenTours, setSeenTours] = useState(() => {
    const saved = ls.get('seenTours');
    return saved ? saved : {};
  });
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialTab = queryParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tourSteps, setTourSteps] = useState({});
  const [sleepDataLoading, setSleepDataLoading] = useState(true);
  const [refsReady, setRefsReady] = useState({});
  const tourTimeoutRef = useRef(null);
  // Update refs when provided by RefProvider
  const handleRefsUpdate = useCallback((refs) => {
    setAllRefs((prevRefs) => {
      if (prevRefs !== refs) {
        // Compare references
        return refs;
      }
      return prevRefs;
    });

    const readyTabs = {};
    Object.keys(refs).forEach((key) => {
      if (key.startsWith('tab_') && refs[key].current) {
        const tab = key.split('_')[1];
        readyTabs[tab] = true;
      }
    });

    setRefsReady((prev) => {
      const newReadyTabs = { ...prev, ...readyTabs };
      if (JSON.stringify(newReadyTabs) !== JSON.stringify(prev)) {
        return newReadyTabs; // Only update if content changes
      }
      return prev;
    });
  }, []);
  // useEffect(() => {
  //   setTourOpen(false);
  //   document.body.classList.remove("no-scroll"); // Remove scroll lock
  //   if (tourTimeoutRef.current) {
  //     clearTimeout(tourTimeoutRef.current); // Prevent tour from opening for previous tab
  //   }
  // }, [activeTab]);

  // Open tour after a 2-second delay if refs are ready and tour hasn’t been seen
  // useEffect(() => {
  //   if (refsReady[activeTab] && !seenTours[activeTab]) {
  //     console.log("Calling Inside");
  //     console.log(allRefs);

  //     tourTimeoutRef.current = setTimeout(() => {
  //       setTourOpen(true);
  //       document.body.classList.add("no-scroll");
  //     }, 2000);
  //   }
  // }, [activeTab, refsReady[activeTab], seenTours[activeTab]]);
  const previousPathnameRef = useRef(location.pathname);
  // const [sleepData, setSleepData] = useState([]);
  // const elderlyDetails = ls.get("elderly_details");
  // Define tab items with their associated components and icons

  // Sync URL with activeTab state
  useLayoutEffect(() => {
    ls.set('activeElderlyTab', activeTab);
    navigate(`${location.pathname}?tab=${activeTab}`, { replace: true });
  }, [activeTab]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const resizeCharts = useCallback(() => {
    const charts = document.querySelectorAll('.echarts');
    charts.forEach((chart) => {
      if (chart && chart.echartsInstance) {
        chart.echartsInstance.resize();
      }
    });
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => resizeCharts();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCharts]);

  //get elderly details
  const getElderlyDetails = useCallback(() => {
    if (!params.id) return;
    getElderlyInfo();
  }, [params.id]);

  const getElderlyInfo = () => {
    getDetails({ id: params.id })
      .then((res) => {
        const updatedElderlyDetails = {
          ...res?.data,
          // deviceId: "E598A2CB69C3,",
          deviceId:
            res?.data?.rooms?.length > 0
              ? res.data.rooms
                  .filter((item) => item.device_no)
                  .map((item) => item.device_no)
                  .join(',')
              : '',
          bedRoomIds:
            res?.data?.rooms?.length > 0
              ? res.data.rooms
                  .filter((item) => item.device_no && item.room_type == 2)
                  .map((item) => item.device_no)
                  .join(',')
              : '',
        };

        setElderlyDetails(updatedElderlyDetails);
        setParentElderlyDetails(updatedElderlyDetails);
        ls.set('elderly_details', updatedElderlyDetails);
        // Removed fatchSleepData call from here to prevent double calling
      })
      .catch((error) => {
        console.log('error ==================>', error);
        setSleepDataLoading(false);
      });
  };
  useEffect(() => {
    ls.set('elderly_details', []);
    ls.set('sleepData', []);
    if (!params.id) return;
    setSleepDataLoading(true);
    getElderlyDetails();
  }, [getElderlyDetails, params.id]);

  useEffect(() => {
    if (elderlyDetails?.bedRoomIds) {
      fatchSleepData({
        uids: elderlyDetails.bedRoomIds,
        to_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      });
    }
  }, [elderlyDetails?.bedRoomIds, dailyRepDate]);
  function fatchSleepData({ uids, to_date }) {
    if (!uids || !params.id) {
      setSleepDataLoading(false);
      return;
    }
    setSleepDataLoading(true);
    getSleepData({
      uids: uids,
      elderly_id: params.id,
      to_date: dailyRepDate || to_date,
    })
      .then((res) => {
        setSleepData(res?.data);
        ls.set('sleepData', res?.data);
        setSleepDataLoading(false);
      })
      .catch((error) => {
        console.log('error ==================>', error);
        setSleepDataLoading(false);
      });
  }
  // const subscribesToMqtt = useCallback(
  //   (data) => {
  //     const currentPathname = location.pathname;
  //     const isElderlyProfile = currentPathname.includes(
  //       "/supporter/elderlies/elderly-profile"
  //     );

  //     if (isElderlyProfile) {
  //       const uids = data?.uids.split(",");

  //       uids.forEach((uid) => {
  //         subscribeToMqtt({
  //           uid: uid,
  //           messageType: ["1", "2", "3", "4"],
  //           topics: {
  //             pub: [uid],
  //           },
  //         })
  //           .then((res) => {
  //             console.log(`Subscription for UID ${uid}:`, res);
  //           })
  //           .catch((err) => {
  //             console.log(`Error for UID ${uid}:`, err);
  //           });
  //       });
  //     }
  //   },
  //   [params.id]
  // );

  const tabListRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [isScrollableLeft, setIsScrollableLeft] = useState(false);
  const [isScrollableRight, setIsScrollableRight] = useState(true);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only respond to the left mouse button
    setIsDragging(true);
    setStartX(e.pageX - tabListRef.current.offsetLeft);
    setScrollLeft(tabListRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tabListRef.current.offsetLeft;
    const walk = (x - startX) * 0.8; // Adjust multiplier for smoothness
    tabListRef.current.scrollLeft = scrollLeft - walk;

    // Update indicators with requestAnimationFrame for better performance
    requestAnimationFrame(updateScrollIndicators);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const updateScrollIndicators = () => {
    if (!tabListRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current;
    setIsScrollableLeft(scrollLeft > 0);
    setIsScrollableRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    updateScrollIndicators();
  }, [tabItems]);

  const buttonStyles = {
    fontSize: '14px',
    padding: '14px 18px',
    borderRadius: '8px',
  };
  const buttonStyles2 = {
    fontSize: '14px',
    padding: '14px 18px',
    borderRadius: '8px',
  };

  useEffect(() => {
    const tourStepsByTab = {
      overview: [
        {
          title: <h1 className='text-xl text-primary'>Sleep Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Shows sleep-related timestamps like when the person went to bed, fell asleep, and woke
              up.
            </p>
          ),
          target: () => allRefs.tab_overview_step2?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Current Health Status</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Displays real-time heart rate and breathing patterns.
            </p>
          ),
          target: () => allRefs.tab_overview_step3?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Wellness Score</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Displays your overall wellness score based on various health metrics, including
              activity levels, heart rate, and recovery trends.
            </p>
          ),
          target: () => allRefs.tab_overview_step4?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Sensitivity Indicators & Special Needs</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Provides insights into personal health sensitivities, special needs, and custom health
              concerns, including specific conditions or risk factors added by the user.
            </p>
          ),
          target: () => allRefs.tab_overview_step5?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Sleep Pattern</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Visual representation of sleep phases, breathing disruptions, and awakenings.
            </p>
          ),
          target: () => allRefs.tab_overview_step6?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Live Room Map</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Shows the placement of the bed and other objects within the monitored room and live
              user activity.
            </p>
          ),
          target: () => allRefs.tab_overview_step7?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        // {
        //   title: <h1 className="text-xl text-primary">Upcoming Events</h1>,
        //   description: (
        //     <p className="text-base tracking-tight text-primary/80">
        //       Lists scheduled activities and important dates.
        //     </p>
        //   ),
        //   target: () => allRefs.tab_overview_step8?.current,
        //   nextButtonProps: {
        //     children: "Next",
        //     style: buttonStyles,
        //     size: "middle",
        //     color: "default",
        //     variant: "solid",
        //   },
        //   prevButtonProps: {
        //     style: buttonStyles2,
        //   },
        // },
        {
          title: <h1 className='text-xl text-primary'>Recent Notification Log</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Displays recent alerts and observations related to the users&apos;s activities.
            </p>
          ),
          target: () => allRefs.tab_overview_step8?.current,
          nextButtonProps: {
            children: 'Finish',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
      ],
      sleep: [
        {
          title: <h1 className='text-xl text-primary'>Sleep Score</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Displays an overall sleep score and efficiency.
            </p>
          ),
          target: () => allRefs.tab_sleep_step1?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Sleep Events</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Tracks key sleep events such as breathing disruptions, deep breathing phases, and
              other significant occurrences that may impact sleep quality.
            </p>
          ),
          target: () => allRefs.tab_sleep_step2?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Sleep Timeline</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              A detailed visual representation of your sleep stages, showing when you were awake, in
              light sleep, or deep sleep throughout the night.
            </p>
          ),
          target: () => allRefs.tab_sleep_step3?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },

        {
          title: <h1 className='text-xl text-primary'>Sleep Data & Reports</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              This section provides detailed graphs and charts for sleep duration, quality,
              disturbances, bed exits, and trends over 30 days.
            </p>
          ),
          target: () => allRefs.tab_sleep_step4?.current,
          nextButtonProps: {
            children: 'Finish',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
          mask: false,
        },
      ],
      health: [
        {
          title: <h1 className='text-xl text-primary'>Wellness Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Displays key health indicators, including Pulse Rhythm, Breathing Rhythm, and the
              total count of Wellness Events.
            </p>
          ),
          target: () => allRefs.tab_health_step1?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Current Heart & Breathing Patterns</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Displays real-time heart rate and breathing patterns, along with today&apos;s average,
              minimum, and maximum values.
            </p>
          ),
          target: () => allRefs.tab_health_step2?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Breathing Rate Trends</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Displays your breathing rate trends from the past week, highlighting fluctuations and
              patterns for better insights.
            </p>
          ),
          target: () => allRefs.tab_health_step3?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Heart Rate Trends</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Provides a summary of your heart rate variations over the last 7 days, helping you
              track patterns and overall wellness.
            </p>
          ),
          target: () => allRefs.tab_health_step4?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Wellness Patterns & Insights</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Visualizes key metrics such as sleep disturbances, stress levels, and other important
              trends through interactive graphs and reports.
            </p>
          ),
          target: () => allRefs.tab_health_step5?.current,
          nextButtonProps: {
            children: 'Finish',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
          mask: false,
        },
      ],
      activity: [
        {
          title: <h1 className='text-xl text-primary'> Daily Activity Summary</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Displays key metrics such as Indoor Duration, Walking Steps, Skill Time, Walking
              Speed, and Room Entry/Exit Count.
            </p>
          ),
          target: () => allRefs.tab_activity_step1?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Daily Routine Trends</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Tracks sleep-related trends such as when you went to bed, fell asleep, woke up, and
              got up, helping you understand your daily habits.
            </p>
          ),
          target: () => allRefs.tab_activity_step2?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Routine Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Displays key routine patterns, including bedtime, wake-up time, and time spent in
              different activities throughout the day.
            </p>
          ),
          target: () => allRefs.tab_activity_step3?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Walking & Mobility Insights</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Visualizes trends in Walking Steps, Walking Speed, and Room Entry/Exit Frequency over
              30 days.
            </p>
          ),
          target: () => allRefs.tab_activity_step4?.current,
          nextButtonProps: {
            children: 'Finish',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
          },
          placement: 'top',
          prevButtonProps: {
            style: buttonStyles2,
          },
          mask: false,
        },
      ],
    };
    // setTourSteps(tourStepsByTab[activeTab] || []);
  }, [refsReady[activeTab], activeTab]);

  const getActiveTabSteps = () => {
    if (tourSteps.length > 0) {
      return tourSteps;
    } else {
      return [];
    }
  };
  const handleTourFinish = () => {
    setTourOpen(false);
    document.body.classList.remove('no-scroll');
    const updatedSeenTours = { ...seenTours, [activeTab]: true };
    setSeenTours(updatedSeenTours);
    ls.set('seenTours', updatedSeenTours);
  };
  return (
    <div id='elderly-profile-tabs' className='rounded-2xl mt-8 relative' key={params.id}>
      <RefProvider onRefsUpdate={handleRefsUpdate}>
        <WebSocketProvider deviceId={elderlyDetails.deviceId}>
          <CustomContext.Provider
            value={{
              sleepData,
              sleepDataLoading,
              elderlyDetails,
              getElderlyDetails,
            }}
          >
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: 'Baloo2',
                  colorPrimary: '#252F67',
                  colorLinkActive: '#252F67',
                  colorLinkHover: '#252F67',
                  colorLink: '#252F67',
                },
              }}
            >
              {isScrollableLeft && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '30px',
                    background: 'linear-gradient(to right, white, rgba(255,255,255,0))',
                    zIndex: 1,
                    pointerEvents: 'none',
                    borderRadius: '14px',
                    height: '60px',
                  }}
                />
              )}
              {isScrollableRight && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '30px',
                    background: 'linear-gradient(to left, white, rgba(255,255,255,0))',
                    zIndex: 1,
                    pointerEvents: 'none',
                    borderRadius: '14px',
                    height: '60px',
                  }}
                />
              )}
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                size='large' // Adjust size as needed
                className='mb-4'
                tabBarStyle={{ borderBottom: 'none' }}
                destroyInactiveTabPane // Unmount inactive tabs
                renderTabBar={(props, DefaultTabBar) => (
                  <div
                    className='tabs-drag-container'
                    ref={tabListRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onScroll={updateScrollIndicators}
                    style={{
                      overflowX: 'auto',
                      borderRadius: '14px',
                      whiteSpace: 'nowrap',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      display: 'flex',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      userSelect: 'none',
                    }}
                  >
                    <style>
                      {`
              .tabs-drag-container::-webkit-scrollbar {
                display: none;
              }
            `}
                    </style>
                    <DefaultTabBar {...props} />
                  </div>
                )}
              >
                {memoizedTabItems.map((item) => (
                  <Tabs.TabPane
                    key={item.key}
                    tab={
                      <span className='flex items-center gap-2 !border-none'>
                        {item.icon}
                        {item.label}
                      </span>
                    }
                  >
                    <Suspense fallback={<SkeletonView />}>
                      {activeTab === item.key ? item.component : null}
                    </Suspense>
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </ConfigProvider>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: 'Baloo2',
                  colorPrimary: '#252F67',
                  colorLinkActive: '#252F67',
                  colorLinkHover: '#252F67',
                  colorLink: '#252F67',
                  primaryColor: '#252F67',
                },
              }}
            >
              {/* <Tour
                open={tourOpen}
                onFinish={handleTourFinish}
                steps={getActiveTabSteps()}
                onClose={handleTourFinish}
              /> */}
            </ConfigProvider>
          </CustomContext.Provider>
        </WebSocketProvider>
      </RefProvider>
    </div>
  );
}
