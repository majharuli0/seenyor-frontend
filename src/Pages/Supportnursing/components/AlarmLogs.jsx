import React, { useContext } from 'react';
import AlermLogsCard from './AlermLogsCard';
import { getaAlarmLogs } from '@/api/elderly';
import { Empty, Button, Spin } from 'antd';
import { SidebarContext } from '@/Context/CustomContext';
import dayjs from 'dayjs';

export default function AlermLogs({ id }) {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 5;

  const { resolvedAlarm, setResolvedAlarm } = useContext(SidebarContext);

  const getAlarmsLogs = React.useCallback(
    (currentPage = 1) => {
      setLoading(true);
      getaAlarmLogs({
        room_id: id,
        page: currentPage,
        limit,
        to_date: dayjs().format('YYYY-MM-DD'),
      })
        .then((res) => {
          if (currentPage === 1) {
            setData(res.data || []);
          } else {
            setData((prev) => [...prev, ...(res.data || [])]);
          }
          setTotal(res.total);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    },

    [id, resolvedAlarm]
  );

  React.useEffect(() => {
    if (id) {
      setPage(1);
      getAlarmsLogs(1);
    }
  }, [id, getAlarmsLogs]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getAlarmsLogs(nextPage);
  };

  const hasMore = data.length < total;

  return (
    <div className='bg-white'>
      <div className='flex items-center justify-center gap-2 mb-4'>
        {/* <div className="size-3 bg-slate-500 rounded-sm"></div> */}
        <h3 className='text-base font-medium text-nowrap'>Today’s Alarm Logs</h3>
        <hr className='w-full m-0' />
      </div>

      {data?.length === 0 && !loading ? (
        <Empty description='Alarm Logs Not Available For Today' className='mt-4' />
      ) : (
        <div className='flex flex-col w-full gap-3'>
          {data?.map((item, indx) => (
            <AlermLogsCard data={item} key={indx} />
          ))}

          {loading && (
            <div className='flex justify-center my-2'>
              <Spin />
            </div>
          )}

          {!loading && hasMore && (
            <div className='flex justify-center mt-3'>
              <Button onClick={handleLoadMore}>Load More</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
