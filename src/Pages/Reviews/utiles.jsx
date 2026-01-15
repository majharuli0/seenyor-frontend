import RefundsRequestModal from '@/Components/RefundsModal/RefundsRequestModal';
import AdminFiled from '@/Shared/AdminFiled/AdminFiled';
import { Button, ConfigProvider, Tooltip } from 'antd';
export const reviewsTableColumn = [
  {
    title: 'Customer',
    render: (row) => <AdminFiled data={row} role={'review_changes'} />,
  },
  {
    title: 'Device ID',
    render: (row) => (
      <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
        {row?.rooms?.device_no || 'N/A'}
      </span>
    ),
  },

  {
    title: 'Date',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row?.rooms?.created_at ? new Date(row?.rooms?.created_at).toLocaleString() : 'N/A'}
        </span>
      </button>
    ),
  },

  {
    title: 'Room Type',
    render: (row) => {
      const roomType = {
        1: 'Livingroom',
        2: 'Bedroom',
        3: 'Bathroom',
        4: 'Otherroom',
      };
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary flex flex-col gap-2'>
            {roomType[row?.rooms?.room_type] || '-'}
          </span>
        </button>
      );
    },
  },
  {
    title: 'Status',
    render: (row) => {
      let bgColor;
      switch (row?.rooms?.review_status) {
        case 'unsubmitted':
          bgColor = 'text-[#DC2626]';
          break;
        case 'revision_required':
          bgColor = 'text-[#FF994D]';
          break;
        case 'completed':
          bgColor = 'text-[#36b610]';
          break;
        case 'awaiting_review':
          bgColor = 'text-[#9369C5]';
          break;
        default:
          bgColor = 'text-gray';
      }
      const statusMapping = {
        not_uploaded: 'Unsubmitted',
        uploaded: 'Awaiting Review',
        revision_required: 'Request Change',
        completed: 'Completed',
      };
      return (
        <button>
          <span
            className={`text-[14px] xl:text-base capitalize font-medium p-2 px-3 py-1 ${bgColor} rounded-lg`}
          >
            {statusMapping[row?.rooms?.review_status] || 'N/A'}
          </span>
        </button>
      );
    },
  },

  {
    title: 'Action',
    render: (row) => (
      <ConfigProvider
        theme={{
          token: {
            primaryColor: '#514EB5',
            defaultActiveBg: '#514EB5',
            defaultActiveBorderColor: '#514EB5',
            defaultActiveColor: '#514EB5',
            colorPrimary: '#514EB5',
          },
        }}
      >
        <Button
          color='primary'
          variant='solid'
          className='px-6'
          onClick={() => {
            window.location.href = `/#/super-admin/reviews/details/${row?._id}/${row?.rooms?._id}`;
          }}
        >
          Review
        </Button>
      </ConfigProvider>
    ),
  },
];
