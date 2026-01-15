import { Tag } from 'antd';
import ReportActionModal from '../Supportnuser/components/ReportActionModal';
import { useState, useEffect } from 'react';
import { updateUserDetails } from '@/api/Users';
import { ConfigProvider, Select } from 'antd';
import { RiToolsLine } from 'react-icons/ri';
import AssignInstaller from './components/AssignInstaller';
function StatusDropdown({ row }) {
  const [status, setStatus] = useState(row?.status);
  const [handleLoading, sethandleLoading] = useState(false);
  // let status = row?.status
  const handleChange = (value) => {
    sethandleLoading(true);
    updateUserDetails(row?._id, {
      status: value,
    })
      .then((res) => {
        console.log(res);
        if (res) {
          setStatus(res?.user?.status);
        }
      })
      .finally(() => {
        sethandleLoading(false);
      });
  };
  // Update local state if row status changes
  useEffect(() => {
    setStatus(row?.status);
  }, [row]);
  return (
    <div className='flex items-center space-x-2 mr-0 '>
      {/* Red or green circle based on status */}
      <span
        className={`w-3 h-3 rounded-full relative -right-2 ${
          status == true ? 'bg-[#1EB564]' : 'bg-red-500'
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
          dropdownMatchSelectWidth={false}
          onChange={handleChange}
          loading={handleLoading}
          optionSelectedColor='#8086AC'
          className='w-fit !text-red-100'
          options={[
            { value: 'Complete', label: <span>Complete</span> },
            { value: 'Pending', label: <span>Pending</span> },
            { value: 'Problem', label: <span>Problem</span> },
            { value: 'Not Started', label: <span>Not Started</span> },
          ]}
        />
      </ConfigProvider>
    </div>
  );
}
const ordersTableCol = [
  // {
  //   title: "Installation Date",
  //   render: (row) => (
  //     <button>
  //       <span className="text-[14px] xl:text-base font-normal text-text-secondary text-nowrap">
  //         {row.installation_date}
  //       </span>
  //     </button>
  //   ),
  // },
  {
    title: 'Action',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap '>
          {row.installation_date === null ? (
            <span className=''>N/A</span>
          ) : row.installer_id ? (
            <span className='italic'>Assigned</span>
          ) : (
            <AssignInstaller data={row} />
          )}
        </span>
      </button>
    ),
  },
  {
    title: 'Installer Status',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row.installation_date === null ? 'N/A' : row.installer_id ? 'Assigned' : 'Not Assigned'}
        </span>
      </button>
    ),
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
    title: 'Installation Status',
    render: (row) => {
      let bgColor;
      switch (row.installation_status) {
        case 'not_started':
          bgColor = 'bg-red-500';
          break;
        case 'pending':
          bgColor = 'bg-yellow-500';
          break;
        case 'completed':
          bgColor = 'bg-[#1EB564]';
          break;
        default:
          bgColor = 'bg-black'; // Add a default case to handle unexpected statuses
      }
      const statusMapping = {
        not_started: 'Not Started',
        pending: 'Pending',
        completed: 'Completed',
      };
      return (
        <button>
          <span
            className={`text-[14px] xl:text-base capitalize font-normal text-white p-2 px-3 py-1 ${
              row.installer_id ? bgColor : 'bg-transparent !text-black'
            } rounded-lg`}
          >
            {row.installer_id ? statusMapping[row.installation_status] || 'Unknown' : 'N/A'}
          </span>
        </button>
      );
    },
  },
  {
    title: 'Location',
    render: (row) => (
      <button className='text-left'>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap text-left'>
          {row.address?.line1}
          {row.address?.line2 ? `, ${row.address.line2}` : ''}
          {row.address?.city ? `, ${row.address.city}` : ''}
          <br />
          {row.address?.state ? `, ${row.address.state}` : ''}
          {row.address?.postal_code ? `, ${row.address.postal_code}` : ''}
          {row.address?.country ? `, ${row.address.country}` : ''}
        </span>
      </button>
    ),
  },
  {
    title: 'Preferred Installation Date',
    render: (row) => {
      const formattedDate = row.installation_date
        ? new Date(row.installation_date).toLocaleDateString('en-CA')
        : '--';
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
          color = 'bg-[#1EB564]/20 text-[#1EB564]';
          break;
        case 'pending':
          color = 'bg-[#F59E0B]/20 text-[#F59E0B]';
          break;
        case 'cancelled':
          color = 'bg-[#F59E0B]/20 text-[#F59E0B]';
          break;
        default:
          color = 'bg-[#8086AC]/20 text-[#8086AC]';
      }

      return (
        <span
          style={{
            padding: '4px 16px',
            borderRadius: '500px',
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
          className={`${color}`}
        >
          {status}
        </span>
      );
    },
  },
];

const installation = [
  {
    title: 'Customer Name',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row.name}
        </span>
      </button>
    ),
  },
  {
    title: 'Address',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row.address}
        </span>
      </button>
    ),
  },
  {
    title: 'Phone Number',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row.contact_number}
        </span>
      </button>
    ),
  },
  {
    title: 'E-mail',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row.email}
        </span>
      </button>
    ),
  },
  {
    title: 'Installer',
    render: (row) => (
      <button>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary'>
          {row.installer}
        </span>
      </button>
    ),
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
    title: 'Status',
    render: (row) => <StatusDropdown row={row} />,
  },
];

// Export both arrays
export { ordersTableCol, installation };
