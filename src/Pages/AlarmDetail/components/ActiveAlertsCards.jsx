import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
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
  getAlertInfoViaEvent,
  getAlertsGroup,
} from '@/utils/helper';
import { useNavigate } from 'react-router-dom';
import AutoUpdatingDuration from '@/Components/AutoUpdatingDuration/AutoUpdatingDuration';
import { FaUserCircle } from 'react-icons/fa';
import { useNotification } from '@/Context/useNotification';

export default function ActiveAlertsCards({
  elderlyId = '',
  isElderlyVisible = false,
  alertData = {},
}) {
  const { notificationEvent } = useNotification();
  const [openAlertCloseModal, setOpenAlertCloseModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertList, setAlertList] = useState([]);
  const PRIORITY_GROUPS = ['Critical', 'Warning'];
  const navigate = useNavigate();
  console.log(alertData);

  const getAlertListData = useCallback(async () => {
    const allAlerts = [];
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
          elderly_id: elderlyId,
          lookup: false,
          limit: remainingCount,
          ...groupParams,
        });

        const fetchedAlerts = response.data || [];
        allAlerts.push(...fetchedAlerts);
        remainingCount -= fetchedAlerts.length;

        if (remainingCount <= 0) break;
      } catch (err) {
        console.error(`Error fetching ${group} alerts:`, err);
      }
    }

    setAlertList(allAlerts);
  }, [elderlyId]);

  useEffect(() => {
    if (elderlyId) {
      getAlertListData();
    }
  }, [getAlertListData, elderlyId]);
  useEffect(() => {
    if (alertData) {
      setAlertList([alertData]);
    }
  }, [alertData]);

  useEffect(() => {
    if (notificationEvent) {
      getAlertListData();
    }
  }, [getAlertListData, notificationEvent]);
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
          slidesToShow: 1,
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

  return (
    <div>
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
                  } p-4 flex justify-between items-center`}
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
                  <div id='rightSide' className='z-50'>
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
                  <img src={AlertBG} alt='' className='absolute top-0 right-0 x-0' />
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
        }}
      />
    </div>
  );
}
