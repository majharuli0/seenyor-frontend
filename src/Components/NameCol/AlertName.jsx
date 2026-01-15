import React from 'react';
import { AiOutlineAlert } from 'react-icons/ai';
import { AiOutlineBug } from 'react-icons/ai';
import { getAlertType, getAlertInfoViaEvent, transformDateAndTime } from '@/utils/helper';
import { MdLocationPin } from 'react-icons/md';
import { Tooltip } from 'antd';

export default function AlertName({ data = [], type = 1 }) {
  const alertInfo = getAlertInfoViaEvent(data);

  return (
    <div className='flex items-center gap-2 min-w-[380px] w-fit'>
      <div id='Icon'>
        {alertInfo?.icon ? (
          <img
            src={alertInfo?.icon}
            alt='Alert Icon'
            width={38}
            height={38}
            className='min-w-[38px]'
          />
        ) : null}
      </div>
      {type == 1 && (
        <div className='w-full'>
          <h4 className='text-sm font-medium text-text-primary'>{alertInfo?.title}</h4>
          <p className='text-xs text-text-secondary'>{alertInfo?.message}</p>
        </div>
      )}
      {type == 2 && (
        <div className='w-full'>
          <div className='flex items-center gap-1'>
            <h4 className='text-base font-medium text-text-primary flex text-nowrap'>
              {alertInfo?.message}
            </h4>
            <div className='size-1 bg-slate-400 rounded-full'></div>{' '}
            <span className='text-nowrap text-[13px] font-medium'>
              {' '}
              {transformDateAndTime(data?.created_at)}
            </span>
          </div>
          <Tooltip title='Click to view on Map' placement='topLeft'>
            <a
              href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-base font-medium !text-blue-500 w-fit'
            >
              <p className='text-[14px] text-text-secondary flex items-center gap-1 cursor-pointer hover:text-primary w-fit'>
                {' '}
                <MdLocationPin /> <span>{data?.address}</span>
              </p>
            </a>
          </Tooltip>
        </div>
      )}
      {type == 3 && (
        <div className='w-fit'>
          <div className='flex items-center gap-1'>
            <h4 className='text-base font-medium text-text-primary flex text-nowrap'>
              {alertInfo?.title}
            </h4>
            <div className='size-1 bg-slate-400 rounded-full'></div>{' '}
            <span className='text-nowrap text-[13px] font-medium'>
              {' '}
              {transformDateAndTime(data?.created_at)}
            </span>
          </div>
          <p className='text-xs text-text-secondary'>{alertInfo?.message}</p>
        </div>
      )}
    </div>
  );
}
