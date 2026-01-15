import { getaAlarmsLogsDetails } from '@/api/elderly';
import { formatCreatedAt, getAlertInfoViaEventDetails } from '@/utils/helper';
import { Modal, Steps, Button, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

export default function LogsViweModal({ isvisible, setVisible, id, firstAlarm }) {
  const onClose = () => {
    setVisible(false);
    setLogs([]);
    setPage(1);
    setHasMore(false);
    setLoading(false);
  };

  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const getLogsDetails = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const res = await getaAlarmsLogsDetails(id, {
          page: pageNum,
          limit: 50,
        });
        const newLogs = res?.data[0]?.logs_before_resovle || [];

        if (isLoadMore) {
          setLogs((prevLogs) => [...prevLogs, ...newLogs]);
        } else {
          setLogs(newLogs);
        }

        // If we get exactly the limit, assume there might be more data
        setHasMore(newLogs.length === 50);

        if (!isLoadMore) {
          setPage(1);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [id]
  );

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getLogsDetails(nextPage, true);
  };

  useEffect(() => {
    if (id && isvisible) {
      getLogsDetails(1, false);
    }
  }, [id, isvisible, getLogsDetails]);

  // Create the steps items with first alarm, logs, and resolved entry
  const stepItems = [
    // First alarm entry
    ...(firstAlarm
      ? [
          {
            title: (
              <span className='text-[16px] font-medium text-primary/70'>
                {formatCreatedAt(firstAlarm.created_at)}
              </span>
            ),
            description: (
              <p className='text-[18px] font-medium text-primary'>
                {getAlertInfoViaEventDetails(firstAlarm)?.title || 'Alarm Triggered'}
              </p>
            ),
            key: 'first-alarm',
          },
        ]
      : []),

    // Log entries
    ...logs.map((log, index) => ({
      title: (
        <span className='text-[16px] font-medium text-primary/70'>
          {formatCreatedAt(log.created_at)}
        </span>
      ),
      description: (
        <p className='text-[18px] font-medium text-primary'>
          {getAlertInfoViaEventDetails(log)?.title}
        </p>
      ),
      key: `log-${index}`,
    })),

    // Resolved entry (if firstAlarm has closed_at)
    ...(firstAlarm?.closed_at
      ? [
          {
            title: (
              <span className='text-[16px] font-medium text-primary/70'>
                {formatCreatedAt(firstAlarm.closed_at)}
              </span>
            ),
            description: <p className='text-[18px] font-medium text-primary'>Alarm Resolved</p>,
            key: 'resolved',
          },
        ]
      : []),
  ];

  return (
    <Modal
      open={isvisible}
      onCancel={onClose}
      footer={null}
      centered
      className='!w-[60vw] max-h-[90svh] bg-white !border-none overflow-x-hidden rounded-lg'
    >
      <div className='p-6'>
        <h1 className='text-[24px] font-semibold'>Alarm Logs</h1>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <Spin size='large' />
          </div>
        ) : (
          <>
            <Steps
              progressDot
              current={stepItems.length}
              direction='vertical'
              items={stepItems}
              className='max-h-[70vh] overflow-y-auto'
            />

            {loadingMore && (
              <div className='flex justify-center mt-4'>
                <Spin size='small' />
              </div>
            )}

            {hasMore && !loadingMore && (
              <div className='flex justify-center mt-4'>
                <Button type='primary' onClick={loadMore} className='load-more-btn'>
                  Load More
                </Button>
              </div>
            )}

            {logs.length === 0 && !firstAlarm && !loading && (
              <div className='text-center py-8 text-gray-500'>No logs found</div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
