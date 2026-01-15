import { getAlertInfoViaEvent } from '@/utils/helper';
import { Button, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { FaCheck, FaPersonFalling } from 'react-icons/fa6';
import { LuSearch } from 'react-icons/lu';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AlertCloseModal from '../ActiveAlerts/AlertCloseModal';
import { SidebarContext } from '@/Context/CustomUsertable';
import { fallPlayback } from '../../api/deviceReports';
import { formatCreatedAt } from '../../utils/helper';
import FallPlayback from '../FallPlayback/index';
import Modal from '@/MonitoringService/Components/common/modal';
import { FallPlayBack } from '@/MonitoringService/Components/FallPlayBack';
import ls from 'store2';

export default function InlineActionManu({ row = {}, onlyFall = false }) {
  const isFall = getAlertInfoViaEvent(row);
  const navigate = useNavigate();
  const sharedMethod = useContext(SidebarContext);
  const [visible, setVisible] = useState(false);
  const [mainRole, setMainRole] = useState(ls.get('rootRole'));
  const [rootToken, setRootToken] = useState(ls.get('rootToken'));
  const [openAlertCloseModal, setOpenAlertCloseModal] = useState(false);
  const [openFallPlaybackModal, setOpenFallPlaybackModal] = useState(false);
  function getFallReplay() {
    setOpenFallPlaybackModal(true);
  }
  return (
    <div className='flex items-end gap-2 w-fill justify-end'>
      {isFall?.tag === 'fall' && (
        <Tooltip title='Fall Playback'>
          <Button shape='circle' onClick={() => getFallReplay(row)} icon={<FaPersonFalling />} />
        </Tooltip>
      )}
      {isFall?.tag === 'fall' && mainRole == 'super_admin' && rootToken && (
        <Tooltip title='Long Fall Playback'>
          <Button shape='round' onClick={() => setVisible(true)} icon={<FaPersonFalling />}>
            Replay
          </Button>
        </Tooltip>
      )}
      {!onlyFall && (
        <Tooltip title='Resolve'>
          <Button
            shape='circle'
            icon={<FaCheck />}
            onClick={() => {
              setOpenAlertCloseModal(true);
            }}
          />
        </Tooltip>
      )}
      {!onlyFall && (
        <Tooltip title='Quick Look'>
          <Button
            shape='round'
            icon={<MdOutlineRemoveRedEye />}
            onClick={() => {
              navigate('/support-nurnt/dashboard/alarm-detail', {
                state: { alertData: row, id: row?.elderly_id },
              });
            }}
          >
            {' '}
            View
          </Button>
        </Tooltip>
      )}

      <AlertCloseModal
        openAlertCloseModal={openAlertCloseModal}
        setOpenAlertCloseModal={setOpenAlertCloseModal}
        selectedAlert={row}
        getAlertListDatas={() => {
          //   getAlertListData();
          sharedMethod.getLatestAlarmList.getAlartsHistory();
          sharedMethod.getLatestAlarmList.getAlarmsCounts();
          sharedMethod.getLatestAlarmList.refreshSomeAPIs();
        }}
      />
      <Modal
        isVisible={visible}
        setIsVisible={setVisible}
        cancelText='Close Playback'
        className={'sm:max-w-none w-fit p-0 pb-4'}
        onCancel={() => console.log('Cancelled')}
        showCloseButton={false}
        footerButtons='cancel'
        footerAlign='center'
      >
        <div className='min-w-[600px] sm:max-w-[700px] w-full'>
          <FallPlayBack selectedAlert={row} type={2} />
        </div>
      </Modal>
      <FallPlayback
        isvisible={openFallPlaybackModal}
        setVisible={setOpenFallPlaybackModal}
        data={row}
      />
    </div>
  );
}
