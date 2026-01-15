import { TableProvider } from '@/MonitoringService/Context/TableContext';
import { AlarmLogsTable } from '../AlarmLogsTable';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import CardUI from '../common/card';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiSort } from 'react-icons/bi';
import { useAlerts } from '@/MonitoringService/hooks/useAlert';
import { ResolvedAlertsTable } from '../ResolvedAlertsTable';

export const AgentResolvedAlerts = ({ setTotalAlerts, date_range = {} }) => {
  return (
    <>
      <CardUI
        title={
          <h1 className='text-base font-medium text-text truncate text-wrap'>Resolved Alerts</h1>
        }
        className='!h-fit'
        headerPadding='px-5 py-4'
      >
        <TableProvider onAction={(event) => console.log('Table Action:', event)}>
          <ResolvedAlertsTable setTotalAlerts={setTotalAlerts} date_range={date_range} />
        </TableProvider>
      </CardUI>
    </>
  );
};
