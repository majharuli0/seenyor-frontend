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
  const displayedId =
    transactionId?.length > 22 ? transactionId?.slice(0, 22) + '...' : transactionId;

  return (
    <Tooltip title={copied ? 'Copied!' : 'Click to copy'}>
      <span
        className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap cursor-pointer'
        onClick={handleCopy}
      >
        {displayedId}
      </span>
    </Tooltip>
  );
};

export const paymentHistoryColumn = [
  {
    title: 'Transaction Date',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap'>
        {formatCreatedAt(row?.created_at) || 'N/A'}
      </span>
    ),
  },
  {
    title: 'Transaction ID',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap w-[100px]'>
        <TransactionIdColumn transactionId={row?.transaction_id} />
      </span>
    ),
  },
  {
    title: 'User Email',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap w-[100px]'>
        <TransactionIdColumn transactionId={row?.metadata?.customer_details?.email} />{' '}
      </span>
    ),
  },

  {
    title: 'Payment Status',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap capitalize'>
        <Tag color={`${row?.payment_status == 'paid' ? 'green' : 'red'}`}>
          {' '}
          {row?.payment_status || 'N/A'}
        </Tag>
      </span>
    ),
  },
  {
    title: 'Request/Response',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap capitalize'>
        {row?.method_type || 'N/A'}
      </span>
    ),
  },
  {
    title: 'Provider',
    render: (row) => (
      <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap capitalize'>
        {row?.provider || 'N/A'}
      </span>
    ),
  },
  {
    title: 'Amount',
    render: (row) => (
      <button>
        <span className=' text-[14px] xl:text-base  font-normal text-text-secondary text-nowrap uppercase'>
          ${row?.amount || 0} {row?.currency || 'USD'}
        </span>
      </button>
    ),
  },

  {
    title: 'Details',
    render: (row) => {
      const isActive = Math.random() < 0.5;
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary flex items-center gap-1'>
            <SubDetails data={row} />
          </span>
        </button>
      );
    },
  },
];
