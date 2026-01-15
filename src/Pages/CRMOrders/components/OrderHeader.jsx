import React from 'react';
import SearchInput from '@/Shared/Search/SearchInput';
import Sort2 from '@/Shared/sort/Sort2';

const OrderHeader = ({ search, setSearch, query, setQuery, selected, setSelected, sortData }) => {
  return (
    <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-6 pb-0'>
      <h2 className='text-[20px] font-semibold text-[#1B2559]'>Order List</h2>

      <div className='flex flex-wrap items-center gap-3'>
        <div className='w-full md:w-auto'>
          <SearchInput search={search} setSearch={setSearch} placeholder='Search Order' />
        </div>

        <Sort2
          query={query}
          setQuery={setQuery}
          selected={selected}
          setSelected={setSelected}
          data={sortData}
        />
      </div>
    </div>
  );
};

export default OrderHeader;
