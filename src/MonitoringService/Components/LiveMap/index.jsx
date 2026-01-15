import { useAlertPick, useRoomInfo } from '@/MonitoringService/hooks/useAlert';
import CardUI from '../common/card';
import WallMountCanvas from '../RoomMapCanvas/WallMount';
import TopMountCanvas from '../RoomMapCanvas/TopMount';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { initiateCall } from '@/utils/makeDeviceCall';
import { Spinner } from '../ui/spinner';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty';
import { PiEmptyBold } from 'react-icons/pi';
import { Phone, PhoneCall, Plug, WifiOff } from 'lucide-react';
import CallNoteSection from '../CallNoteSection';
import Modal from '../common/modal';
import { useUserStore } from '@/MonitoringService/store/useUserStore';
import { useParams } from 'react-router-dom';

export const LiveMap = ({ selectedAlert = {}, userData = {} }) => {
  const { id } = useParams();
  const [selectedRoom, setSelectedRoom] = useState('');
  const [deviceCallNote, setDeviceCallNote] = useState(false);
  const [calledDevice, setCalledDevice] = useState(null);
  const rooms = userData?.rooms || [];
  const { mutate: pickAlert, isPending, isSuccess } = useAlertPick();
  const [user, serUser] = useState(null);
  const { getUser } = useUserStore();
  const token = localStorage.getItem('token');
  const [visible, setVisible] = useState(false);
  console.log(selectedAlert);

  useEffect(() => {
    serUser(getUser);
  }, [getUser, token]);
  useEffect(() => {
    if (selectedAlert?.uid) {
      setSelectedRoom(selectedAlert.uid);
    }
  }, [selectedAlert]);

  const {
    data: roomInfo,
    refetch,
    isLoading,
  } = useRoomInfo(
    {
      elderly_id: selectedAlert?.elderly_id,
      room_id: selectedRoom,
      alert_id: selectedAlert?._id, // Adding this to support demo offline logic
      uid: selectedAlert?.uid,
    },
    {
      enabled: !!selectedAlert?.elderly_id && !!selectedRoom && !selectedRoom.includes('temp_'),
      cacheTime: 5 * 60 * 1000,
    }
  );
  console.log(roomInfo);

  function handleClick(id) {
    if (id && actionReq()) {
      initiateCall(id, (id) => {
        setDeviceCallNote(true);

        setCalledDevice(rooms?.filter((item) => item?.device_no == id)[0]);
      });
    }
  }
  function actionReq() {
    if (user?.role == 'monitoring_agent' && !selectedAlert?.picked_by) {
      setVisible(true);
      return false;
    }
    return true;
  }
  return (
    <CardUI
      title={<h1 className='text-base font-semibold text-text'>Live Map</h1>}
      headerPadding='px-5 py-2'
      actions={
        <div className='flex items-center gap-2'>
          <Select
            value={selectedRoom}
            onValueChange={(value) => {
              setSelectedRoom(value);
            }}
          >
            <SelectTrigger className='text-text !py-2.5 !h-[40px] min-w-[150px]'>
              <SelectValue placeholder='Select Room' />
            </SelectTrigger>
            <SelectContent>
              {rooms
                ?.filter((item) => item?.device_no)
                .map((room, ind) => (
                  <SelectItem key={room._id} value={room.device_no || `temp_${ind}`}>
                    {room.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button
            key={selectedRoom}
            variant='outline'
            className='border-destructive/80 border-2'
            disabled={selectedRoom?.includes('temp_') || !roomInfo?.data?.is_device_bind}
            onClick={() => handleClick(selectedRoom)}
          >
            <Phone /> Call Device
          </Button>
        </div>
      }
    >
      <div className='relative w-full h-full'>
        {/* grid background */}
        <div
          className='absolute inset-0 pointer-events-none z-0 bg-[length:20px_20px]'
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(var(--ms-text-color) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(var(--ms-text-color) / 0.1) 1px, transparent 1px)
            `,
          }}
        ></div>

        <div className='relative z-10 max-w-[600px] mx-auto'>
          {roomInfo?.data?.mount_type === 2 && !isLoading && roomInfo?.data?.is_device_bind && (
            <WallMountCanvas roomInfo={roomInfo?.data} />
          )}
          {roomInfo?.data?.mount_type === 1 && !isLoading && roomInfo?.data?.is_device_bind && (
            <TopMountCanvas roomInfo={roomInfo?.data} />
          )}
          {(isLoading || !roomInfo || !roomInfo?.data || !roomInfo?.data?.is_device_bind) && (
            <div className='w-full h-full flex justify-center items-center aspect-[6/4] max-h-screen'>
              {isLoading ? (
                <Spinner className='h-8 w-8' />
              ) : !roomInfo?.data?.is_device_bind && roomInfo?.data?.device_no ? (
                <Empty className='w-full text-center'>
                  <EmptyHeader className='pt-8'>
                    <EmptyMedia variant='icon'>
                      <Plug className='w-16 h-16 text-muted-foreground' />
                    </EmptyMedia>
                    <EmptyTitle>Device Offline</EmptyTitle>
                    <EmptyDescription>Check device or select another room.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                !isLoading && (
                  <Empty className='w-full text-center'>
                    <EmptyHeader className='pt-8'>
                      <EmptyMedia variant='icon'>
                        <WifiOff className='w-16 h-16 text-muted-foreground' />
                      </EmptyMedia>
                      <EmptyTitle>No Device</EmptyTitle>
                      <EmptyDescription>No device is linked to this room.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <Modal isVisible={deviceCallNote} setIsVisible={setDeviceCallNote} showFooter={false}>
        <div className='space-y-5'>
          <h2 className='text-xl font-semibold text-text mb-1'>Write Call Note</h2>

          <CallNoteSection
            modalShow={deviceCallNote}
            setModalShow={setDeviceCallNote}
            autoOpen={true}
            contactName={calledDevice?.name}
            contactNumber={calledDevice?.device_no}
            contactType='device_call'
            placeholder={'e.g. Checked via room device, resident responded and appears safe.'}
          />
        </div>
      </Modal>
      <Modal
        isVisible={visible}
        setIsVisible={setVisible}
        okText='Yes, Confirm'
        title='Confirm Resolution'
        description='are you sure you want to pick this alert?'
        onOk={async () => {
          await pickAlert(id);
        }}
        onCancel={() => {}}
      ></Modal>
    </CardUI>
  );
};
