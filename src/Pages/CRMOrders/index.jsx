import React, { useState } from 'react';
import OrderTabs from './components/OrderTabs';
import OrderTable from './components/OrderTable';
import OrderHeader from './components/OrderHeader';
import { orderColumns, orderData } from './utils';
import { SidebarContext } from '@/Context/CustomUsertable';

const CRMOrders = () => {
  const [page, SetPage] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({});
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('By Name');

  const sortData = ['By Name', 'By Date'];

  const getList = () => {
    console.log('Fetching orders with:', { page, query, search, selected });
  };

  return (
    <div className='p-6 bg-[#F8F9FA] min-h-screen font-poppins'>
      <OrderTabs />

      <div className='mt-6 bg-white rounded-[10px]'>
        <OrderHeader
          search={search}
          setSearch={setSearch}
          query={query}
          setQuery={setQuery}
          selected={selected}
          setSelected={setSelected}
          sortData={sortData}
        />

        <SidebarContext.Provider
          value={{
            total: orderData.length,
            page,
            SetPage,
            getlist: getList,
            query,
          }}
        >
          <OrderTable data={orderData} loading={loading} columns={orderColumns} />
        </SidebarContext.Provider>
      </div>
    </div>
  );
};

export default CRMOrders;
