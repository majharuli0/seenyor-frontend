import React, { useState, useEffect, useMemo } from 'react';
import BreadcrumbUI from '@/MonitoringService/Components/common/breadcrumb';
import BrandingWhiteLabel from '@/MonitoringService/Components/BrandingWhiteLabel';
import APIAndWebhooks from '@/MonitoringService/Components/APIAndWebhooks';
import { usePermission } from '@/MonitoringService/store/usePermission';
import { FcEmptyBattery } from 'react-icons/fc';
import { Inbox } from 'lucide-react';

export default function Settings() {
  const { can } = usePermission();
  const tabs = useMemo(() => {
    return [
      can('branding_setting_access') && {
        value: 'branding',
        label: 'Branding & White-Label',
        content: <BrandingWhiteLabel />,
      },
      can('api_and_webhook_access') && {
        value: 'api',
        label: 'API & Webhooks',
        content: <APIAndWebhooks />,
      },
    ].filter(Boolean);
  }, [can]);

  const [active, setActive] = useState(null);

  useEffect(() => {
    if (tabs.length > 0 && !active) {
      setActive(tabs[0].value);
    }
  }, [tabs, active]);

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6'>
        <Navigation />
      </div>

      <div className='flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]'>
        {tabs.length > 0 && (
          <div className='w-full lg:w-72 bg-card p-3 rounded-xl overflow-x-auto lg:overflow-visible'>
            <nav aria-label='Settings tabs' className='flex lg:flex-col gap-2 min-w-max lg:min-w-0'>
              {tabs.map((t) => {
                const isActive = t.value === active;
                return (
                  <div
                    key={t.value}
                    onClick={() => setActive(t.value)}
                    aria-selected={isActive}
                    role='tab'
                    className={`relative flex items-center whitespace-nowrap text-left px-4 py-2 rounded-lg cursor-pointer transition text-sm sm:text-base
                      ${
                        isActive
                          ? 'bg-background border border-primary text-foreground font-medium'
                          : 'hover:bg-background/50 border border-transparent text-muted-foreground'
                      }`}
                  >
                    {t.label}
                  </div>
                );
              })}
            </nav>
          </div>
        )}

        <div className='flex-1 bg-card p-4 sm:p-6 rounded-xl shadow-sm overflow-auto flex items-start justify-center'>
          {tabs.length === 0 ? (
            <div className='text-muted-foreground text-sm animate-fade-in h-full flex items-center justify-center'>
              <div className='flex flex-col items-center justify-center'>
                <Inbox size={34} />
                <p className='text-sm mt-2'>You do not have any access to this feature.</p>
              </div>
            </div>
          ) : (
            tabs.map((t) =>
              t.value === active ? (
                <section
                  key={t.value}
                  role='tabpanel'
                  aria-labelledby={`tab-${t.value}`}
                  className='animate-fade-in w-full bg-card'
                >
                  {t.content}
                </section>
              ) : null
            )
          )}
        </div>
      </div>

      <style>{`
        .animate-fade-in { 
          animation: fadeIn 0.25s ease-out; 
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const Navigation = () => (
  <div className='flex flex-col items-start gap-2'>
    <h1 className='text-foreground text-lg sm:text-xl font-semibold'>Settings</h1>
    <div className='opacity-80 text-sm'>
      <BreadcrumbUI />
    </div>
  </div>
);
