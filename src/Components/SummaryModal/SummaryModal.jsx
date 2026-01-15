import React, { useState, useEffect, Suspense, useContext } from 'react';
import { Modal, DatePicker } from 'antd';
import './style.css';
import WeeklyMonthlyPicker from '@/Components/WeeklyMonthlyPicker/WeeklyMonthlyPicker';
import { Table } from 'antd';
import targetIcon from '@/assets/icon/target.svg';
import p0 from '@/assets/icon/p0.svg';
import p1 from '@/assets/icon/p1.svg';
import p2 from '@/assets/icon/p2.svg';
import { formatTimeWithSuffix, transformDataForBedExit } from '@/utils/helper';

import { IoMdArrowDropup } from 'react-icons/io';
const DataAnalysis = React.lazy(() => import('@/Components/DataAnalysis/DataAnalysis'));
const BarChart = React.lazy(() => import('@/Components/GraphAndChart/barChart'));
const MultiBarChart = React.lazy(() => import('@/Components/GraphAndChart/multibarChart'));
const TimelineGraph = React.lazy(() => import('@/Components/GraphAndChart/TimelineGraph'));
const TimelineBar = React.lazy(() => import('@/Components/GraphAndChart/TimelineBar'));
const LiveRateChart = React.lazy(() => import('@/Components/GraphAndChart/LiveRateChart'));
const RateChart = React.lazy(() => import('@/Components/GraphAndChart/RateChart'));
const DayRateChart = React.lazy(() => import('@/Components/GraphAndChart/DayRateChart'));
const ScatterChart = React.lazy(() => import('@/Components/GraphAndChart/scatterChart'));
import dayjs from 'dayjs';
import { SidebarContext } from '@/Context/CustomContext';
import { transformTime, transformDataDailyRoutine } from '@/utils/helper';
const { RangePicker, DatePicker: SingleDatePicker } = DatePicker;
import { durationData } from './mockData';
import getSummaryData from './getSummaryData';
import { CustomContext } from '@/Context/UseCustomContext';
import SleepHypnogram from '../GraphAndChart/SleepHynogram';

function convertDurationToMinutes(duration) {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  return hours * 60 + minutes + seconds / 60;
}
export default function SummaryModal({ visible, onClose, modalData, summaryProps }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedPickerType, setSelectedPickerType] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [avgLabels, setAvgLabels] = useState([]);
  const { sleepEventsType, sleepEventsColor } = useContext(SidebarContext);
  const context = useContext(CustomContext);
  const { elderlyDetails } = context || {};
  function handleWeeklyMonthly(e) {
    setFromDate(e.end);
    setToDate(e.start);
    setSelectedPickerType('weeklyMonthly');
  }

  function handleDatePicker(dates, dateStrings) {
    setFromDate(dateStrings[1] || '');
    setToDate(dateStrings[0] || '');
    setSelectedPickerType('range');
  }

  function handleDayPicker(date, dateString) {
    setFromDate(null);
    setToDate(dateString || '');
    setSelectedPickerType('day');
  }
  function generateSleepEventsData(data) {
    return data.map(({ date, events }) => {
      const eventCounts = events.reduce((acc, { event_type }) => {
        acc[event_type] = (acc[event_type] || 0) + 1;
        return acc;
      }, {});

      const data = Object.entries(eventCounts).map(([type, count]) => ({
        name: sleepEventsType[type],
        value: `${count}`,
        status: type,
        color: sleepEventsColor[type],
      }));

      return { date, data };
    });
  }
  function filteredDataForBedExitDuration(data) {
    if (!Array.isArray(data)) {
      console.error('Invalid data format: Expected an array.');
      return [];
    }

    const newData = data.map((item) => {
      // Calculate the total duration from sleep_index_common_list
      const totalBedExitDuration =
        item.sleep_index_common_list?.reduce((total, listItem) => {
          const value = Number(listItem?.value) || 0; // Convert value to a number
          return total + value;
        }, 0) || '0'; // Default to 0 if no valid values are present

      return {
        date: item?.date || null, // Default to null if date is missing
        bed_exit_duration: totalBedExitDuration, // Total duration as a number
      };
    });

    return newData;
  }
  function filteredDataForTimeToFallAsleep(data) {
    const filteredData = data.map((item) => {
      const totalDuration = item.sleep_index_common_list.reduce(
        (sum, sleepItem) => sum + parseInt(sleepItem.value, 10),
        0
      );
      return {
        date: item.date,
        totalFallAsleepDuration: totalDuration,
      };
    });
    return filteredData;
  }
  function filteredDataForHeartRateAnnomaly(data) {
    const result = [];
    data?.forEach((item) => {
      const eventDate = item.date;
      item?.events?.forEach((ev) => {
        if (ev.event_type === 14 || ev.event_type === 15) {
          // Check if the event date already exists in the result array
          const existingEntry = result.find((entry) => entry.date === eventDate);

          if (existingEntry) {
            // If the date exists, increment the total event count for that date
            existingEntry.anomalyHeartRate += 1;
          } else {
            // If the date doesn't exist, create a new entry for that date
            result.push({ date: eventDate, anomalyHeartRate: 1 });
          }
        }
      });
    });
    return result;
  }
  function filteredDataForDurationSpentInRoom(data) {
    const result = [];
    console.log(data);

    data?.forEach((item) => {
      const date = dayjs(item.datestr).subtract(1, 'day').format('YYYY-MM-DD');
      const entry = {
        date: date,
        data: [],
      };

      // Manually set status for specific fields and store them as objects
      if (item?.user_activity?.static_duration !== undefined) {
        entry.data.push({
          name: 'still_time',
          value: convertDurationToMinutes(item?.user_activity?.static_duration),
          status: '30', // Set status for still_time
        });
      }

      if (item?.user_activity?.walk_duration !== undefined) {
        entry.data.push({
          name: 'walking_duration',
          value: convertDurationToMinutes(item?.user_activity?.walk_duration),
          status: '31', // Set status for walking_duration
        });
      }

      if (item?.user_activity?.other_duration !== undefined) {
        entry.data.push({
          name: 'other_duration',
          value: convertDurationToMinutes(item?.user_activity?.other_duration),

          status: '32',
        });
      }

      // Push the formatted entry into the result array
      result.push(entry);
    });

    return result;
  }

  function prepareLabelData(data) {
    let labelData = [];
    if (!data) setAvgLabels([]);
    if (
      summaryProps?.title === 'Breath Rate Summary' ||
      summaryProps?.title === 'Heart Rate Summary'
    ) {
      if (!fromDate && data[0]?.avg) {
        labelData = [
          {
            name: 'Avg. Breath Rate',
            value: data[0]?.avg,
          },
          {
            name: 'Min. Breath Rate',
            value: data[0]?.min,
          },
          {
            name: 'Max. Breath Rate',
            value: data[0]?.max,
          },
        ];
      } else {
        // labelData = data[0]?.map((item) => ({
        //   name: item.name,
        //   value: item.value,
        // }));
      }
    } else if (summaryProps?.title === 'Sleep Timeline Summary') {
      if (data[0]?.statistical_data && toDate && fromDate == null) {
        //it's for day
        console.log(data[0]);

        const aggregatedEvents = data[0]?.statistical_data.reduce((acc, data) => {
          const startTime = new Date(data.start_time);
          const endTime = new Date(data.end_time);
          const durationInMinutes = (endTime - startTime) / (1000 * 60); // Duration in minutes
          const statusName = sleepEventsType[data.status];

          if (!acc[statusName]) {
            acc[statusName] = {
              duration: 0,
            };
          }
          acc[statusName].duration += durationInMinutes;
          return acc;
        }, {});

        labelData = Object.entries(aggregatedEvents).map(([name, { duration }]) => {
          const hours = Math.floor(duration / 60);
          const minutes = Math.floor(duration % 60);
          return {
            name,
            value: `${hours}hr ${minutes}m`, // Format duration
          };
        });
        labelData = [
          {
            name: 'Fell Asleep',
            value: formatTimeWithSuffix(data[0]?.sleep_st_idx),
          },
          ...labelData,
          {
            name: 'Bed Exit After Sleep',
            value: data[0]?.leave_bed_count + 'x',
          },
          {
            name: 'Woke up',
            value: formatTimeWithSuffix(data[0]?.sleep_ed_idx),
          },
        ];
      } else {
        const averages = {};
        const avgdata = data.map((item) => ({
          ...{ data: item.sleep_index_common_list, date: item.date },
        }));
        avgdata?.forEach((dayData) => {
          dayData?.data?.forEach(({ name, value, status, ratio }) => {
            if (!averages[status]) {
              averages[status] = {
                name: `Avg. ${sleepEventsType[status]}`,
                totalValue: 0,
                totalRatio: 0,
                count: 0,
              };
            }
            averages[status].totalValue += parseInt(value);
            averages[status].totalRatio += ratio;
            averages[status].count += 1;
          });
        });

        labelData = Object.entries(averages).map(([status, data]) => {
          const avgMinutes = Math.round(data.totalValue / data.count);
          const hours = Math.floor(avgMinutes / 60);
          const minutes = avgMinutes % 60;

          return {
            name: data.name,
            value: `${hours}hr ${minutes}m`,
            ratio: Math.round(data.totalRatio / data.count),
          };
        });
      }
    } else if (summaryProps?.title === 'Sleep Events Summary') {
      if (data[0]?.events && toDate && fromDate == null) {
        const alarmEventCounts = data[0]?.events.reduce((acc, event) => {
          const eventName = sleepEventsType[event.event_type];
          const existingEvent = acc.find((e) => e.name === eventName);
          if (existingEvent) {
            // Remove 'x', increment, then add 'x' back
            const currentValue = parseInt(existingEvent.value.replace('x', ''));
            existingEvent.value = `${currentValue + 1}x`;
          } else {
            acc.push({
              name: eventName,
              value: '1x',
              color: sleepEventsColor[eventName],
            });
          }
          return acc;
        }, []);

        labelData = alarmEventCounts;
      } else {
        const averages = {};
        const avgData = generateSleepEventsData(data);
        avgData?.forEach((dayData) => {
          dayData?.data?.forEach(({ name, value, status }) => {
            if (!averages[status]) {
              averages[status] = {
                name: `Avg. ${sleepEventsType[status]}`,
                totalValue: 0,
                count: 0,
              };
            }
            averages[status].totalValue += parseInt(value);
            averages[status].count += 1; // Increment counter
          });
        });

        labelData = Object.entries(averages).map(([status, data]) => {
          const average = Math.round(data.totalValue / data.count); // Calculate average
          return {
            name: data.name,
            value: `${average}x`, // Add 'x' suffix to match format
          };
        });
      }
    }

    setAvgLabels(labelData);
    return labelData;
  }

  function prepareChartData(data) {
    if (!data) setChartData([]);
    if (summaryProps?.title === 'Sleep Timeline Summary') {
      if (toDate && fromDate) {
        const chartData = data.map((item) => ({
          ...{ data: item.sleep_index_common_list, date: item.date },
        }));
        setChartData(chartData);
      } else {
        setChartData(data[0]);
      }
    } else if (summaryProps?.title === 'Sleep Events Summary') {
      const transformedData = generateSleepEventsData(data);
      setChartData(transformedData);
    } else if (
      summaryProps?.title === 'Daily Breathing Rate Summary' ||
      summaryProps?.title === 'Daily Heart Rate Summary'
    ) {
      if (fromDate && toDate) {
        const transformedData = {
          xdata: data.map((item) => item.date),
          maxArray: data.map((item) => item.max),
          minArray: data.map((item) => item.min),
          allAvgNumber: Math.round(data.reduce((sum, item) => sum + item.avg, 0) / data.length),
        };
        setChartData(transformedData);
      }
    } else if (summaryProps?.title === 'Time Spent Out of Bed Summary') {
      const transformedData = filteredDataForBedExitDuration(data);
      return transformedData;
    } else if (summaryProps?.title === 'Time to Fall Asleep Summary') {
      const transformedData = filteredDataForTimeToFallAsleep(data);
      return transformedData;
    } else if (summaryProps?.title === 'Heart Rate Variation Overview Summary') {
      const transformedData = filteredDataForHeartRateAnnomaly(data);
      return transformedData;
    } else if (summaryProps?.title === 'Room Occupancy Duration Overview Summary') {
      const transformedData = filteredDataForDurationSpentInRoom(data);
      setChartData(transformedData);
    }
    // setChartData(data);
    return data;
  }
  useEffect(() => {
    async function fetchData() {
      // Prevent fetching if modal is not visible or dates are missing or endpoint is missing
      if (
        !visible ||
        (!fromDate && selectedPickerType !== 'day') ||
        !toDate ||
        !summaryProps?.apisProps?.endpoint
      ) {
        return;
      }

      let apiToDate = toDate;
      let apiFromDate = fromDate;

      if (selectedPickerType === 'day') {
        apiToDate = toDate ? dayjs(toDate).subtract(1, 'day').format('YYYY-MM-DD') : '';
        apiFromDate = apiToDate;
      }

      try {
        const res = await getSummaryData(summaryProps?.apisProps?.endpoint, {
          ...summaryProps?.apisProps?.query,
          elderly_id: elderlyDetails?._id,
          from_date: apiFromDate,
          to_date: apiToDate,
        });
        if (res && res?.data) {
          setResponseData(prepareChartData(res?.data));
          prepareLabelData(res?.data);
          prepareChartData(res?.data);
        }
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setResponseData([]);
      }
    }

    fetchData();
  }, [
    summaryProps?.apisProps?.endpoint,
    fromDate,
    toDate,
    visible,
    selectedPickerType,
    elderlyDetails?._id,
  ]);

  const renderPickers = () => {
    return summaryProps?.pickerTypes?.map((type) => {
      switch (type) {
        case 'weeklyMonthly':
          return (
            <WeeklyMonthlyPicker
              key='weeklyMonthly'
              placeholder={'Weekly/Monthly'}
              style={{ width: '140px', borderRadius: '10px' }}
              handleChnage={handleWeeklyMonthly}
              value={
                selectedPickerType === 'weeklyMonthly' && toDate && fromDate
                  ? { start: toDate, end: fromDate }
                  : null
              }
            />
          );
        case 'range':
          return (
            <RangePicker
              key='range'
              showTime={false}
              style={{ width: '200px', borderRadius: '10px' }}
              size='large'
              placeholder={['Pick Data Range (Start)', 'End']}
              format='YYYY-MM-DD'
              onChange={(value, dateString) => handleDatePicker(value, dateString)}
              value={
                selectedPickerType === 'range' && fromDate && toDate
                  ? [dayjs(toDate), dayjs(fromDate)]
                  : null
              }
              allowClear={true}
            />
          );
        case 'day':
          return (
            <DatePicker
              key='day'
              style={{ width: '200px', borderRadius: '10px' }}
              size='large'
              format='YYYY-MM-DD'
              onChange={(date, dateString) => handleDayPicker(date, dateString)}
              value={selectedPickerType === 'day' && toDate ? dayjs(toDate) : null}
              allowClear={true}
            />
          );
        default:
          return null;
      }
    });
  };

  const chartConfig = {
    multibar: {
      default: {
        component: MultiBarChart,
        getProps: () => ({
          data: chartData,
          toDate: fromDate,
          fromDate: toDate,
          valueType: summaryProps?.dataType,
        }),
      },
      day: {
        component: SleepHypnogram,
        getProps: () => ({
          sleepData: chartData?.statistical_data,
          height: 300,
        }),
      },
    },
    multibar_sleep_events: {
      default: {
        component: MultiBarChart,
        getProps: () => ({
          data: chartData,
          toDate: fromDate,
          fromDate: toDate,
          valueType: summaryProps?.dataType,
        }),
      },
      day: {
        component: TimelineBar,
        getProps: () => ({
          alarmEvents: responseData[0]?.events,
          enterBedTime: transformTime(responseData[0]?.get_bed_idx),
          getupAfterTime: transformTime(responseData[0]?.leave_bed_idx),
        }),
      },
    },
    bar: {
      default: {
        component: BarChart,
        getProps: () => ({
          data: responseData,
          dataType: summaryProps?.dataType,
          color: summaryProps?.color,
          xUnit: summaryProps?.xUnit,
          toDate: summaryProps?.isFromToDate ? fromDate : '',
          fromDate: summaryProps?.isFromToDate ? toDate : '',
          numberLimit: summaryProps?.numberLimit,
          dataUnit: summaryProps?.dataUnit,
          chartFor: summaryProps?.chartFor,
        }),
      },
    },
    rate: {
      default: {
        component: RateChart,
        getProps: () => ({
          cheartInfo: chartData,
          color: summaryProps?.color,
          dateType: 'Month',
          fromDate: toDate,
          toDate: fromDate,
        }),
      },
      day: {
        component: DayRateChart,
        getProps: () => ({
          data: responseData[0]?.data_list || [],
          timestamp: responseData[0]?.timestamps || [],
          color: summaryProps?.color,
          type: summaryProps?.dataType,
        }),
      },
    },
    scatter: {
      default: {
        component: ScatterChart,
        getProps: () => ({
          data:
            summaryProps?.title !== 'Bed Exit Time Trends Summary'
              ? transformDataDailyRoutine(responseData)
              : transformDataForBedExit(responseData),
          colors: {
            gotobed: '#2EC7C9',
            wakeup: '#5AB1EF',
            getup: '#FFB980',
            fallasleep: '#B6A2DE',
            bedexit: '#508C9B',
          },
        }),
      },
    },
  };

  const renderChart = () => {
    const chartType = summaryProps?.chartType;
    const chartConfigEntry =
      chartConfig[chartType]?.[selectedPickerType] || chartConfig[chartType]?.default;

    if (!chartConfigEntry) return null;

    const { component: ChartComponent, getProps } = chartConfigEntry;

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ChartComponent {...getProps()} />
      </Suspense>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width='100%'
      style={{ height: '100vh', padding: 0, borderRadius: 0, top: 0 }}
      className='!rounded-none summaryModal !h-[100vh] overflow-hidden'
    >
      <div className='p-4 h-[100vh]'>
        <div className='flex flex-col justify-center items-center mb-4 gap-2'>
          <h2 className='text-2xl font-bold text-primary'>{summaryProps?.title}</h2>
          <div id='DatePickers' className='flex gap-4 items-center justify-center mt-4'>
            {renderPickers()}
          </div>
        </div>
        {avgLabels.length > 0 && (
          <div
            id='chartTotal'
            className='flex w-full flex-wrap items-center justify-center border-b mt-12'
          >
            {avgLabels.map((item, indx, arr) => (
              <TotalItem
                key={indx}
                label={item.name}
                value={item.value}
                isFirst={indx === 0}
                isLast={indx === arr.length - 1}
              />
            ))}
          </div>
        )}

        <div className='report-content max-h-[350px]  w-[90%] mt-16 mx-auto'>{renderChart()}</div>

        {/* data table  */}
        {/* <div className="w-[90%] mx-auto mt-6">
          <Table dataSource={data} columns={columns} pagination={false} />
        </div> */}
      </div>
    </Modal>
  );
}

export const TotalItem = ({ label, value, isFirst, isLast }) => {
  return (
    <div
      id='totalItem'
      className={`max-w-[200px] w-fit border p-1 px-6 flex items-center justify-center border-b-[0.5px] flex-col ${
        isFirst && isLast
          ? 'rounded-tl-xl rounded-tr-xl'
          : isFirst
            ? 'rounded-tl-xl'
            : isLast
              ? 'rounded-tr-xl'
              : ''
      }`}
    >
      <h1 className='text-2xl font-bold text-primary text-nowrap'>{value}</h1>
      <span className='text-sm font-medium opacity-80 text-primary text-nowrap'>{label}</span>
    </div>
  );
};

export const columns = [
  {
    title: 'Item',
    render: (row) => (
      <div className='text-primary px-[11px] text-base font-semibold'>{row.event}</div>
    ),
  },
  {
    title: 'Target',
    render: (row) => (
      <div className='text-primary px-[11px] text-base font-semibold flex items-center gap-1'>
        <img src={targetIcon} alt='target' />
        {row.target}x
      </div>
    ),
  },
  {
    title: 'Value',
    render: (row) => (
      <div className='text-primary px-[11px] text-base font-semibold'>{row.value}x</div>
    ),
  },
  {
    title: 'Trend',
    render: (row) => (
      <div className='w-full h-[10px]  px-[11px] text-base font-semibold flex items-center gap-2'>
        <img src={row.value - row.target > 0 ? p1 : p0} alt='trend' className='w-[16px] h-[16px]' />
        {row.value - row.target}x
      </div>
    ),
  },
  {
    title: 'Type',
    render: (row) => (
      <div
        className={`w-full h-[10px] flex items-center gap-2 px-[11px] text-base font-semibold ${
          row.status === '1'
            ? 'text-yellow-500'
            : row.status === '2'
              ? 'text-red-500'
              : 'text-blue-500'
        } `}
      >
        {row.status === '0' ? 'Good' : row.status === '1' ? 'Warning' : 'Critical'}
        {row.status === '0' && (
          <div className='w-4 h-4 bg-blue-500 rounded-full'></div> // Circle
        )}
        {row.status === '1' && <IoMdArrowDropup size={26} className='text-yellow-500' />}
        {row.status === '2' && <IoMdArrowDropup size={26} className='text-red-500' />}
      </div>
    ),
  },
];

export const data = [
  {
    event: 'Sleep Apnea',
    value: '10',
    target: '7',
    status: '1',
  },
];
