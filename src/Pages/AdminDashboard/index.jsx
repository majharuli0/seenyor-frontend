import React, { useEffect, useRef, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Spin, Table, Tag, Modal, ConfigProvider, Select, DatePicker } from 'antd';
import { useroverViewCount } from '@/api/AdminDashboard';
import TabMenus from '@/Components/TabMenus';
import Monthcharts from './components/Monthcharts';
import TimeSelection from '@/Components/TimeSelection';
import ls from 'store2';
import { SidebarContext } from '@/Context/CustomContext';
import dayjs from 'dayjs';
import BarChart from './components/barChart';
import TotalSalesChart from './components/totalSalesChart';
import TotalAlertsChart from './components/totalAlersChart';
import { getUsersCount, getSalesReports } from '@/api/Dashboard';
const { RangePicker } = DatePicker;
import { CountMapping } from './count-utiles';
import { useNavigate } from 'react-router-dom';
const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role } = useContext(SidebarContext);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState([]);
  const [todaySales, setTodaySales] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [distributorSales, setDistributorSales] = useState([]);

  function AllCounts() {
    getUsersCount()
      .then((res) => {
        const apiData = res?.data || [];

        const mergedData = CountMapping.map((config) => {
          const apiItem = apiData.find((item) => item.role === config.role);

          return {
            ...config,
            count: apiItem ? apiItem.count : 0,
          };
        });

        setCount(mergedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function TodaySalesGraph(role = 'distributor') {
    const today_date = dayjs().format('YYYY-MM-DD');
    getSalesReports({ role: role, to_date: today_date })
      .then((res) => {
        setTodaySales(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function TotalSalesGraph(fromDate, toDate) {
    getUsersCount({ from_date: fromDate, to_date: toDate })
      .then((res) => {
        setTotalSales(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function DistributorSalesGrpah(sortValue = '-1') {
    getSalesReports({ role: 'distributor', sort_by_sales: sortValue })
      .then((res) => {
        const filteredData = res.data?.filter((item) => item.name);
        setDistributorSales(filteredData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    AllCounts();
    TodaySalesGraph();
    TotalSalesGraph();
    DistributorSalesGrpah();
  }, []);

  //All Graph Controller Functions
  function onTodaySalesRoleChnage(e) {
    TodaySalesGraph(e.value);
  }
  function onDistributorSalesSortChange(e) {
    DistributorSalesGrpah(e.value);
  }
  function onTotalSalesChange(date) {
    TotalSalesGraph(date[0], date[1]);
  }

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    // <Spin spinning={loading}></Spin>
    <div className='w-full flex flex-col gap-6 pt-6'>
      <div className='rounded-2xl w-full flex flex-col gap-6 h-full'>
        <div id='Reports' className='w-full rounded-2xl flex flex-col gap-6'>
          <div
            id='Cards'
            className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'
          >
            {count?.map((item, key) => {
              let IconName = item.icon;
              return (
                <div
                  key={key}
                  id='Card'
                  onClick={() => (item.tab ? navigate(`/super-admin/users?tab=${item.tab}`) : null)}
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
                    style={{
                      backgroundColor: `${item.color}15`,
                    }}
                    className={`h-fit rounded-[8px] p-2`}
                  >
                    {IconName && <IconName style={{ color: item?.color }} size={20} />}
                  </div>
                  <div className='flex flex-col items-start'>
                    <h1 className='text-[26px] font-semibold leading-none text-text-primary'>
                      {item.count ? item.count : 0}
                    </h1>
                    <span className='text-[14px] font-medium text-text-primary/70 leading-none'>
                      {t(item.labelKey)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className='w-full flex  gap-6 lg:flex-row flex-col'>
        <div className=' p-[25px] rounded-2xl  bg-white lg:w-[65%] w-full  h-[445px]'>
          <div id='ChartHeader' className='w-full flex justify-between'>
            <h1 className='text-[24px] font-bold'>
              {t('graph_chart.today_sales', "Today's Sales")}
            </h1>
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
                  onChange={onTodaySalesRoleChnage}
                  defaultValue={'distributor'}
                  size='large'
                  // className="w-[200px]"
                  dropdownMatchSelectWidth={false}
                  //   className="custom-select"
                  labelInValue={true}
                  options={[
                    {
                      value: 'distributor',
                      label: t('roles.distributor'),
                    },
                    {
                      value: 'sales_agent',
                      label: t('roles.sales_agent'),
                    },
                    {
                      value: 'monitoring_station',
                      label: t('roles.control_center'),
                    },
                    {
                      value: 'nursing_home',
                      label: t('roles.nursing_home'),
                    },
                  ]}
                />
              </ConfigProvider>
            </div>
          </div>
          <BarChart data={todaySales} graphTitle={t('today_sales', "Today's Sales")} />
        </div>
        <div className=' p-[25px] rounded-2xl  bg-white lg:w-[35%] w-full  h-[445px]'>
          <div id='ChartHeader' className='w-full flex justify-between'>
            <h1 className='text-[24px] font-bold'>{t('graph_chart.total_sales')}</h1>
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
                <RangePicker
                  showTime={false}
                  style={{
                    width: '200px',
                    borderRadius: '10px',
                    height: '40px',
                    zIndex: '1',
                  }}
                  size='large'
                  placeholder={[
                    t('pick_date_range_start', 'Pick Data Range (Start)'),
                    t('pick_date_range_end', 'End'),
                  ]}
                  format='YYYY-MM-DD'
                  onChange={(value, dateString) => onTotalSalesChange(dateString)}
                />
              </ConfigProvider>
            </div>
          </div>
          <div className='h-[260px] my-0 mx-auto flex items-center justify-center'>
            <TotalSalesChart data={totalSales} />
          </div>
          <div id='ChartInfo' className='w-full flex flex-col gap-2'>
            <div id='InfoItem' className='w-full flex justify-between'>
              <div className='flex gap-2 items-center'>
                <div className='w-[12px] h-[12px] bg-[#4379EE] rounded-full'></div>
                <span className='text-lg font-medium'>{t('graph_chart.end_user_sales')}</span>
              </div>
              <span className='text-lg font-semibold'>
                {totalSales?.find((user) => user.role === 'end_user')?.count || 0}
              </span>
            </div>
            <div id='InfoItem' className='w-full flex justify-between'>
              <div className='flex gap-2 items-center'>
                <div className='w-[12px] h-[12px] bg-[#F1963A] rounded-full'></div>
                <span className='text-lg font-medium'>{t('graph_chart.nursing_home_sales')}</span>
              </div>
              <span className='text-lg font-semibold'>
                {' '}
                {totalSales?.find((user) => user.role === 'nursing_home')?.count || 0}
              </span>
            </div>
            <div id='InfoItem' className='w-full flex justify-between'>
              <div className='flex gap-2 items-center'>
                <div className='w-[12px] h-[12px] bg-[#D90000] rounded-full'></div>
                <span className='text-lg font-medium'>
                  {t('graph_chart.control_centers_sales')}
                </span>
              </div>
              <span className='text-lg font-semibold'>
                {totalSales?.find((user) => user.role === 'monitoring_station')?.count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className=' p-[25px] rounded-2xl  bg-white  w-full  h-[445px]'>
        <div id='ChartHeader' className='w-full flex justify-between'>
          <h1 className='text-[24px] font-bold'>{t('graph_chart.distributor_sales')}</h1>
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
                onChange={onDistributorSalesSortChange}
                defaultValue={'-1'}
                size='large'
                dropdownMatchSelectWidth={false}
                //   className="custom-select"
                labelInValue={true}
                options={[
                  {
                    value: '-1',
                    label: t('high_to_low', 'High to Low'),
                  },
                  {
                    value: '1',
                    label: t('low_to_high', 'Low to High'),
                  },
                ]}
              />
            </ConfigProvider>
          </div>
        </div>
        <BarChart
          data={distributorSales}
          graphTitle={t('distributor_sales', 'Distributor Sales')}
        />
      </div>
      {/* <div className=" p-[25px] rounded-2xl  bg-white  w-full  lg:h-[445px] flex lg:flex-row flex-col  h-auto">
        <div className=" lg:w-[50%] w-full flex flex-col gap-6 ">
          <div id="ChartHeader" className="w-full flex justify-between">
            <h1 className="text-[24px] font-bold">{t("total_alerts", "Total Alerts")}</h1>
            <div id="chartController" className="flex gap-4">
              <ConfigProvider
                theme={{
                  token: {
                    fontFamily: "Baloo2",
                    colorPrimary: "#8086AC",
                    colorLinkActive: "#8086AC",
                    colorLinkHover: "#8086AC",
                    colorLink: "#8086AC",
                  },
                }}
              >
                <Select
                  optionFilterProp="label"
                  onChange={onChange}
                  defaultValue={"distributor"}
                  size="large"
                  //   className="custom-select"
                  labelInValue={true}
                  options={[
                    {
                      value: "distributor",
                      label: t("distributor", "Distributor"),
                    },
                    {
                      value: "Sales Agent",
                      label: t("sales_agent", "Sales Agent"),
                    },
                    {
                      value: "Monitoring Company",
                      label: t("monitoring_company", "Monitoring Company"),
                    },
                    {
                      value: "Nursing Home",
                      label: t("nursing_home", "Nursing Home"),
                    },
                  ]}
                />
              </ConfigProvider>
            </div>
          </div>
          <div
            id="ChartInfo"
            className="grid lg:grid-cols-2 grid-cols-1  h-fit gap-6"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, indx) => {
              return (
                <div
                  key={indx}
                  id="InfoItem"
                  className="w-full flex justify-between items-center"
                >
                  <div className="flex gap-2 items-center">
                    <div className="w-[12px] h-[12px] bg-text-primary rounded-full"></div>
                    <span className="text-lg font-medium">
                      {t("alert_n", "Alert")} {indx + 1}
                    </span>
                  </div>
                  <span className="text-lg font-semibold">400</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:w-[50%] w-full">
          <TotalAlertsChart />
        </div>
      </div> */}
    </div>
  );
};

export default AdminDashboard;
// import React, { useEffect, useRef, useState, useContext } from "react";
// import {
//   Spin,
//   Table,
//   Tag,
//   Modal,
//   ConfigProvider,
//   Select,
//   DatePicker,
// } from "antd";
// import { useroverViewCount } from "@/api/AdminDashboard";
// import TabMenus from "@/Components/TabMenus";
// import Monthcharts from "./components/Monthcharts";
// import TimeSelection from "@/Components/TimeSelection";
// import ls from "store2";
// import { SidebarContext } from "@/Context/CustomContext";
// import dayjs from "dayjs";
// import BarChart from "./components/barChart";
// import TotalSalesChart from "./components/totalSalesChart";
// import TotalAlertsChart from "./components/totalAlersChart";
// import { getUsersCount, getSalesReports } from "@/api/Dashboard";
// const { RangePicker } = DatePicker;
// import { CountMapping } from "./count-utiles";
// import { useNavigate } from "react-router-dom";
// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const { role } = useContext(SidebarContext);
//   const [loading, setLoading] = useState(true);
//   const [count, setCount] = useState([]);
//   const [todaySales, setTodaySales] = useState([]);
//   const [totalSales, setTotalSales] = useState([]);
//   const [distributorSales, setDistributorSales] = useState([]);

//   function AllCounts() {
//     getUsersCount()
//       .then((res) => {
//         const apiData = res?.data || [];

//         const mergedData = CountMapping.map((config) => {
//           const apiItem = apiData.find((item) => item.role === config.role);

//           return {
//             ...config,
//             count: apiItem ? apiItem.count : 0,
//           };
//         });

//         setCount(mergedData);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   function TodaySalesGraph(role = "distributor") {
//     const today_date = dayjs().format("YYYY-MM-DD");
//     getSalesReports({ role: role, to_date: today_date })
//       .then((res) => {
//         setTodaySales(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   function TotalSalesGraph(fromDate, toDate) {
//     getUsersCount({ from_date: fromDate, to_date: toDate })
//       .then((res) => {
//         setTotalSales(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   function DistributorSalesGrpah(sortValue = "-1") {
//     getSalesReports({ role: "distributor", sort_by_sales: sortValue })
//       .then((res) => {
//         const filteredData = res.data?.filter((item) => item.name);
//         setDistributorSales(filteredData);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   useEffect(() => {
//     AllCounts();
//     TodaySalesGraph();
//     TotalSalesGraph();
//     DistributorSalesGrpah();
//   }, []);

//   //All Graph Controller Functions
//   function onTodaySalesRoleChnage(e) {
//     TodaySalesGraph(e.value);
//   }
//   function onDistributorSalesSortChange(e) {
//     DistributorSalesGrpah(e.value);
//   }
//   function onTotalSalesChange(date) {
//     TotalSalesGraph(date[0], date[1]);
//   }

//   const onChange = (value) => {
//     console.log(`selected ${value}`);
//   };

//   return (
//     // <Spin spinning={loading}></Spin>
//     <div className="w-full flex flex-col gap-6 pt-6">
//       <div className="rounded-2xl w-full flex flex-col gap-6 h-full">
//         <div id="Reports" className="w-full rounded-2xl flex flex-col gap-6">
//           <div
//             id="Cards"
//             className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
//           >
//             {count?.map((item, key) => {
//               let IconName = item.icon;
//               return (
//                 <div
//                   key={key}
//                   id="Card"
//                   onClick={() =>
//                     item.tab
//                       ? navigate(`/super-admin/users?tab=${item.tab}`)
//                       : null
//                   }
//                   className="cursor-pointer group flex w-full items-center p-4 py-6 bg-[#fff] text-white gap-3 rounded-[12px] relative overflow-hidden"
//                 >
//                   <div
//                     id="circle"
//                     style={{ backgroundColor: item.color, opacity: "0.9" }}
//                     className={`w-[100px] h-[100px] absolute -right-11 -top-14 rounded-full group-hover:-right-5 group-hover:-top-[75px] transition-all duration-200 ease-in-out`}
//                   ></div>
//                   <div
//                     id="circle"
//                     style={{ backgroundColor: item.color, opacity: "0.2" }}
//                     className={`w-[100px] h-[100px] absolute -right-3 -top-[70px] rounded-full group-hover:-right-[50px] group-hover:-top-[45px] transition-all duration-200 ease-in-out`}
//                   ></div>
//                   <div
//                     style={{
//                       backgroundColor: `${item.color}15`,
//                     }}
//                     className={`h-fit rounded-[8px] p-2`}
//                   >
//                     {IconName && (
//                       <IconName style={{ color: item?.color }} size={20} />
//                     )}
//                   </div>
//                   <div className="flex flex-col items-start">
//                     <h1 className="text-[26px] font-semibold leading-none text-text-primary">
//                       {item.count ? item.count : 0}
//                     </h1>
//                     <span className="text-[14px] font-medium text-text-primary/70 leading-none">
//                       {item.label}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//       <div className="w-full flex  gap-6 lg:flex-row flex-col">
//         <div className=" p-[25px] rounded-2xl  bg-white lg:w-[65%] w-full  h-[445px]">
//           <div id="ChartHeader" className="w-full flex justify-between">
//             <h1 className="text-[24px] font-bold">Today's Sales</h1>
//             <div id="chartController" className="flex gap-4">
//               <ConfigProvider
//                 theme={{
//                   token: {
//                     fontFamily: "Baloo2",
//                     colorPrimary: "#8086AC",
//                     colorLinkActive: "#8086AC",
//                     colorLinkHover: "#8086AC",
//                     colorLink: "#8086AC",
//                   },
//                 }}
//               >
//                 <Select
//                   optionFilterProp="label"
//                   onChange={onTodaySalesRoleChnage}
//                   defaultValue={"distributor"}
//                   size="large"
//                   // className="w-[200px]"
//                   dropdownMatchSelectWidth={false}
//                   //   className="custom-select"
//                   labelInValue={true}
//                   options={[
//                     {
//                       value: "distributor",
//                       label: "Distributor",
//                     },
//                     {
//                       value: "sales_agent",
//                       label: "Sales Agent",
//                     },
//                     {
//                       value: "monitoring_station",
//                       label: "Monitoring Station",
//                     },
//                     {
//                       value: "nursing_home",
//                       label: "Nursing Home",
//                     },
//                   ]}
//                 />
//               </ConfigProvider>
//             </div>
//           </div>
//           <BarChart data={todaySales} graphTitle="Today's Sales" />
//         </div>
//         <div className=" p-[25px] rounded-2xl  bg-white lg:w-[35%] w-full  h-[445px]">
//           <div id="ChartHeader" className="w-full flex justify-between">
//             <h1 className="text-[24px] font-bold">Total Sales</h1>
//             <div id="chartController" className="flex gap-4">
//               <ConfigProvider
//                 theme={{
//                   token: {
//                     fontFamily: "Baloo2",
//                     colorPrimary: "#8086AC",
//                     colorLinkActive: "#8086AC",
//                     colorLinkHover: "#8086AC",
//                     colorLink: "#8086AC",
//                   },
//                 }}
//               >
//                 <RangePicker
//                   showTime={false}
//                   style={{
//                     width: "200px",
//                     borderRadius: "10px",
//                     height: "40px",
//                     zIndex: "1",
//                   }}
//                   size="large"
//                   placeholder={["Pick Data Range (Start)", "End"]}
//                   format="YYYY-MM-DD"
//                   onChange={(value, dateString) =>
//                     onTotalSalesChange(dateString)
//                   }
//                 />
//               </ConfigProvider>
//             </div>
//           </div>
//           <div className="h-[260px] my-0 mx-auto flex items-center justify-center">
//             <TotalSalesChart data={totalSales} />
//           </div>
//           <div id="ChartInfo" className="w-full flex flex-col gap-2">
//             <div id="InfoItem" className="w-full flex justify-between">
//               <div className="flex gap-2 items-center">
//                 <div className="w-[12px] h-[12px] bg-[#4379EE] rounded-full"></div>{" "}
//                 <span className="text-lg font-medium">End User Sales</span>
//               </div>
//               <span className="text-lg font-semibold">
//                 {totalSales?.find((user) => user.role === "end_user")?.count ||
//                   0}
//               </span>
//             </div>
//             <div id="InfoItem" className="w-full flex justify-between">
//               <div className="flex gap-2 items-center">
//                 <div className="w-[12px] h-[12px] bg-[#F1963A] rounded-full"></div>{" "}
//                 <span className="text-lg font-medium">Nursing Home Sales</span>
//               </div>
//               <span className="text-lg font-semibold">
//                 {" "}
//                 {totalSales?.find((user) => user.role === "nursing_home")
//                   ?.count || 0}
//               </span>
//             </div>
//             <div id="InfoItem" className="w-full flex justify-between">
//               <div className="flex gap-2 items-center">
//                 <div className="w-[12px] h-[12px] bg-[#D90000] rounded-full"></div>{" "}
//                 <span className="text-lg font-medium">
//                   Control Centers Sales
//                 </span>
//               </div>
//               <span className="text-lg font-semibold">
//                 {" "}
//                 {totalSales?.find((user) => user.role === "monitoring_station")
//                   ?.count || 0}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className=" p-[25px] rounded-2xl  bg-white  w-full  h-[445px]">
//         <div id="ChartHeader" className="w-full flex justify-between">
//           <h1 className="text-[24px] font-bold">Distributor Sales</h1>
//           <div id="chartController" className="flex gap-4">
//             <ConfigProvider
//               theme={{
//                 token: {
//                   fontFamily: "Baloo2",
//                   colorPrimary: "#8086AC",
//                   colorLinkActive: "#8086AC",
//                   colorLinkHover: "#8086AC",
//                   colorLink: "#8086AC",
//                 },
//               }}
//             >
//               <Select
//                 optionFilterProp="label"
//                 onChange={onDistributorSalesSortChange}
//                 defaultValue={"-1"}
//                 size="large"
//                 dropdownMatchSelectWidth={false}
//                 //   className="custom-select"
//                 labelInValue={true}
//                 options={[
//                   {
//                     value: "-1",
//                     label: "High to Low",
//                   },
//                   {
//                     value: "1",
//                     label: "Low to High",
//                   },
//                 ]}
//               />
//             </ConfigProvider>
//           </div>
//         </div>
//         <BarChart data={distributorSales} graphTitle="Distributor Sales" />
//       </div>
//       {/* <div className=" p-[25px] rounded-2xl  bg-white  w-full  lg:h-[445px] flex lg:flex-row flex-col  h-auto">
//         <div className=" lg:w-[50%] w-full flex flex-col gap-6 ">
//           <div id="ChartHeader" className="w-full flex justify-between">
//             <h1 className="text-[24px] font-bold">Total Alerts</h1>
//             <div id="chartController" className="flex gap-4">
//               <ConfigProvider
//                 theme={{
//                   token: {
//                     fontFamily: "Baloo2",
//                     colorPrimary: "#8086AC",
//                     colorLinkActive: "#8086AC",
//                     colorLinkHover: "#8086AC",
//                     colorLink: "#8086AC",
//                   },
//                 }}
//               >
//                 <Select
//                   optionFilterProp="label"
//                   onChange={onChange}
//                   defaultValue={"distributor"}
//                   size="large"
//                   //   className="custom-select"
//                   labelInValue={true}
//                   options={[
//                     {
//                       value: "distributor",
//                       label: "Distributor",
//                     },
//                     {
//                       value: "Sales Agent",
//                       label: "Sales Agent",
//                     },
//                     {
//                       value: "Monitoring Company",
//                       label: "Monitoring Company",
//                     },
//                     {
//                       value: "Nursing Home",
//                       label: "Nursing Home",
//                     },
//                   ]}
//                 />
//               </ConfigProvider>
//             </div>
//           </div>
//           <div
//             id="ChartInfo"
//             className="grid lg:grid-cols-2 grid-cols-1  h-fit gap-6"
//           >
//             {[1, 2, 3, 4, 5, 6, 7, 8].map((item, indx) => {
//               return (
//                 <div
//                   key={indx}
//                   id="InfoItem"
//                   className="w-full flex justify-between items-center"
//                 >
//                   <div className="flex gap-2 items-center">
//                     <div className="w-[12px] h-[12px] bg-text-primary rounded-full"></div>
//                     <span className="text-lg font-medium">
//                       Alert {indx + 1}
//                     </span>
//                   </div>
//                   <span className="text-lg font-semibold">400</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <div className="lg:w-[50%] w-full">
//           <TotalAlertsChart />
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default AdminDashboard;
