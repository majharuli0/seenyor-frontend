import React, { useCallback, useEffect, useState } from 'react';
import CustomTable from '@/Shared/Table/CustomTable';
import { SidebarContext } from '@/Context/CustomUsertable';
import { reviewsTableColumn } from './utiles';
import debounce from 'lodash/debounce';
import SearchInput from '@/Shared/Search/SearchInput';
import Sort2 from '@/Shared/sort/Sort2';
import { reviewsTableData } from './data';
import { ConfigProvider } from 'antd';
import { getReviews } from '@/api/elderly';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, SetPage] = useState({});
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState({});
  const [selected, setSelected] = useState('By Name');
  const [counts, setCounts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all'); // 🆕 active tile
  const data = ['By Time', 'By Name'];

  const handleSearchChange = useCallback(
    debounce((value) => {
      setQuery((prev) => ({ ...prev, name: value.trim() }));
      SetPage((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );

  const handleCardClick = (status) => {
    // set active tile
    setSelectedStatus(status);

    if (status === 'all') {
      setQuery((prev) => {
        const { review_status, ...rest } = prev;
        return rest;
      });
    } else {
      setQuery((prev) => ({ ...prev, review_status: status }));
    }
    SetPage((prev) => ({ ...prev, page: 1 }));
  };

  const getReviewsList = useCallback(() => {
    getReviews({ ...page, ...query })
      .then((res) => {
        const countsObj = res?.count?.reduce((acc, item) => {
          if (item._id) {
            acc[item._id] = item.count;
          }
          return acc;
        }, {});
        countsObj.total = Object.values(countsObj).reduce((sum, c) => sum + (c || 0), 0);
        setCounts(countsObj);
        setReviews(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, query]);

  useEffect(() => {
    setLoading(true);
    getReviewsList();
  }, [getReviewsList]);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Poppins',
          colorPrimary: '#001529',
          colorLinkActive: '#001529',
          colorLinkHover: '#001529',
          colorLink: '#001529',
        },
      }}
    >
      <div className='w-full bg-[#F4F4F4] h-[100svh] p-6 font-poppins'>
        <div className='flex flex-wrap md:gap-[32px] gap-4'>
          <ReviewsCountCard
            color='#6B7280'
            title='All'
            value={counts?.total}
            type='all'
            active={selectedStatus === 'all'} // 🆕
            onClick={handleCardClick}
          />
          <ReviewsCountCard
            color='#5070DD'
            title='Awaiting Review'
            value={counts?.uploaded}
            type='uploaded'
            active={selectedStatus === 'uploaded'} // 🆕
            onClick={handleCardClick}
          />
          <ReviewsCountCard
            color='#FF994D'
            title='Request Change'
            type='revision_required'
            value={counts?.revision_required}
            active={selectedStatus === 'revision_required'} // 🆕
            onClick={handleCardClick}
          />
          <ReviewsCountCard
            color='#26AB6C'
            title='Completed'
            value={counts?.completed}
            type='completed'
            active={selectedStatus === 'completed'} // 🆕
            onClick={handleCardClick}
          />
          <ReviewsCountCard
            color='#DC2626'
            title='Unsubmitted'
            value={counts?.not_uploaded}
            type='not_uploaded'
            active={selectedStatus === 'not_uploaded'} // 🆕
            onClick={handleCardClick}
          />
        </div>

        <div
          id='refunds_request'
          className='w-full flex flex-col gap-4 justify-center items-center bg-white rounded-2xl py-6 mt-6'
        >
          <div className='w-full justify-between flex px-6'>
            <SearchInput
              search={search}
              setSearch={(value) => {
                setSearch(value);
                handleSearchChange(value);
              }}
              placeholder={`Search`}
            />
            <Sort2
              query={query}
              setQuery={setQuery}
              selected={selected}
              setSelected={setSelected}
              data={data}
            />
          </div>
          <SidebarContext.Provider
            value={{
              total: reviews?.total,
              page,
              SetPage,
              getList: getReviewsList,
            }}
          >
            <CustomTable
              loading={loading}
              columns={reviewsTableColumn}
              tableData={reviews?.data || []}
            />
          </SidebarContext.Provider>
        </div>
      </div>
    </ConfigProvider>
  );
}

const ReviewsCountCard = ({
  color = 'gray',
  title,
  value = 0,
  type = '',
  onClick,
  active = false,
}) => {
  return (
    <div
      onClick={() => onClick?.(type)}
      className={`
        cursor-pointer p-[10px] pl-[20px] rounded-lg flex flex-col 
        md:max-w-[250px] max-w-full w-full transition-all duration-300
        ${active ? 'border-4 border-black/50' : 'border-4 border-transparent'}
      `}
      style={{ background: color }}
    >
      <span className='text-base font-medium text-white'>{title}</span>
      <h1 className='text-[32px] font-semibold text-white'>{value}</h1>
    </div>
  );
};
