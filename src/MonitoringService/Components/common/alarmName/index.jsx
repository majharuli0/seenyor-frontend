import React from 'react';
import clsx from 'clsx';
import { AlertTriangle, WifiOff, ShieldAlert, BellRing, Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { formatCreatedAt, getAlertInfoViaEventDetails } from '@/utils/helper';
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
export default function AlarmName({ alert, subTitle = '' }) {
  const getAlertConfig = (type) => {
    switch (type) {
      case '1':
        return {
          color: 'bg-yellow-600/10 text-yellow-400 border-yellow-600/30',
          icon: <WifiOff className='w-5 h-5' />,
        };
      case '2':
        return {
          color: 'bg-red-600/10 text-red-400 border-red-600/30',
          icon: <AlertTriangle className='w-5 h-5' />,
        };
      case '3':
        return {
          color: 'bg-blue-600/10 text-blue-400 border-blue-600/30',
          icon: <ShieldAlert className='w-5 h-5' />,
        };
      case '4':
        return {
          color: 'bg-green-600/10 text-green-400 border-green-600/30',
          icon: <BellRing className='w-5 h-5' />,
        };
      case '5':
        return {
          color: 'bg-yellow-600/10 text-yellow-400 border-yellow-600/30',
          icon: <WifiOff className='w-5 h-5' />,
        };
      default:
        return {
          color: 'bg-gray-600/10 text-gray-400 border-gray-600/30',
          icon: <WifiOff className='w-5 h-5' />,
        };
    }
  };

  const { color, icon } = getAlertConfig(alert?.event);

  return (
    <div className='flex items-center gap-3 min-w-0'>
      <div
        className={clsx(
          'flex items-center justify-center w-9 h-9 rounded-md border flex-shrink-0',
          color
        )}
      >
        {icon}
      </div>
      <div className='min-w-0'>
        <TooltipText text={getAlertInfoViaEventDetails(alert)?.title}>
          <div className='text-sm font-medium truncate'>
            {' '}
            {getAlertInfoViaEventDetails(alert)?.title}
          </div>
        </TooltipText>
        <TooltipText text={subTitle ? subTitle : formatCreatedAt(alert?.created_at)}>
          <div className='text-xs text-muted-foreground truncate'>
            {subTitle ? subTitle : formatCreatedAt(alert?.created_at)}
          </div>
        </TooltipText>
      </div>
    </div>
  );
}
