import RefundsRequestModal from '@/Components/RefundsModal/RefundsRequestModal';
import { Tooltip } from 'antd';
import { useState } from 'react';

export function handleClick(id) {
  window.location.href = `/#/super-admin/users/distributor-deal/details/${encodeURIComponent(id)}`;
}
export const distributorDealColumn = [
  {
    title: 'Date of Sales',
    render: (row) => {
      const formattedDate = new Date(row.created_at).toLocaleDateString('en-CA');
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
            {formattedDate}
          </span>
        </button>
      );
    },
  },
  {
    title: 'Product Quantity',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary flex flex-col gap-2'>
          {row.devices?.length}
        </span>
      </button>
    ),
  },
  {
    title: 'Product Price',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
          ${row?.price * row.devices?.length}
        </span>
      </button>
    ),
  },

  {
    title: 'Action',
    render: (row) => (
      <button onClick={() => handleClick(row?._id)}>
        <span className='text-[14px] xl:text-base  text-text-secondary text-nowrap cursor-pointer hover:text-primary font-medium'>
          View Details
        </span>
      </button>
    ),
  },
];
