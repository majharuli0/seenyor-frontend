import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getElderliesPriority, getAllUIDs } from '@/api/elderly';
import { getAlertInfoViaEventDetails } from '../../../utils/helper';
import CurrentActivityOverview from '../components/CurrentActivityOverview';
import UserCardList from '../components/userCardList';
import { WebSocketProvider } from '../../../Context/WebSoketHook';
import { CustomContext } from '@/Context/UseCustomContext';
import { Button, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { FaArrowRotateRight } from 'react-icons/fa6';
import { SidebarContext } from '@/Context/CustomContext';
import AlertsTails from '@/Components/AlarmsState';
import useNotification from 'antd/es/notification/useNotification';
import { getCache, setCache } from '@/utils/cacheStore';
export default function NurseDashboard() {
  const [allDevicesList, setAllDevicesList] = useState('');
  const [allDevicesList2, setAllDevicesList2] = useState('');
  const [roomList, setRoomList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 30;
  const {
    totalResident,
    setTotalResident,
    setActiveAlerts,
    activeAlerts,
    selectedEvents,
    setSelectedEvents,
    setNotVisitedRoom,
    notVisitedRoom,
    notVisitRoomCount,
    setNotVisitRoomCount,
    offlineRoomCount,
    setOfflineRoomCount,
  } = useContext(SidebarContext);
  const { resolvedAlarm, setResolvedAlarm } = useContext(SidebarContext);
  const { notificationEvent } = useNotification();
  const ROOM_LIST_CACHE_KEY = 'roomListCache';
  const ALL_UIDS_CACHE_KEY = 'allUIDsCache';

  const getRoomListData = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        // only load cache for the first page & not append
        if (pageNum === 1 && !append) {
          const cached = localStorage.getItem(ROOM_LIST_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            const now = Date.now();
            if (now - parsed.timestamp < 24 * 60 * 60 * 1000) {
              setRoomList(parsed.data);
              setTotalResident(parsed.totalResident || 0);
              setNotVisitRoomCount(parsed.notVisitRoomCount || 0);
            }
          }
        }

        setLoadingData(true);
        const res = await getElderliesPriority({ page: pageNum, limit });

        setTotalResident(res?.total || 0);

        const getPriorityRoom = (rooms) => {
          const priorities = [2, 1, 3, 4];
          for (const type of priorities) {
            const room = rooms.find((r) => r?.room_type === type && r?.device_no);
            if (room) return room;
          }
          return rooms.find((r) => r?.device_no) || '';
        };

        const refineData = res.data.map((item) => {
          const deviceC = getPriorityRoom(item.rooms);

          return {
            id: item._id,
            name: item.name || `N/A`,
            room: item.room_no || `N/A`,
            visit_count: item.visit_count || 0,
            room_id: deviceC?._id,
            is_device_bind: deviceC?.is_device_bind || false,

            sleepScore: Math.floor(Math.random() * 100),
            emergency_contacts: item.emergency_contacts || [],
            deviceCode: deviceC?.device_no,
            rooms: (item.rooms || [])
              .filter((room) => room.device_no && room.device_no.trim() !== '')
              .map((room) => ({
                room: room.name || `N/A`,
                device_no: room.device_no,
                room_no: item.room_no,
                room_type: room.room_type,
                id: room._id,
                is_device_bind: room.is_device_bind,
              })),
            currentAlertDetails: {
              ...getAlertInfoViaEventDetails(item?.alarms_data[0]),
              created_at: item?.alarms_data[0]?.created_at,
            },
            priority: item?.highest_priority,
            details: item?.rooms,
          };
        });

        setRoomList((prev) => (append ? [...prev, ...refineData] : refineData));
        const allDeviceUIDs = res.data
          .map((item) => {
            const deviceC = getPriorityRoom(item.rooms);
            return deviceC?.device_no || null;
          })
          .filter(Boolean);
        const offlineDevices = res.data.filter((item) => {
          const deviceC = getPriorityRoom(item.rooms);
          return deviceC?.is_device_bind === false;
        })?.length;
        setOfflineRoomCount(offlineDevices);
        const notVisitedRooms = res.data.filter(
          (item) => !item.visit_count || item.visit_count == 0
        )?.length;
        setNotVisitRoomCount(notVisitedRooms || 0);
        setAllDevicesList2(allDeviceUIDs.join(','));
        localStorage.setItem(
          ROOM_LIST_CACHE_KEY,
          JSON.stringify({
            data: refineData,
            timestamp: Date.now(),
            totalResident: res?.total || 0,
            notVisitRoomCount: notVisitedRooms || 0,
          })
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingData(false);
      }
    },
    [resolvedAlarm, notificationEvent]
  );

  const getNursingHomeUIDs = useCallback(async () => {
    try {
      const cachedUIDs = getCache(ALL_UIDS_CACHE_KEY);
      if (cachedUIDs) {
        setAllDevicesList(cachedUIDs);
      }

      const res = await getAllUIDs();
      const uids = res.data
        ?.map((item) => item?.uid)
        .filter(Boolean)
        .join(',');

      setAllDevicesList(uids);

      setCache(ALL_UIDS_CACHE_KEY, uids);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getRoomListData(1);
    getNursingHomeUIDs();
  }, [getRoomListData]);
  const handleLoadMore = () => {
    if (roomList.length < totalResident) {
      const nextPage = page + 1;
      setPage(nextPage);
      getRoomListData(nextPage, true);
    }
  };
  console.log('device list========>', allDevicesList2, '2========>', allDevicesList);

  return (
    <WebSocketProvider deviceId={[allDevicesList].filter(Boolean).join(',')}>
      <CustomContext.Provider
        value={{
          selectedEvents,
          setSelectedEvents,
          setActiveAlerts,
          activeAlerts,
          totalResident,
          setNotVisitedRoom,
          notVisitedRoom,
          notVisitRoomCount,
        }}
      >
        <div className='w-full bg-[#F4F4F4] h-[calc(100svh-100px)] flex flex-col items-start font-poppins relative '>
          <div className='p-[20px] w-full flex lg:flex-nowrap flex-wrap gap-2 lg:gap-8 sticky top-0 bg-gradient-to-b from-[#F4F4F4] via-[#F4F4F4]/70 to-[#F4F4F4]/10 z-50'>
            <div className='lg:w-[60%] w-[100%]'>
              <CurrentActivityOverview />
            </div>
            <div className='lg:w-[40%] w-[100%]'>
              <AlertsTails />
            </div>
          </div>

          <div className='w-full p-5 pt-1 h-[calc(100svh-100px)] overflow-auto'>
            {/* <div className="header flex justify-between w-full items-center gap-2">
              <h2 className="font-semibold text-[21px] flex-shrink-0">
                All Rooms
              </h2>
              <div className="h-[1px] w-full bg-slate-100"></div>
            </div> */}

            <UserCardList
              users={roomList}
              selectedEvents={selectedEvents}
              loading={loadingData && roomList.length === 0}
              isActiveAlertsSelect={activeAlerts}
              notVisitedRoom={notVisitedRoom}
            />
          </div>

          {/* Floating Load More Button */}
          {roomList.length < totalResident && (
            <div className='absolute bottom-6 left-1/2 -translate-x-1/2'>
              <Button
                shape='round'
                onClick={handleLoadMore}
                disabled={loadingData}
                className='shadow-lg'
              >
                {loadingData ? (
                  <Spin size='small' />
                ) : (
                  <div className='flex items-center justify-center gap-2'>
                    Load More <FaArrowRotateRight size={12} />
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </CustomContext.Provider>
    </WebSocketProvider>
  );
}
