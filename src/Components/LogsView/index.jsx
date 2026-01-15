import { Breadcrumb } from 'antd';
import React from 'react';
import LogsViweModal from '../LogsViewModal';
import { formatToTime12Hour, getAlertInfoViaEventDetails } from '@/utils/helper';

export default function LogsView({ data = {} }) {
  const [openLogModal, setOpenLogModal] = React.useState(false);
  const mid_log =
    data?.last_entries_before_resolve_alarm ||
    (data?.last_entries_before_resolve_alarm?.length > 0 &&
      data?.last_entries_before_resolve_alarm[0]) ||
    null;
  return (
    <div className='text-left font-medium'>
      <div
        className='cursor-pointer hover:bg-slate-100 w-fit p-1 rounded-md'
        onClick={() => setOpenLogModal(true)}
      >
        <Breadcrumb separator='>' className='text-primary '>
          <Breadcrumb.Item>
            <span className='text-primary text-[14px] font-normal'>
              <b>{formatToTime12Hour(data?.created_at)}</b>{' '}
              {getAlertInfoViaEventDetails(data)?.title}
            </span>
          </Breadcrumb.Item>
          {mid_log && mid_log !== null && (
            <Breadcrumb.Item>
              <span className='text-primary text-[14px] font-normal'>
                <b>{formatToTime12Hour(mid_log?.created_at)}</b>{' '}
                {getAlertInfoViaEventDetails(mid_log)?.title}
              </span>
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>
            <span className='text-primary text-[14px] font-normal'>
              <b> {formatToTime12Hour(data?.closed_at)}</b> Alarm Resolved
            </span>
          </Breadcrumb.Item>
          {/* <Breadcrumb.Item>
            <span className="text-primary text-[14px] font-normal">
              <b> 08:58:22</b> Resident Back to Bed
            </span>
          </Breadcrumb.Item> */}
        </Breadcrumb>
      </div>
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
