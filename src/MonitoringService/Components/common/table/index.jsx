import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../ui/table';
import { Skeleton } from '../../ui/skeleton';
import { useTable } from '../../../Context/TableContext';
import { TablePagination } from './TablePagination';
import { Inbox } from 'lucide-react';

export default function TableUI({
  columns = [],
  data = [],
  isLoading = false,
  isPagination = false,
  total = 0,
  limit = 10,
  headerClassName = 'bg-background/60',
  headerTextClassName = 'text-text/60',
  rowClassName = '',
  skeletonRow,
  cellClassName = 'py-3',
}) {
  const { triggerAction, page } = useTable();
  const skeletonRows = skeletonRow || (page?.limit ? page?.limit : 5);

  return (
    <div className='w-full'>
      {/* Table */}
      <Table>
        <TableHeader className={headerClassName}>
          <TableRow>
            {columns &&
              columns.map((col) => (
                <TableHead key={col.key} className={`${headerTextClassName} font-medium`}>
                  {col.header}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className={rowClassName + '!space-y-2'}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={'!py-[22px]'}>
                      <Skeleton className='h-4 w-full rounded-md bg-card-300' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.length > 0 &&
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className={rowClassName}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cellClassName}>
                      {typeof col.render === 'function'
                        ? col.render(row[col.key], row, rowIndex, () =>
                            triggerAction('cellClick', { col, row })
                          )
                        : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {!isLoading && data.length === 0 && renderEmptyState()}
      {/* Pagination */}
      {isPagination && <TablePagination total={total} limit={limit} />}
    </div>
  );
}
const renderEmptyState = () => (
  <div className='flex flex-col items-center justify-center py-24 text-center text-muted-foreground'>
    <Inbox className='w-10 h-10 mb-3 text-muted-foreground/80' />
    <p className='text-sm font-medium'>No data available</p>
    <p className='text-xs text-muted-foreground'>Try adjusting your filters or check back later.</p>
  </div>
);
