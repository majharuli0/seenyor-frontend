import React, { useEffect } from 'react';
import { FiClipboard } from 'react-icons/fi';
import { toast } from 'sonner';
import Modal from '../common/modal';
import { useEmergencyNumbers } from '@/MonitoringService/hooks/useAlert';
import { Button } from '../ui/button';
import CallNoteSection from '../CallNoteSection';

export function EmergencyContactModal({ visible, setVisible, countryCode = 'bd' }) {
  const { data, isLoading, isError } = useEmergencyNumbers({ countryCode });
  const GLOBAL_DEFAULT_NUMBERS = {
    ambulance: ['112'],
    fire: ['112'],
    police: ['112'],
    country: { name: 'Global' },
  };

  if (isLoading) {
    return (
      <Modal isVisible={visible} setIsVisible={setVisible}>
        <div className='p-6 text-center text-sm text-text/60'>Loading...</div>
      </Modal>
    );
  }

  const { Ambulance, Fire, Police, Dispatch, Country } = data || {};

  const sections = [
    { label: 'Ambulance', numbers: Ambulance?.All?.filter((n) => n != null) || [] },
    { label: 'Fire', numbers: Fire?.All?.filter((n) => n != null) || [] },
    { label: 'Police', numbers: Police?.All?.filter((n) => n != null) || [] },
    { label: 'Emergency Center', numbers: Dispatch?.All?.filter((n) => n != null) || [] },
  ]
    .map((sec) => ({
      ...sec,
      // Use Dispatch only if section numbers are empty
      numbers: sec.numbers.length > 0 ? sec.numbers : Dispatch?.All?.filter((n) => n != null) || [],
    }))
    .filter((sec) => sec.numbers.length > 0);

  console.log(sections);
  if (isError || !data || !sections.length) {
    const fallback = GLOBAL_DEFAULT_NUMBERS;

    return (
      <Modal isVisible={visible} setIsVisible={setVisible} showFooter={false}>
        <div className='flex flex-col items-center text-center space-y-4'>
          <h2 className='text-xl font-semibold text-text'>
            Emergency Contacts — {fallback?.country?.name}
          </h2>
          <p className='text-sm text-text/70'>
            Failed to load local emergency contacts. Use the global emergency numbers instead:
          </p>

          <div className='w-full flex flex-col space-y-3'>
            {Object.entries(fallback).map(([key, numbers]) => {
              if (key === 'country') return null;
              return (
                <div
                  key={key}
                  className='flex items-center justify-between bg-background px-4 py-2 rounded-lg border border-border'
                >
                  <span className='text-base font-medium text-text/80'>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <div className='flex items-center space-x-2'>
                    {numbers.map((num) => (
                      <div
                        key={num}
                        className='flex items-center space-x-1 bg-white dark:bg-muted px-2 py-1 rounded-md border border-border'
                      >
                        <span className='text-lg font-bold text-red-600 select-all'>{num}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(num);
                            toast.success(`${num} copied!`);
                          }}
                          className='p-1 rounded-md hover:bg-red-100 transition'
                          title='Copy'
                        >
                          <FiClipboard className='text-red-500' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className='text-xs text-text/60 italic'>
            These numbers are globally recognized emergency numbers.
          </p>

          <CallNoteSection contactType={'emergency'} />
        </div>
      </Modal>
    );
  }
  return (
    <Modal
      isVisible={visible}
      setIsVisible={setVisible}
      onCancel={() => setVisible(false)}
      // footerButtons="cancel"
      showFooter={false}
    >
      <div className='flex flex-col items-center text-center space-y-4'>
        <h2 className='text-xl font-semibold text-text'>
          Emergency Contacts <span className='opacity-50'>•</span> {Country?.Name}
        </h2>
        <p className='text-sm text-text/70'>
          In case of an emergency, contact any of the following services:
        </p>

        <div className='w-full flex flex-col space-y-3'>
          {sections
            .filter((item) => item.numbers)
            .map((sec) => (
              <div
                key={sec.label}
                className='flex items-center justify-between bg-background px-4 py-2 rounded-lg border border-border'
              >
                <span className='text-base font-medium text-text/80'>{sec.label}</span>
                <div className='flex items-center space-x-2'>
                  {sec.numbers.map((num) => (
                    <div
                      key={num}
                      className='flex items-center space-x-1 bg-white dark:bg-muted px-2 py-1 rounded-md border border-border'
                    >
                      <span className='text-lg font-bold text-red-600 select-all'>{num}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(num);
                          toast.success(`${num} copied!`);
                        }}
                        className='p-1 rounded-md hover:bg-red-100 transition'
                        title='Copy'
                      >
                        <FiClipboard className='text-red-500' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <CallNoteSection contactType={'emergency'} />
        {/* <p className="text-xs text-text/60 italic">
          These numbers connect you directly to emergency services in{" "}
          {Country?.Name}.
        </p> */}
      </div>
    </Modal>
  );
}
