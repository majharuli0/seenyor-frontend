import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ConfigProvider, Select, Table, Button } from 'antd';
import { HomeOutlined, AimOutlined } from '@ant-design/icons';
import MapView from './Components/Mapview/index';
import { DatePicker, Input } from 'antd';
const { RangePicker } = DatePicker;
import { SidebarContext } from '@/Context/CustomUsertable';
import CustomTable from '@/Shared/Table/CustomTable';
import { useAlertTableColumns } from '../Utiles/utiles';
import { getAlertList, getEventList } from '@/api/elderlySupport';
import dayjs, { Dayjs } from 'dayjs';
// import { getEventFilter } from "@/utils/helper";
import { escapeRegExp } from '@/utils/regex';
import { useNavigate } from 'react-router-dom';
import ActiveAlertsCards from '@/Components/ActiveAlerts/ActiveAlertsCards';
import { getElderlies } from '@/api/elderly';
import { getAlarmCount, getElderlyAndDeviceCount } from '@/api/Dashboard';
import { RiHome5Line } from 'react-icons/ri';
import { IoMdWarning } from 'react-icons/io';
import { MdWarningAmber } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa6';
import AlertCloseModal from '@/Components/ActiveAlerts/AlertCloseModal';
import { useNotification } from '@/Context/useNotification';

export default function MonitoringAgencyDashboard() {
  const [viewType, setViewType] = useState('Map View');
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const activeAlertTableColumns = useAlertTableColumns('activeAlert');
  const recentlyClosedAlertTableColumns = useAlertTableColumns('recentAlarms');
  const [alertHistory, setAlertHistory] = useState([]);
  const [alertHistoryLoading, setAlertHistoryLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [eventList, setEventList] = useState([]);
  const [eventPage, setEventPage] = useState([]);
  const [eventTotal, setEventTotal] = useState(0);
  const eventsTableColumns = useAlertTableColumns('events');
  const [selectedAlarmType, setSelectedAlarmType] = useState('fl_dv'); // Default to "All Alarms"
  const [alertHistiryQuery, setAlertHistiryQuery] = useState(getEventFilter('fl_dv'));
  const [devieCount, setDevieCount] = useState({});
  const [alarmsCount, setAlarmsCount] = useState({});
  const [searchResult, setSearchResult] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openAlertCloseModal, setOpenAlertCloseModal] = useState(false);
  const navigate = useNavigate();
  const { notificationEvent } = useNotification();
  const mapViewRef = useRef(null);
  const alarmOptions = [
    { value: 'fl_dv', label: 'All Alarms' },
    { value: 'fall_detected', label: 'Fall Detected' },
    { value: 'device_disconnected', label: 'Device Disconnected' },
  ];

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
      to_date: '2024-01-01',
      from_date: dayjs().format('YYYY-MM-DD'),
      is_resolved: false,
      lookup: false,
      limit: limit,
      ...alertHistiryQuery,
    })
      .then((res) => {
        setAlertHistoryLoading(false);
        setAlertHistory(res.data);
      })
      .catch((err) => {
        setAlertHistoryLoading(false);
        console.log(err);
      });
  }, [limit, alertHistiryQuery]);

  useEffect(() => {
    getAlartsHistory();
  }, [getAlartsHistory]);

  const getElderlyBySearch = useCallback(() => {
    if (searchQuery.trim() === '') {
      setSearchResult([]);
      return;
    }
    getElderlies({ search: searchQuery })
      .then((res) => {
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

  useEffect(() => {
    getElderlyAndDeviceCount()
      .then((res) => setDevieCount(res?.data))
      .catch((err) => console.log(err));
  }, []);
  const getAlarmsCounts = useCallback(() => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(7, 'days');
    getAlarmCount({
      end_date: startDate.format('YYYY-MM-DD'),
      from_date: endDate.format('YYYY-MM-DD'),
    })
      .then((res) => setAlarmsCount(res?.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getAlarmsCounts();
  }, [getAlarmsCounts]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  const handleResolveSelected = () => {
    setOpenAlertCloseModal(true);
  };
  useEffect(() => {
    if (notificationEvent) {
      getAlartsHistory();
    }
  }, [notificationEvent]);
  function refreshSomeAPIs() {
    if (mapViewRef.current && mapViewRef.current.getAlertListData) {
      mapViewRef.current.getAlertListData();
    }
  }
  return (
    <>
      <div className='flex gap-4 flex-col pb-8'>
        <div className='flex item-center justify-between w-full'></div>
        <div className='flex items-start gap-4 w-full'>
          <div
            id='Recently_Closed_Alerts'
            className='w-[50%] flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6'
          >
            <div
              id='Recently_Closed_Alerts_Header'
              className='w-full flex justify-between items-center'
            >
              <h1 className='text-[24px] font-bold'>Recent Notifications</h1>
              <div className='flex items-center gap-4'>
                {selectedRowKeys.length == 0 && (
                  <div className='flex items-center gap-4'>
                    <Select
                      value={selectedAlarmType}
                      onChange={(value) => {
                        setSelectedAlarmType(value);
                        setAlertHistiryQuery(getEventFilter(value));
                      }}
                      options={alarmOptions}
                      style={{ width: 200 }}
                      dropdownMatchSelectWidth={false}
                    />
                    <Select
                      value={limit}
                      onChange={(value) => setLimit(value)}
                      dropdownMatchSelectWidth={false}
                      options={[
                        { value: 10, label: '10' },
                        { value: 50, label: '50' },
                        { value: 100, label: '100' },
                        { value: 1000, label: '1000' },
                      ]}
                      style={{ width: 80 }}
                    />
                  </div>
                )}
                {selectedRowKeys.length !== 0 && (
                  <Button
                    variant='solid'
                    style={{ backgroundColor: 'black' }}
                    icon={<FaCheck />}
                    onClick={() => handleResolveSelected()}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
            <div id='Recently_Closed_Alerts_Table' className='w-full'>
              <SidebarContext.Provider
                value={{
                  getLatestAlarmList: {
                    getAlartsHistory,
                    getAlarmsCounts,
                    refreshSomeAPIs,
                  },
                }}
              >
                <Table
                  rowSelection={rowSelection}
                  columns={recentlyClosedAlertTableColumns}
                  dataSource={alertHistory}
                  rowKey='_id'
                  loading={alertHistoryLoading}
                  pagination={false}
                  locale={{ emptyText: 'No recent alerts' }}
                  className='rounded-lg'
                  scroll={{ x: scroll?.x || scroll || 700, y: scroll?.y }}
                />
              </SidebarContext.Provider>
            </div>
          </div>
          <div className='w-[50%] flex flex-col gap-4'>
            <div className='flex gap-4 w-full'>
              <div className='bg-white w-full p-4 rounded-xl flex flex-col'>
                <div>
                  <div className='font-medium opacity-90 flex items-center gap-1'>
                    <RiHome5Line /> <span>Total User</span>
                  </div>
                  <h2 className='text-4xl font-medium'>{devieCount?.house_count}</h2>
                </div>
                <div className='flex w-full items-end justify-end gap-6'>
                  <div className='flex flex-col justify-center items-center'>
                    <h2 className='font-semibold text-2xl'>{devieCount?.active_device_count}</h2>
                    <p className='capitalize font-medium opacity-90 text-[14px] flex items-center gap-1'>
                      <div className='size-2 bg-lime-600 rounded-sm'></div>
                      <span>Online Devices</span>
                    </p>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <h2 className='font-semibold text-2xl'>{devieCount?.inactive_device_count}</h2>
                    <p className='capitalize font-medium opacity-90 text-[14px] flex items-center gap-1'>
                      <div className='size-2 bg-red-600 rounded-sm'></div>
                      <span>Offline Devices</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-white w-full p-4 rounded-xl flex flex-col'>
                <div>
                  <div className='font-medium opacity-90 flex items-center gap-1'>
                    <MdWarningAmber />
                    <span>Past Week Alarms</span>
                  </div>
                  <h2 className='text-4xl font-medium'>{alarmsCount?.alarm_count}</h2>
                </div>
                <div className='flex w-full items-end justify-end gap-6'>
                  <div className='flex flex-col justify-center items-center'>
                    <h2 className='font-semibold text-2xl'>{alarmsCount?.closed_alarm}</h2>
                    <p className='capitalize font-medium opacity-90 text-[14px] flex items-center gap-1'>
                      <div className='size-2 bg-lime-600 rounded-sm'></div>
                      <span>Closed Alarms</span>
                    </p>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <h2 className='font-semibold text-2xl'>{alarmsCount?.false_alarm}</h2>
                    <p className='capitalize font-medium opacity-90 text-[14px] flex items-center gap-1'>
                      <div className='size-2 bg-red-600 rounded-sm'></div>
                      <span>False Alarms</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full p-0'>
              <div className='bg-transparent rounded-2xl h-[750px] z-1'>
                {viewType === 'Map View' && <MapView height={650} ref={mapViewRef} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertCloseModal
        openAlertCloseModal={openAlertCloseModal}
        setOpenAlertCloseModal={setOpenAlertCloseModal}
        selectedAlert={selectedRowKeys}
        getAlertListDatas={() => {
          refreshSomeAPIs();
          getAlartsHistory();
          getAlarmsCounts();
        }}
      />
    </>
  );
}

export const alertViewSegmentOptions = [
  { label: `Map View`, value: 'Map View', icon: <AimOutlined /> },
  { label: 'Room View', value: 'Room View', icon: <HomeOutlined /> },
];

// Filter logic helper (assumed to be in @/utils/helper)
export const getEventFilter = (eventKey) => {
  const filters = {
    fall_detected: { event: '2' },
    device_disconnected: { event: '5', is_online: '1' },
    fl_dv: { event: '2,5', is_online: '1' }, // Show both Fall Detected and Device Disconnected
  };
  return filters[eventKey] || {};
};
