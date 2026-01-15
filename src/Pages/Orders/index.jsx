import React, { useState, useEffect, useContext } from 'react';
import { ConfigProvider, Table } from 'antd';
import { ordersTableCol } from './utiles';
import { getOrders } from '@/api/ordersManage';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [ordersList, setOrdersList] = useState([]);
  const [page, SetPage] = useState(1);
  const [total, setTotal] = useState(0);
  function getOrdersList() {
    setLoading(true);
    getOrders({ page: page.page })
      .then((res) => {
        setOrdersList(res.data);
        setTotal(res.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    getOrdersList();
  }, [page]);

  return (
    <>
      <div id='dealsDetails' className=' p-[25px] rounded-2xl  bg-white w-full  mt-8'>
        <div id='ChartHeader' className='w-full flex justify-between mb-8'>
          <h1 className='text-[24px] font-bold'>All Orders</h1>
        </div>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Baloo2',
              colorPrimary: '#8086AC',
              colorLinkActive: '#8086AC',
              colorLinkHover: '#8086AC',
              colorLink: '#8086AC',
            },
          }}
        >
          <SidebarContext.Provider
            value={{
              getOrdersList: { getOrdersList },
              total: total,
              page,
              SetPage,
            }}
          >
            <CustomTable
              loading={loading}
              columns={ordersTableCol}
              tableData={ordersList}
              scroll={{ x: 750 }}
            />
          </SidebarContext.Provider>
        </ConfigProvider>
      </div>
    </>
  );
}
