import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Radio,
  Select,
  Table,
  Typography,
  Space,
  ConfigProvider,
  Spin,
  Empty,
} from 'antd';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
import {
  sampleVisitData,
  sampleAlarmData,
  filterData,
  formatDateRange,
  calculateAlarmStats,
} from './data/sampleData';
import { downloadPDF } from './pdfGenerator';
import { FaDownload } from 'react-icons/fa';
import { getaAlarmLogs, getElderlyList, getVisitLogs } from '@/api/elderly';
import { render } from 'react-dom';
import {
  formatMilliseconds,
  getAlertInfoViaEventDetails,
  getEventFilter,
  getResponseTime,
} from '@/utils/helper';
import dayjs from 'dayjs';
import { getNurseList } from '@/api/Users';
export default function ExportCompliance() {
  const defaultFrom = dayjs().subtract(7, 'day');
  const defaultTo = dayjs();
  const [type, setType] = useState('alarms');
  const [alarmsData, setAlarmsData] = useState([]);
  const [visitsData, setVisitsData] = useState([]);
  const [nurseList, setNurseList] = useState([]);
  const [elderlyList, setElderlyList] = useState([]);
  const [selectedNurseNames, setSelectedNurseNames] = useState([]);
  const [selectedResidentNames, setSelectedResidentNames] = useState([]);

  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [summary, setSummary] = React.useState({
    fall_avg_res_time: 0,
    total: 0,
  });
  const [filters, setFilters] = useState({
    dateRange: [defaultFrom, defaultTo],
    residents: [],
    nurses: [],
    alarms: [],
  });
  const [totalPages, setTotalPages] = React.useState(1);
  const [toDate, setToDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [limit] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const buildEventArray = (alarmKeys) => {
    return alarmKeys.map((key) => getEventFilter(key)).filter(Boolean);
  };
  const [alarmsCache, setAlarmsCache] = useState({});
  const [visitsCache, setVisitsCache] = useState({});
  const getFilterHash = (filters) => {
    return JSON.stringify({
      alarms: filters?.alarms,
      nurses: filters?.nurses,
      residents: filters?.residents,
      dateRange: filters?.dateRange?.map((d) => d.format('YYYY-MM-DD')),
    });
  };

  const handleGenerateReport = async (reportType, filter) => {
    try {
      let data;
      const { from, to } = getFormattedDates();
      if (reportType === 'visits') {
        data = {
          visits: visitsData,
          dateRange: { from, to },
          selectedResidents: selectedResidentNames,
        };
      } else if (reportType === 'alarms') {
        data = {
          alarms: alarmsData,
          dateRange: { from, to },
          totalAlarms: summary.total,
          avgResponseTime: formatMilliseconds(summary.fall_avg_res_time),
          selectedResidents: selectedResidentNames,
          selectedNurses: selectedNurseNames,
        };
      }

      await downloadPDF(reportType, data, filters);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const getFormattedDates = () => {
    if (!filters.dateRange || filters.dateRange.length !== 2) return { from: '', to: '' };
    return {
      from: filters.dateRange[0].format('DD MMM YYYY'),
      to: filters.dateRange[1].format('DD MMM YYYY'),
    };
  };
  const { from, to } = getFormattedDates();

  const visitColumns = [
    {
      title: 'Time of Visit',
      dataIndex: 'time_of_visit',
      key: 'time_of_visit',
      render: (text) => (
        <div className='px-4'>
          <div className='rounded-[6px] text-nowrap bg-white border border-[#E4E4E7] px-3 py-1 text-[12px] font-medium text-gray-700 inline-block'>
            {dayjs(text).format('HH:mm:ss')}
          </div>
        </div>
      ),
    },
    {
      title: 'Exit Time',
      key: 'exitTime',
      dataIndex: 'exit_time',
      render: (text) => (
        <div className='px-2 '>{(text && dayjs(text).format('HH:mm:ss')) || '-'}</div>
      ),
    },
    {
      title: 'Visit Duration',
      key: 'duration',
      render: (row) => (
        <div className='px-2 '>{getResponseTime(row?.time_of_visit, row?.exit_time)}</div>
      ),
    },
    {
      title: 'Room Number',
      key: 'room',
      render: (row) => <div className='px-2'>{row?.room_no}</div>,
    },
  ];

  const alarmColumns = [
    {
      title: 'Alarm Name',
      key: 'alarm',
      render: (row) => {
        return <span>{getAlertInfoViaEventDetails(row)?.title}</span>;
      },
    },
    {
      title: 'Logs',
      key: 'logs',
      render: (row) => {
        return (
          <div>
            Alarm detected at {new Date(row?.created_at).toLocaleTimeString()}{' '}
            {row?.response_details
              ? `•
            Responded At
            ${new Date(row?.response_details?.created_at).toLocaleTimeString()}`
              : ''}{' '}
            {row?.closed_at ? `• Resolved At ${new Date(row?.closed_at).toLocaleTimeString()}` : ''}
          </div>
        );
      },
    },
    {
      title: 'Resident Name',
      key: 'resident',
      render: (row) => {
        return <div>{row?.elderly_name}</div>;
      },
    },
    {
      title: 'Room No.',
      key: 'room',
      render: (row) => {
        return <div>{row?.room_no}</div>;
      },
    },
    {
      title: 'Response Time',
      key: 'responseTime',
      render: (row) => {
        return (
          <div className=''>
            {row?.response_details?.created_at ? (
              getResponseTime(row?.created_at, row?.response_details?.created_at)
            ) : (
              <span className='italic text-sm opacity-40'>Not Vsited Yet</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Resolved by',
      key: 'resolvedBy',
      render: (row) => {
        return (
          <>{row?.closed_by || <span className='italic text-sm opacity-40'>Unresolved</span>}</>
        );
      },
    },
    {
      title: 'Comments',
      key: 'comments',
      render: (row) => {
        return (
          <>{row?.comment || <span className='italic text-sm opacity-40'>No Comments</span>}</>
        );
      },
    },
  ];
  const getAlarmLogs = useCallback(async () => {
    if (type !== 'alarms') return;

    const filterHash = getFilterHash(filters);

    if (alarmsCache[filterHash]) {
      setAlarmsData(alarmsCache[filterHash].data);
      setTotalPages(alarmsCache[filterHash].totalPages);
      setSummary(alarmsCache[filterHash].summary);
      return;
    }
    setLoading(true);
    try {
      const [from, to] = filters.dateRange || [];
      const to_date = from ? from.format('YYYY-MM-DD') : '';
      const from_date = to ? to.format('YYYY-MM-DD') : '';

      const event = buildEventArray(filters.alarms);

      const first = await getaAlarmLogs({
        page: 1,
        from_date,
        limit,
        to_date,
        event: event.length > 0 ? JSON.stringify(event) : null,
        closed_by_id: filters.nurses.length ? filters.nurses.join(',') : null,
        room_no: filters.residents.length ? filters.residents.join(',') : null,
      });

      let allData = first.data || [];
      const total_pages = first.total_pages || 1;

      if (total_pages > 1) {
        const promises = [];
        for (let p = 2; p <= total_pages; p++) {
          promises.push(
            getaAlarmLogs({
              page: p,
              from_date,
              limit,
              closed_by_id: filters.nurses.length ? filters.nurses.join(',') : null,
              room_no: filters.residents.length ? filters.residents.join(',') : null,
              to_date,
              event: event.length > 0 ? JSON.stringify(event) : null,
            })
          );
        }
        const results = await Promise.all(promises);
        results.forEach((res) => {
          allData = allData.concat(res.data || []);
        });
      }
      setAlarmsData(allData);
      setTotalPages(total_pages);
      setSummary({
        total: first?.total,
        fall_avg_res_time: first?.fall_avg_res_time,
      });

      setAlarmsCache((prev) => ({
        ...prev,
        [filterHash]: {
          data: allData,
          totalPages: total_pages,
          summary: {
            total: first?.total,
            fall_avg_res_time: first?.fall_avg_res_time,
          },
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);
  const getVisitLogsData = useCallback(async () => {
    if (type !== 'visits') return;

    const filterHash = getFilterHash(filters);

    if (visitsCache[filterHash]) {
      setVisitsData(visitsCache[filterHash].data);
      setTotalPages(visitsCache[filterHash].totalPages);
      return;
    }

    setLoading(true);
    try {
      const [from, to] = filters.dateRange || [];
      const from_date = to ? to.format('YYYY-MM-DD') : '';
      const to_date = from ? from.format('YYYY-MM-DD') : '';
      const firstPage = await getVisitLogs({
        page: 1,
        limit: 25,
        room_no: filters.residents.length ? filters.residents.join(',') : null,
        from_date,
        to_date,
      });

      let allData = firstPage.data || [];
      const total_pages = firstPage.total_pages || 1;

      if (total_pages > 1) {
        const promises = [];
        for (let p = 2; p <= total_pages; p++) {
          promises.push(
            getVisitLogs({
              page: p,
              limit: 25,
              room_no: filters.residents.length ? filters.residents.join(',') : null,
              from_date,
              to_date,
            })
          );
        }
        const results = await Promise.all(promises);
        results.forEach((res) => {
          allData = allData.concat(res.data || []);
        });
      }
      setVisitsCache((prev) => ({
        ...prev,
        [filterHash]: { data: allData, totalPages },
      }));
      setVisitsData(allData);
      setTotalPages(total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type, filters, limit]);

  const lastFilterRef = useRef({ alarms: '', visits: '' });

  useEffect(() => {
    const filterHash = getFilterHash(filters);
    if (type === 'alarms') {
      if (lastFilterRef.current.alarms !== filterHash) {
        getAlarmLogs();
        lastFilterRef.current.alarms = filterHash;
      }
    } else if (type === 'visits') {
      if (lastFilterRef.current.visits !== filterHash) {
        getVisitLogsData();
        lastFilterRef.current.visits = filterHash;
      }
    }
  }, [type, filters]);
  const getNurseLists = useCallback(() => {
    getNurseList()
      .then((res) => {
        const nurseOptions = res?.data?.map((n) => ({
          value: n._id,
          label: `${n.name} ${n.last_name || ''}`.trim(),
        }));

        setNurseList(nurseOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const getElderlyLists = useCallback(() => {
    getElderlyList()
      .then((res) => {
        const residentOptions = res?.data?.map((r) => ({
          value: r.room_no,
          label: r.name,
        }));
        setElderlyList(residentOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    getNurseLists();
    getElderlyLists();
  }, [getElderlyLists, getNurseLists]);

  const currentArray = type === 'visits' ? visitsData : alarmsData;

  const rowsPerPage = 20;
  const pageChunks = Array.from({ length: Math.ceil(currentArray.length / rowsPerPage) }, (_, i) =>
    currentArray.slice(i * rowsPerPage, (i + 1) * rowsPerPage)
  );
  useEffect(() => {
    const nurseNames = filters.nurses.length
      ? filters.nurses
          .map((id) => nurseList.find((n) => n.value === id))
          .filter(Boolean)
          .map((n) => n.label)
      : [];

    const residentNames = filters.residents.length
      ? filters.residents
          .map((roomNo) => elderlyList.find((r) => r.value === roomNo))
          .filter(Boolean)
          .map((r) => r.label)
      : [];

    setSelectedNurseNames(nurseNames);
    setSelectedResidentNames(residentNames);
  }, [filters, nurseList, elderlyList]);

  return (
    <div className='flex gap-4 h-[calc(100svh-80px)]  bg-[#F9F9F9] overflow-hidden'>
      <div className='max-w-[320px] w-full h-[calc(100svh-80px)] bg-white overflow-y-auto p-4 '>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#514EB5',
              colorLinkActive: '#514EB5',
              colorLinkHover: '#514EB5',
              colorLink: '#514EB5',
            },
          }}
        >
          <div className='flex items-center gap-2 mb-6'>
            <span className='font-medium text-[20px] text-nowrap'>Filter Compliance</span>
            <hr className='bg-[#EEEEEE] h-[1px] w-full' />
          </div>
          <div className='flex flex-col  justify-start lg2:justify-between lg2:h-[90%] h-fit  '>
            <div>
              <div style={{ marginBottom: 25 }}>
                <label className='block text-base font-medium mb-1'>Compliance Type</label>
                <Radio.Group
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  buttonStyle='solid'
                  style={{ width: '100%' }}
                >
                  <Radio.Button value='alarms' style={{ width: '50%', textAlign: 'center' }}>
                    Alarms
                  </Radio.Button>
                  <Radio.Button value='visits' style={{ width: '50%', textAlign: 'center' }}>
                    Visit
                  </Radio.Button>
                </Radio.Group>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className='block text-base font-medium mb-1'>Select Date & Time Range</label>
                <RangePicker
                  style={{ width: '100%' }}
                  value={filters.dateRange}
                  onChange={(values) => setFilters({ ...filters, dateRange: values })}
                />
              </div>

              <div style={{ marginBottom: 25 }}>
                <label className='block text-base font-medium mb-1'>Filter By Alarm</label>
                <Select
                  mode='multiple'
                  placeholder='Please select alarms'
                  style={{ width: '100%' }}
                  disabled={type === 'visits'}
                  onChange={(val) => setFilters({ ...filters, alarms: val })}
                  options={[
                    { value: 'fall_detected', label: 'Fall Detected' },
                    {
                      value: 'device_disconnected',
                      label: 'Device Disconnected',
                    },
                    { value: 'off_bed', label: 'Nighttime Wandering' },
                  ]}
                />
              </div>

              <div style={{ marginBottom: 25 }}>
                <label className='block text-base font-medium mb-1'>Filter By Nurse</label>
                <Select
                  mode='multiple'
                  placeholder='Select nurses'
                  dropdownMatchSelectWidth={false}
                  style={{ width: '100%' }}
                  disabled={type === 'visits'}
                  onChange={(val) => setFilters({ ...filters, nurses: val })}
                  options={nurseList}
                />
              </div>

              <div style={{ marginBottom: 25 }}>
                <label className='block text-base font-medium mb-1'>Filter By Resident</label>
                <Select
                  mode='multiple'
                  placeholder='Select residents'
                  dropdownMatchSelectWidth={false}
                  style={{ width: '100%' }}
                  onChange={(val) => setFilters({ ...filters, residents: val })}
                  options={elderlyList}
                />
              </div>
            </div>

            <Button
              type='primary'
              block
              size='large'
              disabled={
                loading || type == 'visits' ? visitsData.length === 0 : alarmsData.length === 0
              }
              onClick={() =>
                handleGenerateReport(type, {
                  dateRange: {
                    from: '2025-02-26',
                    to: '2025-02-28',
                  },
                  residents: [],
                  nurses: [],
                  alarms: [],
                  timeRange: {
                    from: '08:00',
                    to: '08:00',
                  },
                })
              }
              icon={<FaDownload />}
            >
              Download as PDF
            </Button>
          </div>
        </ConfigProvider>
      </div>

      <div className='w-full  h-[calc(100svh-80px)] overflow-y-auto p-6'>
        <Spin spinning={loading} className='flex items-center justify-center h-[100vh] mt-[25vh]'>
          {pageChunks.map((chunk, idx) => (
            <Card
              key={idx}
              className='border-1 border-[#B1B1B1] !rounded-none shadow-md h-fit mb-4 '
            >
              {idx === 0 && (
                <>
                  <div className='flex w-full justify-between items-center mb-4'>
                    <div>
                      <span className='text-[16px] font-medium text-[#8C8C8C]'>
                        COMPLIANCE REPORT
                      </span>
                      <h1 className='text-[24px] font-medium text-[#2B2B2B]'>
                        Eldery Nursing Home care, UK
                      </h1>
                      <span className='text-[16px] font-normal text-[#2B2B2B]'>From {from}</span>
                      <br />
                      <span className='text-[16px] font-normal text-[#2B2B2B]'>To {to}</span>
                    </div>
                    {type === 'alarms' && (
                      <div className='flex flex-col max-w-[300px] w-full'>
                        <div className='flex items-center justify-between border-b border-[#D9D9D9] pb-2 mb-2'>
                          <span className='text-[15px] font-medium text-[#5D5D5D]'>
                            Total Alarms
                          </span>
                          <span className='text-[18px] font-medium text-[#000000]'>
                            {summary.total}
                          </span>
                        </div>
                        {(filters?.alarms.includes('fall_detected') ||
                          filters?.alarms?.length == 0) && (
                          <div className='flex items-center justify-between'>
                            <span className='text-[16px] font-medium text-[#5D5D5D]'>
                              Avg. Response Time
                            </span>
                            <span className='text-[16px] font-medium text-[#000000]'>
                              {formatMilliseconds(summary.fall_avg_res_time)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='p-2 bg-gray-100 mb-4 rounded-lg'>
                    {type === 'alarms' && (
                      <div>
                        <b className='font-medium'>With Nurse Involved: </b>
                        {selectedNurseNames.length ? selectedNurseNames.join(', ') : 'All Nurses'}
                      </div>
                    )}
                    <div>
                      <b className='font-medium'>With Resident Involved: </b>
                      {selectedResidentNames.length
                        ? selectedResidentNames.join(', ')
                        : 'All Residents'}
                    </div>
                  </div>
                </>
              )}

              <Table
                dataSource={chunk}
                columns={type === 'visits' ? visitColumns : alarmColumns}
                pagination={false}
              />

              <div className='w-full flex justify-center mt-6 border-t border-[#CCCCCC] pt-4'>
                <span className='text-[14px] font-medium text-[#2B2B2B]'>
                  Page {idx + 1} of {pageChunks.length}
                </span>
              </div>
            </Card>
          ))}
        </Spin>
        <div className='flex items-center justify-center h-[70vh]'>
          {!loading && alarmsData?.length == 0 && type == 'alarms' && (
            <Empty description='No Alarm Data Found'></Empty>
          )}
          {!loading && visitsData?.length == 0 && type == 'visits' && (
            <Empty description='No Visits Data Found'></Empty>
          )}
        </div>
      </div>
    </div>
  );
}
