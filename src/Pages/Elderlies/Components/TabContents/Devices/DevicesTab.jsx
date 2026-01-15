import React, { useCallback, useContext, useEffect, useState } from 'react';
import deviceImg from './images/1.png';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { PiShieldWarning } from 'react-icons/pi';
import { CustomContext } from '@/Context/UseCustomContext';
import { Button, Modal, Tag, Tooltip } from 'antd';
import { PiGearBold } from 'react-icons/pi';
import ModalComponent from '@/Components/Modal';
import { ExclamationCircleFilled } from '@ant-design/icons';
import DeviceConfigurationModal from '@/Components/Modal';
import { getDeviceInfo } from '@/api/deviceReports';
import { getSignalStrength } from '@/utils/helper';
import { FaWifi } from 'react-icons/fa6';
export default function DevicesTab() {
  const { elderlyDetails } = useContext(CustomContext);

  return (
    <>
      <div className='flex flex-col gap-4 mt-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-[24px] font-bold text-[#1B2559]'>Devices</h1>
        </div>
        <div id='devices' className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
          {elderlyDetails?.rooms
            ?.filter((tab) => tab?.device_no)
            .map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
        </div>
      </div>
    </>
  );
}

const DeviceCard = ({ device = {} }) => {
  const [visible, setVisible] = useState(false);
  const [openOfflineModal, setOpenOfflineModal] = useState(false);
  const { elderlyDetails } = useContext(CustomContext);
  const [loadingDevice, setLoadingDevice] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState();
  const deviceUID = device?.device_no;
  const fetchDeviceInfo = useCallback(async () => {
    if (!deviceUID) return;
    setLoadingDevice(true);
    try {
      const res = await getDeviceInfo(deviceUID);
      setDeviceInfo(res?.data);
    } catch (err) {
      console.error('Error fetching device info', err);
    } finally {
      setLoadingDevice(false);
    }
  }, [deviceUID]);
  useEffect(() => {
    fetchDeviceInfo();

    const interval = setInterval(() => {
      fetchDeviceInfo();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchDeviceInfo]);

  const signal =
    deviceInfo?.signal_intensity && getSignalStrength('wifi', deviceInfo?.signal_intensity);

  return (
    <div className='flex flex-col gap-8 bg-white rounded-xl p-4 group  cursor-pointer device_modal'>
      <div className='flex items-center justify-between gap-4 w-full '>
        <div className='flex items-center gap-4'>
          <div id='deviceImg'>
            <img src={deviceImg} alt='device' width={84} height={84} />
          </div>
          <div className='flex flex-col'>
            <h1 className='text-[22px] font-semibold text-[#1B2559] flex items-center gap-2'>
              {device?.name} <div className='size-1.5 bg-slate-400 rounded-full'></div>
              <span className='text-base opacity-85 cursor-pointer'>{device?.device_no}</span>
            </h1>
            <div id='status' className='flex items-center gap-2'>
              {/* <div
                className="rounded-full w-[8px] h-[8px]"
                style={{ backgroundColor: signal?.color }}
              ></div> */}
              {device?.is_device_bind ? <FaWifi color={signal?.color} /> : <FaWifi color={'red'} />}
              <p className='text-[16px] font-semibold text-primary capitalize'>
                {device?.is_device_bind ? 'Online' : 'Offline'}
              </p>
              {signal && <Tag color={signal?.color}>{signal.label}</Tag>}
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            if (device?.is_device_bind) {
              setVisible(true);
            } else {
              setOpenOfflineModal(true);
            }
          }}
        >
          <PiGearBold /> Settings
        </Button>
      </div>
      {/* <div id="issue" className="flex items-start justify-start gap-2 w-[60%]">
        <div id="icon">
          {device.issueStatus === "0" ? (
            <IoCheckmarkSharp size={18} color="#00c42e" />
          ) : (
            <PiShieldWarning size={18} color="#ff9f0d" />
          )}
        </div>
        <p className="text-[15px] font-medium text-[#1B2559] capitalize">
          {device.issue || "--"}
        </p>
      </div> */}
      <DeviceConfigurationModal
        isvisible={visible}
        setVisible={setVisible}
        elderly_id={elderlyDetails._id}
        device_id={device?.device_no}
        room_id={device?._id}
      />
      <DeviceOfflineModal isvisible={openOfflineModal} setVisible={setOpenOfflineModal} />
    </div>
  );
};
const DeviceOfflineModal = ({ isvisible = false, setVisible }) => {
  function onClose() {
    setVisible(false);
  }
  return (
    <>
      <Modal
        centered
        open={isvisible}
        onCancel={onClose}
        onOk={onClose}
        className='device-offline-modal '
        title={
          <div className='flex items-center gap-2 p-6'>
            <ExclamationCircleFilled className='text-yellow-500' />
            <span>Offline Device</span>
          </div>
        }
        footer={
          <div className='p-6'>
            <Button onClick={() => setVisible(false)}>Ok</Button>
          </div>
        }
        okText='OK'
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className='px-4'>
          <p>This device is currently offline. You cannot make any changes now.</p>
        </div>
      </Modal>
    </>
  );
};
