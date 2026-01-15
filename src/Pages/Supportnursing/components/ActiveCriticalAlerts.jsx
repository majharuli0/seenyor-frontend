import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getAlertList } from '@/api/elderlySupport';
import AlertCloseModal from '@/Components/ActiveAlerts/AlertCloseModal';
import CriticalAlertCard from '@/Components/CriticalAlertCard';
import { getAlertsGroup } from '@/utils/helper';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';

export default function ActiveCriticalAlerts({ elderlyId }) {
  const [alertList, setAlertList] = useState([]);
  const PRIORITY_GROUPS = ['Critical'];

  const getAlertListData = useCallback(async () => {
    const allAlerts = [];
    let remainingCount = 10;

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
          limit: remainingCount,
          lookup: false,

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
      console.log(alertList);
    }
  }, [getAlertListData, elderlyId]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    // Add these settings to ensure proper slide display
    centerMode: false,
    variableWidth: false,
    adaptiveHeight: true,
    appendDots: (dots) => (
      <div
        style={{
          backgroundColor: 'transparent',
          borderRadius: '10px',
          padding: '5px',
        }}
      >
        <ul id='dots' style={{ margin: '0px' }}>
          {dots}
        </ul>
      </div>
    ),
  };
  return (
    <>
      {alertList.length > 0 && (
        <div className='mb-4'>
          <Slider {...settings} className='w-full transition-all duration-300'>
            {alertList?.map((item, i) => {
              return (
                <CriticalAlertCard key={i + 1} item={item} onResolved={() => getAlertListData()} />
              );
            })}
          </Slider>
        </div>
      )}
    </>
  );
}
