import React from 'react';
import SearchInput from '@/Shared/Search/SearchInput';
import Sort2 from '@/Shared/sort/Sort2';
import { Button, ConfigProvider, Dropdown } from 'antd';
import { PlusCircle, Layers } from 'lucide-react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { BiLayer } from 'react-icons/bi';

const CustomerHeader = ({
  search,
  setSearch,
  query,
  setQuery,
  selected,
  setSelected,
  sortData,
}) => {
  const bulkActionItems = [
    {
      key: '1',
      label: 'Send Email',
    },
    {
      key: '2',
      label: 'Add Tag',
    },
    {
      key: '3',
      label: 'Export',
    },
  ];

  return (
    <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-6 pb-0'>
      <h2 className='text-2xl font-bold text-gray-800'>Customers</h2>

      <div className='flex flex-wrap items-center gap-3'>
        <div className='w-full md:w-auto'>
          <SearchInput search={search} setSearch={setSearch} placeholder='Search Customers' />
        </div>

        <Sort2
          query={query}
          setQuery={setQuery}
          selected={selected}
          setSelected={setSelected}
          data={sortData}
        />
        <ConfigProvider
          theme={{
            token: {
              primaryColor: '#514EB5',
              defaultActiveBg: '#514EB5',
              defaultActiveBorderColor: '#514EB5',
              defaultActiveColor: '#514EB5',
              colorPrimary: '#514EB5',
            },
          }}
        >
          <Button type='primary' size='large' className='py-5'>
            <IoAddCircleOutline size={20} />
            Create Customer
          </Button>

          <Dropdown menu={{ items: bulkActionItems }} trigger={['click']}>
            <Button type='primary' size='large' className='py-5'>
              <BiLayer size={20} /> Bulk Action
            </Button>
          </Dropdown>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default CustomerHeader;
