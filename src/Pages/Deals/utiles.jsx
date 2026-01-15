import { Tag } from 'antd';
import ReportActionModal from '../Supportnuser/components/ReportActionModal';
import { useState, useEffect, useContext } from 'react';
import { ConfigProvider, Select } from 'antd';
import { updateInstallationStatus } from '@/api/ordersManage';
import { SidebarContext } from '@/Context/CustomUsertable';
import ls from 'store2';
import AssignInstaller from './components/AssignInstaller';

function StatusDropdown({ row }) {
  const sharedMethod = useContext(SidebarContext);
  const [status, setStatus] = useState(row?.installation_status);
  const [handleLoading, sethandleLoading] = useState(false);

  const handleChange = (value) => {
    setStatus(value);
    sethandleLoading(true);
    updateInstallationStatus(row?._id, {
      installation_status: value,
    })
      .then((res) => {
        console.log(res);
        sharedMethod.getInstallationList.getCompletedandToBeInstalled();
        sharedMethod.getInstallationList.getDeviceSalesCounts();
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
  };

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
          dropdownMatchSelectWidth={false}
          loading={handleLoading}
          optionSelectedColor='#8086AC'
          className='w-fit !text-red-100'
          options={[
            { value: 'completed', label: <span>Complete</span> },
            { value: 'pending', label: <span>Pending</span> },
            { value: 'not_started', label: <span>Not Started</span> },
          ]}
        />
      </ConfigProvider>
    </div>
  );
}

export default function DealColumns(columnsName) {
  const user = ls.get('user');
  const dealDetailCol = [
    ...(user.role !== 'office'
      ? [
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
        ]
      : [
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
                  {row.installation_date === null
                    ? 'N/A'
                    : row.installer_id
                      ? 'Assigned'
                      : 'Not Assigned'}
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
        ]),
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
            {row.address?.city}, {row.address?.state}, {row.address ? row.address.postal_code : ' '}
            , {row.address?.country}
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
                  !/^AI Sensor/.test(item.type) &&
                  (item.type !== 'Seenyor Kit' || isUniqueSeenyorKit)
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
              .filter((item) =>
                ['Seenyor Kit', 'Installation', 'AI Monitoring'].includes(item.type)
              )
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
              .filter(
                (item) => !['Seenyor Kit', 'Installation', 'AI Monitoring'].includes(item.type)
              )
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
            ${row.total.toFixed(2)}
          </span>
        </button>
      ),
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
      render: (status, record) => {
        let color = '';

        switch (status) {
          case 'pending':
            color = 'orange';
            break;
          case 'cancelled':
            color = 'red';
            break;
          case 'completed':
            color = 'green';
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

  if (columnsName === 'dealDetailCol') {
    return dealDetailCol;
  }
}
