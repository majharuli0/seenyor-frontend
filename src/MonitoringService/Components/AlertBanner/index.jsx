import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../ui/spinner';
import { getAlertInfoViaEventDetails } from '@/utils/helper';
import { PiHandPointingBold } from 'react-icons/pi';
import Modal from '../common/modal';
import { useAlertPick } from '@/MonitoringService/hooks/useAlert';
import { useUserStore } from '@/MonitoringService/store/useUserStore';
export const AlertBanner = ({ alerts = [] }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedId = id ? id : null;
  const [visible, setVisible] = useState(false);
  const { mutate: pickAlert, isPending, isSuccess } = useAlertPick();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [user, serUser] = useState(null);

  const { getUser } = useUserStore();
  const token = localStorage.getItem('token');

  useEffect(() => {
    serUser(getUser);
  }, [token]);

  useEffect(() => {
    if (selectedId && alerts.length > 0) {
      const index = alerts.findIndex((a) => {
        return a?._id === selectedId;
      });
      if (index !== -1) setCurrentIndex(index);
    }
  }, [selectedId, alerts]);

  const alert = alerts[currentIndex];

  useEffect(() => {
    const updateTimer = () => {
      if (!alert?.created_at) return;

      const alertTime = new Date(alert?.created_at);
      const now = new Date();
      const diffMs = now - alertTime;
      const diffSec = Math.floor(diffMs / 1000);

      if (diffSec < 60) {
        setTimeLeft(`${diffSec}s`);
      } else if (diffSec < 3600) {
        const m = Math.floor(diffSec / 60);
        const s = diffSec % 60;
        setTimeLeft(`${m}m ${s}s`);
      } else if (diffSec < 86400) {
        const h = Math.floor(diffSec / 3600);
        const m = Math.floor((diffSec % 3600) / 60);
        setTimeLeft(`${h}h ${m}m`);
      } else {
        const h = Math.floor(diffSec / 3600);
        const m = Math.floor((diffSec % 3600) / 60);
        setTimeLeft(`${h}h ${m}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [alert]);

  const handleNavigate = (index) => {
    navigate(`/ms/dashboard/alert/${alerts[index]._id}`);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const newIndex = currentIndex === 0 ? alerts.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    handleNavigate(newIndex);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const newIndex = currentIndex === alerts.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    handleNavigate(newIndex);
  };

  if (!alerts.length) return null;

  return (
    <div className='flex items-center justify-between w-full bg-[#CD3939] text-white rounded-2xl p-4 sm:p-4 shadow-md rounded-b-none transition-all '>
      <div className='flex items-center gap-3 sm:gap-4 overflow-hidden'>
        <div
          className='relative w-16 h-16 flex items-center justify-center rounded-full bg-red-700'
          title={`Alert since: ${new Date(alert?.created_at).toLocaleString()}`}
        >
          <span
            className={`font-bold text-center truncate max-w-[45px] sm:max-w-[55px] ${
              timeLeft.includes('s') && !timeLeft.includes('m')
                ? 'text-sm sm:text-base'
                : 'text-xs sm:text-xs'
            }`}
          >
            {timeLeft}
          </span>

          <Spinner variant='circle' className='absolute t-0 text-red-500 size-[70px] ' />
        </div>

        <div className='max-w-[60vw] sm:max-w-[70vw]'>
          <h3
            className='text-base sm:text-base md:text-lg font-medium truncate '
            title={getAlertInfoViaEventDetails(alert)?.title}
          >
            {getAlertInfoViaEventDetails(alert)?.title}{' '}
            <span className='font-medium text-sm italic'>
              {' '}
              •{' '}
              {alert?.picked_by
                ? alert?.picked_by?.picked_by_id == user?._id
                  ? 'Picked by you'
                  : `Picked by ${alert?.picked_by?.picked_by || ''}`
                : 'No Picked up'}
            </span>
          </h3>
          <p
            className='text-xs sm:text-xs md:text-sm text-white/80 truncate'
            title={new Date(alert?.created_at).toLocaleString()}
          >
            {new Date(alert?.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-2 sm:gap-3'>
        {!alert?.picked_by && user?.role !== 'monitoring_agency' && (
          <button
            onClick={() => setVisible(true)}
            className='bg-red-700 hover:bg-red-800 p-2.5 rounded-md px-4 sm:rounded-xl transition text-sm flex items-center gap-2'
          >
            <PiHandPointingBold className='w-5 h-5 ' />
            Pick Alert
          </button>
        )}
        <button
          onClick={handlePrev}
          className='bg-red-700 hover:bg-red-800 p-2 rounded-lg sm:rounded-xl transition'
        >
          <ChevronLeft className='w-5 h-5 sm:w-6 sm:h-6' />
        </button>

        <span className='text-xs sm:text-sm md:text-base font-medium text-white/90 min-w-[40px] text-center'>
          {currentIndex + 1}/{alerts.length}
        </span>

        <button
          onClick={handleNext}
          className='bg-red-700 hover:bg-red-800 p-2 rounded-lg sm:rounded-xl transition'
        >
          <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6' />
        </button>
      </div>

      <Modal
        isVisible={visible}
        setIsVisible={setVisible}
        okText='Yes, Confirm'
        title='Confirm Resolution'
        description='are you sure you want to pick this alert?'
        onOk={async () => {
          await pickAlert(id);
        }}
        onCancel={() => console.log('Cancelled')}
      >
        {/* <p>This action cannot be undone.</p> */}
      </Modal>
    </div>
  );
};
