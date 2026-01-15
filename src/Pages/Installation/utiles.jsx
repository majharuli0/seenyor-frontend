import { Tag } from 'antd';
import ReportActionModal from '@/Components/ReportActionModal/ReportActionModal';
import { useState, useEffect, useContext } from 'react';
import { ConfigProvider, Select } from 'antd';
import { updateInstallationStatus, activeSubscriptions } from '@/api/ordersManage';
import { SidebarContext } from '@/Context/CustomUsertable';
import SuccessModal from '@/Shared/Success/SuccessModal';
import { getUserDetails } from '@/api/Users';

function StatusDropdown({ row }) {
  const sharedMethod = useContext(SidebarContext);
  const [status, setStatus] = useState(row?.installation_status);
  const [handleLoading, sethandleLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // let status = row?.status
  const handleChange = (value) => {
    if (value === 'completed') {
      setModalOpen(true);
    } else {
      sethandleLoading(true);
      updateInstallationStatus(row?._id, {
        installation_status: value,
      })
        .then((res) => {
          sharedMethod.getList();
          if (res) {
            setStatus(value);
          }
        })
        .catch((err) => {
          console.log(err);
          setStatus(row?.installation_status);
        })
        .finally(() => {
          sethandleLoading(false);
        });
    }
  };
  const completeChnage = async () => {
    sethandleLoading(true);
    const isAIMonitoring = row?.products.filter((item) => item?.type === 'AI Monitoring');
    if (isAIMonitoring.length > 0) {
      await getUserDetails({
        id: row?.user_id,
      })
        .then((user) => {
          if (user) {
            activeSubscriptions({
              subscription_id: user?.data?.subscription_id,
              extend_day: '30',
            })
              .then(() => {})
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    await updateInstallationStatus(row?._id, {
      installation_status: 'completed',
    })
      .then((res) => {
        sharedMethod.getList();
        if (res) {
          setStatus('completed');
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus('completed');
      })
      .finally(() => {
        sethandleLoading(false);
      });
  };
  // Update local state if row status changes
  useEffect(() => {
    setStatus(row?.installation_status);
  }, [row?.installation_status]);
  return (
    <div className='flex items-center space-x-2 mr-0 '>
      <span
        className={`w-3 h-3 rounded-full relative -right-2 ${
          status === 'completed'
            ? 'bg-[#1EB564]'
            : status === 'pending'
              ? 'bg-yellow-500'
              : 'bg-red-500'
        }`}
      ></span>
      {/* Status select dropdown */}
      <ConfigProvider
        theme={{
          token: {
            colorText: '#707EAE',
            colorPrimary: '#8086AC',
            colorLinkActive: '#8086AC',
            colorLinkHover: '#8086AC',
            colorLink: '#8086AC',
          },
        }}
      >
        <Select
          value={status}
          variant='borderless'
          onChange={handleChange}
          loading={handleLoading}
          optionSelectedColor='#8086AC'
          className='w-fit !text-red-100'
          options={[
            { value: 'completed', label: <span>Complete</span> },
            { value: 'pending', label: <span>Pending</span> },
            { value: 'not_started', label: <span>Not Started</span> },
          ]}
          // disabled={status === "completed"}
        />
      </ConfigProvider>
      <SuccessModal
        modalOPen={modalOpen}
        setModalOpen={setModalOpen}
        title={''}
        title2={
          "Are you sure you want to change the status to 'Completed'? Once confirmed, this action cannot be undone, and user subscription will start immediately from now."
        }
        okText='Confirm'
        onOk={() => completeChnage()}
      />
    </div>
  );
}
const installation = [
  {
    title: 'Installation Status',
    render: (row) => <StatusDropdown row={row} />,
  },
  {
    title: 'Report',
    render: (row) => (
      <div className='flex justify-center'>
        <ReportActionModal report={row} />
      </div>
    ),
  },
  {
    title: 'Customer Name',
    render: (row) => {
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
            {row?.user_name}
          </span>
        </button>
      );
    },
  },
  {
    title: 'Customer Phone Number',
    render: (row) => {
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
            {row?.user_phone}
          </span>
        </button>
      );
    },
  },
  {
    title: 'Customer Email',
    render: (row) => {
      return (
        <button>
          <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
            {row?.user_email}
          </span>
        </button>
      );
    },
  },
  {
    title: 'Location',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row.address?.line1}, {row.address?.line2 ? row.address?.line2 + ', ' : ''},{' '}
          {row.address?.city}, {row.address?.state}, {row.address ? row.address.postal_code : ' '},{' '}
          {row.address?.country}
        </span>
      </button>
    ),
  },
  {
    title: 'Product Name',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary flex  gap-2'>
          {/* {row.products.map(
            (item, indx) =>
              ["Seenyor Kit", "Installation"].includes(item.type) &&
              indx < 2 && <span key={indx}>{item.type}</span>
          )} */}
          {row.products
            .filter((item, indx, self) => {
              const isUniqueSeenyorKit =
                item.type === 'Seenyor Kit' &&
                self.findIndex((i) => i.type === 'Seenyor Kit') === indx;
              return (
                !/^AI Sensor/.test(item.type) && (item.type !== 'Seenyor Kit' || isUniqueSeenyorKit)
              );
            })
            .map((item, indx) => {
              const color =
                item.type === 'Seenyor Kit'
                  ? 'blue'
                  : item.type === 'Installation'
                    ? 'orange'
                    : 'default';
              return (
                <Tag key={indx} color={color}>
                  {item.type === 'Seenyor Kit' ? 'Package' : item.type}
                </Tag>
              );
            })}
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
        <span className='text-[14px] xl:text-base font-normal text-text-secondary flex gap-2'>
          {/* {row.products.map(
            (item, indx) =>
              !["Seenyor Kit", "Installation", "AI Monitoring"].includes(
                item.type
              ) && <span key={indx}>{item.type}</span>
          )} */}
          {row.products
            .filter((item) => !['Seenyor Kit', 'Installation', 'AI Monitoring'].includes(item.type))
            .map((item, indx) => <Tag key={indx}>{item.type}</Tag>).length === 0 ? (
            <span>--</span>
          ) : (
            row.products
              .filter(
                (item) => !['Seenyor Kit', 'Installation', 'AI Monitoring'].includes(item.type)
              )
              .map((item, indx) => <Tag key={indx}>{item.type}</Tag>)
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
          {row.products
            .map((item, indx) =>
              !['Seenyor Kit', 'Installation', 'AI Monitoring'].includes(item.type) ? (
                <span key={indx}>${item.price.toFixed(2)}</span>
              ) : null
            )
            .filter(Boolean).length === 0 ? (
            <span>--</span>
          ) : (
            row.products.map((item, indx) =>
              !['Seenyor Kit', 'Installation', 'AI Monitoring'].includes(item.type) ? (
                <span key={indx}>${item.price.toFixed(2)}</span>
              ) : null
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
          ${row.total}
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
    title: 'Payment Status',
    dataIndex: 'payment_status',
    key: 'payment_status',
    filters: [
      { text: 'Completed', value: 'completed' },
      { text: 'Pending', value: 'pending' },
      { text: 'Cancelled', value: 'cancelled' },
    ],
    filterMultiple: true,
    onFilter: (value, record) => record.payment_status.includes(value),
    render: (status) => {
      let color = '';

      switch (status) {
        case 'completed':
          color = 'green';
          break;
        case 'pending':
          color = 'orange';
          break;
        case 'cancelled':
          color = 'red';
          break;
        default:
          color = 'black';
      }

      return (
        <span
          style={{
            backgroundColor: color,
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        >
          {status}
        </span>
      );
    },
  },
];

// Export both arrays
export { installation };
