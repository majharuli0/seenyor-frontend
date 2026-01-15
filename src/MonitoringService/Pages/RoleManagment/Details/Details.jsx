import { AgentResolvedAlerts } from '@/MonitoringService/Components/AgentResolvedAlerts';
import BreadcrumbUI from '@/MonitoringService/Components/common/breadcrumb';
import CardUI from '@/MonitoringService/Components/common/card';
import CreateModal from '@/MonitoringService/Components/common/CreateAndEditModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/MonitoringService/Components/ui/avatar';
import { Button } from '@/MonitoringService/Components/ui/button';
import { Calendar } from '@/MonitoringService/Components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/MonitoringService/Components/ui/popover';
import { useStatisticsCountByAgent } from '@/MonitoringService/hooks/useAnalytics';
import { useUpdateUserRole, useUserDetails } from '@/MonitoringService/hooks/UseUser';
import { useAgentStore } from '@/MonitoringService/store/useAgentStore';
import { usePermission } from '@/MonitoringService/store/usePermission';
import { useSelectedItemStore } from '@/MonitoringService/store/useSelectedItemStore';
import { formatMilliseconds } from '@/utils/helper';
import dayjs from 'dayjs';
import { ArrowRight, CalendarIcon, Edit2, MailCheck, Phone } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function RoleManagmentDetails() {
  const { id } = useParams();
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [range, setRange] = React.useState({
    from: null,
    to: null,
  });
  const [agent, setAgent] = useState({});

  const { users, setSelectedAgent } = useAgentStore();
  const existingAgent = users.find((c) => c._id === id);
  const { setSelectedItem } = useSelectedItemStore();
  const [sla, setSLA] = useState(0);
  const [falseP, setFalseP] = useState(0);

  useEffect(() => {
    if (existingAgent) {
      setSelectedItem(`${existingAgent?.name} ${existingAgent?.last_name}`);
      setSelectedAgent(existingAgent);
      setAgent(existingAgent);
    }
  }, [existingAgent, setSelectedAgent, setSelectedItem]);

  const { data: fetchedAgent, isLoading } = useUserDetails(
    { id },
    {
      enabled: id ? true : false,
    }
  );
  useEffect(() => {
    if (fetchedAgent?.data) {
      setSelectedAgent(fetchedAgent?.data);
      setSelectedItem(`${fetchedAgent?.data?.name} ${fetchedAgent?.data?.last_name}`);
      setAgent(fetchedAgent?.data);
    }
  }, [fetchedAgent]);
  //====> Agent Statistical Count <====//
  const {
    data: countStatistics,
    isLoading: isAlertLoading,
    isError: isAlertError,
    isSuccess: isAlertSuccess,
    error: alertError,
  } = useStatisticsCountByAgent(
    {
      to_date: range.from || dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      from_date: range.to || dayjs().format('YYYY-MM-DD'),
      agent_id: id,
    },
    {
      enabled: id ? true : false,
    }
  );
  useEffect(() => {
    const total =
      (countStatistics?.data.count_less_sla ?? 0) + (countStatistics?.data.count_more_sla ?? 0);
    const p = total > 0 ? ((countStatistics?.data.count_less_sla ?? 0) / total) * 100 : 0;
    const total_alerts =
      (countStatistics?.data.total_true ?? 0) + (countStatistics?.data.total_false ?? 0);
    const devide = (countStatistics?.data.total_false ?? 0) / total_alerts;
    setSLA(p);
    setFalseP((devide ? devide : 0) * 100);
  }, [countStatistics, isAlertSuccess]);

  return (
    <div className='space-y-6'>
      <div
        id='customer_heading'
        className='flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center'
      >
        <Navigation />

        <div className='flex flex-wrap gap-2 items-center w-full sm:w-auto'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='tertiary'
                className='w-full sm:w-auto flex justify-between items-center'
              >
                <CalendarIcon className='mr-2' />
                {range?.from && range?.to ? (
                  `${range.from} - ${range.to}`
                ) : (
                  <div className='flex items-center gap-2 text-sm'>
                    <span>Start Date</span>
                    <ArrowRight className='w-4 h-4' />
                    <span>End Date</span>
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='overflow-hidden p-0 !w-[300px] sm:w-auto' align='end'>
              <Calendar
                className='w-full border-border'
                mode='range'
                selected={range}
                onSelect={(selectedRange) => {
                  if (!selectedRange?.from || !selectedRange?.to) {
                    setRange({ from: null, to: null });
                    return;
                  }

                  setRange({
                    from: dayjs(selectedRange.from).format('YYYY-MM-DD'),
                    to: dayjs(selectedRange.to).format('YYYY-MM-DD'),
                  });
                }}
                captionLayout='dropdown'
                fixedWeeks
                showOutsideDays
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row items-start gap-6'>
        <div className='w-full lg:w-[40%] bg-card rounded-2xl'>
          <AgentProfile data={agent} />
        </div>

        <div className='w-full lg:w-[60%] space-y-6'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4'>
            <TailsCard label='Total Alerts Handled' value={totalAlerts} />
            <TailsCard label='False Alert' value={falseP.toFixed(2) + '%'} />
            <TailsCard label='Avg. SLA Adherence' value={sla.toFixed(2) + '%'} />
            {/* <TailsCard
              label="Avg. Response Time"
              value={formatMilliseconds(
                countStatistics?.data?.avg_res_time || 0
              )}
            /> */}
          </div>

          <div>
            <AgentResolvedAlerts setTotalAlerts={setTotalAlerts} date_range={range} />
          </div>
        </div>
      </div>
    </div>
  );
}
const Navigation = () => {
  return (
    <>
      <div className='flex flex-col items-start gap-2 w-full'>
        <h1 className='text-text sm:text-xl text-lg'>Role Managment</h1>
        <div className='opacity-95'>
          <BreadcrumbUI />
        </div>
      </div>
    </>
  );
};

const TailsCard = ({ label = '', value = '', icon }) => {
  return (
    <div className='bg-card p-4 flex items-center justify-between gap-3 rounded-md w-full'>
      <div>
        <span className='text-sm'>{label}</span>
        <h1 className='text-lg font-semibold'>{value}</h1>
      </div>
    </div>
  );
};
const AgentProfile = ({ data = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const { can } = usePermission();
  const { mutate: updateDetails, isPending, isSuccess } = useUpdateUserRole();
  const handleSubmit = async (formData) => {
    delete formData.role;
    updateDetails(
      { id, data: formData },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );
  };

  const permissionsList = [
    // {
    //   id: "manageAgent",
    //   label: "Manage Agent",
    //   active: data?.monitoring_agency_access?.manage_agent || false,
    // },
    // {
    //   id: "agentRoleCreation",
    //   label: "Agent Role Creation",
    //   active: data?.monitoring_agency_access?.agent_role_creation || false,
    // },
    // {
    //   id: "deleteAgent",
    //   label: "Delete Agent",
    //   active: data?.monitoring_agency_access?.delete_agent || false,
    // },
    // {
    //   id: "slaSetting",
    //   label: "SLA Setting Access",
    //   active: data?.monitoring_agency_access?.sla_setting_access || false,
    // },
    {
      id: 'editCustomers',
      label: 'Edit Customers',
      active: data?.monitoring_agency_access?.edit_customer || false,
    },
    // {
    //   id: "brandingSetting",
    //   label: "Branding Setting Access",
    //   active: data?.monitoring_agency_access?.branding_setting_access || false,
    // },
    {
      id: 'pauseResumeCustomers',
      label: 'Pause / Resume Customers',
      active: data?.monitoring_agency_access?.pause_resume_customer || false,
    },
    // {
    //   id: "apiWebhook",
    //   label: "API and Webhook Access",
    //   active: data?.monitoring_agency_access?.api_and_webhook_access || false,
    // },
    {
      id: 'deactivateCustomers',
      label: 'Deactivate Customers',
      active: data?.monitoring_agency_access?.deactive_customers || false,
    },
    // {
    //   id: "billingUsage",
    //   label: "Billing and Usage Access",
    //   active: data?.monitoring_agency_access?.billing_and_usage_access || false,
    // },
  ];

  return (
    <div className='bg-card rounded-2xl p-4 sm:p-6 w-full flex flex-col items-center text-center shadow-sm relative'>
      {can('agent_role_creation') && (
        <Button
          onClick={() => setIsModalOpen(true)}
          variant='secondary'
          className='absolute top-3 right-3  shadow-sm bg-background'
        >
          <Edit2 className='w-4 h-4' />
          Edit
        </Button>
      )}
      <div className='relative'>
        <Avatar className='w-24 h-24 border-2 border-border'>
          <AvatarImage src='https://via.placeholder.com/100' alt='Agent' />
          <AvatarFallback>{`${data?.name?.split('', 1) || ''}${
            data?.last_name?.split('', 1) || ''
          }`}</AvatarFallback>
        </Avatar>
      </div>

      <h3 className='mt-4 text-lg font-semibold text-foreground'>
        {`${data?.name || ''} ${data?.last_name || ''}`}
      </h3>
      <p className='text-sm text-muted-foreground mb-4'>Monitoring Agent</p>

      <div className='grid md:grid-cols-2 grid-cols-1  gap-2 text-sm text-muted-foreground w-full mb-4'>
        <div className='flex justify-center items-center gap-2 bg-background rounded-md p-2 px-4'>
          <MailCheck className='w-4 h-4 text-foreground' />
          <span>{`${data?.email || ''}`}</span>
        </div>
        <div className='flex justify-center items-center gap-2 bg-background rounded-md p-2 px-4'>
          <Phone className='w-4 h-4 text-foreground ' />
          <span className='text-nowrap'>
            {' '}
            {`${data?.contact_code || ''} ${data?.contact_number || ''}`}
          </span>
        </div>
      </div>

      <div className='flex justify-between w-full text-xs text-muted-foreground mb-4'>
        <div className='flex flex-col items-start'>
          <span className='text-sm font-medium text-foreground'>Created on</span>
          <span className='text-base'>
            {new Date(data?.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className='w-full border-t border-border pt-4 text-left'>
        <h4 className='text-sm font-medium mb-3 text-foreground'>Access</h4>
        <ul className='space-y-3 text-sm text-muted-foreground'>
          {permissionsList.map((perm) => (
            <li key={perm.id} className='flex items-center gap-2'>
              <span
                className={`h-2 w-2 rounded-full ${
                  perm.active ? 'bg-blue-500' : 'dark:bg-background bg-card-300'
                }`}
              ></span>
              <span className={`${perm.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {perm.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {isModalOpen && (
        <CreateModal
          isVisible={isModalOpen}
          setVisible={setIsModalOpen}
          isLoading={isPending}
          mode='edit'
          isHeader={false}
          editData={data}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
