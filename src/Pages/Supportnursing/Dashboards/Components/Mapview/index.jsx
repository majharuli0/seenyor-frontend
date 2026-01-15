import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LuNavigation } from 'react-icons/lu';
import HomePinIcon from '@/assets/icon/HomePin.svg';
import { useNavigate } from 'react-router-dom';
import { getAlertList } from '@/api/elderlySupport';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import dayjs from 'dayjs';
import { getAlertType } from '@/utils/helper';
import { useNotification } from '@/Context/useNotification';
import { SidebarContext } from '@/Context/CustomUsertable';
// Custom pin icons for different statuses
const getIcon = (status) => {
  const colorClasses = {
    critical: 'bg-red-500',
    warning: 'bg-yellow-500',
    problem: 'bg-blue-500',
  };

  const animationClasses = {
    critical: 'animate-ping-critical',
    warning: 'animate-ping-warning',
    problem: 'animate-ping-problem',
  };

  return L.divIcon({
    className: '',
    html: `
      <div class="relative flex justify-center items-center">
        <div class="${animationClasses[status]} absolute h-8 w-8 rounded-full ${colorClasses[status]} opacity-75"></div>
        <div class="scale-150 h-3 w-4 ${colorClasses[status]} rounded-full"></div>
      </div>
    `,
  });
};

function MapView({ height = 490 }, ref) {
  const navigate = useNavigate();
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
  };
  const [alertList, setAlertList] = useState([]);
  const { notificationEvent } = useNotification();

  function getAlertListData() {
    console.log('referes');

    getAlertList({
      to_date: '2025-05-25',
      from_date: dayjs().format('YYYY-MM-DD'),
      is_resolved: false,
      lookup: false,
      event: [2, 3, 5, 9, 8].join(','),
      alarm_type: [11, 12, 14, 15, 16, 1, 3, 13, 2].join(','),
      is_online: 1,
      recovery: 0,
    })
      .then((res) => {
        if (res.data.length > 0) {
          setAlertList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getAlertListData();
  }, []);
  useImperativeHandle(ref, () => ({
    getAlertListData,
  }));
  useEffect(() => {
    if (notificationEvent) {
      getAlertListData();
    }
  }, [notificationEvent]);
  // Group alerts by elderly_id and sort by priority
  const groupedAlerts = Object.values(
    alertList.reduce((acc, alert) => {
      if (!acc[alert.elderly_id]) {
        acc[alert.elderly_id] = [];
      }
      acc[alert.elderly_id].push(alert);
      return acc;
    }, {})
  ).reduce((acc, alerts) => {
    // Sort alerts by priority: Critical > Warning > Problem
    const priorityOrder = { Critical: 3, Warning: 2, Problem: 1 };
    alerts.sort((a, b) => priorityOrder[getAlertType(b)] - priorityOrder[getAlertType(a)]);
    acc[alerts[0].elderly_id] = alerts;
    return acc;
  }, {});

  // Function to determine the highest-priority alert type
  const getHighestPriorityType = (alerts) => {
    const priorityOrder = { Critical: 3, Warning: 2, Problem: 1 };
    return alerts
      .reduce((highest, alert) => {
        const type = getAlertType(alert);
        return priorityOrder[type] > priorityOrder[highest] ? type : highest;
      }, 'Problem')
      .toLowerCase();
  };

  return (
    <div className='w-full !z-0' style={{ height: height + 'px' }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={2}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        className='!w-full rounded-[8px] overflow-hidden !outline-none z-0'
      >
        <TileLayer
          url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Single loop through grouped alerts with prioritized alert type */}
        {Object.entries(groupedAlerts).map(([elderlyId, alerts]) => (
          <Marker
            key={elderlyId}
            position={[alerts[0].latitude || 0, alerts[0].longitude || 0]}
            icon={getIcon(getHighestPriorityType(alerts))}
          >
            <style>
              {`
                .slick-dots {
                  margin-bottom: 20px;
                }
              `}
            </style>
            <Popup className='w-[350px] !drop-shadow-2xl shadow-none !pb-6'>
              <Slider {...sliderSettings}>
                {alerts.map((alert, index) => (
                  <div key={index} className='!flex w-full flex-col !gap-6 font-baloo pt-2 pb-4'>
                    <div className='flex font-baloo cursor-pointer'>
                      <div
                        className='flex flex-col w-full'
                        onClick={() => {
                          navigate('/support-nurnt/dashboard/alarm-detail', {
                            state: { alertData: alert, id: alert?.elderly_id },
                          });
                        }}
                      >
                        <h1 className='font-bold text-xl text-text-primary'>
                          {alert.elderly_name}
                        </h1>
                        <span className='font-normal text-base text-text-primary'>
                          Age: <b>{alert.age || '-'}</b>
                        </span>
                      </div>
                      <div
                        className={`p-4 py-3 leading-none font-semibold text-base h-fit ${
                          getAlertType(alert) === 'Critical'
                            ? 'bg-red-100 text-red-500'
                            : getAlertType(alert) === 'Warning'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-blue-100 text-blue-500'
                        } w-fit text-nowrap rounded-full flex items-center justify-center capitalize`}
                      >
                        {getAlertType(alert) === 'Critical'
                          ? 'Critical Alert'
                          : getAlertType(alert) === 'Warning'
                            ? 'Warning Alert'
                            : 'Problem Alert'}
                      </div>
                    </div>
                    <div className='flex flex-col items-center justify-center cursor-pointer'>
                      <h1 className='font-bold text-2xl text-text-primary !m-0'>
                        {alert.room_name || '-'}
                      </h1>
                      <p className='font-normal text-lg text-text-primary !m-0'>
                        Location of Incident
                      </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-start gap-2'>
                        <img width={22} height={22} src={HomePinIcon} alt='' />
                        <p className='!m-0 !mt-[2px] font-medium text-base text-text-primary/80'>
                          {alert.address || '-'}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <a
                          href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-base font-medium !text-blue-500'
                        >
                          View on Google Maps
                        </a>
                        <LuNavigation size={18} className='text-blue-500' />
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
export default forwardRef(MapView);
