import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { DatePicker, Select, ConfigProvider, Tour } from 'antd';
import ls from 'store2';
import './style.css';
import SalesOverviewChart from './components/salesOverviewChart';
import TotalSalesChart from './components/totalSalesChart';
import BarChart from './components/barChart';
import BarChartByGender from './components/barChartByGender';
import PieChart from './components/pieChart';
import {
  getUsersCount,
  getSalesData,
  getSalesOverview,
  getDealDetails,
  getChartByAge,
} from '@/api/Dashboard';
import { getAllCity } from '@/api/ordersManage';
import { getUser } from '@/api/Users';
const { RangePicker } = DatePicker;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CountMapping } from './count-utiles';
import MonitoringStation from './Dashboards/MonitoringStation';
import InstallerDashboard from './Dashboards/Installer';
import WeeklyMonthlyPicker from '@/Components/WeeklyMonthlyPicker/WeeklyMonthlyPicker';
import {
  getChartByGender,
  getDiseasesCountByGender,
  getAlertsCountByElderly,
  getAlertsCountByName,
} from '@/api/Dashboard';
import { getAlertInfoViaEvent } from '@/utils/helper';
import BubbleChart from './components/bubbleChart';
import { RefProvider } from '@/Context/RefContext';
import { useRefContext } from '@/Context/RefContext';
import { updateUserDetails } from '@/api/Users';
import MonitoringAgencyDashboard from './Dashboards/MonitoringAgency';
import { getAlertInfoViaEventDetails } from '../../utils/helper';
const onOk = (value) => {
  console.log('onOk: ', value);
};
const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log('search:', value);
};
const AdminDashboardComponent = () => {
  // const { role } = useContext(SidebarContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');
  const [modalOPen, setModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState({
    current: '1',
    size: '10',
  });
  const { registerRef } = useRefContext();

  const [page, setPage] = useState({ page: 1, limit: 10 });
  const [dealLoading, setDealLoading] = useState(false);
  const [user, SetUser] = useState(ls.get('user'));
  const [role, setRole] = useState(ls.get('role'));
  const [mainRole, setMainRole] = useState(ls.get('mainRole'));
  //Date Controll
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  //Sales Overview
  const [SOOrderStatus, setSOOrderStatus] = useState(null);
  const [SOAgentId, setSOAgentId] = useState('all');
  //Sales By Agent
  const [SBAOrderStatus, setSBAOrderStatus] = useState(null);
  const [SBAOrderLocation, setSBAOrderLocation] = useState(null);
  //Sales By Location
  const [SBLOrderStatus, setSBLOrderStatus] = useState(null);
  const [SBLAgentId, setSBLAgentId] = useState(null);
  //Sales By PaymentStatus
  const [SBPAgentId, setSBPAgentId] = useState(null);
  //Sales by installation status
  const [SBIAgentId, setSBIAgentId] = useState(null);
  //Deal Details
  const [DDOrderStatus, setDDOrderStatus] = useState(null);
  const [DDAgentId, setDDAgentId] = useState(null);
  // Dashboard Data
  const [office, setOffice] = useState([]);
  const [salesAgent, setSalesAgent] = useState([]);
  const [officeId, setOfficeId] = useState(null);
  const [count, setCount] = useState([]);
  const [salesOverview, setSalesOverview] = useState([]);
  const [salesByAgent, setSalesByAgent] = useState([]);
  const [salesByLocation, setSalesByLocation] = useState([]);
  const [salesByPaymentStatus, setSalesByPaymentStatus] = useState([]);
  const [salesByInstallationStatus, setSalesByInstallationStatus] = useState([]);
  const [dealDetails, setDealDetails] = useState([]);
  const [officeQuery, setOfficeQuery] = useState({});
  const [agentQuery, setAgentQuery] = useState({});
  const [chartByGender, setChartByGender] = useState([]);
  const [chartByAge, setChartByAge] = useState([]);
  const [diseasesCountByGender, setDiseasesCountByGender] = useState([]);
  const [alertsCountByElderly, setAlertsCountByElderly] = useState([]);
  const [alertsCountByName, setAlertsCountByName] = useState([]);
  const [city, setCity] = useState([]);
  //Report Download
  const downloadReport = async () => {
    try {
      if (!dealDetails.data || dealDetails.data.length === 0) {
        throw new Error('No data available to download');
      }

      const formattedData = dealDetails.data.map((item, index) => {
        console.log('DealDetails ===============>', dealDetails.data);

        const saleDate = new Date(item.created_at);
        return {
          'No.': index + 1,
          'Office Name': item.office_name,
          'Agent ID': item.agent_unique_id,
          'Agent Name': item.agent_name,
          // "Order Number": item.order_no,
          'Sale Date': saleDate.toLocaleDateString('en-CA'),
          'Sale Time': saleDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),

          Products: item.products.map((product, idx) => `${idx + 1}. ${product.name}`).join(''),
          'Extra Product': item.products
            .map((item, indx) => {
              if (
                item.type !== 'Seenyor Kit' &&
                item.type !== 'Installation' &&
                item.type !== 'AI Monitoring'
              ) {
                return item.type;
              }
            })
            .join(''),
          'Current Sale Status': item.saleStatus,
          'City Location': item.address?.city || 'N/A',
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const fileName = `Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error downloading the sales report:', error);
      // Here you might want to show an error message to the user
      // For example: message.error("Failed to download report. Please try again.");
    }
  };
  //Chart by gender (male and female)
  const ChartByGender = useCallback(() => {
    getChartByGender()
      .then((res) => {
        setChartByGender(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //chart by age with range
  const ChartByAge = useCallback(() => {
    getChartByAge()
      .then((res) => {
        setChartByAge(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //Diseses count by gender
  const DiseasesCountByGender = useCallback(() => {
    getDiseasesCountByGender()
      .then((res) => {
        setDiseasesCountByGender(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const AlertCountByElderly = useCallback(() => {
    getAlertsCountByElderly()
      .then((res) => {
        setAlertsCountByElderly(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const AlertCountByName = useCallback(() => {
    getAlertsCountByName()
      .then((res) => {
        const filteredData = res.data.map((item) => {
          return {
            property_name: getAlertInfoViaEventDetails(item)?.title,
            count: item.count,
            type: getAlertInfoViaEventDetails(item)?.status,
          };
        });
        console.log(filteredData);

        setAlertsCountByName(filteredData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //Distributor Reports
  function AllCounts() {
    getUsersCount()
      .then((res) => {
        // Map over CountMapping to ensure every role is represented
        const mergedData = CountMapping.map((config) => {
          // Find if there's data from the API matching the current role
          const apiItem = res.data?.find((item) => item.role === config.role);

          // If found, use the API count; otherwise, set count to 0
          return {
            ...config,
            count: apiItem ? apiItem.count : 0, // Default to 0 if not found in the API response
          };
        });

        // Optional: filter based on rolesAllowed for the current user
        const filteredData = mergedData.filter((item) => item.rolesAllowed.includes(user.role));

        // Set the final filtered data to state
        setCount(filteredData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const SalesOverview = useCallback(
    (agentId, orderStatus) => {
      getSalesOverview({
        office_id: officeQuery.office_id,
        agent_id: agentId,
        payment_status: orderStatus,
        from_date: fromDate,
        to_date: toDate,
      })
        .then((res) => {
          console.log('sales Overview', res);

          setSalesOverview(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [SOAgentId, SOOrderStatus, officeQuery.office_id, toDate]
  );

  const SalesByAgent = useCallback(
    (city, orderStatus) => {
      getSalesData({
        ...officeQuery,
        total_sales_by: 'agent_name',
        city: city,
        payment_status: orderStatus,
        from_date: fromDate,
        to_date: toDate,
      })
        .then((res) => {
          const filteredData = res.data?.filter((item) => item.property_name);
          setSalesByAgent(filteredData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [SBAOrderLocation, SBAOrderStatus, officeQuery.office_id, toDate]
  );
  const SalesByLocation = useCallback(
    (agentId, orderStatus) => {
      getSalesData({
        ...officeQuery,
        total_sales_by: 'location',
        payment_status: orderStatus,
        agent_id: agentId,
        from_date: fromDate,
        to_date: toDate,
      })
        .then((res) => {
          const filteredData = res.data?.filter((item) => item.property_name);

          setSalesByLocation(filteredData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [SBLAgentId, SBLOrderStatus, officeQuery.office_id, toDate]
  );

  const SalesByPaymentStatus = useCallback(
    (agentId) => {
      getSalesData({
        ...officeQuery,
        total_sales_by: 'payment_status',
        agent_id: agentId,
        from_date: fromDate,
        to_date: toDate,
      })
        .then((res) => {
          setSalesByPaymentStatus(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [SBPAgentId, officeQuery.office_id, toDate]
  );
  const SalesByInstallationStatus = useCallback(
    (agentId) => {
      getSalesData({
        ...officeQuery,
        total_sales_by: 'installation_status',
        agent_id: agentId,
        from_date: fromDate,
        to_date: toDate,
      })
        .then((res) => {
          setSalesByInstallationStatus(res.data);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [SBIAgentId, officeQuery.office_id, toDate]
  );
  const DealDetails = useCallback(
    (agentId, orderStatus) => {
      setDealLoading(true);
      getDealDetails({
        ...page,
        ...officeQuery,
        agent_id: agentId,
        payment_status: orderStatus,
        from_date: fromDate,
        to_date: toDate,
      })
        .then((res) => {
          console.log(res);

          setDealDetails(res);
          setDealLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [DDOrderStatus, DDAgentId, officeQuery.office_id, toDate, page]
  );

  //All Graph Controller Handle Functions
  useEffect(() => {
    SalesOverview(
      SOAgentId === 'all' ? null : SOAgentId,
      SOOrderStatus === 'all' ? null : SOOrderStatus
    );
  }, [SalesOverview]);
  useEffect(() => {
    SalesByAgent(
      SBAOrderLocation === 'all' ? null : SBAOrderLocation,
      SBAOrderStatus === 'all' ? null : SBAOrderStatus
    );
  }, [SalesByAgent]);
  useEffect(() => {
    SalesByLocation(
      SBLAgentId === 'all' ? null : SBLAgentId,
      SBLOrderStatus === 'all' ? null : SBLOrderStatus
    );
  }, [SBLAgentId, SBLOrderStatus, SalesByLocation]);
  useEffect(() => {
    SalesByPaymentStatus(SBPAgentId === 'all' ? null : SBPAgentId);
  }, [SBPAgentId, SalesByPaymentStatus]);
  useEffect(() => {
    SalesByInstallationStatus(SBIAgentId === 'all' ? null : SBIAgentId);
  }, [SalesByInstallationStatus]);
  useEffect(() => {
    DealDetails(
      DDAgentId === 'all' ? null : DDAgentId,
      DDOrderStatus === 'all' ? null : DDOrderStatus
    );
  }, [DealDetails]);

  useEffect(() => {
    if (!officeId) return;
    if (officeId === 'all') {
      if (officeQuery.office_id) {
        const newQuery = { ...officeQuery };
        delete newQuery.office_id;
        setOfficeQuery(newQuery);
      }
    } else {
      setOfficeQuery((prevQuery) => ({
        ...prevQuery,
        office_id: officeId,
      }));
      // Reset other states if needed
      setSBPAgentId('all');
      setSBIAgentId('all');
      setSBLAgentId('all');
      setSOAgentId('all');
    }
  }, [officeId]);

  //Weekly, Monthly and  Date Picker Handler
  function handleWeeklyMonthly(e) {
    console.log(e);
    setFromDate(e.start);
    setToDate(e.end);
  }
  function handleDatePicker(e) {
    setFromDate(e[0]);
    setToDate(e[1]);
  }

  function getAllOffice() {
    getUser({ role: 'office' })
      .then((res) => {
        setOffice(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function getAllAgent() {
    console.log('called agent get list!', agentQuery);

    getUser({ ...officeQuery, role: 'sales_agent' })
      .then((res) => {
        setSalesAgent(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function getAllCities() {
    getAllCity({ ...officeQuery })
      .then((res) => {
        setCity(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const stepsRef = {
    officeDropdown: useRef(null),
    datePicker: useRef(null),
    usersCount: useRef(null),
    totalSales: useRef(null),
    totalInstallations: useRef(null),
    salesOverview: useRef(null),
    salesByAgent: useRef(null),
    salesByLocation: useRef(null),
    mostAlert: useRef(null),
    activityCount: useRef(null),
    ages: useRef(null),
    gender: useRef(null),
    diseases: useRef(null),
  };

  useEffect(() => {
    Object.keys(stepsRef).forEach((key) => {
      if (stepsRef[key].current) {
        registerRef('tour_step_' + key, stepsRef[key]);
      }
    });
  }, [registerRef]);

  useEffect(() => {
    AllCounts();
    getAllOffice();

    if (user.role === 'nursing_home' || user.role === 'monitoring_station') {
      ChartByGender();
      ChartByAge();
      DiseasesCountByGender();
      AlertCountByElderly();
      AlertCountByName();
    }
  }, [
    AlertCountByElderly,
    AlertCountByName,
    AllCounts,
    ChartByAge,
    ChartByGender,
    DiseasesCountByGender,
    user.role,
  ]);

  useEffect(() => {
    getAllAgent();
    getAllCities();
  }, [officeQuery]);
  // const updateUserDetailsWithFCMToken = (id, token) => {
  //   if (!token) return;
  //   console.log(token);
  //   updateUserDetails(id, { fcm_token_web: token })
  //     .then((res) => {
  //       console.log("Token Updated");
  //     })
  //     .catch((err) => console.log(err));
  // };
  // useEffect(() => {
  //   console.log(user);
  //   requestPermission().then((token) => {
  //     if (
  //       (user.role === "nurse" ||
  //         user.role === "support_agent" ||
  //         user.role === "end_user") &&
  //       token
  //     ) {
  //       console.log(token);

  //       updateUserDetailsWithFCMToken(user?._id, token);
  //     }
  //   });
  // }, [user]);
  return (
    <div className=''>
      {/* Tamplete for w-1/3 w-2/3 */}
      {/* <div className="w-full flex  gap-6 lg:flex-row flex-col">
            <div className=" p-[25px] rounded-2xl  bg-white lg:w-[65%] w-full  h-[445px]"></div>
            <div className=" p-[25px] rounded-2xl  bg-white lg:w-[35%] w-full  h-[445px]"></div>
          </div> */}
      {/* Tamplete for w-1/2 w-1/2 */}
      {/* <div className="w-full flex gap-6 xl:flex-row flex-col">
            <div className=" p-[25px] rounded-2xl  bg-white w-full h-[445px]"></div>
            <div className=" p-[25px] rounded-2xl  bg-white w-full h-[445px]"></div>
          </div> */}

      {/* This code for Distributor , Sales Agent , Office Dashboard */}
      {(user.role == 'distributor' || user.role == 'office' || user.role == 'sales_agent') && (
        <div className='pt-[29px] flex flex-col w-full gap-6 pb-10'>
          <div
            id='Distributor_Dash_Top'
            className='flex justify-between w-full mb-5 flex-wrap gap-5'
          >
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: 'Baloo2',
                  colorPrimary: '#8086AC',
                  colorLinkActive: '#8086AC',
                  colorLinkHover: '#8086AC',
                  colorLink: '#8086AC',
                },
              }}
            >
              {user.role == 'office' ? (
                <div className='p-2 px-4 rounded-lg text-[36px] font-bold  text-primary'>
                  {user.office}
                </div>
              ) : user.role == 'sales_agent' ? null : (
                <div ref={stepsRef.officeDropdown}>
                  <Select
                    showSearch
                    optionFilterProp='label'
                    onChange={(e) => setOfficeId(e.value)}
                    onSearch={onSearch}
                    defaultValue={'all'}
                    size='large'
                    className='custom-select'
                    dropdownMatchSelectWidth={false}
                    labelInValue={true}
                    options={[
                      {
                        value: 'all',
                        label: (
                          <>
                            All Offices <span className='highlighted-number'>{office.length}</span>
                          </>
                        ), // Number of options included here
                      },
                      ...office.map((office) => ({
                        value: office._id,
                        label: office.name,
                      })),
                    ]}
                  />
                </div>
              )}
              <div id='DatePickers' className='flex gap-4 items-center' ref={stepsRef.datePicker}>
                <WeeklyMonthlyPicker
                  placeholder={'Weekly/Monthly'}
                  style={{ width: '140px', borderRadius: '10px' }}
                  handleChnage={handleWeeklyMonthly}
                />
                <RangePicker
                  showTime={false}
                  style={{ width: '200px', borderRadius: '10px' }}
                  size='large'
                  placeholder={['Pick Data Range (Start)', 'End']}
                  format='YYYY-MM-DD'
                  onChange={(value, dateString) => {
                    handleDatePicker(dateString);
                  }}
                  onOk={onOk}
                />
                {/* <CustomButton
                  disabled={dealDetails?.data?.length <= 0}
                  onClick={downloadReport}
                  type="text"
                >
                  Download
                </CustomButton> */}
              </div>
            </ConfigProvider>
          </div>

          <div
            id='Reports'
            className='w-full rounded-2xl bg-transparent flex flex-col gap-6'
            ref={stepsRef.usersCount}
          >
            <div
              id='Cards'
              className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
            >
              {count?.map((item, key) => {
                let IconName = item.icon;
                return (
                  <div
                    key={key}
                    id='Card'
                    className='cursor-pointer group flex w-full items-center p-4 py-6 bg-[#fff] text-white gap-3 rounded-[12px] relative overflow-hidden'
                  >
                    <div
                      id='circle'
                      style={{ backgroundColor: item.color, opacity: '0.9' }}
                      className={`w-[100px] h-[100px] absolute -right-11 -top-14 rounded-full group-hover:-right-5 group-hover:-top-[75px] transition-all duration-200 ease-in-out`}
                    ></div>
                    <div
                      id='circle'
                      style={{ backgroundColor: item.color, opacity: '0.2' }}
                      className={`w-[100px] h-[100px] absolute -right-3 -top-[70px] rounded-full group-hover:-right-[50px] group-hover:-top-[45px] transition-all duration-200 ease-in-out`}
                    ></div>
                    <div
                      style={{ backgroundColor: `${item.color}15` }}
                      className='h-fit rounded-[8px] p-2'
                    >
                      {IconName && <IconName style={{ color: item?.color }} size={20} />}
                    </div>
                    <div className='flex flex-col items-start'>
                      <h1 className='text-[26px] font-semibold leading-none text-text-primary'>
                        {item.count}
                      </h1>
                      <span className='text-[14px] font-medium text-text-primary/70 leading-none'>
                        {item.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div id='SalesOverview&Total' className='w-full flex  gap-6 flex-col'>
            <div className='w-full flex gap-6'>
              <div
                className=' p-[25px] rounded-2xl  bg-white lg:w-[50%] w-full  h-[445px]'
                ref={stepsRef.totalSales}
              >
                <div id='ChartHeader' className='w-full flex justify-between'>
                  <h1 className='text-[24px] font-bold'>Total Sales</h1>
                  <div id='chartController' className='flex gap-4'>
                    {mainRole !== 'sales_agent' ? (
                      <ConfigProvider
                        theme={{
                          token: {
                            fontFamily: 'Baloo2',
                            colorPrimary: '#8086AC',
                            colorLinkActive: '#8086AC',
                            colorLinkHover: '#8086AC',
                            colorLink: '#8086AC',
                          },
                        }}
                      >
                        <Select
                          showSearch
                          optionFilterProp='label'
                          onChange={(e) => setSBPAgentId(e.value)}
                          onSearch={onSearch}
                          defaultValue={{ value: 'all', label: 'All Agents' }}
                          size='large'
                          labelInValue
                          dropdownMatchSelectWidth={false}
                          options={[
                            { value: 'all', label: 'All Agents' },
                            ...salesAgent.map((agent) => ({
                              value: agent._id,
                              label: agent.name + ' ' + agent.last_name,
                            })),
                          ]}
                        />
                      </ConfigProvider>
                    ) : null}
                  </div>
                </div>
                <div className='h-[260px] my-0 mx-auto flex items-center justify-center'>
                  <TotalSalesChart data={salesByPaymentStatus} chartFor='totalSales' />
                </div>
                <div id='ChartInfo' className='w-full  grid grid-cols-2 gap-4 mt-4'>
                  {['paid', 'completed', 'pending', 'cancelled'].map((statusName) => {
                    const status = salesByPaymentStatus.find(
                      (item) => item.property_name === statusName
                    ) || { property_name: statusName, total_orders: 0 };

                    let bgColor;
                    let label;

                    switch (status.property_name) {
                      case 'paid':
                        bgColor = '#36b610';
                        label = 'Paid';
                        break;
                      case 'completed':
                        bgColor = '#4379EE';
                        label = 'Completed';
                        break;
                      case 'pending':
                        bgColor = '#F1963A';
                        label = 'Pending';
                        break;
                      case 'cancelled':
                        bgColor = '#D90000';
                        label = 'Cancelled';
                        break;
                      default:
                        bgColor = '#000000'; // Default color if needed
                        label = 'Unknown';
                    }

                    return (
                      <div
                        key={status.property_name}
                        id='InfoItem'
                        className='w-full flex justify-between'
                      >
                        <div className='flex gap-2 items-center'>
                          <div
                            className={`w-[12px] h-[12px] rounded-full`}
                            style={{ backgroundColor: bgColor }}
                          ></div>
                          <span className='text-lg font-medium'>{label}</span>
                        </div>
                        <span className='text-lg font-semibold'>{status.total_orders}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className=' p-[25px] rounded-2xl  bg-white lg:w-[50%] w-full  h-[445px]'
                ref={stepsRef.totalInstallations}
              >
                <div id='ChartHeader' className='w-full flex justify-between'>
                  <h1 className='text-[24px] font-bold'>Total Installations</h1>
                  <div id='chartController' className='flex gap-4'>
                    {mainRole !== 'sales_agent' ? (
                      <ConfigProvider
                        theme={{
                          token: {
                            fontFamily: 'Baloo2',
                            colorPrimary: '#8086AC',
                            colorLinkActive: '#8086AC',
                            colorLinkHover: '#8086AC',
                            colorLink: '#8086AC',
                          },
                        }}
                      >
                        <Select
                          showSearch
                          optionFilterProp='label'
                          onChange={(e) => setSBIAgentId(e.value)}
                          onSearch={onSearch}
                          defaultValue={'all'}
                          size='large'
                          dropdownMatchSelectWidth={false}
                          labelInValue={true}
                          options={[
                            {
                              value: 'all',
                              label: 'All Agents',
                            },
                            ...salesAgent.map((agent) => ({
                              value: agent._id,
                              label: agent.name + ' ' + agent.last_name,
                            })),
                          ]}
                        />
                      </ConfigProvider>
                    ) : null}
                  </div>
                </div>
                <div className='h-[260px] my-0 mx-auto flex items-center justify-center'>
                  <TotalSalesChart data={salesByInstallationStatus} chartFor='totalInstallations' />
                </div>
                <div id='ChartInfo' className='w-full flex flex-col gap-2'>
                  {['completed', 'pending', 'not_started'].map((statusName) => {
                    const status = salesByInstallationStatus.find(
                      (item) => item.property_name === statusName
                    ) || { property_name: statusName, total_orders: 0 };

                    let bgColor;
                    let label;

                    switch (status.property_name) {
                      case 'completed':
                        bgColor = '#36b610';
                        label = 'Completed';
                        break;
                      case 'pending':
                        bgColor = '#833af1';
                        label = 'In Progress';
                        break;
                      case 'not_started':
                        bgColor = '#5d5d5d';
                        label = 'Not Started';
                        break;
                      default:
                        bgColor = '#000000';
                        label = 'Unknown';
                    }

                    return (
                      <div
                        key={status.property_name}
                        id='InfoItem'
                        className='w-full flex justify-between'
                      >
                        <div className='flex gap-2 items-center'>
                          <div
                            className={`w-[12px] h-[12px] rounded-full`}
                            style={{ backgroundColor: bgColor }}
                          ></div>
                          <span className='text-lg font-medium'>{label}</span>
                        </div>
                        <span className='text-lg font-semibold'>{status.total_orders}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className=' p-[25px] rounded-2xl  bg-white lg:w-[100%] w-full  h-[445px]'
              ref={stepsRef.salesOverview}
            >
              <div id='ChartHeader' className='w-full flex justify-between'>
                <h1 className='text-[24px] font-bold'>Sales Overview</h1>

                <div id='chartController' className='flex gap-4'>
                  <ConfigProvider
                    theme={{
                      token: {
                        fontFamily: 'Baloo2',
                        colorPrimary: '#8086AC',
                        colorLinkActive: '#8086AC',
                        colorLinkHover: '#8086AC',
                        colorLink: '#8086AC',
                      },
                    }}
                  >
                    <Select
                      optionFilterProp='label'
                      onChange={(e) => setSOOrderStatus(e.value)}
                      defaultValue={'all'}
                      size='large'
                      dropdownMatchSelectWidth={false}
                      labelInValue={true}
                      options={[
                        {
                          value: 'all',
                          label: 'All Sales',
                        },
                        {
                          value: 'completed',
                          label: 'Completed',
                        },
                        {
                          value: 'pending',
                          label: 'Pending',
                        },
                        {
                          value: 'cancelled',
                          label: 'Cancelled',
                        },
                      ]}
                    />
                    {mainRole !== 'sales_agent' ? (
                      <Select
                        showSearch
                        optionFilterProp='label'
                        onChange={(e) => setSOAgentId(e.value)}
                        onSearch={onSearch}
                        value={SOAgentId}
                        defaultValue={'all'}
                        size='large'
                        dropdownMatchSelectWidth={false}
                        labelInValue={true}
                        options={[
                          {
                            value: 'all',
                            label: 'All Agents',
                          },
                          ...salesAgent.map((agent) => ({
                            value: agent._id,
                            label: agent.name + ' ' + agent.last_name,
                          })),
                        ]}
                      />
                    ) : null}
                  </ConfigProvider>
                </div>
              </div>
              <SalesOverviewChart data={salesOverview} />
            </div>
          </div>

          <div id='SalesByLucation&Agents' className='w-full flex gap-6 xl:flex-row flex-col'>
            {user.role == 'sales_agent' ? null : (
              <div
                className=' p-[25px] rounded-2xl  bg-white w-full h-[445px]'
                ref={stepsRef.salesByAgent}
              >
                <div id='ChartHeader' className='w-full flex justify-between'>
                  <h1 className='text-[24px] font-bold'> Sales by Agent</h1>

                  <div id='chartController' className='flex gap-4'>
                    <ConfigProvider
                      theme={{
                        token: {
                          fontFamily: 'Baloo2',
                          colorPrimary: '#8086AC',
                          colorLinkActive: '#8086AC',
                          colorLinkHover: '#8086AC',
                          colorLink: '#8086AC',
                        },
                      }}
                    >
                      <Select
                        optionFilterProp='label'
                        onChange={(e) => setSBAOrderStatus(e.value)}
                        defaultValue='all'
                        size='large'
                        labelInValue={true}
                        dropdownMatchSelectWidth={false}
                        options={[
                          {
                            value: 'all',
                            label: 'All Sales',
                          },
                          {
                            value: 'completed',
                            label: 'Completed',
                          },
                          {
                            value: 'pending',
                            label: 'Pending',
                          },
                          {
                            value: 'cancelled',
                            label: 'Cancelled',
                          },
                        ]}
                      />

                      <Select
                        showSearch
                        optionFilterProp='label'
                        onChange={(e) => setSBAOrderLocation(e.value)}
                        onSearch={onSearch}
                        defaultValue={'all'}
                        size='large'
                        //   className="custom-select"
                        dropdownMatchSelectWidth={false}
                        labelInValue={true}
                        options={[
                          { value: 'all', label: 'All Locations' },
                          ...city.map((item) => ({
                            value: item.city_name,
                            label: item.city_name,
                          })),
                        ]}
                      />
                    </ConfigProvider>
                  </div>
                </div>
                <BarChart data={salesByAgent} graphTitle='Sales by Agent' />
              </div>
            )}

            <div
              className='p-[25px] rounded-2xl  bg-white w-full h-[445px]'
              ref={stepsRef.salesByLocation}
            >
              <div id='ChartHeader' className='w-full flex justify-between'>
                <h1 className='text-[24px] font-bold'>Sales by Location</h1>
                <div id='chartController' className='flex gap-4'>
                  <ConfigProvider
                    theme={{
                      token: {
                        fontFamily: 'Baloo2',
                        colorPrimary: '#8086AC',
                        colorLinkActive: '#8086AC',
                        colorLinkHover: '#8086AC',
                        colorLink: '#8086AC',
                      },
                    }}
                  >
                    <Select
                      optionFilterProp='label'
                      onChange={(e) => setSBLOrderStatus(e.value)}
                      defaultValue={'all'}
                      size='large'
                      dropdownMatchSelectWidth={false}
                      //   className="custom-select"
                      labelInValue={true}
                      options={[
                        {
                          value: 'all',
                          label: 'All Sales',
                        },
                        {
                          value: 'completed',
                          label: 'Completed',
                        },
                        {
                          value: 'pending',
                          label: 'Pending',
                        },
                        {
                          value: 'cancelled',
                          label: 'Cancelled',
                        },
                      ]}
                    />
                    {mainRole !== 'sales_agent' ? (
                      <Select
                        showSearch
                        optionFilterProp='label'
                        onChange={(e) => setSBLAgentId(e.value)}
                        onSearch={onSearch}
                        defaultValue={'all'}
                        dropdownMatchSelectWidth={false}
                        size='large'
                        labelInValue={true}
                        options={[
                          {
                            value: 'all',
                            label: 'All Agents',
                          },
                          ...salesAgent.map((agent) => ({
                            value: agent._id,
                            label: agent.name + ' ' + agent.last_name,
                          })),
                        ]}
                      />
                    ) : null}
                  </ConfigProvider>
                </div>
              </div>
              <BarChart data={salesByLocation} graphTitle='Sales by Location' />
            </div>
          </div>
        </div>
      )}

      {/* This code For Monitoring Station dashboard  */}
      {user.role == 'monitoring_station' ? (
        <MonitoringStation
          count={count}
          chartByAge={chartByAge}
          chartByGender={chartByGender}
          diseasesCountByGender={diseasesCountByGender}
          alertsCountByName={alertsCountByName}
          alertsCountByElderly={alertsCountByElderly}
        />
      ) : null}

      {/* This Code for Installer Dashboard */}
      {role == 'installer' ? <InstallerDashboard /> : null}
      {role == 'monitoring_agency' ? <MonitoringAgencyDashboard /> : null}

      {/* This Code for Installer Dashboard */}
      {user.role == 'nursing_home' ? (
        <div className='w-full flex flex-col gap-6 pt-6'>
          <div className='w-full flex gap-6 xl:flex-row flex-col h-fit justify-between'>
            <div
              className='p-[25px] rounded-2xl bg-white w-full h-[445px]'
              ref={stepsRef.mostAlert}
            >
              <div id='ChartHeader' className='w-full flex justify-between'>
                <h1 className='text-[24px] font-bold'>Most Activity</h1>
              </div>
              <BarChart data={alertsCountByElderly} />
            </div>
            <div
              className='p-[25px] rounded-2xl bg-white w-full h-[445px]'
              ref={stepsRef.activityCount}
            >
              <div id='ChartHeader' className='w-full flex justify-between'>
                <h1 className='text-[24px] font-bold'>Activity Count</h1>
              </div>
              {/* <BarChart data={alertsCountByName} /> */}
              <BubbleChart data={alertsCountByName} />
            </div>
          </div>
          <div className='flex gap-6 lg:flex-row flex-col h-fit'>
            <div className='rounded-2xl lg:w-[75%] w-full flex flex-col gap-6 h-full'>
              <div
                className='p-[25px] rounded-2xl bg-white w-full h-[445px] flex-grow'
                ref={stepsRef.ages}
              >
                <div id='ChartHeader' className='w-full flex justify-between'>
                  <h1 className='text-[24px] font-bold'>Ages</h1>
                </div>
                <BarChartByGender chartFor='age' data={chartByGender} />
              </div>
              <div
                className='p-[25px] rounded-2xl bg-white w-full h-[445px] flex-grow'
                ref={stepsRef.diseases}
              >
                <div id='ChartHeader' className='w-full flex justify-between'>
                  <h1 className='text-[24px] font-bold'>Diseases</h1>
                </div>
                <BarChartByGender chartFor='diseases' data={diseasesCountByGender} />
              </div>
            </div>

            <div className='rounded-2xl lg:w-[35%] w-full flex flex-col gap-6 h-full'>
              <div
                className='p-[25px] rounded-2xl bg-white w-full flex flex-col h-[496px] justify-between'
                ref={stepsRef.gender}
              >
                <div>
                  <div id='ChartHeader' className='w-full flex justify-between'>
                    <h1 className='text-[24px] font-bold'>Gender</h1>
                  </div>
                  <div className='h-[260px] my-0 mx-auto flex items-center justify-center'>
                    <PieChart data={chartByAge} chartFor='gender' />
                  </div>
                </div>

                <div id='ChartInfo' className='w-full flex flex-col gap-2'>
                  <div id='InfoItem' className='w-full flex justify-between'>
                    <div className='flex gap-2 items-center'>
                      <div className='w-[12px] h-[12px] bg-text-primary rounded-full'></div>
                      <span className='text-lg font-medium'>Total</span>
                    </div>
                    <span className='text-lg font-semibold'>
                      {chartByAge.reduce(
                        (acc, item) => acc + item.male_count + item.female_count,
                        0
                      )}
                    </span>
                  </div>
                  <div id='InfoItem' className='w-full flex justify-between'>
                    <div className='flex gap-2 items-center'>
                      <div className='w-[12px] h-[12px] bg-[#4379EE] rounded-full'></div>
                      <span className='text-lg font-medium'>Male</span>
                    </div>
                    <span className='text-lg font-semibold'>
                      {chartByAge.map((item) => (item._id === 'male' ? item.male_count || 0 : 0))}
                      {chartByAge.length === 0 && <>0</>}
                    </span>
                  </div>
                  <div id='InfoItem' className='w-full flex justify-between'>
                    <div className='flex gap-2 items-center'>
                      <div className='w-[12px] h-[12px] bg-[#5CC8BE] rounded-full'></div>
                      <span className='text-lg font-medium'>Female</span>
                    </div>
                    <span className='text-lg font-semibold'>
                      {' '}
                      {chartByAge.map((item) => (item._id === 'female' ? item.male_count || 0 : 0))}
                      {chartByAge.length === 0 && <>0</>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const AdminDashboard = () => {
  const [refsReady, setRefsReady] = useState({});
  const [tourOpen, setTourOpen] = useState(false);
  const [tourSteps, setTourSteps] = useState({});
  const [allRefs, setAllRefs] = useState({});
  const [seenTours, setSeenTours] = useState(() => {
    const saved = ls.get('seenToursDash');
    return saved ? saved : {};
  });
  const userRole = ls.get('user')?.role;
  const user = ls.get('user');
  const handleRefsUpdate = useCallback((refs) => {
    setAllRefs((prevRefs) => {
      if (prevRefs !== refs) {
        // Compare references
        return refs;
      }
      return prevRefs; // No update if refs is the same
    });
    // console.log(refs);

    // const readyTabs = {};
    // Object.keys(refs).forEach((key) => {
    //   if (key.startsWith("tour_") && refs[key].current) {
    //     const tab = key.split("_")[1];
    //     readyTabs[tab] = true;
    //   }
    // });

    // setRefsReady((prev) => {
    //   const newReadyTabs = { ...prev, ...readyTabs };
    //   if (JSON.stringify(newReadyTabs) !== JSON.stringify(prev)) {
    //     return newReadyTabs; // Only update if content changes
    //   }
    //   return prev;
    // });
  }, []);
  const buttonStyles = {
    fontSize: '14px',
    padding: '14px 18px',
    borderRadius: '8px',
    // color: "white",
  };
  const buttonStyles2 = {
    fontSize: '14px',
    padding: '14px 18px',
    borderRadius: '8px',
  };
  // const stepsRef = {
  //   officeDropdown: useRef(null),
  //   datePicker: useRef(null),
  //   usersCount: useRef(null),
  //   totalSales: useRef(null),
  //   totalInstallations: useRef(null),
  //   salesOverview: useRef(null),
  //   salesByAgent: useRef(null),
  //   salesByLocation: useRef(null),
  // };

  useEffect(() => {
    const tourStepsByTab = {
      distributor: [
        {
          title: <h1 className='text-xl text-primary'> Welcome, {user?.name}!</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              As a distributor, you have a central role in managing offices, agents, and
              location-specific analytics. Explore the tools and features available to you and take
              control of your domain!
            </p>
          ),
          // target: () => allRefs.tour_step_officeDropdown?.current,
          nextButtonProps: {
            children: "Let's Start",
            style: buttonStyles,
            variant: 'solid',
            size: 'middle',
            color: 'default',
            className: 'tour_step_btn',
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Your Responsibilities</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              As a Distributor, you manage offices, agents, and location analytics.
              <ul className='list-disc pl-5'>
                <li>Create and manage Offices, Managers, and Agents</li>
                <li>Assign agents to offices</li>
                <li>View and filter location-based analytics</li>
                <li>Oversee daily operations</li>
              </ul>
            </p>
          ),
          // target: () => allRefs.tour_step_officeDropdown?.current,
          nextButtonProps: {
            children: 'Start Tour',
            style: buttonStyles,
            variant: 'solid',
            size: 'middle',
            color: 'default',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Office Dropdown</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Use the office dropdown to select a specific office or view data for all offices at
              once.
            </p>
          ),
          target: () => allRefs.tour_step_officeDropdown?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            variant: 'solid',
            size: 'middle',
            className: 'tour_step_btn',

            color: 'default',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Date Range Filter</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Apply a custom date range filter to narrow down the data to a specific period for more
              focused analysis.
            </p>
          ),
          target: () => allRefs.tour_step_datePicker?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> User Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Quickly check the number of key users: Nursing Stations, Sales Agents, Monitoring
              Stations and End Users.
            </p>
          ),
          target: () => allRefs.tour_step_usersCount?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Total Sales</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              View the total number of sales made, with a breakdown of their statuses (Completed,
              Pending, and Cancelled).
            </p>
          ),
          target: () => allRefs.tour_step_totalSales?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Total Installations</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Monitor installation statuses, including Completed, In Progress, and Not Started, to
              track installation progress.
            </p>
          ),
          target: () => allRefs.tour_step_totalInstallations?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Sales Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Visualize sales trends over time with the Sales Overview graph, helping you identify
              patterns and performance.
            </p>
          ),
          target: () => allRefs.tour_step_salesOverview?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Sales by Agent</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              See the total sales made by each agent, allowing you to track individual performance
              and contributions.
            </p>
          ),
          target: () => allRefs.tour_step_salesByAgent?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Sales by Location</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Review sales performance across different locations, helping you identify
              high-performing or underperforming areas.
            </p>
          ),
          target: () => allRefs.tour_step_salesByLocation?.current,
          nextButtonProps: {
            children: 'Finish',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
      ],
      office: [
        {
          title: <h1 className='text-xl text-primary'> Welcome, {user?.name}!</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              As an Office Manager, you'll be overseeing the performance of your support agents and
              managing operations within your office. Let’s get started!
            </p>
          ),
          // target: () => allRefs.tour_step_officeDropdown?.current,
          nextButtonProps: {
            children: "Let's Start",
            style: buttonStyles,
            variant: 'solid',
            size: 'middle',
            color: 'default',
            className: 'tour_step_btn',
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Your Responsibilities</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              As an Office Manager, your key tasks include:
              <ul className='list-disc pl-5'>
                <li>Tracking the performance of support agents assigned to your office</li>
                <li>Managing deals with end users</li>
                <li>Coordinating the scheduling of installers for setup and service</li>
              </ul>
            </p>
          ),
          // target: () => allRefs.tour_step_officeDropdown?.current,
          nextButtonProps: {
            children: 'Start Tour',
            style: buttonStyles,
            variant: 'solid',
            size: 'middle',
            color: 'default',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },

        {
          title: <h1 className='text-xl text-primary'> Date Range Filter</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Apply a custom date range filter to narrow down the data to a specific period for more
              focused analysis.
            </p>
          ),
          target: () => allRefs.tour_step_datePicker?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> User Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Quickly check the number of key users: Nursing Stations, Sales Agents, Monitoring
              Stations and End Users.
            </p>
          ),
          target: () => allRefs.tour_step_usersCount?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Total Sales</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              View the total number of sales made, with a breakdown of their statuses (Completed,
              Pending, and Cancelled).
            </p>
          ),
          target: () => allRefs.tour_step_totalSales?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Total Installations</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Monitor installation statuses, including Completed, In Progress, and Not Started, to
              track installation progress.
            </p>
          ),
          target: () => allRefs.tour_step_totalInstallations?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Sales Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Visualize sales trends over time with the Sales Overview graph, helping you identify
              patterns and performance.
            </p>
          ),
          target: () => allRefs.tour_step_salesOverview?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Sales by Agent</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              See the total sales made by each agent, allowing you to track individual performance
              and contributions.
            </p>
          ),
          target: () => allRefs.tour_step_salesByAgent?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Sales by Location</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Review sales performance across different locations, helping you identify
              high-performing or underperforming areas.
            </p>
          ),
          target: () => allRefs.tour_step_salesByLocation?.current,
          nextButtonProps: {
            children: 'Finish',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
      ],
      sales_agent: [
        {
          title: (
            <h1 className='text-xl text-primary'>
              {' '}
              Welcome, {user?.name} {user?.last_name}!
            </h1>
          ),
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Welcome to your Sales Agent Dashboard! As a Sales Agent, you are responsible for
              registering Nursing Homes, Monitoring Stations, Support Agents, and Installers. Let’s
              dive in and see what you can do!
            </p>
          ),
          // target: () => allRefs.tour_step_officeDropdown?.current,
          nextButtonProps: {
            children: "Let's Start",
            style: buttonStyles,
            variant: 'solid',
            size: 'middle',
            color: 'default',
            className: 'tour_step_btn',
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Your Responsibilities</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              As a Sales Agent, your key tasks include:
              <ul className='list-disc pl-5'>
                <li>
                  Registering Nursing Homes, Monitoring Stations, Support Agents, and Installers
                </li>
                <li>Registering end users through a sales-specific website</li>
                <li>Viewing the end users you have signed up</li>
              </ul>
            </p>
          ),
          // target: () => allRefs.tour_step_officeDropdown?.current,
          nextButtonProps: {
            children: 'Start Tour',
            style: buttonStyles,
            variant: 'solid',
            size: 'middle',
            color: 'default',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },

        {
          title: <h1 className='text-xl text-primary'> Date Range Filter</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Apply a custom date range filter to narrow down the data to a specific period for more
              focused analysis.
            </p>
          ),
          target: () => allRefs.tour_step_datePicker?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> User Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Quickly check the number of key users: Nursing Stations, Sales Agents, Monitoring
              Stations and End Users.
            </p>
          ),
          target: () => allRefs.tour_step_usersCount?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Total Sales</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              View the total number of sales made, with a breakdown of their statuses (Completed,
              Pending, and Cancelled).
            </p>
          ),
          target: () => allRefs.tour_step_totalSales?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Total Installations</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Monitor installation statuses, including Completed, In Progress, and Not Started, to
              track installation progress.
            </p>
          ),
          target: () => allRefs.tour_step_totalInstallations?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'> Sales Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Visualize sales trends over time with the Sales Overview graph, helping you identify
              patterns and performance.
            </p>
          ),
          target: () => allRefs.tour_step_salesOverview?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },

        {
          title: <h1 className='text-xl text-primary'> Sales by Location</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Review sales performance across different locations, helping you identify
              high-performing or underperforming areas.
            </p>
          ),
          target: () => allRefs.tour_step_salesByLocation?.current,
          nextButtonProps: {
            children: 'Finish',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
      ],
      monitoring_station: [
        {
          title: <h1 className='text-xl text-primary'> Welcome, {user?.name}!</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Welcome to your Monitoring Company Dashboard! As a Monitoring Company, you manage
              Installer and Support Agent accounts, ensuring smooth operations for your customers.
              Let’s take a look at your responsibilities:
              <ul className='list-disc pl-5'>
                <li>Manage Installer accounts and oversee their setup of devices and profiles</li>
                <li>Monitor and resolve alerts via the platform and app</li>
                <li>Support elderly profiles assigned to your company</li>
                <li>Ensure all installations are completed successfully at customer's homes</li>
              </ul>
            </p>
          ),
          // target: () => allRefs.tour_step_officeDropdown?.current,
          nextButtonProps: {
            children: "Let's Start",
            style: buttonStyles,
            variant: 'solid',
            size: 'middle',
            color: 'default',
            className: 'tour_step_btn',
          },
        },
        // {
        //   title: (
        //     <h1 className="text-xl text-primary"> Daily Activity Summary</h1>
        //   ),
        //   description: (
        //     <p className="text-base tracking-tight text-primary/80">
        //       Displays key metrics such as Indoor Duration, Walking Steps, Skill
        //       Time, Walking Speed, and Room Entry/Exit Count.
        //     </p>
        //   ),
        //   // target: () => allRefs.tour_step_officeDropdown?.current,
        //   nextButtonProps: {
        //     children: "Start Tour",
        //     style: buttonStyles,
        //     variant: "solid",
        //     size: "middle",
        //     color: "default",
        //     className: "tour_step_btn",
        //   },
        //   prevButtonProps: {
        //     style: buttonStyles2,
        //   },
        // },
        {
          title: <h1 className='text-xl text-primary'> User Overview</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Quickly check the number of key users: Nursing Stations, Sales Agents, Monitoring
              Stations and End Users.
            </p>
          ),
          target: () => allRefs.tour_step_usersCountM?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Ages</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              This section shows the age distribution of individuals in the Nursing Home. It helps
              in understanding the demographics of your residents, displayed by age group and
              gender.
            </p>
          ),
          target: () => allRefs.tour_step_agesM?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Gender</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              The Gender section provides a visual breakdown of male and female residents, giving
              you a clear understanding of the gender distribution in your Nursing Home.
            </p>
          ),
          target: () => allRefs.tour_step_genderM?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Diseases</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              This section tracks the prevalence of various diseases such as Thyroid Disorders,
              Hearing Loss, Depression, and more. It helps you monitor the health trends of your
              residents.
            </p>
          ),
          target: () => allRefs.tour_step_diseasesM?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Activity</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              The Activity section shows a summary of all system activities, including info,
              warning, and critical notifications. Here, you can monitor the status of any alerts or
              updates, ensuring your system is running smoothly.
            </p>
          ),
          target: () => allRefs.tour_step_activityM?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Most Alerts</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              This section displays the most frequent alerts in the system, allowing you to track
              any ongoing issues or patterns. You can see the total alert count and the distribution
              of alerts across various categories.
            </p>
          ),
          target: () => allRefs.tour_step_mostAlertM?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Activity Count</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              The Activity Count visualizes the actions performed over time. Each circle represents
              a different level of activity, allowing you to monitor trends and track performance
              across periods.
            </p>
          ),
          target: () => allRefs.tour_step_activityCountM?.current,
          nextButtonProps: {
            children: 'Finish',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
      ],
      nursing_home: [
        {
          title: <h1 className='text-xl text-primary'> Welcome, {user?.name}!</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              Welcome to your Nursing Home Owner Dashboard! As a Nursing Home Owner, you have full
              control over managing nurse accounts, overseeing billing and services, and interacting
              with end users. Let’s take a look at your responsibilities:
              <ul className='list-disc pl-5'>
                <li>Manage nurse accounts and edit their information</li>
                <li>View and manage a list of Elderlies in your Nursing Home</li>
                <li>Create and manage end-user accounts</li>
                <li>
                  End users interact solely with you for subscriptions and device-related services
                </li>
              </ul>
            </p>
          ),
          // target: () => allRefs.tour_step_officeDropdown?.current,
          nextButtonProps: {
            children: "Let's Start",
            style: buttonStyles,
            variant: 'solid',
            size: 'middle',
            color: 'default',
            className: 'tour_step_btn',
          },
        },
        // {
        //   title: (
        //     <h1 className="text-xl text-primary"> Daily Activity Summary</h1>
        //   ),
        //   description: (
        //     <p className="text-base tracking-tight text-primary/80">
        //       Displays key metrics such as Indoor Duration, Walking Steps, Skill
        //       Time, Walking Speed, and Room Entry/Exit Count.
        //     </p>
        //   ),
        //   // target: () => allRefs.tour_step_officeDropdown?.current,
        //   nextButtonProps: {
        //     children: "Start Tour",
        //     style: buttonStyles,
        //     variant: "solid",
        //     size: "middle",
        //     color: "default",
        //     className: "tour_step_btn",
        //   },
        //   prevButtonProps: {
        //     style: buttonStyles2,
        //   },
        // },

        {
          title: <h1 className='text-xl text-primary'> Most Alerts</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              This section displays the most frequent alerts in the system, allowing you to track
              any ongoing issues or patterns. You can see the total alert count and the distribution
              of alerts across various categories.
            </p>
          ),
          target: () => allRefs.tour_step_mostAlert?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Activity Count</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              The Activity Count visualizes the actions performed over time. Each circle represents
              a different level of activity, allowing you to monitor trends and track performance
              across periods.
            </p>
          ),
          target: () => allRefs.tour_step_activityCount?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Ages</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              This section shows the age distribution of individuals in the Nursing Home. It helps
              in understanding the demographics of your residents, displayed by age group and
              gender.
            </p>
          ),
          target: () => allRefs.tour_step_ages?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Gender</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              The Gender section provides a visual breakdown of male and female residents, giving
              you a clear understanding of the gender distribution in your Nursing Home.
            </p>
          ),
          target: () => allRefs.tour_step_gender?.current,
          nextButtonProps: {
            children: 'Next',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
        {
          title: <h1 className='text-xl text-primary'>Diseases</h1>,
          description: (
            <p className='text-base tracking-tight text-primary/80'>
              This section tracks the prevalence of various diseases such as Thyroid Disorders,
              Hearing Loss, Depression, and more. It helps you monitor the health trends of your
              residents.
            </p>
          ),
          target: () => allRefs.tour_step_diseases?.current,
          nextButtonProps: {
            children: 'Finish',
            style: buttonStyles,
            size: 'middle',
            color: 'default',
            variant: 'solid',
            className: 'tour_step_btn',
          },
          prevButtonProps: {
            style: buttonStyles2,
          },
        },
      ],
    };
    setTourSteps(tourStepsByTab[userRole] || []);
    setTimeout(() => {
      if (tourSteps.length > 0 && !seenTours[userRole]) setTourOpen(true);
    }, 2000);
  }, [allRefs]);
  const getActiveTabSteps = () => {
    if (tourSteps.length > 0) {
      return tourSteps;
    } else {
      return [];
    }
  };
  function handleTourFinish() {
    setTourOpen(false);
    const updatedSeenTours = { ...seenTours, [userRole]: true };
    setSeenTours(updatedSeenTours);
    ls.set('seenToursDash', updatedSeenTours);
  }
  return (
    <>
      <RefProvider onRefsUpdate={handleRefsUpdate}>
        <AdminDashboardComponent />
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
          <Tour
            open={tourOpen}
            onFinish={handleTourFinish}
            steps={getActiveTabSteps()}
            onClose={handleTourFinish}
          />
        </ConfigProvider>
      </RefProvider>
    </>
  );
};
export default AdminDashboard;
