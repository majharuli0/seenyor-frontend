import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { Segmented, Badge, Space, Spin, Empty, Collapse, Tag } from 'antd';
import RoomAndDetails from './roomAndDetails';
import { getAlertList } from '@/api/elderlySupport';
import { getAlertInfoViaEvent, getAlertInfoViaEventDetails, getAlertsGroup } from '@/utils/helper';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import { SidebarContext } from '@/Context/CustomContext';
import { useNotification } from '@/Context/useNotification';

const { Panel } = Collapse;

export default function RoomView() {
  const { setModalDataList, modalDataList } = useContext(SidebarContext);
  const { notificationEvent } = useNotification();

  const [alertType, setAlertType] = useState('All');
  const [alertList, setAlertList] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertTypeQuery, setAlertTypeQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);

  // Fetch alerts from the API
  const getAlertListData = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    getAlertList({
      to_date: '2024-11-30',
      from_date: dayjs().format('YYYY-MM-DD'),
      is_resolved: false,
      limit: 20,
      show_device_area: 1,
      show_device_boundaries: 1,
      page,
      ...alertTypeQuery,
    })
      .then((res) => {
        setAlertList((prev) => [...prev, ...res.data]);
        if (page >= res.totalPages) {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [alertTypeQuery, page, hasMore, loading]);

  useEffect(() => {
    getAlertListData();
  }, [page, alertTypeQuery]);

  // Set the first alert as selected by default
  useEffect(() => {
    if (alertList.length > 0 && !activeItem) {
      const firstAlert = alertList[0];
      setActiveItem(firstAlert._id);
      setSelectedAlert(firstAlert);
    }
  }, [alertList, activeItem]);

  // Handle alert selection
  const onChange = (key) => {
    setActiveItem(key);
    const selected = alertList.find((alert) => alert._id === key);
    setSelectedAlert(selected);
  };

  // Handle scroll for pagination
  const handleScroll = useCallback(
    debounce(() => {
      if (!listRef.current || loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 200),
    [loading, hasMore]
  );

  // Handle segment filter change
  const onSegmentChange = (value) => {
    setAlertTypeQuery(getAlertsGroup(value));
    setPage(1);
    setAlertList([]);
    setHasMore(true);
  };
  useEffect(() => {
    if (notificationEvent) {
      getAlertListData();
    }
  }, [getAlertListData, notificationEvent]);
  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Group alerts by room_name using useMemo for performance
  const groupedAlerts = useMemo(() => {
    return alertList.reduce((acc, alert) => {
      const roomName = alert.room_name;
      if (roomName === '__proto__' || roomName === 'constructor' || roomName === 'prototype') {
        return acc;
      }
      if (!Object.prototype.hasOwnProperty.call(acc, roomName)) {
        acc[roomName] = [];
      }
      acc[roomName].push(alert);
      return acc;
    }, {});
  }, [alertList]);

  // Function to map alert type labels to colors
  const getColorForLabel = (label) => {
    switch (label) {
      case 'Critical':
        return 'red';
      case 'Warning':
        return 'orange';
      case 'Info':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <div className='w-full flex justify-center items-center h-[495px] overflow-hidden'>
      <div className='w-[40%] flex flex-col gap-4 h-full'>
        <Segmented
          style={{ width: '100%' }}
          block
          options={segmentsForAlertView}
          onChange={(value) => onSegmentChange(value)}
        />
        <div ref={listRef} className='w-full overflow-auto' style={{ height: '440px' }}>
          {alertList.length === 0 && !loading && <Empty description='No active alerts available' />}
          {alertList.length > 0 && (
            <Collapse>
              {Object.entries(groupedAlerts).map(([roomName, alerts]) => {
                // Get unique alert types for this room
                const uniqueTypes = [
                  ...new Set(alerts.map((alert) => getAlertInfoViaEvent(alert)?.label)),
                ];
                return (
                  <Panel
                    key={roomName}
                    header={
                      <div className='flex justify-between items-center'>
                        <span className='text-black font-semibold'>{roomName}</span>
                        {/* <Space>
                          {uniqueTypes.map((type) => (
                            <Badge key={type} color={getColorForLabel(type)} />
                          ))}
                        </Space> */}
                      </div>
                    }
                  >
                    {alerts &&
                      alerts.map((alert) => (
                        <div
                          key={alert._id}
                          onClick={() => onChange(alert._id)}
                          className={`flex justify-between items-center p-2 cursor-pointer rounded-md pr-1 ${
                            activeItem === alert._id ? 'bg-gray-100' : ''
                          }`}
                        >
                          <span className='text-[14px] font-semibold'>
                            {getAlertInfoViaEventDetails(alert)?.title}
                            {/* {dayjs(alert.created_at).format("hh:mm:ss a")} */}
                          </span>
                          <Tag> {dayjs(alert.created_at).format('hh:mm:ss a')}</Tag>
                        </div>
                      ))}
                  </Panel>
                );
              })}
            </Collapse>
          )}
          {loading && (
            <div className='w-full flex justify-center py-4'>
              <Spin />
            </div>
          )}
          {!hasMore && alertList.length > 0 && (
            <div className='w-full text-center py-4 text-gray-500'>No more alerts to load</div>
          )}
        </div>
      </div>
      <div className='w-[60%] h-full'>
        {selectedAlert ? (
          <RoomAndDetails data={selectedAlert} />
        ) : (
          <Empty description='Select an alert to view details' />
        )}
      </div>
    </div>
  );
}

export const segmentsForAlertView = [
  { label: 'All', value: 'All' },
  { label: 'Critical', value: 'Critical' },
  { label: 'Warning', value: 'Warning' },
  { label: 'Info', value: 'Info' },
];
