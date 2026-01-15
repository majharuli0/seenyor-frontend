import React, { useCallback, useEffect, useState } from 'react';
import { AlertBanner } from '../AlertBanner';
import { FallPlayBack } from '../FallPlayBack';
import { LiveMap } from '../LiveMap';
import { ActionPanel } from '../ActionPanel';
import CardUI from '../common/card';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import TableUI from '../common/table';
import { TableProvider, useTable } from '@/MonitoringService/Context/TableContext';
import { useColumns } from '@/MonitoringService/Utiles/columnsUtil';
import { AlarmLogsTable } from '../AlarmLogsTable';
import { PreviousAlarmLogs } from '../PreviousAlarmLogs';
import { useCustomersDetails } from '@/MonitoringService/hooks/useCustomer';
import { WebSocketProvider } from '@/Context/WebSoketHook';

export default function AlertDetails({ alerts = [], selectedId = '' }) {
  const [selectedAlert, setSelectedAlert] = useState({});
  const [allDevicesList, setAllDevicesList] = useState('');

  const { data, refetch, isLoading } = useCustomersDetails(
    { id: selectedAlert?.elderly_id },
    { enabled: !!selectedAlert?.elderly_id }
  );
  console.log(data);

  useEffect(() => {
    const UIDs = data?.data?.rooms
      ?.map((item) => item?.device_no)
      .filter(Boolean)
      .join(',');
    setAllDevicesList(UIDs);
  }, [data]);
  useEffect(() => {
    setSelectedAlert(alerts?.filter((item) => item?._id == selectedId)[0]);
  }, [alerts, selectedId]);

  return (
    <WebSocketProvider deviceId={allDevicesList || ''}>
      <div className='space-y-5 '>
        <AlertBanner alerts={alerts} />
        <div className='flex items-start gap-5 flex-col sm:flex-row max-h-[600px]'>
          {selectedAlert?.event == '2' && <FallPlayBack selectedAlert={selectedAlert} />}
          <LiveMap selectedAlert={selectedAlert} userData={data?.data} />
        </div>
        <ActionPanel userData={data?.data} selectedAlert={selectedAlert} />
        <PreviousAlarmLogs userData={data?.data} />
      </div>
    </WebSocketProvider>
  );
}
