import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ls from 'store2';
import { getUserDetails, getUserToken } from '@/api/Users';
import { useCountStore } from '@/store/index';
import { useNavigate } from 'react-router-dom';
import Loader from '@/Components/Loader';
import { getToken, setToken } from '@/utils/auth';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
import { distributorDealColumn } from './utiles';
import CustomButton from '@/Shared/button/CustomButton';
import SearchInput from '@/Shared/Search/SearchInput';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { getDeals } from '@/api/dealManage';

export default function DistributorDeal() {
  const [loading, setLoading] = useState(false);
  const [page, SetPage] = useState({});
  const [total, setTotal] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [onSearch, setOnSearch] = useState('');
  const params = useParams();
  const location = useLocation();
  const { role } = location.state || {};
  const [dealsList, setDealList] = useState([]);
  const [distributor, setDistributor] = useState({});
  const navigate = useNavigate();

  const getDealsList = useCallback(() => {
    setLoading(true);
    if (!(onSearch.length === 0 || onSearch.length > 10)) {
      setLoading(false);
      return;
    }
    getDeals({
      distributor_id: params.id,
      page: page.page,
      uid: onSearch,
    })
      .then((res) => {
        setDealList(res?.data);
        setTotal(res?.total);
        setTotalDevices(res?.total_devices);
        setTotalAmount(res?.total_price);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id, page, onSearch]);

  useEffect(() => {
    getDealsList();
  }, [getDealsList]);

  const getDistributor = useCallback(() => {
    getUserDetails({ id: params.id })
      .then((res) => {
        setDistributor(res?.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  }, [params.id, page]);

  useEffect(() => {
    getDistributor();
  }, [getDistributor]);

  return (
    <>
      <div className='back_button mt-4'>
        <Button
          onClick={() => {
            navigate(-1);
          }}
          icon={<LeftOutlined />}
        >
          Back
        </Button>
      </div>
      <div className='w-full flex items-start gap-6 mt-4'>
        <div className='w-[70%]  flex flex-col justify-center items-center bg-white rounded-2xl'>
          <div className='w-full flex justify-between p-6'>
            <h1 className='text-[24px] font-bold text-primary'>All Deals</h1>

            <div className='flex items-center gap-4'>
              <SearchInput
                placeholder='Search deals by device uid'
                setSearch={(val) => {
                  setOnSearch(val);
                }}
              />

              <CustomButton
                onClick={() =>
                  navigate(`/super-admin/users/distributor-deal/new-deal/${params?.id}`)
                }
                className={'min-w-[80px]'}
              >
                <div
                  className='mr-1'
                  dangerouslySetInnerHTML={{
                    __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 19 19" fill="none">

                <path d="M10.0941 5.54102C10.0941 5.2131 9.82824 4.94727 9.50033 4.94727C9.17241 4.94727 8.90658 5.2131 8.90658 5.54102V8.9056H5.54199C5.21407 8.9056 4.94824 9.17143 4.94824 9.49935C4.94824 9.82727 5.21407 10.0931 5.54199 10.0931H8.90658V13.4577C8.90658 13.7856 9.17241 14.0514 9.50033 14.0514C9.82824 14.0514 10.0941 13.7856 10.0941 13.4577V10.0931H13.4587C13.7866 10.0931 14.0524 9.82727 14.0524 9.49935C14.0524 9.17143 13.7866 8.9056 13.4587 8.9056H10.0941V5.54102Z" fill="white"/>
                </svg>`,
                  }}
                ></div>
                Add New
              </CustomButton>
            </div>
          </div>

          <SidebarContext.Provider
            value={{
              total: total,
              page,
              SetPage,
            }}
          >
            <CustomTable
              loading={loading}
              columns={distributorDealColumn}
              tableData={dealsList}
              scroll={50}
            />
          </SidebarContext.Provider>
        </div>
        <div className='bg-white  w-[30%] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 py-8'>
          <div className='h-[95px] w-[95px] bg-[#80CAA7] flex items-center justify-center text-white font-bold text-4xl rounded-full'>
            <p>{distributor && distributor.name && distributor.name.slice(0, 2).toUpperCase()}</p>
          </div>
          <div className='flex flex-col items-center justify-center text-center'>
            <h1 className='text-2xl text-primary font-semibold m-0'>{distributor?.name || '--'}</h1>
            <span className='text-base font-medium text-text-secondary m-0'>
              {distributor.role || '--'}
            </span>
          </div>
          <div className='flex  gap-4 w-full items-center justify-center mt-6'>
            <div className='flex flex-col items-center justify-center'>
              <span className='text-2xl font-bold text-primary m-0'>{totalDevices}</span>
              <h2 className='text-base font-medium text-text-secondary m-0'>Total Device</h2>
            </div>
            <hr className='h-9 w-[1px] bg-secondLightPrimary' />
            <div className='flex flex-col items-center justify-center'>
              <span className='text-2xl font-bold text-primary m-0'>${totalAmount}</span>
              <h2 className='text-base font-medium text-text-secondary m-0'>Total Amount</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
