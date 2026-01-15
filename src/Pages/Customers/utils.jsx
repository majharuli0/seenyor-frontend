import React from 'react';
import { Tag, Button } from 'antd';
import { Link } from 'react-router-dom';

export const customerTableColumns = [
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (text, record) => (
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm'>
          {record.initials}
        </div>
        <div className='flex flex-col'>
          <span className='font-medium text-gray-900 text-[16px]'>{record.name}</span>
          <span className='text-sm text-gray-500'>{record.email}</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (text) => <span className='text-gray-500 text-[16px]'>{text}</span>,
  },
  {
    title: 'Contact',
    dataIndex: 'contact',
    key: 'contact',
    render: (text) => <span className='text-gray-500 text-[16px]'>{text}</span>,
  },
  {
    title: 'Device Owned',
    dataIndex: 'deviceOwned',
    key: 'deviceOwned',
    render: (text) => <span className='text-gray-500 text-[16px]'>{text}</span>,
  },
  {
    title: 'Subscription',
    dataIndex: 'subscription',
    key: 'subscription',
    render: (status) => {
      let color = '';

      switch (status) {
        case 'Active':
          color = 'success';
          break;
        case 'Triling':
          color = 'processing';
          break;
        case 'Expired':
          color = 'error';
          break;
        default:
          color = 'default';
      }

      return (
        <Tag color={color} className='rounded-md px-3 py-1 font-medium border-0 text-[14px]'>
          {status}
        </Tag>
      );
    },
  },
  {
    title: 'Orders',
    dataIndex: 'orders',
    key: 'orders',
    render: (text) => <span className='text-gray-500 text-[16px]'>{text}</span>,
  },
  {
    title: 'Tickets',
    dataIndex: 'tickets',
    key: 'tickets',
    render: (text) => <span className='text-gray-500 text-[16px]'>{text}</span>,
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
    render: (text) => <span className='text-gray-500 text-[16px]'>{text || '--'}</span>,
  },
  {
    title: '',
    key: 'action',
    render: (_, record) => (
      <Link to={`/management/customers/details/${record.key}`}>
        <Button
          type='text'
          className='text-indigo-600 font-medium hover:bg-transparent hover:text-indigo-700 p-0 text-[16px]'
          style={{ border: 'none', background: 'transparent' }}
        >
          View Details
        </Button>
      </Link>
    ),
  },
];

export const customerTableData = [
  {
    key: '1',
    initials: 'SL',
    name: 'Stephen Lawrence',
    email: 'Stephen@lawrence.com',
    address: '7156 Appleby Line, USA',
    contact: '+353 123 4567 891',
    deviceOwned: '6x',
    subscription: 'Active',
    orders: '1',
    tickets: '1',
    tags: 'In Hand',
  },
  {
    key: '2',
    initials: 'SL',
    name: 'Stephen Lawrence',
    email: 'Stephen@lawrence.com',
    address: '7156 Appleby Line, USA',
    contact: '+353 123 4567 891',
    deviceOwned: '6x',
    subscription: 'Triling',
    orders: '0',
    tickets: '2',
    tags: '',
  },
  {
    key: '3',
    initials: 'SL',
    name: 'Stephen Lawrence',
    email: 'Stephen@lawrence.com',
    address: '7156 Appleby Line, USA',
    contact: '+353 123 4567 891',
    deviceOwned: '6x',
    subscription: 'Active',
    orders: '3',
    tickets: '1',
    tags: '',
  },
  {
    key: '4',
    initials: 'SL',
    name: 'Stephen Lawrence',
    email: 'Stephen@lawrence.com',
    address: '7156 Appleby Line, USA',
    contact: '+353 123 4567 891',
    deviceOwned: '6x',
    subscription: 'Expired',
    orders: '2',
    tickets: '0',
    tags: 'Unpaid',
  },
  {
    key: '5',
    initials: 'SL',
    name: 'Stephen Lawrence',
    email: 'Stephen@lawrence.com',
    address: '7156 Appleby Line, USA',
    contact: '+353 123 4567 891',
    deviceOwned: '6x',
    subscription: 'Active',
    orders: '0',
    tickets: '0',
    tags: 'loream',
  },
  {
    key: '6',
    initials: 'SL',
    name: 'Stephen Lawrence',
    email: 'Stephen@lawrence.com',
    address: '7156 Appleby Line, USA',
    contact: '+353 123 4567 891',
    deviceOwned: '6x',
    subscription: 'Active',
    orders: '0',
    tickets: '1',
    tags: 'loream',
  },
  {
    key: '7',
    initials: 'SL',
    name: 'Stephen Lawrence',
    email: 'Stephen@lawrence.com',
    address: '7156 Appleby Line, USA',
    contact: '+353 123 4567 891',
    deviceOwned: '6x',
    subscription: 'Expired',
    orders: '1',
    tickets: '3',
    tags: 'loream',
  },
  {
    key: '8',
    initials: 'SL',
    name: 'Stephen Lawrence',
    email: 'Stephen@lawrence.com',
    address: '7156 Appleby Line, USA',
    contact: '+353 123 4567 891',
    deviceOwned: '6x',
    subscription: 'Active',
    orders: '0',
    tickets: '1',
    tags: 'loream',
  },
  {
    key: '9',
    initials: 'SL',
    name: 'Stephen Lawrence',
    email: 'Stephen@lawrence.com',
    address: '7156 Appleby Line, USA',
    contact: '+353 123 4567 891',
    deviceOwned: '6x',
    subscription: 'Active',
    orders: '3',
    tickets: '2',
    tags: 'loream',
  },
];
