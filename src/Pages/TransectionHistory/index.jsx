import { useCallback, useEffect, useState } from 'react';
import { paymentHistoryColumn } from './utiles';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
import { getOrders } from '@/api/ordersManage';
import { fetchUsers } from '../../redux/features/users/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Select } from 'antd';
import { FiSearch } from 'react-icons/fi';
import { getPaymentHistory, getSubscriptions } from '../../api/subscriptions';

export default function TransectionHistory() {
  const [loading, setLoading] = useState(true);
  const [page, SetPage] = useState({});
  const [total, setTotal] = useState(0);
  const [paymentHisotry, setPaymentHisotry] = useState([]);
  const getSubscriptionsList = useCallback(() => {
    setLoading(true);
    getPaymentHistory(page)
      .then((res) => {
        setPaymentHisotry(res?.data || []);
        setTotal(res?.total);
      })
      .then((err) => {
        console.error('Error fetching subscriptions:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);
  useEffect(() => {
    getSubscriptionsList();
  }, [getSubscriptionsList]);
  return (
    <>
      <div
        id='refunds_request'
        className='w-full flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6 mt-6'
      >
        <div id='Recently_Closed_Alerts_Header' className='w-full flex justify-between'>
          {/* <Input
            size="large"
            placeholder="Customer name, email..."
            prefix={<FiSearch className="text-gray-400" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className=" pr-20 border border-gray-300 max-w-[300px]"
            style={{ boxShadow: "none" }}
          />
          <Select
            defaultValue="All"
            style={{ width: 150 }}
            size="large"
            onChange={handleChange}
            options={[
              { value: "All", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Canceled", label: "Canceled" },
            ]}
          /> */}
        </div>
        <SidebarContext.Provider
          value={{
            total: total,
            page,
            SetPage,
            getList: getSubscriptionsList,
          }}
        >
          <CustomTable
            loading={loading}
            columns={paymentHistoryColumn}
            tableData={paymentHisotry}
          />
        </SidebarContext.Provider>
      </div>
    </>
  );
}
