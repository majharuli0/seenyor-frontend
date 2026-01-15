import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/MonitoringService/Components/ui/tabs';
import { FcCallback } from 'react-icons/fc';
import { PhoneCall } from 'lucide-react';
import TopMountCanvas from '@/MonitoringService/Components/RoomMapCanvas/TopMount';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/MonitoringService/Components/ui/tooltip';
import useMediaQuery from '@/MonitoringService/hooks/useMediaQuery';
import CardUI from '../common/card';
import { Button } from '../ui/button';
import { useRoomInfo } from '@/MonitoringService/hooks/useAlert';
import WallMountCanvas from '../RoomMapCanvas/WallMount';
import { initiateCall } from '@/utils/makeDeviceCall';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '../ui/empty';
import { MdDoNotDisturb } from 'react-icons/md';
import { WebSocketProvider } from '@/Context/WebSoketHook';

export const CustomerDetailsLiveMap = ({ data = { rooms: [] } }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [rooms, setRooms] = useState(data?.rooms || []);
  const [allDevicesList, setAllDevicesList] = useState('');
  console.log(data.rooms);
  console.log({
    elderly_id: data?._id,
    room_id: activeTab?.device_no,
  });
  const {
    data: roomInfo,
    refetch,
    isLoading,
  } = useRoomInfo(
    {
      elderly_id: data?._id,
      room_id: activeTab?.device_no,
    },
    {
      enabled: !!activeTab?.device_no && !!data?._id,
    }
  );
  console.log(roomInfo);
  useEffect(() => {
    setRooms(data && data?.rooms ? data?.rooms : []);
    const firstRoom = data?.rooms?.find((item) => item?.device_no);
    setActiveTab(firstRoom || null);
  }, [data]);
  useEffect(() => {
    const UIDs = data?.rooms
      ?.map((item) => item?.device_no)
      .filter(Boolean)
      .join(',');
    setAllDevicesList(UIDs);
  }, [data]);
  useEffect(() => {
    if (roomInfo) {
      setRooms((prevRooms) =>
        prevRooms.map((r) => (r._id === roomInfo?.data._id ? { ...r, ...roomInfo?.data } : r))
      );
    }
    console.log(roomInfo);
    console.log(rooms);
  }, [roomInfo]);
  function handleClick(id) {
    if (id) {
      initiateCall(id);
    }
  }
  const renderMap = (roomId) => {
    const room = rooms.find((item) => item._id === roomId);
    console.log(rooms);
    console.log(room);

    if (room?.mount_type == 2) {
      return <TopMountCanvas roomInfo={room} />;
    }
    if (room?.mount_type == 1) {
      return <WallMountCanvas roomInfo={room} />;
    }
  };

  return (
    <WebSocketProvider deviceId={allDevicesList || ''}>
      <CardUI
        title={<h1 className='text-text font-semibold text-lg '>Live Map</h1>}
        actions={
          <Button
            variant='outline'
            disabled={!activeTab?.is_device_bind}
            onClick={() => handleClick(activeTab?.device_no)}
          >
            <PhoneCall /> Call
          </Button>
        }
        className='bg-secondary/40 border-none shadow-sm rounded-2xl !h-fit'
      >
        <div className='min-h-[400px] h-full'>
          {rooms.filter((item) => item?.device_no)?.length == 0 && (
            <div className='w-ful h-full flex items-center justify-center pt-14'>
              <Empty className='w-full text-center '>
                <EmptyHeader>
                  <EmptyMedia variant='icon'>
                    <MdDoNotDisturb className='w-16 h-16 text-muted-foreground' />
                  </EmptyMedia>
                  <EmptyDescription>No Device Found</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
          {rooms?.filter((item) => item?.device_no)?.length !== 0 && (
            <Tabs
              value={activeTab?._id}
              onValueChange={(val) => {
                const room = rooms.find((r) => r._id === val);
                setActiveTab(room);
              }}
              className='flex flex-col md:flex-row h-full bg-card'
            >
              <TabsList className='flex md:flex-col flex-row items-start gap-2 md:w-[30%] w-full px-2 py-3 md:py-4 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent md:min-h-[400px] md:max-h-[400px] rounded-lg justify-start bg-card h-fit md:h-auto py-1'>
                {rooms
                  ?.filter((item) => item?.device_no)
                  .map((room) => (
                    <TabsTrigger
                      key={room._id}
                      value={room._id}
                      className={`flex items-center gap-2 flex-shrink-0 md:w-full px-3 py-2 transition-all duration-150 max-h-fit ${
                        activeTab?._id === room._id
                          ? '!bg-background rounded-lg shadow-sm !border-primary/60'
                          : ''
                      }`}
                    >
                      <div className='hidden md:flex items-center justify-between w-full max-h-fit'>
                        <div className='flex flex-col items-start  !h-fit'>
                          <h2 className='text-text text-sm md:text-base truncate max-w-[120px]'>
                            {room.name}
                          </h2>
                          <span className='text-text/70 font-thin text-xs truncate max-w-[120px]'>
                            {room.device_no}
                          </span>
                        </div>
                        <span className='relative flex size-3'>
                          <span
                            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                              room?.is_device_bind ? 'bg-green-400' : 'bg-red-400'
                            } opacity-75`}
                          ></span>
                          <span
                            className={`relative inline-flex size-3 rounded-full ${
                              room?.is_device_bind ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          ></span>
                        </span>
                      </div>
                      <div className='flex md:hidden items-center justify-center'>
                        <span>{room.name}</span>
                      </div>
                    </TabsTrigger>
                  ))}
              </TabsList>

              <div className='flex-1 md:w-[70%] h-full'>
                {rooms?.map((room) => (
                  <TabsContent
                    key={room._id}
                    value={room._id}
                    className='relative w-full border border-border p-3 md:p-4 h-[400px] mt-0 !py-0'
                  >
                    <div
                      className='absolute inset-0 pointer-events-none z-0 bg-[length:20px_20px]'
                      style={{
                        backgroundImage: `
                      linear-gradient(to right, rgb(var(--ms-text-color)/0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgb(var(--ms-text-color)/0.1) 1px, transparent 1px)
                    `,
                      }}
                    ></div>
                    {renderMap(room._id)}
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </div>
      </CardUI>
    </WebSocketProvider>
  );
};
