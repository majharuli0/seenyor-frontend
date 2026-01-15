import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import clsx from 'clsx';
import { ChevronRight, AlertTriangle, WifiOff, Icon, Bell } from 'lucide-react';
import useMediaQuery from '@/MonitoringService/hooks/useMediaQuery';
import AlertLifeCounter from '../AlertLife';
import { Skeleton } from '../ui/skeleton';
import { TableSkeleton } from '../AlertTableState';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty';
import { PiEmpty, PiEmptyBold } from 'react-icons/pi';
import { formatCreatedAt, getAlertInfoViaEventDetails } from '@/utils/helper';
import { CgBorderStyleSolid } from 'react-icons/cg';

/* ---------------- TooltipText ---------------- */
const TooltipText = ({ text, children }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side='bottom' className='max-w-xs'>
        <p className='break-words'>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/* ---------------- AlertRow ---------------- */
const AlertRow = ({ alert, selectedId, compactMode, isMidScreen, onRowClick }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const selected = String(selectedId) === String(alert?._id);

  const isPickedByYou = alert?.picked_by?.picked_by_id == user?._id;
  const isPickedByOthers = alert?.picked_by ? alert?.picked_by?.picked_by_id !== user?._id : false;

  const getIcon = (type) => {
    switch (type) {
      case '2':
        return <AlertTriangle className='w-5 h-5' />;
      case '5':
        return <WifiOff className='w-5 h-5' />;
      default:
        return <Bell className='w-5 h-5' />;
    }
  };

  const getStatusClass = () => {
    if (isPickedByOthers) return 'opacity-60 cursor-not-allowed border-border';
    if (isPickedByYou) return 'border-border';
    return 'hover:shadow-sm border-border';
  };

  /* grid templates */
  const fullGrid =
    'grid-cols-[minmax(130px,1fr)_minmax(120px,1fr)_minmax(200px,1.3fr)_minmax(80px,0.6fr)_minmax(80px,0.6fr)]';
  const midGrid =
    'grid-cols-[minmax(140px,1fr)_minmax(140px,1.2fr)_minmax(100px,0.8fr)_minmax(80px,0.6fr)]';
  const compactGrid = 'grid-cols-[minmax(140px,1.5fr)_minmax(100px,1fr)_minmax(50px,auto)]';

  const gridClass = compactMode ? compactGrid : isMidScreen ? midGrid : fullGrid;

  return (
    <div
      role='button'
      onClick={() => onRowClick(alert)}
      className={clsx(
        'grid rounded-lg border p-3 transition-all cursor-pointer bg-transparent dark:bg-card dark:hover:bg-card/70 items-center text-left gap-x-3 relative',
        gridClass,
        getStatusClass(),
        selected && 'ring-2 ring-primary/40'
      )}
    >
      {/* Alert Type */}
      <div className='flex items-center gap-3 min-w-0'>
        <div
          className={clsx(
            'flex items-center justify-center w-9 h-9 rounded-md border flex-shrink-0',
            alert?.event === '2'
              ? 'bg-red-600/10 text-red-400 border-red-600/30'
              : 'bg-yellow-600/10 text-yellow-400 border-yellow-600/30'
          )}
        >
          {React.createElement(getAlertInfoViaEventDetails(alert)?.icon2 || CgBorderStyleSolid, {
            size: 20,
          })}
        </div>
        <div className='min-w-0'>
          <TooltipText text={getAlertInfoViaEventDetails(alert)?.title}>
            <div className='text-sm font-medium truncate'>
              {getAlertInfoViaEventDetails(alert)?.title}
            </div>
          </TooltipText>

          <TooltipText text={formatCreatedAt(alert?.created_at)}>
            <div className='text-xs text-muted-foreground truncate'>
              {formatCreatedAt(alert?.created_at)}
            </div>
          </TooltipText>
        </div>
      </div>

      {/* Location */}
      {!compactMode && (
        <div>
          {' '}
          <div className='text-sm text-text truncate'>{alert?.room_name}</div>{' '}
          <div className='text-xs text-muted-foreground truncate'> {alert?.elderly_name} </div>{' '}
        </div>
      )}

      {/* Address */}
      {!compactMode && !isMidScreen && (
        <TooltipText text={alert.address}>
          <div className='text-xs truncate'>{alert.address}</div>
        </TooltipText>
      )}

      {/* Life */}
      <div>
        <AlertLifeCounter date_time={alert?.created_at} />
      </div>

      {/* Status + Button */}
      <div
        className={clsx(
          'flex items-center gap-2 justify-end min-w-0',
          compactMode && 'justify-center'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!compactMode && (
          <TooltipText
            text={
              alert?.picked_by
                ? alert?.picked_by?.picked_by_id == user?._id
                  ? 'Picked by you'
                  : `Picked by ${alert?.picked_by?.picked_by || ''}`
                : 'No Picked up'
            }
          >
            <div className='text-xs text-muted-foreground truncate max-w-[100px]'>
              {alert?.picked_by
                ? alert?.picked_by?.picked_by_id == user?._id
                  ? 'Picked by you'
                  : `Picked by ${alert?.picked_by?.picked_by || ''}`
                : 'No Picked up'}
            </div>
          </TooltipText>
        )}
        <Button
          variant={
            isPickedByYou || selectedId === alert?._id
              ? 'default'
              : isPickedByOthers
                ? 'success'
                : 'outline'
          }
          size='icon'
          className={clsx(
            'transition-all min-w-[26px] size-[26px] border-2 border-solid dark:border-white/70',
            (isPickedByYou || selectedId === alert?._id) &&
              'bg-primary text-white hover:bg-primary/90 shadow-md dark:shadow-lg shadow-primary/60 dark:shadow-primary',
            isPickedByOthers && 'bg-green-600 hover:bg-green-700 text-white',
            !isPickedByYou &&
              !isPickedByOthers &&
              selectedId !== alert?._id &&
              'text-muted-foreground hover:bg-background/40'
          )}
          disabled={isPickedByOthers}
          onClick={() => {
            if (!isPickedByOthers) onRowClick(alert);
          }}
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
};

/* ---------------- Header ---------------- */
const AlertListHeader = ({ compactMode, isMidScreen }) => {
  const fullGrid =
    'grid-cols-[minmax(130px,1fr)_minmax(120px,1fr)_minmax(200px,1.3fr)_minmax(80px,0.6fr)_minmax(80px,0.6fr)]';
  const midGrid =
    'grid-cols-[minmax(140px,1fr)_minmax(140px,1.2fr)_minmax(100px,0.8fr)_minmax(80px,0.6fr)]';
  const compactGrid = 'grid-cols-[minmax(140px,1.5fr)_minmax(100px,1fr)_minmax(50px,auto)]';

  const gridClass = compactMode ? compactGrid : isMidScreen ? midGrid : fullGrid;

  return (
    <div
      className={clsx(
        'hidden md:grid px-4 py-1 bg-card/60 rounded-md text-left items-center font-medium text-xs text-muted-foreground gap-x-3 overflow-hidden',
        gridClass
      )}
    >
      {compactMode ? (
        <>
          <span>Alert Type</span>
          <span>Life</span>
        </>
      ) : isMidScreen ? (
        <>
          <span>Alert Type</span>
          <span>Location</span>
          <span>Life</span>
          <span className='text-right'>Status</span>
        </>
      ) : (
        <>
          <span>Alert Type</span>
          <span>Location</span>
          <span>Address</span>
          <span>Life</span>
          <span className='text-right'>Status</span>
        </>
      )}
    </div>
  );
};

/* ---------------- Main ---------------- */
export default function AlertList({ alerts = [], selectedId, loading = false, refetch }) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isMidScreen = useMediaQuery('(max-width: 1100px)');
  const isHideList = useMediaQuery('(max-width: 1200px)');

  const compactMode = Boolean(selectedId) || isMobile;
  if (isHideList && selectedId) return null;

  const onRowClick = (alert) => {
    // if (alert.status === "Picked by others") return;
    navigate(`/ms/dashboard/alert/${alert._id}`);
  };
  const isEmpty = !loading && alerts?.length === 0;
  return (
    <div className='space-y-3 px-2 h-fit'>
      {!isEmpty && <AlertListHeader compactMode={compactMode} isMidScreen={isMidScreen} />}

      <div className='flex flex-col gap-3'>
        {loading && <TableSkeleton />}

        {isEmpty && (
          <Empty className=']'>
            <EmptyHeader className='pt-14'>
              <EmptyMedia variant='icon'>
                <PiEmptyBold className='w-16 h-16 text-muted-foreground' />
              </EmptyMedia>
              <EmptyTitle> No Alerts Found</EmptyTitle>
              <EmptyDescription> Everything looks calm for now.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant='outline' className='mt-3' onClick={refetch}>
                Refresh
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {!loading &&
          !isEmpty &&
          alerts?.map((alert) => (
            <AlertRow
              key={alert._id}
              alert={alert}
              selectedId={selectedId}
              compactMode={compactMode}
              isMidScreen={isMidScreen}
              onRowClick={onRowClick}
            />
          ))}
      </div>
    </div>
  );
}
