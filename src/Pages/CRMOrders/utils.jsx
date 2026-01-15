import React from 'react';
import { Tag, Button, Checkbox } from 'antd';
import { Link } from 'react-router-dom';

export const orderColumns = [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
    render: (text) => <span className='text-[#707EAE] text-[16px]'>{text}</span>,
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (text) => <span className='text-[#707EAE] font-medium text-[16px]'>{text}</span>,
  },
  {
    title: 'Shipping Address',
    dataIndex: 'address',
    key: 'address',
    render: (text) => <span className='text-[#707EAE] text-[16px]'>{text}</span>,
  },
  {
    title: 'Contact',
    dataIndex: 'contact',
    key: 'contact',
    render: (text) => <span className='text-[#707EAE] text-[16px]'>{text}</span>,
  },
  {
    title: 'Order Items',
    dataIndex: 'items',
    key: 'items',
    render: (items) => (
      <div className='flex flex-col'>
        {items.map((item, index) => (
          <span key={index} className='text-[#707EAE] text-[16px]'>
            {item}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = '';

      switch (status) {
        case 'Shipping':
          color = 'success';
          break;
        case 'Cancelled':
          color = 'error';
          break;
        case 'Returned':
          color = 'processing';
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
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (text) => <span className='text-[#707EAE] font-medium text-[16px]'>{text}</span>,
  },
  {
    title: 'Payment',
    dataIndex: 'payment',
    key: 'payment',
    render: (text) => <span className='text-[#707EAE] font-medium text-[16px]'>{text}</span>,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Link to={`/management/orders/details/${record.orderId.replace('#', '')}`}>
        <Button
          type='primary'
          className='bg-[#514EB5] hover:bg-[#403d96] text-white text-[12px] h-8 rounded-md border-none'
        >
          Manage
        </Button>
      </Link>
    ),
  },
];

export const orderData = Array(10)
  .fill(null)
  .map((_, index) => ({
    key: index,
    orderId: '#56889523',
    customer: 'Either Keihn',
    address: '7156 Appleby Line, USA',
    contact: '+145687938595',
    items: ['Radar 2x', 'AI Speaker 1x'],
    status: index % 3 === 0 ? 'Shipping' : index % 3 === 1 ? 'Cancelled' : 'Returned',
    amount: '$596.66',
    payment: 'Paid',
  }));
