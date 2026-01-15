import { useCallback, useEffect, useState } from 'react';
import TableUI from '../common/table';
import { useTable } from '@/MonitoringService/Context/TableContext';
import { useColumns } from '@/MonitoringService/Utiles/columnsUtil';
import { useAlertLogs, useAlerts } from '@/MonitoringService/hooks/useAlert';
import dayjs from 'dayjs';
import Modal from '../common/modal';
import { FallPlayBack } from '../FallPlayBack';
import { tr } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { formatSmartDate, getLogDisplayInfo } from '@/utils/helper';
import { FaRegStickyNote } from 'react-icons/fa';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';
import { GrEmptyCircle } from 'react-icons/gr';

export function AlarmLogsTable({
  date_range = { from: null, to: null },
  userData = {},
  isAsc = null,
}) {
  const [visible, setVisible] = useState(false);
  const [visibleNote, setVisibleNote] = useState(false);
  const [data, setData] = useState({});
  const [type, setType] = useState('');
  console.log(isAsc);

  const { page = { page: 1, limit: 10 }, setPage, actions, setActions } = useTable();

  const [debouncedDateRange, setDebouncedDateRange] = useState(date_range);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDateRange((prev) => {
        const same = prev.from === date_range.from && prev.to === date_range.to;
        return same ? prev : date_range;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [date_range]);

  const { data: alertsData, isLoading } = useAlerts(
    {
      event: '2,5',
      is_online: '1',
      is_resolved: true,
      elderly_id: userData?._id,
      sort_by_event: isAsc && isAsc ? -1 : 1,
      to_date: debouncedDateRange.from ? dayjs(debouncedDateRange.from).format('YYYY-MM-DD') : null,
      from_date: debouncedDateRange.to ? dayjs(debouncedDateRange.to).format('YYYY-MM-DD') : null,
      ...page,
    },
    {
      enabled: userData?._id ? true : false,
    }
  );
  const columns = useColumns('prev_alerts');

  useEffect(() => {
    setPage((prev) => ({ ...prev, page: 1 }));
  }, [debouncedDateRange]);

  const showFallPlayBack = useCallback((data) => {
    setData(data);

    setType('playback');
    setVisible(true);
  }, []);
  const showAlarmNote = useCallback((data) => {
    setData(data);
    setType('note');
    console.log(data);

    setVisible(true);
  }, []);
  const showAlarmLog = useCallback((data) => {
    setData(data);
    setType('log');
    setVisible(true);
  }, []);

  useEffect(() => {
    setActions({
      showFallPlayBack,
      showAlarmNote,
      showAlarmLog,
    });
  }, [setActions, showFallPlayBack]);

  return (
    <div className='bg-background/50'>
      <TableUI
        columns={columns}
        data={alertsData?.pages[0]?.data || []}
        isPagination
        isLoading={isLoading}
        total={alertsData?.pages[0]?.total || 0}
        limit={10}
        headerClassName='bg-text/10 border-none'
        headerTextClassName='text-text/60'
        rowClassName=''
        cellClassName='!text-text !py-3'
      />

      <Modal
        title={(type == 'note' && 'Alarm Note') || (type == 'log' && 'Alarm Logs')}
        isVisible={visible}
        setIsVisible={setVisible}
        cancelText='Close Playback'
        onCancel={() => console.log('Cancelled')}
        className={type === 'note' || type === 'log' ? '' : 'sm:max-w-none w-fit p-0 pb-4 bg-card'}
        showFooter={type === 'note' || type === 'log' ? false : true}
        showCloseButton={type === 'note' || type === 'log' ? true : false}
        footerButtons='cancel'
        footerAlign='center'
      >
        {type === 'playback' && (
          <div className='min-w-[600px] sm:max-w-[600px] w-full'>
            <FallPlayBack selectedAlert={data} type={2} />
          </div>
        )}
        {type === 'note' && <p>{data?.comment || 'No notes available for this alarm.'}</p>}
        {type === 'log' && <ActionLogsCard id={data?._id} />}
        {/* <p>This action cannot be undone.</p> */}
      </Modal>
    </div>
  );
}
const ActionLogsCard = ({ id }) => {
  const { data: logsData, isLoading } = useAlertLogs({ id: id });
  const logs = logsData?.data?.action_logs || [];
  const reversedLogs = [...logs].reverse();

  return (
    <div className=''>
      {/* Header */}
      <div className='px-0 py-2 border-b border-border flex justify-between'>
        <h2 className='text-xs uppercase text-text/70 font-semibold'>Action Logs</h2>
        <h2 className='text-xs uppercase text-text/70 font-semibold'>Agent</h2>
      </div>

      <div className='p-3 px-0'>
        <div className='h-[300px] overflow-y-auto scrollbar-thin'>
          {/* Loading state */}
          {isLoading ? (
            <div className='space-y-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='flex items-center justify-between gap-3 p-2 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-4 w-20 rounded' />
                    <Skeleton className='h-4 w-24 rounded' />
                  </div>
                  <Skeleton className='h-4 w-16 rounded' />
                </div>
              ))}
            </div>
          ) : reversedLogs.length > 0 ? (
            <div className='space-y-1'>
              {reversedLogs.map((log, idx) => (
                <div
                  key={idx}
                  className='flex hover:bg-text/5 items-center justify-between gap-3 p-2 px-0 rounded-lg hover:bg-muted/50'
                >
                  <div>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary' className='text-text bg-text/10'>
                        {formatSmartDate(log.created_at)}
                      </Badge>
                      {getLogDisplayInfo(log).icon}
                      <p className='text-sm capitalize truncate'>
                        {' '}
                        {getLogDisplayInfo(log).title}{' '}
                        {log?.contact_name && (
                          <Badge variant='secondary' className='text-text bg-text/10'>
                            {log?.contact_name}
                          </Badge>
                        )}
                      </p>
                    </div>
                    {log?.action_note && (
                      <Badge
                        variant='outline'
                        className='text-xs font-thin opacity-85 border-border ml-20 mt-2 relative'
                      >
                        <FaRegStickyNote />
                        {log?.action_note}
                      </Badge>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>{log.action_by}</p>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className='flex items-center justify-center h-full'>
              <Empty className='w-full text-center'>
                <EmptyHeader className='pt-8'>
                  <EmptyMedia variant='icon'>
                    <GrEmptyCircle className='w-16 h-16 text-muted-foreground' />
                  </EmptyMedia>
                  <EmptyTitle>No Logs</EmptyTitle>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
