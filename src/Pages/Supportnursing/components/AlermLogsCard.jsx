import FallPlayback from '@/Components/FallPlayback';
import LogsViweModal from '@/Components/LogsViewModal';
import {
  formatMilliseconds,
  formatToTime12Hour,
  getAlertInfoViaEventDetails,
  transformDateAndTimeToDuration,
} from '@/utils/helper';
import { Breadcrumb, Button, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import { FaPersonFalling } from 'react-icons/fa6';

export default function AlermLogsCard({ data = {} }) {
  const [openFallPlaybackModal, setOpenFallPlaybackModal] = useState(false);
  const [openLogModal, setOpenLogModal] = useState(false);
  const mid_log =
    data?.response_details ||
    (data?.response_details?.length > 0 && data?.response_details[0]) ||
    null;
  function getFallReplay() {
    setOpenFallPlaybackModal(true);
  }
  return (
    <div className='p-4 border border-gray-200 rounded-md w-full'>
      <div className='flex flex-col w-full'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center justify-center gap-2'>
            <h2 className='text-[18px] font-semibold'>
              {getAlertInfoViaEventDetails(data)?.title}
            </h2>
            <div className='size-2 bg-slate-400 rounded-xl'></div>
            <span className='text-[13px] font-medium opacity-80'>
              {transformDateAndTimeToDuration(data?.created_at)}
            </span>
          </div>
          <div>
            {data?.res_time ? (
              <Tag color='purple' className='font-semibold'>
                {formatMilliseconds(data?.res_time || 0)} Resp. Time
              </Tag>
            ) : null}
            {data?.event == 2 && (
              <Tooltip title='Fall Playback'>
                <Button shape='circle' onClick={() => getFallReplay()} icon={<FaPersonFalling />} />
              </Tooltip>
            )}
          </div>
        </div>

        <div
          className='bg-[#80CAA7]/5 mt-6 border border-[#0091DA] cursor-pointer hover:bg-[#0091DA]/10 rounded-sm'
          onClick={() => setOpenLogModal(true)}
        >
          <Breadcrumb separator='>' className='text-[#0091DA] p-3'>
            <Breadcrumb.Item>
              <span className='text-[#0091DA] text-[14px] font-normal'>
                <b> {formatToTime12Hour(data?.created_at)}</b>{' '}
                {getAlertInfoViaEventDetails(data)?.title}
              </span>
            </Breadcrumb.Item>
            {mid_log && mid_log !== null && (
              <Breadcrumb.Item>
                <span className='text-[#0091DA] text-[14px] font-normal'>
                  <b> {formatToTime12Hour(mid_log?.created_at)}</b>{' '}
                  {getAlertInfoViaEventDetails(mid_log)?.title}
                </span>
              </Breadcrumb.Item>
            )}
            {data?.closed_at && (
              <Breadcrumb.Item>
                <span className='text-[#0091DA] text-[14px] font-normal'>
                  <b> {formatToTime12Hour(data?.closed_at)}</b> Alarm Resolved
                </span>
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
        </div>
      </div>
      <FallPlayback
        isvisible={openFallPlaybackModal}
        setVisible={setOpenFallPlaybackModal}
        data={data}
      />
      {openLogModal && (
        <LogsViweModal
          isvisible={openLogModal}
          setVisible={setOpenLogModal}
          id={data?._id}
          firstAlarm={data}
        />
      )}
    </div>
  );
}
