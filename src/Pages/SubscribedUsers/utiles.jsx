import RefundsRequestModal from '@/Components/RefundsModal/RefundsRequestModal';
import { Tag, Tooltip } from 'antd';
import { useState } from 'react';
import AdminFiled from '../../Shared/AdminFiled/AdminFiled';
import { FireTwoTone, StopOutlined, SyncOutlined } from '@ant-design/icons';
import alipay from '../../assets/icon/payment-method-icons/alipay.svg';
import jcb from '../../assets/icon/payment-method-icons/jcb.svg';
import gpay from '../../assets/icon/payment-method-icons/gpay.svg';
import applepay from '../../assets/icon/payment-method-icons/applepay.svg';
import unionpay from '../../assets/icon/payment-method-icons/unionpay.svg';
import mastercard from '../../assets/icon/payment-method-icons/mastercard.svg';
import paypal from '../../assets/icon/payment-method-icons/paypal.svg';
import visa from '../../assets/icon/payment-method-icons/visa.svg';
import SubscriptionUserAction from '../../Components/ActionManu/SubscriptionUserAction';
import { convertUnixToReadableDate, formatCreatedAt } from '../../utils/helper';
import SubDetails from '../../Components/ActionManu/SubDetails';

const TransactionIdColumn = ({ transactionId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <Tooltip title={copied ? 'Copied!' : 'Click to copy'}>
      <span
        className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap cursor-pointer'
        onClick={handleCopy}
      >
        {transactionId}
      </span>
    </Tooltip>
  );
};
export const refundRequestColumns = [
  {
    title: 'User',
    render: (row) => <AdminFiled data={row} />,
  },
  {
    title: 'Subscription ID',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
        sub_45asd452rf45rasd
      </span>
    ),
  },
  {
    title: 'Subscription Plan',
    render: (row) => (
      <button>
        <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
          <FireTwoTone /> AI Monitoring
        </span>
      </button>
    ),
  },
  {
    title: 'Recurring Money',
    render: (row) => (
      <button>
        <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
          $ 69 USD
        </span>
      </button>
    ),
  },

  {
    title: 'Subscription Expire Date',
    render: (row) => (
      <button>
        <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
          1 July, 2026
        </span>
      </button>
    ),
  },
  {
    title: 'Subscription Status',
    render: (row) => {
      const isActive = crypto.getRandomValues(new Uint8Array(1))[0] / 255 < 0.5; // 50% chance
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
            {isActive ? (
              <Tag icon={<SyncOutlined spin />} color='success' className='font-semibold'>
                Active
              </Tag>
            ) : (
              <Tag icon={<StopOutlined />} className='font-semibold'>
                Canceled
              </Tag>
            )}
          </span>
        </button>
      );
    },
  },
  {
    title: 'Default Payment Method',
    render: (row) => {
      const isActive = crypto.getRandomValues(new Uint8Array(1))[0] / 255 < 0.5; // 50% chance
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary flex items-center gap-1'>
            <img src={visa} alt='' /> **** 3456
          </span>
        </button>
      );
    },
  },

  {
    title: 'Action',
    render: (row) => {
      return (
        <button>
          <SubscriptionUserAction />
        </button>
      );
    },
  },
];
export const subcriptionColumns = [
  {
    title: 'Subscription Created At',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
        {formatCreatedAt(row?.created_at) || 'N/A'}
      </span>
    ),
  },
  {
    title: 'User ',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
        {row?.StripeEventData?.metadata?.user_email || 'N/A'}
      </span>
    ),
  },
  {
    title: 'Subscription ID',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
        {row?.StripeEventData?.id || 'N/A'}
      </span>
    ),
  },

  {
    title: 'Product ID',
    render: (row) => (
      <button>
        <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
          {row?.StripeEventData?.plan?.product || 'N/A'}
        </span>
      </button>
    ),
  },
  {
    title: 'Amount',
    render: (row) => (
      <button>
        <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap uppercase'>
          ${row?.real_amount_decimal / 100 || 0} {row?.currency || 'USD'}
        </span>
      </button>
    ),
  },

  {
    title: 'Subscription Expire Date',
    render: (row) => (
      <button>
        <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
          {convertUnixToReadableDate(row?.StripeEventData?.current_period_end) || 'N/A'}
        </span>
      </button>
    ),
  },
  {
    title: 'Subscription Status',
    render: (row) => {
      const isActive = crypto.getRandomValues(new Uint8Array(1))[0] / 255 < 0.5; // 50% chance
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
            {/* {isActive ? (
              <Tag
                icon={<SyncOutlined spin />}
                color="success"
                className="font-semibold"
              >
                Active
              </Tag>
            ) : (
              <Tag icon={<StopOutlined />} className="font-semibold">
                Canceled
              </Tag>
            )} */}
            {row?.SubscriptionStatus === 'cancelled' && (
              <Tag icon={<StopOutlined />} className='font-semibold'>
                Canceled
              </Tag>
            )}
            {row?.SubscriptionStatus === 'active' && (
              <Tag icon={<SyncOutlined spin />} color='success' className='font-semibold'>
                Active
              </Tag>
            )}
            {row?.SubscriptionStatus === 'trialing' && (
              <Tag icon={<SyncOutlined spin />} color='warning' className='font-semibold'>
                Trialing
              </Tag>
            )}
          </span>
        </button>
      );
    },
  },
  {
    title: 'Details',
    render: (row) => {
      const isActive = crypto.getRandomValues(new Uint8Array(1))[0] / 255 < 0.5;
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary flex items-center gap-1'>
            <SubDetails data={row} />
          </span>
        </button>
      );
    },
  },
  {
    title: 'Action',
    render: (row) => {
      return (
        <button>
          <SubscriptionUserAction data={row} />
        </button>
      );
    },
  },
];
