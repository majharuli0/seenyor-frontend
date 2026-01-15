import { Badge, Drawer, Button, Spin, Segmented, Empty, Checkbox } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import CriticalAlertCard from '../CriticalAlertCard';
import dayjs from 'dayjs';
import { getAlertList } from '@/api/elderlySupport';
import { readAlarm } from '@/api/elderly';
import { SidebarContext } from '@/Context/CustomContext';
import { getEventFilter } from '@/utils/helper';
import AlertCloseModal from '../ActiveAlerts/AlertCloseModal';

export default function ActiveAlertsView({ setOpen, open, notificationEvent }) {
  const [alertHistory, setAlertHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterQuarty, setFilterQuary] = useState(null);
  const { resolvedAlarm, setResolvedAlarm } = useContext(SidebarContext);

  // for modal + selection
  const [openBulkResolveModal, setOpenBulkResolveModal] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState([]); // string IDs only
  const [selectionMode, setSelectionMode] = useState(false); // toggles checkbox mode

  const toggleSelectAlert = (id) => {
    setSelectedAlerts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleSelectAll = () => {
    if (selectedAlerts.length === alertHistory.length) {
      // all selected → deselect all
      setSelectedAlerts([]);
    } else {
      // not all selected → select all
      setSelectedAlerts(alertHistory.map((a) => a._id));
    }
  };

  function onClose() {
    setOpen(false);
  }

  const getAlartsHistory = useCallback(
    (append = false) => {
      setLoading(true);
      getAlertList({
        to_date: '2025-01-01',
        from_date: dayjs().format('YYYY-MM-DD'),
        is_resolved: false,
        page,
        limit: 20,
        event: '2,5',
        is_online: '1',
        lookup: false,
        ...filterQuarty,
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
    if (value === 'fall') {
      setFilterQuary(getEventFilter('fall_detected'));
    } else if (value === 'device_offline') {
      setFilterQuary(getEventFilter('device_disconnected'));
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
        <h1 className='text-[26px] font-semibold'>
          Active Alerts <small className='text-slate-500'>({total})</small>
        </h1>
        <div className='flex gap-2 items-center'>
          <Segmented options={alertHistorySegmentOptions} onChange={onAlertHistorySegmantChnage} />
        </div>
      </div>
      <div className='flex w-full justify-between items-center mt-3'>
        {/* Toggle selection mode */}

        {alertHistory.length > 0 && !selectionMode && (
          <>
            <div></div>
            <Button
              type='default'
              onClick={() => {
                setSelectionMode(true);
                setSelectedAlerts([]);
              }}
            >
              Select Alerts
            </Button>
          </>
        )}

        {/* Show resolve button when in selection mode */}
        {selectionMode && (
          <>
            <div className='flex gap-2 items-center'>
              <Button
                type='primary'
                disabled={selectedAlerts.length === 0}
                onClick={() => setOpenBulkResolveModal(true)}
              >
                Resolve Selected ({selectedAlerts.length})
              </Button>
              <Button onClick={toggleSelectAll}>
                {selectedAlerts.length === alertHistory.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <Button
              onClick={() => {
                setSelectionMode(false);
                setSelectedAlerts([]);
              }}
              color='danger'
              variant='outlined'
            >
              Cancel
            </Button>
          </>
        )}
      </div>

      <Spin spinning={loading} className='h-full min-h-[400px]'>
        <div className='flex flex-col gap-3 mt-3'>
          {alertHistory.length > 0
            ? alertHistory.map((item, i) => (
                <div key={i} className='relative flex items-start gap-2'>
                  {selectionMode && (
                    <Checkbox
                      checked={selectedAlerts.includes(item._id)}
                      onChange={() => toggleSelectAlert(item._id)}
                      className='mt-1'
                      size='large'
                    />
                  )}
                  <CriticalAlertCard
                    item={item}
                    onResolved={() => {
                      setPage(1);
                      getAlartsHistory();
                      setSelectedAlerts([]);
                    }}
                    setOpen={setOpen}
                  />
                </div>
              ))
            : !loading && (
                <div className='w-full mt-20'>
                  <Empty description='No Alarms Found' />
                </div>
              )}
        </div>
      </Spin>

      {/* Load more button */}
      <div className='flex justify-center mt-4'>
        {!loading && alertHistory.length < total && (
          <Button type='primary' className='bg-primary' onClick={loadMore}>
            Load More
          </Button>
        )}
      </div>

      <AlertCloseModal
        openAlertCloseModal={openBulkResolveModal}
        setOpenAlertCloseModal={setOpenBulkResolveModal}
        selectedAlert={selectedAlerts} // array of string IDs only
        getAlertListDatas={() => {
          setPage(1);
          getAlartsHistory();
          setSelectedAlerts([]);
          setSelectionMode(false);
        }}
      />
    </Drawer>
  );
}

export const alertHistorySegmentOptions = [
  { label: 'All', value: 'All' },
  { label: 'Fall', value: 'fall' },
  { label: 'Device Offline', value: 'device_offline' },
];
