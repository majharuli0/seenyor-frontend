import * as React from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Shared/shadncn-ui/table';
import { Breadcrumb, Button, Spin } from 'antd';
import { getaAlarmLogs } from '@/api/elderly';
import InlineActionManu from '../ActionManu/InlineActionManu';
import AlertName from '../NameCol/AlertName';
import {
  formatMilliseconds,
  getAlertInfoViaEventDetails,
  getResponseTime,
  transformDateAndTimeToDuration,
} from '@/utils/helper';
import LogsViweModal from '../LogsViewModal';
import LogsView from '../LogsView';
import { CgBorderStyleSolid } from 'react-icons/cg';

const NotificationIcon = ({ children }) => (
  <div className='w-[32px] h-[32px] rounded-full flex items-center justify-center text-white'>
    {children}
  </div>
);

export function AlarmLogsTable({ toDate, fromDate, setAlarmsCounts, query = null, page, setPage }) {
  const [data, setData] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [limit] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [openLogModal, setOpenLogModal] = React.useState(false);

  const columns = [
    {
      accessorKey: 'title',
      header: 'Alarm Name',
      cell: ({ row }) => {
        return (
          <div className='flex items-center space-x-3'>
            <div className='p-[10px] bg-red-50 text-red-500 rounded-full flex items-center justify-center'>
              {React.createElement(
                getAlertInfoViaEventDetails(row?.original)?.icon2 || CgBorderStyleSolid,
                {
                  size: 20,
                  color: 'red',
                }
              )}
            </div>
            <div>
              <h3 className='text-primary text-[15px]'>
                {getAlertInfoViaEventDetails(row?.original)?.title}
              </h3>
              <p className='text-[13px] text-gray-500 mt-1'>Room {row?.original?.room_no}</p>
            </div>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "Status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     return <div className="text-sm">{row?.original?.closed_at}</div>;
    //   },
    // },
    {
      accessorKey: 'incident_time',
      header: 'Incident Time',
      cell: ({ row }) => {
        const createdAt = row?.original?.created_at;
        return (
          <div className='text-sm'>
            <div>{new Date(createdAt).toLocaleTimeString()}</div>
            <div className='text-gray-500 text-[12px]'>
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'staff_entered',
      header: 'Responded At',
      cell: ({ row }) => {
        const responseAt = row?.original?.response_details?.created_at;
        if (!responseAt) {
          return <span className='italic text-sm opacity-40'>Not Vsited Yet</span>;
        }

        return (
          <div className='text-sm'>
            <div>{new Date(row?.original?.response_details?.created_at).toLocaleTimeString()}</div>
            <div className='text-gray-500 text-[12px]'>
              {new Date(row?.original?.response_details?.created_at).toLocaleDateString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'resolved',
      header: 'Resolved',
      cell: ({ row }) => {
        const closedAt = row?.original?.closed_at;
        if (!closedAt) return <span className='italic text-sm opacity-40'>Unresolved</span>;
        return (
          <div className='text-sm'>
            <div>{new Date(closedAt).toLocaleTimeString()}</div>
            <div className='text-gray-500 text-[12px]'>
              {new Date(closedAt).toLocaleDateString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'resolved_by',
      header: 'Resolved By',
      cell: ({ row }) =>
        row?.original?.closed_by || <span className='italic text-sm opacity-40'>Unresolved</span>,
    },
    {
      accessorKey: 'response_time',
      header: 'Response Time',
      cell: ({ row }) => {
        return (
          <div className=''>
            {row?.original?.response_details?.created_at ? (
              getResponseTime(
                row?.original?.created_at,
                row?.original?.response_details?.created_at
              )
            ) : (
              <span className='italic text-sm opacity-40'>Not Vsited Yet</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) =>
        row?.original?.is_resolved ? (
          row?.original?.status ? (
            'True Alarm'
          ) : (
            'False Alarm'
          )
        ) : (
          <span className='italic text-sm opacity-40'>Unresolved</span>
        ),
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) =>
        row?.original?.comment || <span className='italic text-sm opacity-40'>No Comments</span>,
    },

    // {
    //   accessorKey: "logs",
    //   header: () => <div className="text-left">Logs</div>,
    //   cell: ({ row }) => (
    //     <div className="text-left font-medium">
    //       <LogsView data={row?.original} />
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "actions",
    //   header: () => <div className="text-right"></div>,
    //   cell: ({ row }) => (
    //     <div>
    //       <InlineActionManu onlyFall={true} row={row?.original} />
    //     </div>
    //   ),
    // },
  ];

  const getAlarmsLogs = React.useCallback(() => {
    setLoading(true);
    getaAlarmLogs({
      page,
      to_date: toDate,
      from_date: fromDate,
      event: query ? JSON.stringify(query) : null,
    })
      .then((res) => {
        setAlarmsCounts({
          fall: res?.fall_avg_res_time,
          fall_total: res?.count?.filter((item) => item.event == '2')[0]?.count || 0,
          device_offline_total: res?.count?.filter((item) => item.event == '5')[0]?.count || 0,
          off_bed_total: res?.count?.filter((item) => item.event == '9')[0]?.count || 0,
        });
        setData(res.data || []);
        setTotalPages(res.total_pages || 1);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [page, toDate, fromDate, query]);
  React.useEffect(() => {
    getAlarmsLogs();
  }, [getAlarmsLogs]);
  React.useEffect(() => {
    setPage(1);
  }, [toDate, fromDate]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className='w-full'>
      <div className='overflow-hidden '>
        <Spin spinning={loading}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='bg-[#F4F4FB] !border-none'>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className='!border-none px-6 py-2'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFC]'} !border-none`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='!border-none px-6 py-2'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className='!border-none'>
                  <TableCell
                    colSpan={columns.length}
                    className='text-center !border-none px-4 py-2'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Spin>
      </div>

      <div className='flex items-center justify-between py-4'>
        <span className='text-sm'>
          Page {page} of {totalPages}
        </span>
        <div className='space-x-2'>
          <Button
            size='sm'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            size='sm'
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
