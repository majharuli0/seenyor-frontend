import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { TableCell, TableRow } from '../ui/table';

export const TableSkeleton = () => (
  <>
    {[...Array(4)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className='h-4 w-[150px]' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-[100px]' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-[120px]' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-[80px]' />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export const EmptyState = () => (
  <div className='flex flex-col items-center justify-center py-12 text-center'>
    <Skeleton className='h-16 w-16 rounded-full mb-4' />
    <h3 className='text-lg font-medium text-muted-foreground'>No Data Found</h3>
    <p className='text-sm text-muted-foreground'>
      Try adjusting your filters or adding new records.
    </p>
    <Button variant='outline' className='mt-4'>
      Reload
    </Button>
  </div>
);
