import RefundsRequestModal from '@/Components/RefundsModal/RefundsRequestModal';
import { Tooltip } from 'antd';
import { useState } from 'react';
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
    title: 'Action',
    render: (row) => <RefundsRequestModal record={row} />,
  },
  {
    title: 'Transaction ID',
    render: (row) => <TransactionIdColumn transactionId={row.transaction_id} />,
  },
  {
    title: 'Office Identifier',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row.office_name}
        </span>
      </button>
    ),
  },
  {
    title: 'Agent Name (ID Number)',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row.agent_name} ({row.agent_unique_id})
        </span>
      </button>
    ),
  },
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
    title: 'Product Name',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary flex flex-col gap-2'>
          {row.products
            .filter(
              (item, indx, self) =>
                item.type !== 'Seenyor Kit' ||
                self.findIndex((i) => i.type === 'Seenyor Kit') === indx
            )
            .map(
              (item, indx) =>
                ['Seenyor Kit', 'Installation'].includes(item.type) &&
                indx < 2 && <span key={indx}>{item.type}</span>
            )}
        </span>
      </button>
    ),
  },
  {
    title: 'Product Price',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
          $
          {row.products
            .filter((item) => ['Seenyor Kit', 'Installation', 'AI Monitoring'].includes(item.type))
            .reduce((total, item) => total + item.price, 0)
            .toFixed(2)}
        </span>
      </button>
    ),
  },
  {
    title: 'Addon Name',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary flex flex-col gap-2'>
          {row.products.map(
            (item, indx) =>
              !['Seenyor Kit', 'Installation', 'AI Monitoring'].includes(item.type) && (
                <span key={indx}>{item.type}</span>
              )
          )}
        </span>
      </button>
    ),
  },
  {
    title: 'Addon Price',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row.products.map(
            (item, indx) =>
              !['Seenyor Kit', 'Installation', 'AI Monitoring'].includes(item.type) && (
                <span key={indx}>${item.price.toFixed(2)}</span>
              )
          )}
        </span>
      </button>
    ),
  },
  {
    title: 'Total Price',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          ${row.total.toFixed(2)}
        </span>
      </button>
    ),
  },
  {
    title: 'Installation Status',
    render: (row) => {
      let bgColor;
      switch (row.installation_status) {
        case 'not_started':
          bgColor = 'bg-[#5d5d5d]';
          break;
        case 'pending':
          bgColor = 'bg-[#833af1]';
          break;
        case 'completed':
          bgColor = 'bg-[#36b610]';
          break;
        default:
          bgColor = 'bg-black';
      }
      const statusMapping = {
        not_started: 'Not Started',
        pending: 'Pending',
        completed: 'Completed',
      };
      return (
        <button>
          <span
            className={`text-[14px] xl:text-base capitalize font-normal text-white p-2 px-3 py-1 ${bgColor} rounded-lg`}
          >
            {statusMapping[row.installation_status]}
          </span>
        </button>
      );
    },
  },
];
