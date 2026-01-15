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

export const PreviousAlarmLogs = ({ userData = {} }) => {
  const [range, setRange] = React.useState({
    from: null,
    to: null,
  });
  const [isAsc, setIsAsc] = React.useState(null);

  const handleToggle = () => setIsAsc((prev) => !prev);
  return (
    <>
      <CardUI
        title={
          <h1 className='text-base font-medium text-text truncate text-wrap'>
            Previous Alarm Logs
          </h1>
        }
        className='!h-fit'
        headerPadding='px-5 py-2'
        actions={
          <div className='flex gap-2 items-center'>
            <Button
              variant='tertiary'
              onClick={handleToggle}
              className='flex items-center gap-2 select-none'
            >
              <motion.span
                animate={{ rotate: isAsc ? 0 : 180 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className='inline-block'
              >
                <BiSort className='w-5 h-5' />
              </motion.span>
              <span>Type</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='tertiary'>
                  <CalendarIcon />
                  {range?.from && range?.to
                    ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                    : 'All Time'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='overflow-hidden p-0' align='end'>
                <Calendar
                  className='w-full border-border'
                  mode='range'
                  selected={range}
                  onSelect={setRange}
                  captionLayout='dropdown'
                  fixedWeeks
                  showOutsideDays
                />
              </PopoverContent>
            </Popover>
          </div>
        }
      >
        <TableProvider onAction={(event) => console.log('Table Action:', event)}>
          <AlarmLogsTable date_range={range} userData={userData} isAsc={isAsc} />
        </TableProvider>
      </CardUI>
    </>
  );
};
