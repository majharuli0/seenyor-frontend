import React, { useCallback, useEffect, useState } from 'react';
import { Table, Select, DatePicker, Spin, Button, ConfigProvider, Input, Drawer } from 'antd';
import dayjs from 'dayjs';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getVisitLogs } from '@/api/elderly';
import { getResponseTime } from '@/utils/helper';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

export default function VisitLogsByRoom({ setOpen, open, room_id }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  function onClose() {
    setOpen(false);
  }

  const getVisitLogsData = useCallback(
    (currentPage = 1, append = false) => {
      setLoading(true);

      getVisitLogs({
        limit: 30,
        page: currentPage,
        room_no: room_id,
        to_date: selectedDate ? selectedDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        sort_by: sortOrder,
      })
        .then((res) => {
          // append or replace data
          setData((prev) => (append ? [...prev, ...res.data] : res.data));

          // use total_pages from API to decide hasMore
          if (res.total_pages && currentPage < res.total_pages) {
            setHasMore(true);
          } else {
            setHasMore(false);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    },
    [sortOrder, selectedRoom, selectedDate]
  );

  // reload when filters change
  useEffect(() => {
    setPage(1);
    getVisitLogsData(1, false);
  }, [getVisitLogsData]);

  // load next page
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getVisitLogsData(nextPage, true);
  };

  const columns = [
    {
      title: <span className='px-0 block font-medium text-gray-700'>Check-In</span>,
      dataIndex: 'time_of_visit',
      key: 'time_of_visit',
      render: (text) => (
        <div className='px-2'>
          <div className='rounded-[6px] text-nowrap bg-white border border-[#E4E4E7] px-3 py-1 text-[12px] font-medium text-gray-700 inline-block'>
            {dayjs(text).format('HH:mm:ss')}
          </div>
        </div>
      ),
    },
    {
      title: <span className='px-0 block  font-medium text-gray-700'>Check-Out</span>,
      dataIndex: 'exit_time',
      key: 'exit_time',
      render: (text) => (
        <div className='px-2 '>{(text && dayjs(text).format('HH:mm:ss')) || '-'}</div>
      ),
    },
    {
      title: <span className='px-0 block  font-medium text-gray-700'>Stay</span>,
      key: 'duration',
      render: (row) => (
        <div className='px-2 text-nowrap'>
          {getResponseTime(row?.time_of_visit, row?.exit_time)}
        </div>
      ),
    },
    {
      title: <span className='px-0 block text-nowrap font-medium text-gray-700'>Occupancy</span>,
      key: 'event_user_no',
      render: (row) => <div className='px-2'>{row?.event_user_no}</div>,
    },
  ];

  return (
    <Drawer
      title={null}
      onClose={onClose}
      closeIcon={<MdKeyboardDoubleArrowRight size={24} />}
      size='large'
      open={true}
    >
      <div className=' bg-white rounded-[12px] w-full'>
        <h2 className='text-[22px] font-semibold mb-4'>
          Visit Logs - <small className='text-slate-500'> Room {room_id}</small>
        </h2>
        <ConfigProvider theme={{ token: { colorPrimary: '#64748b' } }}>
          <div className='flex items-center gap-3 mb-4'>
            <DatePicker onChange={(date) => setSelectedDate(date)} placeholder="Today's Visits" />
            <div
              className='flex items-center px-3 py-1 border rounded cursor-pointer'
              onClick={() => setSortOrder((prev) => (prev === 1 ? 0 : 1))}
            >
              {sortOrder === 1 ? 'Oldest First' : 'Latest First'}
              {sortOrder === 1 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            </div>
          </div>
        </ConfigProvider>

        <div style={{ maxHeight: 'auto', overflowY: 'auto' }}>
          <div className='w-full '>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              loading={loading && page === 1}
              size='middle'
              rowClassName={(_, index) =>
                index === 0 ? 'bg-white' : (index - 1) % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }
              className='
      [&_.ant-table-thead>tr>th]:!bg-gray-100
      [&_.ant-table-thead>tr>th]:!py-3
      [&_.ant-table-thead>tr>th]:!text-gray-700
      [&_.ant-table-thead>tr>th]:!font-semibold
      [&_.ant-table-tbody_td]:!border-none
      [&_.ant-table-tbody_td]:!whitespace-normal
    '
            />
          </div>
        </div>

        {hasMore && !loading && (
          <div className='flex justify-center mt-4'>
            <Button onClick={loadMore} type='default'>
              Load More
            </Button>
          </div>
        )}
        {hasMore && loading && (
          <div className='flex justify-center p-4'>
            <Spin />
          </div>
        )}
      </div>
    </Drawer>
  );
}
