import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '@/Components/Breadcrumb';
import CustomerProfileCard from '../components/CustomerProfileCard';
import SubscriptionCard from '../components/SubscriptionCard';
import DeviceListCard from '../components/DeviceListCard';
import PaymentHistoryCard from '../components/PaymentHistoryCard';
import InvoiceHistoryCard from '../components/InvoiceHistoryCard';

const mockCustomer = {
  id: '34876529578',
  name: 'David Jonson',
  initials: 'DJ',
  image: 'https://i.pravatar.cc/300?img=11', // Placeholder image
  joinDate: '25/02/2025',
  totalSpent: '3264.66',
  deviceCount: 12,
  phone: '+128 7486 896 44',
  email: 'Davisjonson@gmail.com',
  address: '47 W 13th St, New York, NY 10011, USA',
  seniors: [
    {
      name: 'Anamika Taylor',
      address: '47 W 13th St, New York, NY 10011, USA',
      image: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Rober Miller',
      address: '47 W 13th St, New York, NY 10011, USA',
      image: 'https://i.pravatar.cc/150?img=13',
    },
    {
      name: 'Harley Davidson',
      address: '47 W 13th St, New York, NY 10011, USA',
      image: 'https://i.pravatar.cc/150?img=60',
    },
  ],
};

const mockSubscription = {
  status: 'Active',
  plan: 'Solo Guardian',
  amount: '50$/Month',
  id: 'wdietsutwrb45kdfmu',
  period: '25/10/2025-25/11/2025',
  nextInvoice: '26 Nov 2025',
};

const mockDevices = [
  { key: '1', device: 'AI Sensor', date: '15/08/2025', uid: 'SDJFEO4646KLG' },
  { key: '2', device: 'AI Sensor', date: '15/08/2025', uid: 'SDJFEO4646KLG' },
  { key: '3', device: 'AI Sensor', date: '15/08/2025', uid: 'SDJFEO4646KLG' },
  { key: '4', device: 'AI Speaker', date: '15/08/2025', uid: 'SDJFEO4646KLG' },
];

const mockPayments = [
  { key: '1', amount: '$250', date: '26/06/2025' },
  { key: '2', amount: '$1648', date: '16/02/2025' },
];

const mockInvoices = [
  { key: '1', total: '$250', date: '26/06/2025', frequency: 'Monthly', invoiceId: 'dgfsdg465dg' },
  { key: '2', total: '$654', date: '26/06/2025', frequency: 'One-time', invoiceId: 'JDBF7DFKDJF' },
];

const CustomerDetails = () => {
  const { id } = useParams();

  const breadcrumbItems = [
    { title: 'Home', path: '/' },
    { title: 'Customers', path: '/management/customers' },
    { title: mockCustomer.name, path: null },
  ];

  return (
    <div className='p-6 bg-[#F8F9FA] min-h-screen font-poppins'>
      <Breadcrumb items={breadcrumbItems} />

      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='w-full lg:w-[380px] flex-shrink-0'>
          <CustomerProfileCard customer={mockCustomer} />
        </div>

        <div className='flex-1 flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SubscriptionCard subscription={mockSubscription} />
            <DeviceListCard devices={mockDevices} />
          </div>

          <PaymentHistoryCard payments={mockPayments} />
          <InvoiceHistoryCard invoices={mockInvoices} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
