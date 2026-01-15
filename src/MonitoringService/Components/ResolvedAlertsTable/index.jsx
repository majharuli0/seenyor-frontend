import { useCallback, useEffect, useState } from 'react';
import TableUI from '../common/table';
import { useTable } from '@/MonitoringService/Context/TableContext';
import { useColumns } from '@/MonitoringService/Utiles/columnsUtil';
import { useAlerts } from '@/MonitoringService/hooks/useAlert';
import dayjs from 'dayjs';
import Modal from '../common/modal';
import { FallPlayBack } from '../FallPlayBack';
import { tr } from 'date-fns/locale';
import { useParams } from 'react-router-dom';

export function ResolvedAlertsTable({ setTotalAlerts, date_range = {} }) {
  const [visible, setVisible] = useState(false);
  const [visibleNote, setVisibleNote] = useState(false);
  const [data, setData] = useState({});
  const [type, setType] = useState('');
  const { id } = useParams();

  const { page = { page: 1, limit: 10 }, setPage, actions, setActions } = useTable();

  const { data: alertsData, isLoading } = useAlerts(
    {
      event: '2,5',
      is_online: '1',
      is_resolved: true,
      closed_by_id: id,
      to_date: date_range.from || null,
      from_date: date_range.to || null,
      ...page,
    },
    {
      enabled: id ? true : false,
    }
  );
  const columns = useColumns('resolved_alerts');
  useEffect(() => {
    if (alertsData) {
      setTotalAlerts(alertsData?.pages[0]?.total || 0);
    }
  }, [alertsData]);
  const showFallPlayBack = useCallback((data) => {
    setData(data);
    setType('playback');
    setVisible(true);
  }, []);
  const showAlarmNote = useCallback((data) => {
    setData(data);
    setType('note');
    setVisible(true);
  }, []);

  useEffect(() => {
    setActions({
      showFallPlayBack,
      showAlarmNote,
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
        title={type == 'note' && 'Alarm Note'}
        isVisible={visible}
        setIsVisible={setVisible}
        cancelText='Close Playback'
        onCancel={() => console.log('Cancelled')}
        className={type === 'note' ? '' : 'sm:max-w-none w-fit p-0 pb-4'}
        showFooter={type === 'note' ? false : true}
        showCloseButton={type === 'note' ? true : false}
        footerButtons='cancel'
        footerAlign='center'
      >
        {type === 'playback' && (
          <div className='min-w-[600px] sm:max-w-[600px] w-full'>
            <FallPlayBack selectedAlert={data} type={2} />
          </div>
        )}
        {type === 'note' && <p>{data?.comment || 'No notes available for this alarm.'}</p>}
      </Modal>
    </div>
  );
}
