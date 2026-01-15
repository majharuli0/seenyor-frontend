import { useNavigate, useParams } from 'react-router-dom';
import { MdNotificationsActive } from 'react-icons/md';
import { BiSolidBellOff } from 'react-icons/bi';
import { TbUnlink } from 'react-icons/tb';
import BreadcrumbUI from '@/MonitoringService/Components/common/breadcrumb';
import { Button } from '@/MonitoringService/Components/ui/button';
import { ButtonGroup } from '@/MonitoringService/Components/ui/button-group';
import useMediaQuery from '@/MonitoringService/hooks/useMediaQuery';
import { CustomerDetailsLiveMap } from '@/MonitoringService/Components/CusLiveMap';
import { PreviousAlarmLogs } from '@/MonitoringService/Components/PreviousAlarmLogs';
import { CustomerProfileCard } from '@/MonitoringService/Components/CustomerProfileCard';
import { useEffect, useState } from 'react';
import { useCustomerStore } from '@/MonitoringService/store/useCustomerStore';
import { useCustomersDetails, useDeactivatedCustomer } from '@/MonitoringService/hooks/useCustomer';
import Modal from '@/MonitoringService/Components/common/modal';
import { UploadIcon } from 'lucide-react';
import { useSelectedItemStore } from '@/MonitoringService/store/useSelectedItemStore';
import { usePermission } from '@/MonitoringService/store/usePermission';

export default function CustomersDetails() {
  const { can } = usePermission();

  const navigate = useNavigate();
  const { id, type } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customer, setCustomer] = useState({});
  const isSmallScreen = useMediaQuery('(max-width: 1200px)');
  const { customers, setSelectedCustomer } = useCustomerStore();
  const existingCustomer = customers.find((c) => c._id === id);
  const { setSelectedItem } = useSelectedItemStore();

  useEffect(() => {
    if (existingCustomer) {
      setSelectedItem(existingCustomer?.name);
      setSelectedCustomer(existingCustomer);
      setCustomer(existingCustomer);
    }
  }, [existingCustomer]);
  const { mutate: deactivate, isPending, isSuccess, isError } = useDeactivatedCustomer();
  const { data: fetchedCustomer, isLoading } = useCustomersDetails(
    { id },
    {
      // enabled: !existingCustomer,
    }
  );
  useEffect(() => {
    if (fetchedCustomer?.data) {
      setSelectedCustomer(fetchedCustomer.data);
      setCustomer(fetchedCustomer.data);
    }
  }, [fetchedCustomer]);
  function handleDeactivate() {
    if (customer?._id) {
      deactivate({
        id: customer._id,
        data: { monitoring_agency_status: 'deactivate' },
      });
    }
  }
  function handleReactivate() {
    if (customer?._id) {
      deactivate({
        id: customer._id,
        data: { monitoring_agency_status: 'active' },
      });
    }
  }
  useEffect(() => {
    if (!isModalOpen) {
      if (isPending) return;
      if (isSuccess) {
        navigate('/ms/customers');
      }
    }
  }, [isModalOpen, isPending, isSuccess]);
  return (
    <>
      <div className='flex justify-between items-center mb-6 flex-wrap gap-6'>
        <Navigation customerName={customer.name || customer.id || id} id={id} />
        {can('pause_resume_customer') && (
          <ButtonGroup className='mx-auto sm:m-0'>
            <Button
              size='default'
              variant={type === 'active' ? '' : 'outline'}
              disabled={type === 'active' || isPending || isSuccess}
              onClick={() => setIsModalOpen(true)}
            >
              <MdNotificationsActive className='mr-1' />
              Active
            </Button>

            <Button
              size='default'
              variant={type === 'paused' ? '' : 'outline'}
              disabled={type === 'paused' || isPending || isSuccess}
              onClick={() => setIsModalOpen(true)}
            >
              <BiSolidBellOff className='mr-1' />
              Paused
            </Button>
            <Button
              size='default'
              variant={type === 'deactivated' ? 'destructive' : 'outline'}
              disabled={type === 'deactivated' || isPending || isSuccess}
              onClick={() => setIsModalOpen(true)}
            >
              <TbUnlink className='mr-1' />
              Deactivated
            </Button>
          </ButtonGroup>
        )}
      </div>

      <div className={`flex  ${isSmallScreen ? 'flex-col' : 'flex-row'}  gap-6 mb-6`}>
        <div className={`${isSmallScreen ? 'w-[100%]' : 'w-[30%]'} space-y-4`}>
          <CustomerProfileCard data={customer} />
        </div>

        <div className={`${isSmallScreen ? 'w-[100%]' : 'w-[70%]'} space-y-4`}>
          <CustomerDetailsLiveMap data={customer} />
          <PreviousAlarmLogs userData={customer} />
        </div>
      </div>

      <Modal
        isVisible={isModalOpen}
        setIsVisible={setIsModalOpen}
        onOk={async () => {
          if (type !== 'deactivated') {
            await handleDeactivate();
          } else {
            await handleReactivate();
          }
        }}
        okLoading={isPending}
      >
        <div className=''>
          <div className=''>
            <div
              className={`mb-4 flex size-11 items-center justify-center rounded-full  sm:mx-0 ${
                type !== 'deactivated' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
              }`}
            >
              {type !== 'deactivated' ? (
                <TbUnlink className='text-destructive text-lg' />
              ) : (
                <MdNotificationsActive className='text-primary text-lg' />
              )}
            </div>
            <div className='text-lg font-medium'>
              {type !== 'deactivated' ? 'Deactivate Customer' : 'Reactivate Customer'}
            </div>
            <div className='text-muted-foreground'>
              {type !== 'deactivated'
                ? 'Are you sure you want to deactivate this account? This action can be reversed by reactivating the account later.'
                : 'Are you sure you want to reactivate this account?'}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

const Navigation = ({ customerName, id }) => (
  <div className='flex flex-col items-start gap-2'>
    <h1 className='text-text sm:text-xl text-lg font-semibold'>Customers</h1>
    <div className='opacity-95'>
      <BreadcrumbUI skipPatterns={['customers/:type']} customLabels={{ [id]: customerName }} />
    </div>
  </div>
);
