import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AlertCloseModal from '@/Components/ActiveAlerts/AlertCloseModal';
import AlertBG from '@/assets/AlertBGABS.svg';
import { getAlertList } from '@/api/elderlySupport';
import dayjs from 'dayjs';
import {
  getAlertType,
  transformDateAndTime,
  transformDateAndTimeToDuration,
  getAlertInfoViaEvent,
  getAlertsGroup,
} from '@/utils/helper';
import AutoUpdatingDuration from '@/Components/AutoUpdatingDuration/AutoUpdatingDuration';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SidebarContext } from '@/Context/CustomContext';
import { useNotification } from '@/Context/useNotification';

export default function ActiveAlertsCards({
  refreshAlertList,
  isElderlyVisible = false,
  isAlarmViewBtn = false,
}) {
  const { setModalDataList, modalDataList } = useContext(SidebarContext);
  const [openAlertCloseModal, setOpenAlertCloseModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertList, setAlertList] = useState([]);
  const PRIORITY_GROUPS = ['Critical'];
  const navigate = useNavigate();
  const { notificationEvent } = useNotification();

  const prevAlertListLength = useRef(0);
  const getAlertListData = useCallback(async () => {
    let allAlerts = [];
    let remainingCount = 30;

    for (const group of PRIORITY_GROUPS) {
      if (remainingCount <= 0) break;

      const groupParams = getAlertsGroup(group);
      if (!groupParams) continue;

      try {
        const response = await getAlertList({
          to_date: '2024-11-30',
          from_date: dayjs().format('YYYY-MM-DD'),
          is_resolved: false,
          limit: remainingCount,
          lookup: false,

          ...groupParams,
        });

        const fetchedAlerts = response.data || [];
        allAlerts = [...allAlerts, ...fetchedAlerts];
        remainingCount -= fetchedAlerts.length;

        if (remainingCount <= 0) break;
      } catch (err) {
        console.error(`Error fetching ${group} alerts:`, err);
      }
    }
    // Check if the new alert list length is greater than the previous one
    if (allAlerts.length > prevAlertListLength.current) {
      refreshAlertList();
    }

    // Update the previous length
    prevAlertListLength.current = allAlerts.length;
    setAlertList(allAlerts);
    // setAlertList([
    //   {
    //     event: 2,
    //   },
    // ]);
  }, [PRIORITY_GROUPS, refreshAlertList]);

  useEffect(() => {
    getAlertListData();
  }, [getAlertListData]);

  const settings = {
    dots: alertList.length >= 2,
    infinite: alertList.length > 2,
    speed: 500,
    slidesToShow: alertList.length === 1 ? 1 : 2,
    slidesToScroll: 1,
    draggable: true,
    arrows: false,
    appendDots: (dots) => (
      <div
        style={{
          backgroundColor: 'transparent',
          borderRadius: '10px',
          padding: '2px',
        }}
      >
        <ul id='dots' style={{ margin: '0px' }}>
          {dots}
        </ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: alertList.length === 1 ? 1 : 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 800,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const handleViewClick = (row) => {
    window.scrollTo(0, 0);
    navigate(`/supporter/elderlies/elderly-profile/${row.elderly_id}?tab=overview`);
  };
  useEffect(() => {
    if (notificationEvent) {
      getAlertListData();
    }
  }, [notificationEvent]);
  return (
    <>
      {alertList.length > 0 && (
        <div id='ActiveAlertsCards' className='w-full mb-2 transition-all duration-300'>
          <Slider {...settings} className='w-full transition-all duration-300'>
            {alertList.map((item, index) => (
              <div
                key={index}
                className='px-2 overflow-hidden transition-all duration-300 relative w-full'
              >
                <div
                  id='alertItem'
                  className={`rounded-2xl overflow-hidden w-full ${
                    getAlertInfoViaEvent(item)?.label === 'Critical'
                      ? 'bg-red-500'
                      : getAlertInfoViaEvent(item)?.label === 'Warning'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                  } p-4 w-full flex justify-between items-center`}
                >
                  <div id='leftSide' className='z-50'>
                    <div id='alertItemHeader'>
                      <div id='alertItemTitleAndDescription' className='flex flex-col gap-6'>
                        <div id='time' className='flex gap-2'>
                          {isElderlyVisible && (
                            <span
                              onClick={() => handleViewClick(item)}
                              className='bg-white font-semibold p-1 px-2 pl-1 rounded-full text-text-primary flex items-center gap-2 cursor-pointer hover:opacity-90'
                            >
                              <FaUserCircle size={22} style={{ opacity: '0.8' }} />
                              {item?.elderly_name}
                            </span>
                          )}
                          <span className='bg-white font-semibold p-1 px-2 rounded-full text-text-primary flex items-center gap-2'>
                            <div
                              id='dot'
                              className={`w-2 h-2 ${
                                getAlertInfoViaEvent(item)?.label === 'Critical'
                                  ? 'bg-red-500'
                                  : getAlertInfoViaEvent(item)?.label === 'Warning'
                                    ? 'bg-yellow-500'
                                    : 'bg-blue-500'
                              } rounded-full animate-ping`}
                            ></div>
                            {transformDateAndTime(item.created_at)}
                          </span>
                          <span className='bg-white font-semibold p-1 px-2 rounded-full text-text-primary'>
                            <AutoUpdatingDuration date={item.created_at} />
                          </span>
                        </div>
                        <div id='alertItemTitleAndDescription'>
                          <h1 className='text-xl font-bold text-white m-0'>
                            {getAlertInfoViaEvent(item)?.title}
                          </h1>
                          <p className='text-white text-base m-0 leading-none'>
                            {getAlertInfoViaEvent(item)?.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isAlarmViewBtn ? (
                    <div id='btn' className='z-50 w-fit'>
                      <span
                        onClick={() => {
                          setSelectedAlert(item);
                          navigate('/support-nurnt/dashboard/alarm-detail', {
                            state: { alertData: item, id: item?.elderly_id },
                          });
                        }}
                        className='text-sm p-2 px-3 bg-white rounded-xl text-text-primary cursor-pointer hover:bg-white/90 transition-all duration-300 text-nowrap'
                      >
                        View Alert
                      </span>
                    </div>
                  ) : (
                    <div id='rightSide' className='z-50 w-fit'>
                      <span
                        onClick={() => {
                          setSelectedAlert(item);
                          setOpenAlertCloseModal(true);
                        }}
                        className='text-sm p-2 px-3 bg-white rounded-xl text-text-primary cursor-pointer hover:bg-white/90 transition-all duration-300 text-nowrap'
                      >
                        Mark as Complete
                      </span>
                    </div>
                  )}

                  <img src={AlertBG} alt='' className='absolute top-0 right-0' />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
      <AlertCloseModal
        openAlertCloseModal={openAlertCloseModal}
        setOpenAlertCloseModal={setOpenAlertCloseModal}
        selectedAlert={selectedAlert}
        getAlertListDatas={() => {
          getAlertListData();
          refreshAlertList();
        }}
      />
    </>
  );
}
