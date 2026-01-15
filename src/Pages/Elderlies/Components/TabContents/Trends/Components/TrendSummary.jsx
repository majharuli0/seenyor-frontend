import React, { useEffect, useContext, useState, useCallback } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { DatePicker, Spin } from 'antd';
import BarChart from '@/Components/GraphAndChart/barChart';
import { numberData } from './mockData';
import { Table } from 'antd';
import DynamicBarChart from '@/Components/GraphAndChart/barGraph';
import { getTrendsReport } from '@/api/elderlySupport';
import { CustomContext } from '@/Context/UseCustomContext';
import { formatDuration, extractTimeAndSuffix } from '@/utils/helper';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const svgs = import.meta.glob('./Icons/TrendIcons/*.svg', { eager: true });
let obj = {};
for (const key in svgs) {
  if (Object.hasOwnProperty.call(svgs, key)) {
    const element = svgs[key];
    obj[key] = element.default;
  }
}

const formatTo12HourTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  return `${formattedHours}:${String(minutes).padStart(2, '0')} ${suffix}`;
};

export default function TrendSummary({ trendId, selectedTrendData, onBackClick }) {
  const [fromDate, setFromDate] = useState(dayjs().subtract(29, 'day').format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  const { elderlyDetails } = useContext(CustomContext);
  const [chartData, setChartData] = useState({
    categories: [],
    values: [],
  });
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleDatePicker = (dateString) => {
    setFromDate(dateString[0]);
    setToDate(dateString[1]);
  };

  // Function to map trend to its source and field
  const getSelectedSourceAndField = (trendName) => {
    switch (trendName) {
      case 'Device Offline':
        return {
          source: 'alarms_data',
          field: 'device_offline',
          type: 'number',
          unit: ' x',
        };
      case 'Heart Rate High':
        return {
          source: 'sleep_data',
          field: 'heart_rate_high',
          type: 'number',
          unit: ' x',
        };
      case 'Heart Rate Low':
        return {
          source: 'sleep_data',
          field: 'heart_rate_low',
          type: 'number',
          unit: ' x',
        };
      case 'Respiratory Rate High':
        return {
          source: 'sleep_data',
          field: 'respiratory_rate_high',
          type: 'number',
          unit: ' /bpm',
        };
      case 'Respiratory Rate Low':
        return {
          source: 'sleep_data',
          field: 'respiratory_rate_low',
          type: 'number',
          unit: ' /bpm',
        };
      case 'Sleep Apnea':
        return {
          source: 'alarms_data',
          field: 'sleep_apnea',
          type: 'number',
          unit: '',
        };
      case 'Bad Sleep Duration':
        return {
          source: 'alarms_data',
          field: 'sleep_apnea',
          type: 'number',
          unit: '',
        };
      case 'Bed Exit Times':
        return {
          source: 'sleep_data',
          field: 'bed_exit_time',
          type: 'time',
          unit: '',
        };
      case 'Fall Alerts':
        return {
          source: 'alarms_data',
          field: 'fall_alerts',
          type: 'number',
          unit: '',
        };
      case 'Indoor Duration':
        return {
          source: 'sleep_data',
          field: 'indoor_duration',
          type: 'duration',
          unit: '',
        };
      case 'Walking Steps':
        return {
          source: 'sleep_data',
          field: 'walking_steps',
          type: 'number',
          unit: '',
        };
      case 'Walking Speed':
        return {
          source: 'sleep_data',
          field: 'walking_speed',
          type: 'number',
          unit: ' m/min',
        };
      case 'Walking Time':
        return {
          source: 'sleep_data',
          field: 'walking_time',
          type: 'duration',
          unit: '',
        };
      case 'Still Time':
        return {
          source: 'sleep_data',
          field: 'static_duration',
          type: 'duration',
          unit: '',
        };
      case 'AHI Index':
        return {
          source: 'sleep_data',
          field: 'ahi_index',
          type: 'number',
          unit: '',
        };
      case 'Abnormal Heart Rate':
        return {
          source: 'alarms_data',
          field: 'abnormal_heart_rate',
          type: 'number',
          unit: ' BPM',
        };
      case 'Changes in No. of Persons':
        return {
          source: 'alarms_data',
          field: 'person_changes',
          type: 'number',
          unit: '',
        };
      case 'Weak Vital Signals':
        return {
          source: 'alarms_data',
          field: 'weak_vital_signals',
          type: 'number',
          unit: '',
        };
      case 'In/Out of Room':
        return {
          source: 'sleep_data',
          field: 'entry_exits',
          type: 'number',
          unit: '',
        };
      case 'Bathroom Visits':
        return {
          source: 'alarms_data',
          field: 'bathroom_visits',
          type: 'number',
          unit: '',
        };
      default:
        return { source: null, field: null, type: null, unit: null };
    }
  };

  const formatValueBasedOnType = (value, dataType, unit) => {
    if (dataType === 'duration') {
      return formatDuration(value);
    } else if (dataType === 'time') {
      const { suffix, time } = extractTimeAndSuffix(value);
      return suffix ? ` ${suffix} ${formatTo12HourTime(time)}` : formatTo12HourTime(time);
    } else if (dataType === 'number') {
      return value + unit;
    } else {
      return value; // Default case for unrecognized data types
    }
  };

  const getTrendsReports = useCallback(() => {
    setIsLoading(true);
    setTableData([]);
    setChartData([]);
    getTrendsReport({
      elderly_id: elderlyDetails?._id,
      uids: elderlyDetails?.deviceId,
      // uids: "25A859B81A6G",
      to_date: fromDate || dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
      from_date: toDate || dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    })
      .then((res) => {
        if (res?.status) {
          const { source, field, type, unit } = getSelectedSourceAndField(selectedTrendData?.name);

          if (!source || !field || !res[source]) {
            setChartData({});
            return;
          }
          if (source === 'alarms_data') {
            const categories = res[source].map(
              (item) => new Date(item.date).toISOString().split('T')[0]
            );
            const values = res[source].map((item) => item[field] || 0);
            setChartData({ categories, values, type, unit });

            const tableDataFormatted = categories.map((date, index) => ({
              key: index,
              date,
              value: formatValueBasedOnType(values[index], type, unit),
            }));
            setTableData(tableDataFormatted);
          } else {
            const categories = res[source].map(
              (item) => new Date(item.date).toISOString().split('T')[0]
            );
            const values = res[source].map((item) => item[field] || 0);
            setChartData({ categories, values, type, unit });

            const tableDataFormatted = categories.map((date, index) => ({
              key: index,
              date,
              value: formatValueBasedOnType(values[index], type, unit),
            }));
            setTableData(tableDataFormatted);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching trends report:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toDate, selectedTrendData]);

  useEffect(() => {
    getTrendsReports();
  }, [getTrendsReports]);
  return (
    <>
      <div id='trendSummary' className='w-full h-full flex flex-col gap-6'>
        <div id='header' className='flex justify-between items-center'>
          <div
            id='trendTitleAndIcon'
            className='flex gap-2 items-center cursor-pointer hover:opacity-70 w-fit '
            onClick={() => {
              onBackClick();
            }}
          >
            <div
              id='icon'
              className='w-[28px] h-[28px] border-2 border-slate-700 rounded-full flex items-center justify-center'
            >
              <MdKeyboardArrowLeft color='#707070' size={24} />
            </div>
            <h1 className='text-[18px] font-bold'>{selectedTrendData?.name}</h1>
          </div>
          <RangePicker
            showTime={false}
            style={{ width: '250px', borderRadius: '10px' }}
            size='large'
            placeholder={['Pick Data Range (Start)', 'End']}
            format='YYYY-MM-DD'
            onChange={(value, dateString) => {
              handleDatePicker(dateString);
            }}
          />
        </div>
        <div id='graph' className='w-full h-fit'>
          <Spin spinning={isLoading}>
            <DynamicBarChart
              title={selectedTrendData?.name}
              fromDate={fromDate}
              toDate={toDate}
              values={chartData?.values}
              dataType={chartData?.type}
              unit={chartData?.unit}
            />
          </Spin>
        </div>
        <div id='data' className='w-full h-full bg-white rounded-2xl p-4 flex flex-col gap-4'>
          <h1 className='text-[22px] font-bold'>Data</h1>
          <Table dataSource={tableData} columns={columns} />
        </div>
      </div>
    </>
  );
}
const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
  },
  {
    title: 'Value',
    dataIndex: 'value',
  },
];
