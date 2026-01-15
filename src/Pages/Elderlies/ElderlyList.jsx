import React, { useEffect, useState, useCallback, useMemo } from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { useElderlyTableColumns } from './Utiles/utiles2';
import { SidebarContext } from '@/Context/CustomUsertable';
import SearchInput from '@/Shared/Search/SearchInput';
import { getElderlies } from '@/api/elderly';
import debounce from 'lodash/debounce';

export default function ElderlyList() {
  const [search, setSearch] = useState('');
  const [elderlies, setElderlies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [elderliesQuery, setElderliesQuery] = useState({});
  const columns = useElderlyTableColumns('support_agent');
  const user = JSON.parse(localStorage.getItem('user'));
  // Debounced search
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value) => {
        setElderliesQuery((prev) => ({ ...prev, name: value.trim() }));
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSetQuery.cancel();
  }, [debouncedSetQuery]);

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value === '') {
      debouncedSetQuery.cancel();
      setElderliesQuery((prev) => ({ ...prev, name: '' }));
    } else {
      debouncedSetQuery(value);
    }
  };

  const getElderlyList = useCallback(() => {
    setLoading(true);
    getElderlies(elderliesQuery)
      .then((res) => setElderlies(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [elderliesQuery]);

  useEffect(() => {
    getElderlyList();
  }, [getElderlyList]);

  function hnadleChangeElderlyFilter(data) {
    switch (data) {
      case 'diseases':
        return setElderliesQuery({ diseases: true });
      case 'comments':
        return setElderliesQuery({ comments: true });
      case 'medications':
        return setElderliesQuery({ medications: true });
      default:
        return setElderliesQuery({});
    }
  }

  return (
    <div
      id='Elderlies'
      className='w-full flex flex-col gap-4 justify-center items-center bg-white rounded-2xl p-6 mt-8'
    >
      <div id='Elderlies_Header' className='w-full flex justify-between'>
        <h1 className='text-[24px] font-bold'>{user?.role == 'nurse' ? 'Residents' : 'Users'}</h1>
        <div className='flex gap-4'>
          <SearchInput search={search} setSearch={handleSearchChange} placeholder='Search Users' />
        </div>
      </div>
      <SidebarContext.Provider
        value={{
          total: elderlies?.data?.length,
          page: 1,
          SetPage: () => {},
          getlist: getElderlyList,
        }}
      >
        <CustomTable loading={loading} columns={columns} tableData={elderlies?.data} />
      </SidebarContext.Provider>
    </div>
  );
}
