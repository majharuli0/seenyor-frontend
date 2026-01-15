import React, { useState } from 'react';
import CustomerHeader from './components/CustomerHeader';
import CustomerTable from './components/CustomerTable';
import CustomerStatsCards from './components/CustomerStatsCards';
import { customerTableColumns, customerTableData } from './utils';
import { SidebarContext } from '@/Context/CustomUsertable';

const Customers = () => {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState({});
  const [selected, setSelected] = useState('By Name');
  const [page, SetPage] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const sortData = ['By Name', 'By Date'];

  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);

    console.log('Filter changed to:', filterType);
    setQuery((prev) => ({ ...prev, status: filterType === 'all' ? undefined : filterType }));
  };

  const getList = () => {
    console.log('Fetching data with:', { page, query, search, selected });
  };

  return (
    <div className='p-6 bg-[#F8F9FA] min-h-screen font-poppins'>
      <CustomerStatsCards selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />

      <div className='bg-white rounded-[10px] '>
        <CustomerHeader
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
            total: customerTableData.length,
            page,
            SetPage,
            getlist: getList,
            query,
          }}
        >
          <CustomerTable
            data={customerTableData}
            loading={loading}
            columns={customerTableColumns}
          />
        </SidebarContext.Provider>
      </div>
    </div>
  );
};

export default Customers;
