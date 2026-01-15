import React from 'react';
import { Select, ConfigProvider } from 'antd';
import SearchInput from '@/Shared/Search/SearchInput';
import Sort2 from '@/Shared/sort/Sort2';

const { Option } = Select;

const DeviceHeader = ({
  search,
  setSearch,
  query,
  setQuery,
  selected,
  setSelected,
  sortData,
  filterModel,
  setFilterModel,
}) => {
  return (
    <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-6 pb-0 bg-white rounded-t-[10px]'>
      <h2 className='text-[20px] font-bold text-gray-800'>All Devices</h2>

      <div className='flex flex-wrap items-center gap-3'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#514EB5',
            },
          }}
        >
          <Select
            value={filterModel === 'Device Model' ? null : filterModel}
            onChange={setFilterModel}
            placeholder='Device Model'
            className='w-[140px] h-[44px]'
            suffixIcon={<span className='text-[#514EB5]'>▼</span>}
          >
            <Option value='AI Speaker'>AI Speaker</Option>
            <Option value='AI Sensor'>AI Sensor</Option>
          </Select>
        </ConfigProvider>

        <div className='w-full md:w-auto'>
          <SearchInput
            search={search}
            setSearch={setSearch}
            placeholder='Search here'
            className='h-[44px]'
          />
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

export default DeviceHeader;
