import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getDealById, deleteDeal, updateDealStatus } from '@/api/dealManage';
import { Button, ConfigProvider, Select } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import CustomToast from '@/Shared/Tosat/CustomToast';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
import PermanentDeleteModal from '@/Shared/delete/PermanentDeleteModal';
import { deleteDevices } from '@/api/dealManage'; // Assuming this API exists
import SearchInput from '@/Shared/Search/SearchInput';
import SuccessModal from '@/Shared/Success/SuccessModal';
import ls from 'store2';

function StatusDropdown({ row }) {
  const [status, setStatus] = useState(row?.is_active);
  const [handleLoading, sethandleLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // let status = row?.status
  const handleChange = (value) => {
    setModalOpen(true);
  };
  const completeChnage = () => {
    sethandleLoading(true);
    const email = ls.get('user').email;
    updateDealStatus({
      uids: [`${row?.uid}`],
      is_active: false,
      email,
    })
      .then((res) => {
        toast.custom((t) => <CustomToast t={t} text={'Status Updated Successfully!'} />);
        setStatus(!status);
        sethandleLoading(false);
      })
      .catch((err) => {
        console.log(err);
        sethandleLoading(false);
      });
  };

  // Update local state if row status changes
  useEffect(() => {
    setStatus(row?.is_active);
  }, [row?.is_active]);
  return (
    <div className='flex items-center space-x-2 mr-0 '>
      <span
        className={`w-3 h-3 rounded-full relative -right-2 ${
          status === true ? 'bg-[#1EB564]' : 'bg-red-500'
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
          dropdownMatchSelectWidth={false}
          className='w-fit !text-red-100'
          options={[
            { value: true, label: <span>Active</span> },
            { value: false, label: <span>Inactive</span> },
          ]}
          disabled={status === false}
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
const columns = [
  {
    title: 'UIDs',
    render: (row) => (
      <div className='flex gap-2 items-center'>
        <span className='text-[14px] xl:text-base font-normal text-text-secondary text-nowrap'>
          {row?.uid}
        </span>
        {/* <div
          style={{
            backgroundColor: row?.is_active ? "green" : "",
            width: "10px",
            height: "10px",
          }}
          className="bg-slate-200 rounded-full"
        ></div> */}
      </div>
    ),
  },
  {
    title: 'Status',
    render: (row) => <StatusDropdown row={row} />,
  },
];

export default function DealDetails() {
  const [loading, setLoading] = useState(false);
  const [dealDetails, setDealDetails] = useState({});
  const [devices, setDevices] = useState([]);
  const [deviceCount, setDeviceCount] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalState, setModalState] = useState({
    dealDelete: false,
    deviceDelete: false,
  });
  const [loadDeleteDeal, setLoadDeleteDeal] = useState(false);
  const [search, setSearch] = useState('');
  const [loadDeleteDevice, setLoadDeleteDevice] = useState(false);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const getDealDetails = useCallback(() => {
    setLoading(true);
    getDealById({ id: params.id })
      .then((res) => {
        setDealDetails(res);
        setDevices(res?.devices);
        setFilteredDevices(res?.devices);
        let activeCount = 0;
        let inactiveCount = 0;
        res?.devices.forEach((device) => {
          if (device.is_active) activeCount++;
          else inactiveCount++;
        });
        setDeviceCount({
          inActiveDevices: inactiveCount,
          activeDevices: activeCount,
        });
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [params.id]);

  const deleteDeals = useCallback(() => {
    setLoadDeleteDeal(true);
    deleteDeal({ id: dealDetails?._id })
      .then(() => {
        toast.custom((t) => <CustomToast t={t} text={'Deal Deleted Successfully!'} />);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoadDeleteDeal(false);
        setModalState((prev) => ({ ...prev, dealDelete: false }));
        navigate(-1);
      });
  }, [dealDetails?._id, navigate]);

  const handleDeleteDevices = useCallback(() => {
    setLoadDeleteDevice(true);
    deleteDevices({
      id: dealDetails?._id,
      data: {
        deviceUids: selectedRowKeys,
      },
    })
      .then(() => {
        toast.custom((t) => <CustomToast t={t} text={'Devices Deleted Successfully!'} />);
        getDealDetails(); // Refresh the device list
        setSelectedRowKeys([]);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoadDeleteDevice(false);
        setModalState((prev) => ({ ...prev, deviceDelete: false }));
      });
  }, [selectedRowKeys, getDealDetails]);

  useEffect(() => {
    getDealDetails();
  }, [getDealDetails]);
  // function handBlurchange() {}
  const handBlurchange = useCallback(() => {
    if (search === '') {
      setFilteredDevices(devices);
      return;
    }
    const filteredDevices = devices.filter((device) => device.uid.includes(search));
    setFilteredDevices(filteredDevices);
  }, [search]);
  useEffect(() => {
    handBlurchange();
  }, [handBlurchange]);
  return (
    <>
      <div className='back_button mt-4'>
        <Button onClick={() => navigate(-1)} icon={<LeftOutlined />}>
          Back
        </Button>
      </div>
      <div className='w-full flex items-start gap-6 mt-4'>
        <div
          id='deal_device_table'
          className='w-[55%] flex flex-col justify-center items-center bg-white rounded-2xl'
        >
          <div className='w-full flex justify-between p-6 pb-0'>
            <h1 className='text-[24px] font-bold text-primary'>All Devices</h1>
            <SearchInput
              search={search}
              setSearch={(e) => setSearch(e.toUpperCase())}
              // handBlurchange={handBlurchange}
              placeholder={`Search UID`}
            />
          </div>
          <div className='w-full flex items-start gap-3 px-6 justify-between pb-4 pt-4'>
            {hasSelected && (
              <>
                <p className='font-normal text-primary text-lg'>
                  <span className='font-medium'>{selectedRowKeys?.length}</span> Item Selected
                </p>
                <Button
                  color='danger'
                  variant='solid'
                  onClick={() => setModalState((prev) => ({ ...prev, deviceDelete: true }))}
                  loading={loadDeleteDevice}
                >
                  Delete Selected Devices
                </Button>
              </>
            )}
          </div>
          <SidebarContext.Provider value={{ total: filteredDevices?.length }}>
            <CustomTable
              loading={loading}
              pageSize={1000}
              columns={columns}
              tableData={filteredDevices}
              rowSelection={rowSelection}
              rowKey={'uid'}
              scroll={{ y: 500 }}
              showPagination={false}
            />
          </SidebarContext.Provider>
        </div>
        <div className='bg-white w-[45%] rounded-2xl p-6 flex flex-col items-center justify-center gap-4'>
          <div className='w-full flex items-center justify-between'>
            <h1 className='text-xl font-bold text-primary'>Deal Info</h1>
            <p className='text-base font-medium text-text-secondary'>
              {new Date(dealDetails?.created_at).toLocaleDateString('en-CA')}
            </p>
          </div>
          <div className='grid grid-cols-2 gap-6 w-full relative mt-6'>
            <div className='absolute h-px w-full bg-gray-200 top-1/2 -translate-y-1/2 left-0 z-0' />
            <div className='absolute w-px h-full bg-gray-200 left-1/2 -translate-x-1/2 top-0 z-0' />
            <div className='flex flex-col items-center justify-center relative z-10'>
              <span className='text-2xl font-bold text-primary m-0'>{devices?.length || '--'}</span>
              <h2 className='text-base font-medium text-text-secondary m-0'>Total Device</h2>
            </div>
            <div className='flex flex-col items-center justify-center relative z-10'>
              <span className='text-2xl font-bold text-primary m-0'>
                ${dealDetails?.price * devices?.length || '--'}
              </span>
              <h2 className='text-base font-medium text-text-secondary m-0'>Total Amount</h2>
            </div>
            <div className='flex flex-col items-center justify-center relative z-10'>
              <span className='text-2xl font-bold text-primary m-0'>
                {deviceCount?.activeDevices || '--'}
              </span>
              <h2 className='text-base font-medium text-text-secondary m-0'>Active Devices</h2>
            </div>
            <div className='flex flex-col items-center justify-center relative z-10'>
              <span className='text-2xl font-bold text-primary m-0'>
                {deviceCount?.inActiveDevices || '--'}
              </span>
              <h2 className='text-base font-medium text-text-secondary m-0'>Inactive Devices</h2>
            </div>
          </div>
          <Button
            color='danger'
            variant='dashed'
            className='w-full mt-8'
            onClick={() => setModalState((prev) => ({ ...prev, dealDelete: true }))}
            loading={loadDeleteDeal}
          >
            Delete Deal
          </Button>
        </div>
      </div>

      {/* Deal Delete Modal */}
      <PermanentDeleteModal
        onDelete={deleteDeals}
        modalOPen={modalState.dealDelete}
        setModalOpen={(open) => setModalState((prev) => ({ ...prev, dealDelete: open }))}
        body="Are You Sure to Delete This Deal? This Process Can't Be Undone!"
      />

      {/* Device Delete Modal */}
      <PermanentDeleteModal
        onDelete={handleDeleteDevices}
        modalOPen={modalState.deviceDelete}
        setModalOpen={(open) => setModalState((prev) => ({ ...prev, deviceDelete: open }))}
        body={`Are You Sure to Delete ${selectedRowKeys.length} Selected Device(s)? This Process Can't Be Undone!`}
      />
    </>
  );
}

export const userData = {
  name: 'John Doe',
  last_name: 'Smith',
  role: 'Distributor',
};
