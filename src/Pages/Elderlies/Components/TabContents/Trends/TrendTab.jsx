import React, { useState, useEffect, useContext } from 'react';
import { Spin, Splitter } from 'antd';
import TrendCard from './Components/TrendCard';
import { Segmented, ConfigProvider } from 'antd';
import TrendSummary from './Components/TrendSummary';
import {
  MdSignalWifiOff,
  MdMonitorHeart,
  MdWarningAmber,
  MdBedtime,
  MdAccessTime,
  MdOutlineBathroom,
  MdOutlineDoorSliding,
} from 'react-icons/md';
import { FaWalking, FaHeartbeat, FaLungs } from 'react-icons/fa';
import { AiOutlineClockCircle, AiFillAlert } from 'react-icons/ai';
import { getTrendsReport } from '@/api/elderlySupport';
import { CustomContext } from '@/Context/UseCustomContext';
import { formatDuration, extractTimeAndSuffix, getAlarmCount } from '@/utils/helper';
import { SidebarContext } from '@/Context/CustomContext';

import dayjs from 'dayjs';
export default function TrendTab() {
  const [activeTrend, setActiveTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const { elderlyDetails } = useContext(CustomContext);

  const [trendData, setTrendData] = useState([]);
  const { dailyRepDate } = useContext(SidebarContext);

  // Simulate fetching data from an API
  useEffect(() => {
    setLoading(true);
    getTrendsReport({
      elderly_id: elderlyDetails?._id,
      uids: elderlyDetails?.deviceId,
      to_date: dailyRepDate || dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    })
      .then((res) => {
        setLoading(false);

        // setTrendData([
        //   {
        //     trendId: 1,
        //     name: "Device Offline",
        //     value: res?.alarms_data[0]?.device_offline || 0,
        //     priority: 0,
        //     icon: MdSignalWifiOff,
        //   },
        //   {
        //     trendId: 2,
        //     name: "Respiratory Rate High",
        //     value: `${res?.sleep_data[0]?.respiratory_rate_high || 0} BPM`,
        //     priority: 0,
        //     icon: FaHeartbeat,
        //   },
        //   {
        //     trendId: 3,
        //     name: "Respiratory Rate Low",
        //     value: `${res?.sleep_data[0]?.respiratory_rate_low || 0} BPM`,
        //     priority: 0,
        //     icon: FaLungs,
        //   },
        //   {
        //     trendId: 4,
        //     name: "Heart Rate High",
        //     value: `${res?.sleep_data[0]?.heart_rate_high || 0} BPM`,
        //     priority: 0,
        //     icon: MdMonitorHeart,
        //   },
        //   {
        //     trendId: 5,
        //     name: "Heart Rate Low",
        //     value: `${res?.sleep_data[0]?.heart_rate_low || 0} BPM`,
        //     priority: 0,
        //     icon: AiFillAlert,
        //   },
        //   {
        //     trendId: 6,
        //     name: "Sleep Apnea",
        //     value: 0,
        //     priority: 0,
        //     icon: MdBedtime,
        //   },
        //   {
        //     trendId: 7,
        //     name: "Bad Sleep Duration",
        //     value: 0,
        //     priority: 0,
        //     icon: AiOutlineClockCircle,
        //   },
        //   {
        //     trendId: 8,
        //     name: "Bed Exit Times",
        //     value: `${
        //       extractTimeAndSuffix(res?.sleep_data[0]?.bed_exit_time)?.suffix
        //     } ${
        //       extractTimeAndSuffix(res?.sleep_data[0]?.bed_exit_time)?.time || 0
        //     }`,
        //     priority: 0,
        //     icon: MdWarningAmber,
        //   },
        //   {
        //     trendId: 9,
        //     name: "Fall Alerts",
        //     value: 0,
        //     priority: 0,
        //     icon: MdWarningAmber,
        //   },
        //   {
        //     trendId: 10,
        //     name: "Indoor Duration",
        //     value: `${
        //       formatDuration(res?.sleep_data[0]?.indoor_duration) || 0
        //     }`,
        //     priority: 0,
        //     icon: MdAccessTime,
        //   },
        //   {
        //     trendId: 11,
        //     name: "Walking Steps",
        //     value: `${res?.sleep_data[0]?.walking_steps || 0}`,
        //     priority: 0,
        //     icon: FaWalking,
        //   },
        //   {
        //     trendId: 12,
        //     name: "Walking Speed",
        //     value: `${res?.sleep_data[0]?.walking_speed || 0}`,
        //     priority: 0,
        //     icon: FaWalking,
        //   },
        //   {
        //     trendId: 13,
        //     name: "Walking Time",
        //     value: `${formatDuration(res?.sleep_data[0]?.walking_time) || 0}`,
        //     priority: 0,
        //     icon: AiOutlineClockCircle,
        //   },
        //   {
        //     trendId: 14,
        //     name: "Still Time",
        //     value: `${
        //       formatDuration(res?.sleep_data[0]?.static_duration) || 0
        //     }`,
        //     priority: 0,
        //     icon: MdAccessTime,
        //   },
        //   {
        //     trendId: 15,
        //     name: "AHI Index",
        //     value: `${res?.sleep_data[0]?.ahi_index || 0}`,
        //     priority: 0,
        //     icon: MdMonitorHeart,
        //   },
        //   {
        //     trendId: 16,
        //     name: "Abnormal Heart Rate",
        //     value: 0,
        //     priority: 0,
        //     icon: AiFillAlert,
        //   },
        //   {
        //     trendId: 17,
        //     name: "Changes in No. of Persons",
        //     value: 0,
        //     priority: 0,
        //     icon: MdMonitorHeart,
        //   },
        //   {
        //     trendId: 18,
        //     name: "Weak Vital Signals",
        //     value: 0,
        //     priority: 0,
        //     icon: MdWarningAmber,
        //   },
        //   {
        //     trendId: 19,
        //     name: "In/Out of Room",
        //     value: `${res?.sleep_data[0]?.entry_exits || 0}`,
        //     priority: 0,
        //     icon: MdOutlineDoorSliding,
        //   },
        //   {
        //     trendId: 20,
        //     name: "Bathroom Visits",
        //     value: 0,
        //     priority: 0,
        //     icon: MdOutlineBathroom,
        //   },
        // ]);
        setTrendData([
          {
            trendId: 1,
            name: 'Device Offline',
            value:
              getAlarmCount(res?.alarms_data, {
                is_online: '1',
                event: '5',
              }) || 0,
            priority: 0,
            icon: MdSignalWifiOff,
          },
          {
            trendId: 2,
            name: 'Elevated Breathing Activity',
            value:
              getAlarmCount(res?.alarms_data, {
                alarm_type: '11',
                event: '3',
              }) || 0,
            priority: 0,
            icon: FaHeartbeat,
          },
          {
            trendId: 3,
            name: 'Lower Breathing Activity',
            value:
              getAlarmCount(res?.alarms_data, {
                alarm_type: '12',
                event: '3',
              }) || 0,
            priority: 0,
            icon: FaLungs,
          },
          {
            trendId: 4,
            name: 'Elevated Heart Activity',
            value:
              getAlarmCount(res?.alarms_data, {
                alarm_type: '14',
                event: '3',
              }) || 0,
            priority: 0,
            icon: MdMonitorHeart,
          },
          {
            trendId: 5,
            name: 'Lower Heart Activity',
            value:
              getAlarmCount(res?.alarms_data, {
                alarm_type: '15',
                event: '3',
              }) || 0,
            priority: 0,
            icon: AiFillAlert,
          },
          {
            trendId: 6,
            name: 'Sleep Disturbances',
            value:
              getAlarmCount(res?.alarms_data, {
                alarm_type: '13',
                event: '3',
              }) || 0,
            priority: 0,
            icon: MdBedtime,
          },
          // {
          //   trendId: 7,
          //   name: "Bad Sleep Duration",
          //   value: 0,
          //   priority: 0,
          //   icon: AiOutlineClockCircle,
          // },
          {
            trendId: 8,
            name: 'Bed Exit Times',
            value: `${extractTimeAndSuffix(res?.sleep_data[0]?.bed_exit_time)?.suffix} ${
              extractTimeAndSuffix(res?.sleep_data[0]?.bed_exit_time)?.time || 0
            }`,
            priority: 0,
            icon: MdWarningAmber,
          },
          {
            trendId: 9,
            name: 'Fall Alerts',
            value: getAlarmCount(res?.alarms_data, {
              event: '2',
            }),
            priority: 0,
            icon: MdWarningAmber,
          },
          {
            trendId: 10,
            name: 'Indoor Duration',
            value: `${formatDuration(res?.sleep_data[0]?.indoor_duration) || 0}`,
            priority: 0,
            icon: MdAccessTime,
          },
          {
            trendId: 11,
            name: 'Walking Steps',
            value: `${res?.sleep_data[0]?.walking_steps || 0}`,
            priority: 0,
            icon: FaWalking,
          },
          {
            trendId: 12,
            name: 'Walking Speed',
            value: `${res?.sleep_data[0]?.walking_speed || 0}`,
            priority: 0,
            icon: FaWalking,
          },
          {
            trendId: 13,
            name: 'Walking Time',
            value: `${formatDuration(res?.sleep_data[0]?.walking_time) || 0}`,
            priority: 0,
            icon: AiOutlineClockCircle,
          },
          {
            trendId: 14,
            name: 'Still Time',
            value: `${formatDuration(res?.sleep_data[0]?.static_duration) || 0}`,
            priority: 0,
            icon: MdAccessTime,
          },
          {
            trendId: 15,
            name: 'Sleep Consistency Indicator',
            value: `${res?.sleep_data[0]?.ahi_index || 0}`,
            priority: 0,
            icon: MdMonitorHeart,
          },
          // {
          //   trendId: 16,
          //   name: "Irregular Activity Pattern",
          //   value: 0,
          //   priority: 0,
          //   icon: AiFillAlert,
          // },
          {
            trendId: 17,
            name: 'Changes in No. of Persons',
            value:
              getAlarmCount(res?.alarms_data, {
                event: '1',
              }) || 0,
            priority: 0,
            icon: MdMonitorHeart,
          },
          {
            trendId: 18,
            name: 'Low Sensor Detection',
            value:
              getAlarmCount(res?.alarms_data, {
                recovery: '0',
                event: '7',
              }) || 0,
            priority: 0,
            icon: MdWarningAmber,
          },
          {
            trendId: 19,
            name: 'In/Out of Room',
            value:
              getAlarmCount(res?.alarms_data, {
                entry_2_exit: '1',
                event: '4',
              }) +
                getAlarmCount(res?.alarms_data, {
                  entry_2_exit: '0',
                  event: '4',
                }) || 0,
            priority: 0,
            icon: MdOutlineDoorSliding,
          },
          // {
          //   trendId: 20,
          //   name: "Bathroom Visits",
          //   value: 0,
          //   priority: 0,
          //   icon: MdOutlineBathroom,
          // },
        ]);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [elderlyDetails, dailyRepDate]);
  const handleTrendClick = (trendId) => {
    setActiveTrend((prevTrend) => (prevTrend === trendId ? null : trendId));
  };

  return (
    <Spin spinning={loading} tip='Fetching Data...'>
      <div className={`flex rounded-lg mt-6 overflow-auto min-h-[400px]`}>
        <Splitter className='h-full'>
          <Splitter.Panel
            size={activeTrend ? undefined : '100%'} // Adjust size based on activeTrend
            min='20%'
            max='100%'
            className='h-fit'
          >
            {/* <ConfigProvider
            theme={{
              components: {
                Segmented: {
                  trackBg: "#e5e8ed",
                },
              },
            }}
          >
            <div className="px-4 pl-0">
              <Segmented
                style={{ width: "100%", marginBottom: "10px" }}
                className={`${activeTrend ? "" : "max-w-[300px]"}`}
                block
                options={["All", "Critical", "Warning"]}
                onChange={(value) => console.log(value)}
                size="large"
              />
            </div>
          </ConfigProvider> */}
            <div
              id='trends'
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              }}
              className={`grid gap-4 h-full overflow-auto p-4 pt-0 pl-0 w-full ${
                activeTrend ? '!h-[70vh] ' : 'h-[max-content]'
              }`}
            >
              {trendData.map((trend) => (
                <TrendCard
                  key={trend.trendId}
                  trendId={trend.trendId}
                  name={trend.name}
                  value={trend.value}
                  priority={trend.priority}
                  icon={trend.icon}
                  style={{
                    border:
                      activeTrend === trend.trendId
                        ? '2px solid rgb(139 144 170)'
                        : '2px solid transparent',
                  }}
                  onClick={() => handleTrendClick(trend.trendId)}
                />
              ))}
            </div>
          </Splitter.Panel>
          {activeTrend && (
            <Splitter.Panel defaultSize='60%' min='52%' max='75%'>
              <div id='trendGraph' className='p-4'>
                <TrendSummary
                  onBackClick={() => setActiveTrend(null)}
                  trendId={activeTrend}
                  //for now we are using the trendData to get the trend summary(temporary)
                  selectedTrendData={trendData.find((trend) => trend.trendId === activeTrend)}
                />
              </div>
            </Splitter.Panel>
          )}
        </Splitter>
      </div>
    </Spin>
  );
}
