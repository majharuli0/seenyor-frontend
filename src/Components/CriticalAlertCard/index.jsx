import React, { useState } from 'react';
import { Button } from 'antd';
import AlertCloseModal from '../ActiveAlerts/AlertCloseModal';
import FallPlayback from '../FallPlayback';
import {
  getAlertInfoViaEvent,
  getAlertInfoViaEventDetails,
  getAlertType,
  transformDateAndTime,
} from '@/utils/helper';
import { useNavigate } from 'react-router-dom';

const CriticalAlertCard = ({ onResolved, item = {}, setOpen }) => {
  const [openFallPlaybackModal, setOpenFallPlaybackModal] = useState(false);
  const [openAlertCloseModal, setOpenAlertCloseModal] = useState(false);
  const navigate = useNavigate();

  function getFallReplay() {
    setOpenFallPlaybackModal(true);
  }
  return (
    <div
      className=' border-l-4  rounded-lg  w-full'
      style={{
        borderColor:
          getAlertType(item) == 'Critical'
            ? 'red'
            : getAlertType(item) == 'Warning'
              ? 'yellow'
              : 'gray',
      }}
    >
      <div className=' flex justify-between items-center w-full border border-slate-200 p-4  rounded-lg  '>
        {/* Left Section */}
        <div
          className='pr-8 cursor-pointer'
          onClick={() => {
            setOpen(false);
            navigate(`/supporter/elderlies/elderly-profile/${item?.elderly_id}?tab=overview`);
          }}
        >
          <h3 className='text-[18px] font-medium capitalize'>
            {' '}
            {getAlertInfoViaEventDetails(item)?.title || ''}{' '}
            {item?.is_resolved &&
              (['2', '5', '9'].includes(item?.event) ||
                ['1'].includes(item?.alarm_type) ||
                ['1'].includes(item?.is_online)) && (
                <span className='text-sm font-normal italic'>Resolved</span>
              )}
          </h3>
          <p className='text-[#6E6B6B] text-[14px] font-medium'>
            {getAlertInfoViaEvent(item)?.message || ''}
          </p>
          <p className='text-gray-400 text-sm mt-2'> {transformDateAndTime(item.created_at)}</p>
        </div>

        {/* Right Section (Buttons) */}
        <div className='flex gap-2'>
          {item?.event == 2 && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                getFallReplay();
              }}
            >
              Playback
            </Button>
          )}
          {!item?.is_resolved &&
            (['2', '5', '9'].includes(item?.event) ||
              ['1'].includes(item?.alarm_type) ||
              ['1'].includes(item?.is_online)) && (
              <Button
                onClick={() => {
                  setOpenAlertCloseModal(true);
                }}
                type='primary'
                style={{ backgroundColor: '#001529' }}
              >
                Resolve
              </Button>
            )}
        </div>
      </div>
      <AlertCloseModal
        openAlertCloseModal={openAlertCloseModal}
        setOpenAlertCloseModal={setOpenAlertCloseModal}
        selectedAlert={item}
        getAlertListDatas={() => onResolved()}
      />
      <FallPlayback
        isvisible={openFallPlaybackModal}
        setVisible={setOpenFallPlaybackModal}
        data={item}
      />
    </div>
  );
};

export default CriticalAlertCard;
