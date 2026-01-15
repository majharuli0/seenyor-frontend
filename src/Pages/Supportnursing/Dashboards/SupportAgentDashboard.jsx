import React, { useCallback, useEffect, useState } from 'react';
import { Segmented, ConfigProvider, Select } from 'antd';
import DOMPurify from 'dompurify';
import { HomeOutlined, AimOutlined } from '@ant-design/icons';
import MapView from './Components/Mapview/index';
import RoomView from './Components/RoomvView/index';
import MultiLineChart from './Components/3xLineChart/MultiLineChart';
import WeeklyPicker from '@/Components/WeeklyPicker/WeeklyPicker';
import WeeklyMonthlyPicker from '@/Components/WeeklyMonthlyPicker/WeeklyMonthlyPicker';
import CustomButton from '@/Shared/button/CustomButton';
import { DatePicker, Input } from 'antd';
const { RangePicker } = DatePicker;
import { SidebarContext } from '@/Context/CustomUsertable';
import CustomTable from '@/Shared/Table/CustomTable';
import { LuPlus } from 'react-icons/lu';
import { useAlertTableColumns } from '../Utiles/utiles';
import { LuNavigation } from 'react-icons/lu';
import { getAlertList, getEventList } from '@/api/elderlySupport';
import dayjs, { Dayjs } from 'dayjs';
import { activeAlertsTableData, recentlyClosedAlertsTableData, eventsTableData } from './mock';
import { getAlertsGroup } from '@/utils/helper';
import { escapeRegExp } from '@/utils/regex';
import { useNavigate } from 'react-router-dom';
import ActiveAlertsCards from '@/Components/ActiveAlerts/ActiveAlertsCards';
import AlertsOverview from './Components/AlertsOverview/alertsOverview';
import CreateAndEditModal from '@/Components/CreateAndEditModal/CreateAndEditModal';
import { getElderlies } from '@/api/elderly';

export default function SupportAgentDashboard() {
  const [viewType, setViewType] = useState('Map View');
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const activeAlertTableColumns = useAlertTableColumns('activeAlert');
  const recentlyClosedAlertTableColumns = useAlertTableColumns('recentlyClosedAlert');
  const [alertHistory, setAlertHistory] = useState([]);
  const [page, SetPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [eventList, setEventList] = useState([]);
  const [eventPage, setEventPage] = useState([]);
  const [eventTotal, setEventTotal] = useState(0);
  const eventsTableColumns = useAlertTableColumns('events');
  const [alertHistoryLoading, setAlertHistoryLoading] = useState(true);
  const [alertHistiryQuery, setAlertHistiryQuery] = useState(null);
  const [searchResult, setSearchResult] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  function handleDatePicker(dateString) {
    console.log(dateString);
  }

  const onExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record._id]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const getAlartsHistory = useCallback(() => {
    setAlertHistoryLoading(true);
    getAlertList({
      to_date: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
      from_date: dayjs().format('YYYY-MM-DD'),
      is_resolved: true,
      lookup: false,
      page: page,
      // ...alertHistiryQuery,
    })
      .then((res) => {
        setTotal(res.total);
        setAlertHistoryLoading(false);
        setAlertHistory(res.data);
      })
      .catch((err) => {
        setAlertHistoryLoading(false);

        console.log(err);
      });
  }, [page]);
  // }, [page, alertHistiryQuery]);
  useEffect(() => {
    getAlartsHistory();
  }, [getAlartsHistory]);

  const getAllEventList = useCallback(() => {
    getEventList({
      to_date: '2024-11-30',
      from_date: dayjs().format('YYYY-MM-DD'),
      page: eventPage,
    })
      .then((res) => {
        setEventTotal(res.total);
        if (res.data.length > 0) {
          setEventList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);
  useEffect(() => {
    getAllEventList();
  }, [getAllEventList]);

  function onAlertHistorySegmantChnage(value) {
    setAlertHistiryQuery(getAlertsGroup(value));
  }

  const getElderlyBySearch = useCallback(() => {
    if (searchQuery.trim() === '') {
      setSearchResult([]); // Clear results if the search query is empty
      return;
    }

    getElderlies({
      search: searchQuery,
    })
      .then((res) => {
        // const originalData = ;
        // const duplicatedData = [
        //   ...originalData,
        //   ...originalData.map((item) => ({
        //     ...item,
        //     _id: `${item._id}_duplicate`, // Create a unique ID for the duplicate
        //   })),
        // ];

        setSearchResult(res?.data);
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
  return (
    <>
      <div className='flex gap-4 flex-col pt-8 pb-8'>
        <div className='flex item-center justify-between w-full'>
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
            <div className='w-[350px] relative'>
              <Input
                className='rounded-[10px]  min-w-[350px] w-full '
                size='large'
                placeholder='Search Anything'
                style={{ height: '44px' }}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                // onBlur={() => setIsFocused(false)}
              />
              {isFocused && searchQuery.trim() !== '' && (
                <div
                  id='searchResult'
                  className='mt-3 max-h-[600px] overflow-auto rounded-lg shadow-lg bg-white border border-gray-300 absolute top-10 left-0 z-[1000] w-full'
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
            {/* <div className="flex gap-4 mb-2">
              <WeeklyMonthlyPicker
                style={{ borderRadius: "10px" }}
                handleChange={(e) => console.log(e)}
              />
              <RangePicker
                showTime={false}
                style={{ width: "200px", borderRadius: "10px" }}
                size="large"
                placeholder={["Pick Data Range (Start)", "End"]}
                format="YYYY-MM-DD"
                onChange={(value, dateString) => {
                  handleDatePicker(dateString);
                }}
              />
              <CustomButton disabled={false} onClick={() => {}} type="text">
                Download Report
              </CustomButton>
            </div> */}
          </ConfigProvider>
        </div>
        <div className='w-full'>
          <ActiveAlertsCards refreshAlertList={getAlartsHistory} isElderlyVisible={true} />
        </div>
        <div className='w-full flex gap-4 md:flex-row flex-col'>
          <div className='w-full  p-0 '>
            <div className='bg-white  rounded-2xl  p-6 h-[600px]'>
              <div className='flex justify-between items-center mb-5'>
                <h1 className='text-2xl font-bold'>Alerts View</h1>
                <Segmented
                  size='large'
                  options={alertViewSegmentOptions}
                  onChange={(value) => setViewType(value)}
                />
              </div>

              {viewType === 'Map View' && <MapView />}
              {viewType === 'Room View' && <RoomView />}
            </div>
          </div>
          <div className='bg-white w-full md:w-[48%] rounded-2xl p-6 h-[600px] overflow-hidden'>
            <AlertsOverview />
          </div>
        </div>

        <div
          id='Recently_Closed_Alerts'
          className='w-full flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6'
        >
          <div id='Recently_Closed_Alerts_Header' className='w-full flex justify-between'>
            <h1 className='text-[24px] font-bold'>Past Alerts</h1>
            <div>
              <ConfigProvider
                theme={{
                  components: {
                    Segmented: {
                      itemSelectedBg: '#252F67',
                      itemSelectedColor: '#fff',
                      fontFamily: 'Baloo2',
                    },
                  },
                }}
              >
                {/* <Segmented
                  options={activeAlertSegmentOptions}
                  onChange={(value) => onAlertHistorySegmantChnage(value)}
                /> */}
              </ConfigProvider>
            </div>
          </div>
          <div id='Recently_Closed_Alerts_Table' className='w-full'>
            <SidebarContext.Provider
              value={{
                total: total,
                page: 1,
                SetPage,
                limit: 6,
              }}
            >
              <CustomTable
                loading={alertHistoryLoading}
                pageSize={6}
                tableData={alertHistory}
                columns={recentlyClosedAlertTableColumns}
              />
            </SidebarContext.Provider>
          </div>
        </div>

        {/* <div
          id="Events"
          className="w-full flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6"
        >
          <div id="Events_Header" className="w-full flex justify-between">
            <h1 className="text-[24px] font-bold">Events</h1>
          </div>
          <div id="Events_Table" className="w-full">
            <SidebarContext.Provider
              value={{
                total: eventTotal,
                page: 1,
                SetPage: () => setEventPage,
                getList: { getAllEventList },
              }}
            >
              <CustomTable
                pageSize={6}
                tableData={eventList}
                columns={eventsTableColumns}
                // expandable={{
                //   expandedRowRender: (record) => (
                //     <div
                //       style={{ margin: "0" }}
                //       className="flex gap-14 w-full items-center justify-start px-2"
                //     >
                //       <div className="flex w-[50vw] items-center justify-between">
                //         <div>
                //           <h2 className="text-[16px] font-semibold">
                //             {record.hospital.name}
                //           </h2>
                //           <p className="text-base">
                //             Phone Number:{" "}
                //             {record.hospital.phone
                //               ? record.hospital.phone
                //               : "Not Available"}
                //           </p>
                //         </div>
                //         <div className="flex items-center gap-2 ">
                //           <a
                //             href={`https://www.google.com/maps?q=${record.hospital.latitude},${record.hospital.longitude}`}
                //             target="_blank"
                //             rel="noopener noreferrer"
                //             className="text-base font-medium !text-blue-500"
                //           >
                //             View on Google Maps
                //           </a>
                //           <LuNavigation size={18} className="text-blue-500" />
                //         </div>
                //       </div>
                //     </div>
                //   ),
                //   rowExpandable: (record) => record.elderlyName !== null,
                //   expandedRowKeys: expandedRowKeys, // Controlled expanded row keys
                //   onExpand: onExpand, // Handle expand/collapse events
                // }}
              />
            </SidebarContext.Provider>
          </div>
        </div> */}
      </div>
      <CreateAndEditModal modalOpen={modalOpen} setModalOpen={setModalOpen} type='event' />
    </>
  );
}

export const alertViewSegmentOptions = [
  {
    label: ` Map View`,
    value: 'Map View',
    icon: <AimOutlined />,
  },
  {
    label: 'Room View',
    value: 'Room View',
    icon: <HomeOutlined />,
  },
];
export const activeAlertSegmentOptions = [
  {
    label: 'All Alerts',
    value: 'All Alerts',
  },
  {
    label: 'Critical',
    value: 'Critical',
  },
  {
    label: 'Warning',
    value: 'Warning',
  },
  {
    label: 'Informational',
    value: 'Informational',
  },
];
