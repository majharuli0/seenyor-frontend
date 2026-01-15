import { Badge, Drawer, Button, Spin, Segmented, Empty } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import CriticalAlertCard from '../CriticalAlertCard';
import dayjs from 'dayjs';
import { getAlertList } from '@/api/elderlySupport';
import { useNavigate } from 'react-router-dom';
import { readAlarm } from '@/api/elderly';
import { useNotification } from '@/Context/useNotification';
import { SidebarContext } from '@/Context/CustomContext';

export default function NotificationCenter({ setOpen, open, notificationEvent }) {
  const [alertHistory, setAlertHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterQuarty, setFilterQuary] = useState(null);
  const { resolvedAlarm, setResolvedAlarm } = useContext(SidebarContext);

  function onClose() {
    setOpen(false);
  }

  const getAlartsHistory = useCallback(
    (append = false) => {
      setLoading(true);
      getAlertList({
        to_date: '2025-01-01',
        from_date: dayjs().format('YYYY-MM-DD'),
        is_read: filterQuarty,
        page,
        limit: 20,
        event: '2,5', //6
        is_online: '1',
        lookup: false,
        // entry_2_exit: "1",
      })
        .then((res) => {
          setLoading(false);
          setTotal(res.total);
          if (append) {
            setAlertHistory((prev) => [...prev, ...res.data]);
          } else {
            setAlertHistory(res.data);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [page, notificationEvent, filterQuarty, resolvedAlarm]
  );

  useEffect(() => {
    getAlartsHistory(page > 1);
  }, [getAlartsHistory]);
  const loadMore = () => {
    // only load more if there’s more data
    if (alertHistory.length < total) {
      setPage((prev) => prev + 1);
    }
  };
  function readAlarms(id) {
    readAlarm(id)
      .then(() => {
        setAlertHistory((prev) =>
          prev.map((alert) => (alert._id === id ? { ...alert, is_read: true } : alert))
        );
      })
      .catch(console.log);
  }
  function onAlertHistorySegmantChnage(value) {
    if (value == 'unread') {
      setFilterQuary(false);
    } else if (value == 'read') {
      setFilterQuary(true);
    } else {
      setFilterQuary(null);
    }
    setPage(1);
  }

  return (
    <Drawer
      title={null}
      onClose={onClose}
      closeIcon={<MdKeyboardDoubleArrowRight size={24} />}
      size='large'
      open={open}
    >
      <div className='flex w-full justify-between items-center'>
        <h1 className='text-[26px] font-semibold'>Alarm Center</h1>
        <Segmented
          options={alertHistorySegmentOptions}
          onChange={(value) => onAlertHistorySegmantChnage(value)}
        />
      </div>
      <Spin spinning={loading} className='h-full min-h-[400px]'>
        <div className='flex flex-col gap-3 mt-3'>
          {alertHistory.length > 0
            ? alertHistory.map((item, i) => (
                <div
                  key={i}
                  className='relative bg-red-50 cursor-pointer'
                  style={{ background: !item?.is_read ? '#f7f7f8' : 'white' }}
                  onClick={() => readAlarms(item?._id)}
                >
                  {!item?.is_read && (
                    <span className='size-3 bg-red-500 rounded-full ml-2 absolute -right-1 -top-1 border-2 border-white' />
                  )}
                  <CriticalAlertCard
                    item={item}
                    onResolved={() => {
                      // refresh after resolve
                      setPage(1);
                      getAlartsHistory();
                    }}
                    setOpen={setOpen}
                  />
                </div>
              ))
            : !loading && (
                <div className='w-full mt-20'>
                  <Empty description='No Alarms Found'></Empty>
                </div>
              )}
        </div>
      </Spin>

      {/* Load more button */}
      <div className='flex justify-center mt-4'>
        {/* {loading && <Spin />} */}
        {!loading && alertHistory.length < total && (
          <Button type='primary' className='bg-primary' onClick={loadMore}>
            Load More
          </Button>
        )}
      </div>
    </Drawer>
  );
}
export const alertHistorySegmentOptions = [
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Unread',
    value: 'unread',
  },
  {
    label: 'Read',
    value: 'read',
  },
];
