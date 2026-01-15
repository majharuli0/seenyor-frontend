import { useEffect, useState } from 'react';
import { refundRequestColumns } from './utiles';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
import { getOrders } from '@/api/ordersManage';

export default function RefundsRequest() {
  const [refundsRequest, setRefundsRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, SetPage] = useState({});
  function getRefundsRequest() {
    setLoading(true);
    getOrders({
      payment_status: 'pending',
      is_refund_requested: true,
      ...page,
    }).then((res) => {
      setRefundsRequest(res);
      console.log(res?.data);
      setLoading(false);
    });
  }
  useEffect(() => {
    getRefundsRequest();
  }, [page]);
  return (
    <>
      <div
        id='refunds_request'
        className='w-full flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6 mt-6'
      >
        <div id='Recently_Closed_Alerts_Header' className='w-full flex justify-between'>
          <h1 className='text-[24px] font-bold text-primary'>All Request</h1>
        </div>
        <SidebarContext.Provider
          value={{
            total: refundsRequest?.total,
            page,
            SetPage,
            getList: getRefundsRequest,
          }}
        >
          <CustomTable
            loading={loading}
            columns={refundRequestColumns}
            tableData={refundsRequest?.data}
          />
        </SidebarContext.Provider>
      </div>
    </>
  );
}
