import {
  Avatar,
  Badge,
  Breadcrumb,
  DatePicker,
  Layout,
  Menu,
  Modal,
  Switch,
} from 'antd';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  LuChevronRight,
  LuKeyRound,
  LuLogOut,
  LuPanelRightClose,
  LuPencil,
  LuPhoneCall,
  LuTrash,
} from 'react-icons/lu';
import {
  MdDashboard,
} from 'react-icons/md';
import { Link, Outlet } from 'react-router-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
const { confirm } = Modal;
const { Header, Content, Sider } = Layout;
import { Button, Dropdown } from 'antd';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import debounce from 'lodash/debounce';
import { BiArrowBack } from 'react-icons/bi';
import { FiSidebar } from 'react-icons/fi';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { IoSearch } from 'react-icons/io5';
import { RiNotification4Line } from 'react-icons/ri';
import ls from 'store2';

import { getElderlies } from '@/api/elderly';
import { getAlertList } from '@/api/elderlySupport';
import {getDeletedUser, getUserDetails } from '@/api/Users';
import sidebarfulllogo from '@/assets/full_logo.svg';
import logo_icon from '@/assets/logo_icon.svg';
import sidebarlogo from '@/assets/sidebarlogo.svg';
import ChnaePasswordModal from '@/Components/ChangePasswordModal/index';
import DeviceReports from '@/Components/DeviceReports/DeviceReports';
import Loader from '@/Components/Loader';
import NotificationCenter from '@/Components/NotificationCenter';
import AdminSupportAgentTable from '@/Components/PubTable/AdminSupportAgentTable';
import CreateAdminSupportAgent from '@/Components/PubTable/CreateAndEditUsers';
import { useNurseAlert } from '@/Context/AlertToggleContext';
import { SidebarContext } from '@/Context/CustomContext';
import * as SidebarContext1 from '@/Context/CustomUsertable';
import { useNotification } from '@/Context/useNotification';
import LogOutModal from '@/Shared/LogOut/LogOutModal';
import SearchInput from '@/Shared/Search/SearchInput';
import RoleSort from '@/Shared/sort/RoleSort';
import Sort from '@/Shared/sort/Sort';
import { useCountStore } from '@/store/index';
import { removeToken } from '@/utils/auth';
import { getToken, setToken } from '@/utils/auth';
import { useIsSmallScreen } from '@/utils/isSmallScreen';
import { initiateCall } from '@/utils/makeDeviceCall';
import { escapeRegExp } from '@/utils/regex';

import GetRecentlyDeletedUserColumn from './utiles';
const RoleBaseSortItem = {
  super_admin: [
    'All Users',
    'Distributors',
    'Offices',
    'Monitoring Stations',
    'Control Centers',
    'Sales Agents',
    'Nursing Homes',
    'Nurses',
    'Support Agents',
    'End Users',
  ],
  distributor: ['All Users', 'Offices', 'Sales Agents'],
};
const RoleMapping = {
  Distributors: 'distributor',
  Offices: 'office',
  'Monitoring Stations': 'monitoring_agency',
  'Control Centers': 'monitoring_station',
  'Sales Agents': 'sales_agent',
  'Nursing Homes': 'nursing_home',
  Nurses: 'nurse',
  'Support Agents': 'support_agent',
  'End Users': 'end_user',
};

import { NAV_CONFIG } from '@/config/navigationConfig';

const MainLayout = () => {
  const navigate = useNavigate();
  // const [activeMemu, setActiveMenu] = useState("");
  const [edit, setEdit] = useState(false);
  const [resetModal, setResetMOdal] = useState(false);
  const [loader, setLoader] = useState(false);
  const { rolesFormatter, isLogin, setActiveMenu, activeMemu, setDailyRepDate } =
    useContext(SidebarContext);
  const location = useLocation();
  const currentPath = location.pathname;
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [isRecentlyDelete, setIsRecentlyDelete] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const [toggleMainSidebar, setToggleMainSidebar] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnred] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openAlertConfirmation, setOpenAlertConfirmation] = useState(false);
  const role = ls.get('role');
  const user = ls.get('user');
  const [searchResult, setSearchResult] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  // const elderlyDetails = ls.get("elderly_details");
  // const { elderlyDetails } = useContext(SidebarContext);
  const [elderlyDetails, setElderlyDetails] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const isSmallScreen = useIsSmallScreen(1400);
  const data = ['Time', 'Name'];
  const [search, setSearch] = useState('');
  // const rootRole = ls.get("rootRole");
  // const mainRole = ls.get("mainRole");
  const [rootRole, setRootRole] = useState('');
  const [mainRole, setMainRole] = useState('');
  const [query, setQuey] = useState({});
  const [selected, setSelected] = useState('Time');
  const [selectedRole, setSelectedRole] = useState('All Users');
  const [page, SetPage] = useState({
    page: 1,
    limit: 10,
  });
  const [total, SetTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const { dashboardAlerts, toggleAlert, setManualOverride, setDashboardAlerts, deactivateAlert } =
    useNurseAlert();

  const [recentlyDeletedUsers, setRecentlyDeletedUsers] = useState([]);
  const [defaultDevice, setDefaultDevice] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);
  const deletedUserColumns = GetRecentlyDeletedUserColumn();
  const { setStoreRole, setUser } = useCountStore();
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // null, "recentlyDeleted", or "reports"
  const elderlyProfilePath = /^#\/supporter\/elderlies\/elderly-profile\/\d+(\/?|\?.*)$/;
  const pathWithoutDomain = currentPath.split('#')[1] || '';
  if (!isLogin) {
    window.location.href = '/';
  }
  const { notificationEvent } = useNotification();

  useEffect(() => {
    const rootRole = ls.get('rootRole');
    const mainRole = ls.get('mainRole');
    setMainRole(mainRole);
    setRootRole(rootRole);
  }, [currentPath]);
  async function getUsers() {
    getUserDetails({
      id: user._id,
    })
      .then((res) => {
        if (res) {
          setUserData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    if (isSmallScreen) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const currentRoleNav = NAV_CONFIG[user.role] || NAV_CONFIG.others;
    let foundParent = null;
    // Check all navigation items for inner page matches
    currentRoleNav.forEach((item) => {
      if (item.innerPages) {
        Object.keys(item.innerPages).forEach((pathPattern) => {
          const fullPath = `${item.link}${pathPattern}`
            .replace(/\/\//g, '/') // Remove double slashes
            .replace(/:\w+/g, '[^/]+') // Handle parameters
            .replace(/\*/g, '.*'); // Handle wildcards

          const regex = new RegExp(`^${fullPath}$`, 'i');
          if (regex.test(currentPath)) {
            foundParent = item?.innerPages[pathPattern];
          }
        });
      }
    });

    if (foundParent) {
      setActiveMenu(foundParent);
      return;
    }

    // Finally check regular paths
    const activeItem = currentRoleNav.find((item) =>
      item.matchPaths.some((path) => {
        const regexReadyPath = path.replace(/\*/g, '.*').replace(/:\w+/g, '[^/]+');

        const regex = new RegExp(`^${regexReadyPath}$`, 'i');
        return regex.test(currentPath);
      })
    );

    setActiveMenu(activeItem?.label || currentRoleNav[0]?.label);
    // setElderlyDetails(ls.get("elderly_details"));
  }, [currentPath, user?.role]);

  useEffect(() => {
    getUsers();
    // setElderlyDetails(ls.get("elderly_details"));
    getAlertList({
      to_date: '2025-01-01',
      from_date: dayjs().format('YYYY-MM-DD'),
      is_read: false,
      lookup: false,
      page: 1,
      limit: 1,
      ...{
        event: '2,5', //6
        is_online: '1',
        // entry_2_exit: "1",
      },
    })
      .then((res) => {
        setHasUnred(res?.data?.length > 0);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [currentPath, notificationEvent, open]);
  const getRecentlyDeletedUsers = useCallback(() => {
    if (!toggleMainSidebar) return;
    setLoading(true);
    getDeletedUser({ ...query, ...page }).then((res) => {
      if (res) {
        setRecentlyDeletedUsers(res.data);
        SetTotal(res.total);
        setLoading(false);
      }
    });
  }, [query, toggleMainSidebar, page]);

  useEffect(() => {
    if (
      !currentPath?.includes('/supporter/elderlies/elderly-profile/') ||
      !currentPath?.includes('/supporter/nurse/dashboard')
    ) {
      const deviceCode = ls.get('elderly_details')?.deviceId;

      // if (deviceCode) {
      //   const deviceCodesArray = deviceCode.split(",");
      //   deviceCodesArray.forEach((deviceNo) => {
      //     unsubscribeFromMqtt({
      //       uid: deviceNo,
      //       messageType: ["1", "2", "3", "4"],
      //     })
      //       .then((res) => {
      //         // Handle the response if needed
      //       })
      //       .catch((err) => {
      //         console.log(
      //           `Error unsubscribing for Device No ${deviceNo}:`,
      //           err
      //         );
      //       });
      //   });
      // }
    }
  }, [currentPath]);

  function isTokenValid() {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'));
    if (!tokenData) return null;

    const currentTime = Date.now();
    if (currentTime < tokenData.expiry) {
      return tokenData;
    }

    return null;
  }

  const onChange = (date, dateString) => {
    const newDate = dayjs(dateString).subtract(1, 'day');
    const formattedDate = newDate.format('YYYY-MM-DD');
    setDailyRepDate(formattedDate);
  };
  useEffect(() => {
    setDailyRepDate(null);
    const defaultDevice = elderlyDetails?.rooms?.find((room) => room.device_no);
    const dropdownItems = elderlyDetails?.rooms
      ?.filter((room) => room.device_no && room.device_no !== defaultDevice?.device_no)
      .map((room) => ({
        label: room.name,
        key: room.device_no,
      }));
    setDefaultDevice(defaultDevice);
    setDropdownItems(dropdownItems);
  }, [currentPath, elderlyDetails]);
  const handleCall = (id) => {
    if (id) {
      initiateCall(id);
    }
  };
  // function getTokenToMakeCall(id) {
  //   const storedToken = isTokenValid();
  //   if (storedToken) {
  //     // Token is still valid, use it to make the call
  //     makeACall(id, storedToken.accessToken, storedToken.refreshToken);
  //   } else {
  //     getTokenToCall()
  //       .then((token) => {
  //         const accessToken = token?.data?.access_token;
  //         const refreshToken = token?.data?.refresh_token;
  //         const expiryTime = Date.now() + 3600 * 1000; // Set expiry time to 1 hour

  //         // Store the new token and expiry time in localStorage
  //         localStorage.setItem(
  //           "tokenData",
  //           JSON.stringify({
  //             accessToken,
  //             refreshToken,
  //             expiry: expiryTime,
  //           })
  //         );

  //         makeACall(id, accessToken, refreshToken);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching token:", error);
  //       });
  //   }
  // }
  // function makeACall(uid, accessToken, refreshToken) {
  //   openPopup(uid, accessToken, refreshToken);
  // }
  // function openPopup(uid, accessToken, refreshToken) {
  //   const data = {
  //     uid: uid,
  //     token: accessToken,
  //     freshToken: refreshToken,
  //     lang: "en_US",
  //   };

  //   const popupUrl = `https://console.elderlycareplatform.com/metting?${new URLSearchParams(
  //     data
  //   ).toString()}`;

  //   // Window features for customization
  //   const windowFeatures =
  //     "width=500,height=600,scrollbars=no,resizable=no,location=no,toolbar=no,status=no,menubar=no";

  //   // Open the window with the custom features
  //   const popup = window.open(popupUrl, "Device Calling", windowFeatures);

  //   if (popup) {
  //     popup.focus(); // Focus on the new popup window
  //   } else {
  //     console.error("Popup window could not be opened");
  //   }
  // }
  const handleClick = (key, item) => {
    navigate(item.link);
  };

  const handleSidebarClose = () => {
    setToggleSidebar(!toggleSidebar);
    if (toggleMainSidebar) {
      setToggleMainSidebar(false);
    }
  };

  // const handleRecentlyDeleted = () => {
  //   if (toggleMainSidebar) {
  //     setToggleSidebar(true);
  //     setToggleMainSidebar(false);
  //   } else {
  //     setToggleSidebar(false);
  //     setToggleMainSidebar(true);
  //   }
  //   if (activeSection === "recentlyDeleted") {
  //     setActiveSection(null);
  //   } else {
  //     setActiveSection("recentlyDeleted");
  //   }
  // };
  // const handleReports = () => {
  //   if (activeSection === "reports") {
  //     setActiveSection(null);
  //   } else {
  //     setActiveSection("reports");
  //   }

  //   if (toggleMainSidebar) {
  //     // If recently deleted sidebar is open, close both sidebars
  //     setToggleSidebar(true);
  //     setToggleMainSidebar(false);
  //   } else {
  //     // If recently deleted sidebar is closed, open it and close the main sidebar
  //     setToggleSidebar(false);
  //     setToggleMainSidebar(true);
  //   }
  // };

  const handleRecentlyDeleted = () => {
    if (activeSection === 'recentlyDeleted') {
      setActiveSection(null);
      setToggleMainSidebar(false);
    } else {
      setActiveSection('recentlyDeleted');
      setToggleMainSidebar(true);
    }
  };

  const handleReports = () => {
    if (activeSection === 'reports') {
      setActiveSection(null); // Close if already open
      setToggleMainSidebar(false); // Close sidebar
    } else {
      setActiveSection('reports'); // Open Reports
      setToggleMainSidebar(true); // Ensure sidebar is open
    }
  };
  const handleCloseRecentlyDeleted = () => {
    setToggleSidebar(true);
    setToggleMainSidebar(false);
  };
  const handelLogout = async () => {
    try {
      await deactivateAlert();
    } catch (error) {
      console.error('deactivateAlert failed:', error);
    }
    removeToken();
  };

  const handBlurchange = useCallback(
    debounce((value) => {
      setQuey((prev) => ({ ...prev, search: value.trim() }));
      SetPage((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );
  useEffect(() => {
    return () => {
      handBlurchange.cancel();
    };
  }, []);

  useEffect(() => {
    if (selected && query.orderType != selected) {
      delete query.sort_by_created_at;
      delete query.sort_by_name;
      setQuey({
        ...(selected === 'Name' ? { sort_by_name: 1 } : { sort_by_created_at: 1 }),
      });
      SetPage({ ...page, page: 1 });
    }
  }, [selected]);
  useEffect(() => {
    if (selectedRole && selectedRole !== 'All Users') {
      setQuey({
        ...query,
        role: RoleMapping[selectedRole],
      });

      SetPage({ ...page, page: 1 });
    } else {
      delete query.role;
      setQuey({
        ...query,
      });
      SetPage({ ...page, page: 1 });
    }
  }, [selectedRole]);
  useEffect(() => {
    getRecentlyDeletedUsers();
  }, [getRecentlyDeletedUsers]);
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
    setStoreRole({ role: data.role });
    setUser({ role: data.role });

    setTimeout(() => {
      setLoader(false);
      nvto(data?.role);
    }, 1500);
  }
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(Boolean);
    const role = userData?.role;

    const baseConfig = NAV_CONFIG[mainRole] || NAV_CONFIG['others'];

    const dashboardItem = baseConfig.find((item) => item.label.toLowerCase() === 'dashboard');

    const matchedNav = baseConfig
      .slice()
      .sort((a, b) => {
        const aMax = Math.max(...(a.matchPaths || []).map((p) => p.length));
        const bMax = Math.max(...(b.matchPaths || []).map((p) => p.length));
        return bMax - aMax; // longest path first
      })
      .find((nav) =>
        nav.matchPaths?.some((path) => {
          const base = path.replace('/*', '').replace('*', '');
          return location.pathname === base || location.pathname.startsWith(base);
        })
      );

    const items = [];

    // Dashboard link
    if (dashboardItem) {
      items.push({
        title: (
          <Link to={dashboardItem.link}>
            <span className='flex items-center gap-1 capitalize font-semibold text-gray-500'>
              <MdDashboard />
              Home
            </span>
          </Link>
        ),
      });
    }

    // Add main menu if it's not dashboard
    if (matchedNav && matchedNav.key !== dashboardItem?.key) {
      items.push({
        title: (
          <Link to={matchedNav.link} className='capitalize font-semibold text-gray-500'>
            {matchedNav.label}
          </Link>
        ),
      });
    }

    // Add inner page (last one — active page)
    let innerMatched = false;
    if (matchedNav?.innerPages) {
      const innerKeys = Object.keys(matchedNav.innerPages);
      innerKeys.forEach((key) => {
        const basePath = key.split('/:')[0];
        if (location.pathname.includes(basePath)) {
          items.push({
            title: (
              <span className='capitalize font-semibold text-primary'>
                {matchedNav.innerPages[key]}
              </span>
            ),
          });
          innerMatched = true;
        }
      });
    }

    // If no inner page matched and it's not dashboard
    if (!innerMatched && matchedNav && matchedNav.key === dashboardItem?.key) {
      // Add active color to dashboard if it's the last page
      items[0] = {
        title: (
          <span className='flex items-center gap-1 capitalize font-semibold text-primary'>
            <MdDashboard />
            Home
          </span>
        ),
      };
    }

    return items;
  };
  function getItem(label, key, icon, link, matchPaths) {
    return {
      key,
      icon,
      label: (
        <NavLink to={link} className={({ isActive }) => (isActive ? 'active' : '')}>
          {label}
        </NavLink>
      ),
    };
  }

  const getActiveKey = () => {
    const config = NAV_CONFIG[user.role] || NAV_CONFIG.others;
    const activeItem = config.find((item) =>
      item.matchPaths.some((path) =>
        path.includes('*')
          ? location.pathname.startsWith(path.replace('/*', ''))
          : location.pathname === path
      )
    );
    return activeItem ? activeItem.key : '1'; // Default to first item
  };

  // Create items array using getItem
  const items = (NAV_CONFIG[user.role] || NAV_CONFIG.others)
    .filter((item) => item.key !== '5')
    .map((item) =>
      getItem(
        item.label,
        item.key,
        location.pathname.startsWith(item.matchPaths[0].replace('/*', '')) ? (
          <item.ActiveIcon size={20} />
        ) : (
          <item.InactiveIcon size={20} />
        ),
        item.link,
        item.matchPaths
      )
    );
  const items2 = (NAV_CONFIG[user.role] || NAV_CONFIG.others)
    .filter((item) => item.key === '5')
    .map((item) =>
      getItem(
        item.label,
        item.key,
        location.pathname.startsWith(item.matchPaths[0].replace('/*', '')) ? (
          <item.ActiveIcon size={16} />
        ) : (
          <item.InactiveIcon size={16} />
        ),
        item.link,
        item.matchPaths
      )
    );
  const getElderlyBySearch = useCallback(() => {
    if (searchQuery.trim() === '') {
      setSearchResult([]); // Clear results if the search query is empty
      return;
    }

    getElderlies({
      search: searchQuery,
    })
      .then((res) => {
        setSearchResult(res?.data);
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchQuery]);
  useEffect(() => {
    getElderlyBySearch();
  }, [getElderlyBySearch]);
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, `<mark style="background-color: #80CAA7; color: white;">$1</mark>`);
  };

  const handleClickOutside = () => {
    setIsFocused(false);
  };
  const ref = useOutsideClick(handleClickOutside);
  function onOkHnadler() {
    toggleAlert(!dashboardAlerts);
    setOpenAlertConfirmation(false);
  }
  function handleChnageDashboardAlerts(e) {
    setOpenAlertConfirmation(true);
  }
  return (
    <>
      <Layout className='overflow-hidden'>
        {role !== 'nurse' ? (
          <Sider
            breakpoint='lg'
            collapsedWidth='0'
            width='120'
            onCollapse={(collapsed) => setToggleMainSidebar(collapsed)}
            collapsed={toggleMainSidebar}
          >
            <img src={sidebarlogo} className='demo-logo-vertical' alt='sidebar-logo' />

            <Menu theme='dark' mode='inline' selectedKeys={[activeMemu]} inlineCollapsed={false}>
              {(NAV_CONFIG[user.role] || NAV_CONFIG.others).map((item) => (
                <Menu.Item
                  key={item.key}
                  icon={
                    activeMemu === item.label ? (
                      <item.ActiveIcon size={25} />
                    ) : (
                      <item.InactiveIcon size={25} />
                    )
                  }
                  onClick={() => {
                    handleClick(item.key, item);
                    // setActiveMenu(item.label);
                  }}
                >
                  <NavLink
                    to={item.link}
                    exact='true'
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    {item.label}
                  </NavLink>
                </Menu.Item>
              ))}
            </Menu>

            {rootRole === 'super_admin' && mainRole !== 'super_admin' && (
              <div
                className='absolute text-white bottom-10 text-base font-semibold text-center cursor-pointer w-full'
                onClick={handleRoleBack}
              >
                Go Back
              </div>
            )}
          </Sider>
        ) : (
          <Sider
            breakpoint='lg'
            collapsedWidth='75'
            onCollapse={(collapsed) => {
              setToggleMainSidebar(collapsed);
              // onCollapse?.(collapsed);
            }}
            collapsed={collapsed}
            width={260}
            style={{
              borderRight: '1px solid #E6E6E6',
            }}
            className='nurse-sider relative !bg-white'
          >
            <div className='flex justify-center pb-[22px]  pt-[28px]'>
              <img
                src={collapsed ? logo_icon : sidebarfulllogo}
                className='h-[22px] object-contain'
                alt='sidebar-logo'
              />
            </div>
            <div className='w-full h-[2px] bg-gradient-to-r from-white via-gray-300 to-white mb-[24px]'></div>
            <Menu
              theme='light'
              selectedKeys={[getActiveKey()]}
              items={items}
              className='w-[260px] px-2'
            />
            <div className='h-[1px] w-full my-6 mb-2 bg-[#E5E7EB]'></div>
            <Menu
              theme='light'
              // mode="inline"
              selectedKeys={[getActiveKey()]}
              items={items2}
              className='w-[260px] px-2'
            />
            {!collapsed && (
              <div
                className='absolute bottom-5 left-2 right-2 bg-[#514EB5] text-white rounded-[9px] p-3'
                style={{
                  bottom: rootRole === 'super_admin' && mainRole !== 'super_admin' && '80px',
                }}
              >
                <div className='flex items-center justify-between mb-1'>
                  <span className='font-medium text-base'>Dashboard Alerts</span>

                  <Switch
                    size='small'
                    checked={dashboardAlerts}
                    onChange={handleChnageDashboardAlerts}
                    style={{
                      backgroundColor: dashboardAlerts ? 'white' : undefined,
                      borderColor: dashboardAlerts ? '#d9d9d6' : undefined,
                    }}
                    className='custom-switch w-[40px] '
                  />

                  <style>
                    {`
                      .custom-switch.ant-switch-checked .ant-switch-handle {
                        background-color: #5A46D6;
                        border-radius: 50%;
                      }
                      
                      .custom-switch.ant-switch-checked .ant-switch-handle::before {
                        background-color: transparent;
                        border-radius: 50%;
                      }
                    `}
                  </style>
                </div>
                <p className='text-xs opacity-90 leading-snug italic font-light'>
                  Dashboard alerts are active while you’re here. SMS alerts to your phone are
                  disabled. Turn this off to receive mobile SMS notifications.
                </p>
              </div>
            )}
            {rootRole === 'super_admin' && mainRole !== 'super_admin' && (
              <div
                className='absolute text-primary bottom-4 text-base font-semibold text-center cursor-pointer w-full bg-white py-2'
                onClick={handleRoleBack}
              >
                {!collapsed ? 'Go Back' : <BiArrowBack size={20} className='mx-auto' />}
              </div>
            )}
          </Sider>
        )}

        <Layout
          style={{
            height: '100vh',
            padding: '0px !importent',
            position: 'relative',
          }}
        >
          {role !== 'nurse' ? (
            <Header
              style={{
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'Baloo2',
                // padding: "20px",
                height: '100px',
                paddingLeft: '30px',
                paddingRight: '30px',
                position: 'relative',
              }}
            >
              <div>
                <h1 className='text-text-primary text-[28px] font-semibold capitalize leading-10'>
                  {activeMemu}
                </h1>
                <Breadcrumb items={getBreadcrumbItems()} style={{ fontSize: 16 }} separator='>' />
              </div>
              <div className='flex gap-8'>
                {!currentPath?.includes('/supporter/elderlies/elderly-profile/') &&
                  userData &&
                  mainRole === 'nurse' && (
                    <div>
                      {' '}
                      <Badge dot={hasUnread}>
                        <Avatar
                          shape='square'
                          size='large'
                          className='bg-slate-100 cursor-pointer hover:bg-slate-200'
                          onClick={() => setOpen(true)}
                          icon={<RiNotification4Line className='text-primary' />}
                        />
                      </Badge>
                      <NotificationCenter
                        open={open}
                        setOpen={setOpen}
                        notificationEvent={notificationEvent}
                      />
                    </div>
                  )}

                {userData && !currentPath?.includes('/supporter/elderlies/elderly-profile/') && (
                  <div
                    className='flex items-center gap-3 cursor-pointer'
                    onClick={handleSidebarClose}
                  >
                    <div className='flex flex-col items-end justify-start'>
                      <p className='leading-[0.98] font-bold text-xl text-primary'>
                        {userData && userData.last_name
                          ? `${userData.name} ${userData.last_name}`
                          : userData.name}
                      </p>
                      <span className='leading-1 font-medium text-sm text-text-secondary'>
                        {rolesFormatter[userData.role]}
                      </span>
                    </div>
                    <div className='h-[42px] w-[42px] bg-[#80CAA7] flex items-center justify-center text-white font-bold text-lg rounded-full'>
                      <p>
                        {userData && userData.last_name
                          ? `${userData.name.charAt(0).toUpperCase()} ${userData.last_name
                              .charAt(0)
                              .toUpperCase()}`
                          : userData.name.slice(0, 2).toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {currentPath?.includes('/supporter/elderlies/elderly-profile/') && (
                <div className='flex items-center gap-3 cursor-pointer'>
                  {/* <Dropdown.Button
                  menu={{
                    items: [
                      {
                        label: "Call 911",
                        key: "1",
                      },
                      {
                        label: "Call Caregiver",
                        key: "2",
                      },
                    ],
                    onClick: () => {
                      console.log("clicked");
                    },
                  }}
                  size="large"
                >
                  <LuPhoneCall />
                  Call Elderly
                </Dropdown.Button> */}
                  <DatePicker
                    size='large'
                    onChange={onChange}
                    placeholder='Today Report'
                    style={{ width: '220px' }}
                  />
                  {elderlyDetails &&
                    defaultDevice &&
                    (dropdownItems.length > 0 ? (
                      <Dropdown.Button
                        style={{ width: 'fit-content' }}
                        menu={{
                          items: dropdownItems,
                          onClick: ({ key }) => handleCall(key),
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (defaultDevice?.device_no) {
                            handleCall(defaultDevice.device_no);
                          }
                        }}
                        size='large'
                        className='border-[#514EB5] !text-[#514EB5] !bg-[#514EB5]/5 font-medium'
                      >
                        <LuPhoneCall />
                        {`Call To ${defaultDevice?.name || 'Device'}`}{' '}
                        {/* Default room with device_no */}
                      </Dropdown.Button>
                    ) : (
                      <Button
                        style={{ width: 'fit-content' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (defaultDevice?.device_no) {
                            handleCall(defaultDevice.device_no);
                          }
                        }}
                        size='large'
                        className='border-[#514EB5] !text-[#514EB5] !bg-[#514EB5]/5 font-medium'
                      >
                        <LuPhoneCall />
                        {`Call To ${defaultDevice?.name || 'Device'}`}{' '}
                        {/* Default room with device_no */}
                      </Button>
                    ))}
                </div>
              )}
            </Header>
          ) : (
            <Header
              style={{
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'Baloo2',
                // padding: "20px",
                height: '82px',
                paddingLeft: '30px',
                paddingRight: '30px',
                position: 'relative',
                borderBottom: '1px solid #E6E6E6',
              }}
            >
              {/* <Button
                type="text"
                icon={collapsed ? <GoSidebarCollapse /> : <GoSidebarExpand />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              /> */}
              <div className='flex gap-4 items-center'>
                <span onClick={() => setCollapsed(!collapsed)} className='cursor-pointer'>
                  {collapsed ? (
                    <FiSidebar size={22} className='rotate-180' />
                  ) : (
                    <FiSidebar size={22} />
                  )}
                </span>
                <div className='h-4 w-[2px] bg-slate-300'></div>
                <div>
                  <h1 className='text-text-primary font-poppins text-[21px] font-semibold capitalize leading-10 text-nowrap'>
                    {activeMemu}
                  </h1>
                </div>
                <div className='w-[3px] h-[40px] bg-gradient-to-t from-white via-gray-300 to-white'></div>
                <div className='flex items-center gap-2 relative' ref={ref}>
                  <IoSearch size={20} className='opacity-50' />
                  <input
                    className='!border-none !outline-none font-poppins text-base'
                    placeholder='Search Anything...'
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                  />
                  {isFocused && searchQuery.trim() !== '' && (
                    <div
                      id='searchResult'
                      className='mt-0 max-h-[600px]   overflow-auto rounded-lg shadow-lg bg-white border border-gray-300 absolute top-10 left-0 z-[1000] w-[600px] '
                    >
                      <ul>
                        {searchResult?.map((result) => (
                          <li
                            key={result._id}
                            className='p-4 hover:bg-gray-100 border-b border-gray-200 cursor-pointer'
                            onClick={() => {
                              navigate(`/supporter/elderlies/elderly-profile/${result?._id}`);
                            }}
                          >
                            <div className='font-semibold text-lg text-gray-800'>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(highlightText(result.name, searchQuery)),
                                }}
                              />
                            </div>
                            <div className='text-sm text-gray-500'>
                              <strong>Room No.:</strong>{' '}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    highlightText(result.room_no.toString(), searchQuery)
                                  ),
                                }}
                              />
                            </div>
                            <div className='text-sm text-gray-500'>
                              <strong>Age:</strong>{' '}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    highlightText(result.age.toString(), searchQuery)
                                  ),
                                }}
                              />
                            </div>
                            <div className='text-sm text-gray-500'>
                              <strong>Address:</strong>{' '}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    highlightText(result.address || 'N/A', searchQuery)
                                  ),
                                }}
                              />
                            </div>

                            <div className='text-sm text-gray-500'>
                              <strong>Sensitivity Factors:</strong>{' '}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    highlightText(result.diseases.join(', '), searchQuery)
                                  ),
                                }}
                              />
                            </div>
                            <div className='text-sm text-gray-500'>
                              <strong>Comments:</strong>{' '}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    highlightText(
                                      result.comments.map((c) => c.comment).join(', '),
                                      searchQuery
                                    )
                                  ),
                                }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex gap-8'>
                {!currentPath?.includes('/supporter/elderlies/elderly-profile/') &&
                  userData &&
                  mainRole === 'nurse' && (
                    <div>
                      {' '}
                      <Badge dot={hasUnread}>
                        <Avatar
                          shape='square'
                          size='large'
                          className='bg-slate-100 cursor-pointer hover:bg-slate-200'
                          onClick={() => setOpen(true)}
                          icon={<RiNotification4Line className='text-primary' />}
                        />
                      </Badge>
                      <NotificationCenter
                        open={open}
                        setOpen={setOpen}
                        notificationEvent={notificationEvent}
                      />
                    </div>
                  )}

                {userData && !currentPath?.includes('/supporter/elderlies/elderly-profile/') && (
                  <div
                    className='flex items-center gap-3 cursor-pointer'
                    onClick={handleSidebarClose}
                  >
                    <div className='flex flex-col items-end justify-start'>
                      <p className='leading-[0.98] font-bold text-xl text-primary'>
                        {userData && userData.last_name
                          ? `${userData.name} ${userData.last_name}`
                          : userData.name}
                      </p>
                      <span className='leading-1 font-medium text-sm text-text-secondary'>
                        {rolesFormatter[userData.role]}
                      </span>
                    </div>
                    <div className='h-[42px] w-[42px] bg-[#80CAA7] flex items-center justify-center text-white font-bold text-lg rounded-full'>
                      <p>
                        {userData && userData.last_name
                          ? `${userData.name.charAt(0).toUpperCase()} ${userData.last_name
                              .charAt(0)
                              .toUpperCase()}`
                          : userData.name.slice(0, 2).toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {currentPath?.includes('/supporter/elderlies/elderly-profile/') && (
                <div className='flex items-center gap-3 cursor-pointer'>
                  {/* <Dropdown.Button
                  menu={{
                    items: [
                      {
                        label: "Call 911",
                        key: "1",
                      },
                      {
                        label: "Call Caregiver",
                        key: "2",
                      },
                    ],
                    onClick: () => {
                      console.log("clicked");
                    },
                  }}
                  size="large"
                >
                  <LuPhoneCall />
                  Call Elderly
                </Dropdown.Button> */}
                  <DatePicker
                    size='large'
                    onChange={onChange}
                    placeholder='Today Report'
                    style={{ width: '220px' }}
                  />
                  {elderlyDetails &&
                    defaultDevice &&
                    (dropdownItems.length > 0 ? (
                      <Dropdown.Button
                        style={{ width: 'fit-content' }}
                        menu={{
                          items: dropdownItems,
                          onClick: ({ key }) => handleCall(key),
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (defaultDevice?.device_no) {
                            handleCall(defaultDevice.device_no);
                          }
                        }}
                        size='large'
                        className='border-[#514EB5] !text-[#514EB5] !bg-[#514EB5]/5 font-medium'
                      >
                        <LuPhoneCall />
                        {`Call To ${defaultDevice?.name || 'Device'}`}{' '}
                        {/* Default room with device_no */}
                      </Dropdown.Button>
                    ) : (
                      <Button
                        style={{ width: 'fit-content' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (defaultDevice?.device_no) {
                            handleCall(defaultDevice.device_no);
                          }
                        }}
                        size='large'
                        className='border-[#514EB5] !text-[#514EB5] !bg-[#514EB5]/5 font-medium'
                      >
                        <LuPhoneCall />
                        {`Call To ${defaultDevice?.name || 'Device'}`}{' '}
                        {/* Default room with device_no */}
                      </Button>
                    ))}
                </div>
              )}
            </Header>
          )}
          <Content
            style={{
              padding:
                ((mainRole == 'nurse' || mainRole == 'super_admin') &&
                  (currentPath.includes('/supporter/nurse/dashboard') ||
                    currentPath.includes('/super-admin/reviews') ||
                    currentPath.includes('/super-admin/reviews/details') ||
                    currentPath.includes('/supporter/export-compliance'))) ||
                currentPath.includes('/management')
                  ? '0px'
                  : '0px 16px 20px 16px',
              fontFamily: 'Baloo2',
              background: '#F1F5F9',
              overflow: 'auto',
            }}
            className={`overflow-x-hidden ${role == 'distrbutor' && '!p-0'}`}
          >
            {loader ? <Loader loaderTitle='Going Back' /> : null}
            <Outlet context={{ setElderlyDetails }} />
          </Content>
        </Layout>
        {userData ? (
          <Sider
            collapsed={toggleSidebar}
            collapsedWidth={0}
            width={toggleMainSidebar ? '100%' : 360}
            style={{
              background: '#fff',
              fontFamily: 'Baloo2',
              zIndex: 1000,
            }}
            className='transition-all duration-500 h-[100vh] overflow-x-hidden overflow-y-auto border-none'
          >
            <div className={`${toggleMainSidebar ? 'flex' : 'block'} overflow-hidden border-none`}>
              <div
                className={`${
                  toggleMainSidebar ? 'w-[38%]' : 'w-[100%]'
                } h-[100vh] p-4 flex flex-col gap-7 border border-r-2 overflow-y-auto border-[#EBEBEE0]`}
              >
                <div
                  className={`p-2 text-text-secondary hover:text-text-primary cursor-pointer  w-fit `}
                  onClick={handleCloseRecentlyDeleted}
                >
                  <LuPanelRightClose size={24} />
                </div>
                <div className='flex flex-col items-center gap-3'>
                  <div className='h-[95px] w-[95px] bg-[#80CAA7] flex items-center justify-center text-white font-bold text-4xl rounded-full'>
                    <p>
                      {userData && userData.last_name
                        ? `${userData.name.charAt(0).toUpperCase()} ${userData.last_name
                            .charAt(0)
                            .toUpperCase()}`
                        : userData.name.slice(0, 2).toUpperCase()}
                    </p>
                  </div>
                  <div className='flex flex-col items-center justify-center text-center'>
                    <p className='leading-[0.98] font-bold text-[24px] text-primary'>
                      {userData && userData.last_name
                        ? `${userData.name} ${userData.last_name}`
                        : userData.name}
                    </p>
                    <span className='leading-1 font-medium text-base text-text-secondary'>
                      {rolesFormatter[userData.role]}
                    </span>
                  </div>
                </div>
                <div>
                  <ul className='flex flex-col gap-6'>
                    {userData.agent_id && userData.role == 'sales_agent' ? (
                      <li className='flex flex-col gap-1'>
                        <span className='text-sm font-semibold text-text-secondary'>Agent ID</span>
                        <p className='text-[18px] leading-[0.8] font-normal text-text-primary text-wrap'>
                          {userData.agent_id}
                        </p>
                      </li>
                    ) : null}
                    {userData.email ? (
                      <li className='flex flex-col gap-1'>
                        <span className='text-sm font-semibold text-text-secondary'>Email</span>
                        <p className='text-[18px] leading-[0.8] font-normal text-text-primary text-wrap'>
                          {userData.email}
                        </p>
                      </li>
                    ) : null}
                    {userData.contact_number ? (
                      <li className='flex flex-col gap-1'>
                        <span className='text-sm font-semibold text-text-secondary'>
                          Contact Number
                        </span>
                        <p className='text-[18px] leading-[0.8] font-normal text-text-primary text-wrap'>
                          {userData.contact_code ? userData.contact_code : ''}{' '}
                          {userData.contact_number}
                        </p>
                      </li>
                    ) : null}
                    {userData.address ? (
                      <li className='flex flex-col gap-1'>
                        <span className='text-sm font-semibold text-text-secondary'>Address</span>
                        <p className='text-[18px] leading-[0.8] font-normal text-text-primary text-wrap'>
                          {userData.address}
                        </p>
                      </li>
                    ) : null}
                  </ul>
                </div>

                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-2'>
                    <span className='text-primary font-bold'>MENU</span>
                    <hr className='h-[2px] w-full bg-[#D8D9DE]' />
                  </div>

                  <ul className='flex flex-col gap-4'>
                    <li
                      className='flex justify-between items-center group cursor-pointer'
                      onClick={() => setEdit(true)}
                    >
                      <div className='flex items-center gap-4'>
                        <div className='text-[#4356FD] w-[45px] h-[45px] bg-[#4356FD]/10 flex items-center justify-center rounded-[50px] transition-all duration-300 ease-in-out group-hover:rounded-xl group-hover:bg-[#4356FD] group-hover:text-white'>
                          <LuPencil size={20} />
                        </div>
                        <p className='text-[18px] text-text-primary'>Change Profile</p>
                      </div>
                      <div className='relative w-[24px] h-[24px] text-text-primary/5 transition-transform duration-300 ease-in-out group-hover:translate-x-[5px] bg-[#4356FD]/10 flex items-center justify-center rounded-full'>
                        <LuChevronRight className='text-text-primary/60' size={18} />
                      </div>
                    </li>
                    <li
                      className='flex justify-between items-center group cursor-pointer'
                      onClick={() => setResetMOdal(true)}
                    >
                      <div className='flex items-center gap-4'>
                        <div className='text-[#DBAF00] w-[45px] h-[45px] bg-[#DBAF00]/10 flex items-center justify-center rounded-[50px] transition-all duration-300 ease-in-out group-hover:rounded-xl group-hover:bg-[#DBAF00] group-hover:text-white'>
                          <LuKeyRound size={20} />
                        </div>
                        <p className='text-[18px] text-text-primary'>Reset Password</p>
                      </div>
                      <div className='relative w-[24px] h-[24px] text-text-primary/5 transition-transform duration-300 ease-in-out group-hover:translate-x-[5px] bg-[#4356FD]/10 flex items-center justify-center rounded-full'>
                        <LuChevronRight className='text-text-primary/60' size={18} />
                      </div>
                    </li>
                    <li
                      className='flex justify-between items-center group cursor-pointer'
                      onClick={handleRecentlyDeleted}
                    >
                      <div className='flex items-center gap-4'>
                        <div
                          className={`${
                            activeSection === 'recentlyDeleted'
                              ? 'text-[#fff] bg-[#DB2100] rounded-xl'
                              : 'text-[#DB2100] bg-[#DB2100]/10 rounded-[50px]'
                          } w-[45px] h-[45px] flex items-center justify-center transition-all duration-300 ease-in-out group-hover:rounded-xl group-hover:bg-[#DB2100] group-hover:text-white`}
                        >
                          <LuTrash size={20} />
                        </div>
                        <p className='text-[18px] text-text-primary'>Recently Deleted</p>
                      </div>
                      <div className='relative w-[24px] h-[24px] text-text-primary/5 transition-transform duration-300 ease-in-out group-hover:translate-x-[5px] bg-[#4356FD]/10 flex items-center justify-center rounded-full'>
                        <LuChevronRight className='text-text-primary/60' size={18} />
                      </div>
                    </li>
                    {user?.role === 'super_admin' && (
                      <li
                        className='flex justify-between items-center group cursor-pointer'
                        onClick={handleReports}
                      >
                        <div className='flex items-center gap-4'>
                          <div
                            className={`${
                              activeSection === 'reports'
                                ? 'text-[#fff] bg-[#2AC8AC] rounded-xl'
                                : 'text-[#2AC8AC] bg-[#2AC8AC]/10 rounded-[50px]'
                            } w-[45px] h-[45px] flex items-center justify-center transition-all duration-300 ease-in-out group-hover:rounded-xl group-hover:bg-[#2AC8AC] group-hover:text-white`}
                          >
                            <HiOutlineDocumentReport size={20} />
                          </div>
                          <p className='text-[18px] text-text-primary'>Device Reports</p>
                        </div>
                        <div className='relative w-[24px] h-[24px] text-text-primary/5 transition-transform duration-300 ease-in-out group-hover:translate-x-[5px] bg-[#4356FD]/10 flex items-center justify-center rounded-full'>
                          <LuChevronRight className='text-text-primary/60' size={18} />
                        </div>
                      </li>
                    )}
                    <li
                      onClick={() => setShow(true)}
                      className='flex justify-between items-center group cursor-pointer'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='text-[#333951] w-[45px] h-[45px] bg-[#333951]/10 flex items-center justify-center rounded-[50px] transition-all duration-300 ease-in-out group-hover:rounded-xl group-hover:bg-[#333951] group-hover:text-white'>
                          <LuLogOut size={20} />
                        </div>
                        <p className='text-[18px] text-text-primary'>Log Out</p>
                      </div>
                      <div className='relative w-[24px] h-[24px] text-text-primary/5 transition-transform duration-300 ease-in-out group-hover:translate-x-[5px] bg-[#4356FD]/10 flex items-center justify-center rounded-full'>
                        <LuChevronRight className='text-text-primary' size={18} />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              {toggleMainSidebar && activeSection === 'recentlyDeleted' && (
                <div className='w-full transition-all duration-500 pb-10 h-[100vh] overflow-auto'>
                  <div>
                    <div className='bg-white rounded-2xl'>
                      <div className='px-[22px] py-6 flex items-center flex-col lg:flex-row justify-between gap-2'>
                        <div className='flex items-center justify-between w-full'>
                          <h2 className='text-2xl font-bold text-text-primary'>
                            Recently Deleted Users
                          </h2>
                        </div>
                        <div className='flex items-center justify-end gap-5 w-full'>
                          <SearchInput
                            search={search}
                            setSearch={(e) => {
                              setSearch(e);
                              handBlurchange(e);
                            }}
                            handBlurchange={handBlurchange}
                            placeholder='Search User'
                          />
                          <RoleSort
                            selectedRole={selectedRole}
                            setSelectedRole={setSelectedRole}
                            data={RoleBaseSortItem[role]}
                          />
                          <Sort
                            query={query}
                            setQuery={setQuey}
                            selected={selected}
                            setSelected={setSelected}
                            data={data}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-1'>
                      <SidebarContext1.SidebarContext.Provider
                        value={{
                          role: query.role,
                          getlist: getRecentlyDeletedUsers,
                          query,
                          total,
                          page,
                          SetPage: SetPage,
                        }}
                      >
                        <AdminSupportAgentTable
                          loading={loading}
                          tableData={recentlyDeletedUsers}
                          columns={deletedUserColumns}
                          getlist={getRecentlyDeletedUsers}
                        />
                      </SidebarContext1.SidebarContext.Provider>
                    </div>
                  </div>
                </div>
              )}

              {toggleMainSidebar && activeSection === 'reports' && (
                <div className='w-full transition-all duration-500 h-[100svh] overflow-auto'>
                  <DeviceReports />
                </div>
              )}
            </div>
          </Sider>
        ) : null}
      </Layout>
      <Modal
        title={null}
        centered
        open={openAlertConfirmation}
        onOk={() => {
          onOkHnadler();
        }}
        onCancel={() => setOpenAlertConfirmation(false)}
        width='30%'
        className='device-configuration-modal'
        okButtonProps={{
          className: 'm-4',
        }}
        okText='Yes, Change'
      >
        <div className='p-6 pb-0'>
          <h1 className='text-[22px] font-semibold'>Switch alert mode?</h1>
          {dashboardAlerts ? (
            <p className='text-base text-secondary mt-1'>
              This will turn off dashboard alerts and start sending SMS notifications to your phone.
            </p>
          ) : (
            <p className='text-base text-secondary mt-1'>
              This will turn on dashboard alerts and stop sending SMS notifications to your phone.
            </p>
          )}
        </div>
      </Modal>
      <CreateAdminSupportAgent
        item={userData}
        role={userData?.role}
        getlist={getUsers}
        modalOPen={edit}
        ownEdit={true}
        setModalOpen={setEdit}
        isEditMode={edit}
      />
      <ChnaePasswordModal item={userData} modalOPen={resetModal} setModalOpen={setResetMOdal} />

      <LogOutModal modalOPen={show} setModalOpen={setShow} onDelete={handelLogout} />
    </>
  );
};

export default MainLayout;
const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, callback]);

  return ref;
};
