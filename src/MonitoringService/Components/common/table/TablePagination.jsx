import { useTable } from '../../../Context/TableContext';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export function TablePagination({ total }) {
  const { page, setPage } = useTable();
  const totalPages = Math.ceil(total / page.limit);
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setPage({ page: 1, limit: newLimit });
  };
  const getPageNumbers = () => {
    const pages = [];
    const page_number = page.page;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page_number <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page_number >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        if (page_number < totalPages / 2) {
          pages.push(1, page_number - 1, page_number, page_number + 1, '...', totalPages);
        } else {
          pages.push(1, '...', page_number - 1, page_number, page_number + 1, totalPages);
        }
      }
    }

    return pages;
  };

  return (
    <div className='flex justify-between items-center p-3.5 px-6 border-t border-border bg-background/20'>
      {/* Left: Limit Selector */}
      <div className='flex items-center gap-2 !text-[12px] text-muted-foreground'>
        Show
        <Select
          value={String(page.limit)}
          onValueChange={(value) => setPage({ page: 1, limit: Number(value) })}
        >
          <SelectTrigger className='text-text' size='sm'>
            <SelectValue placeholder={page.limit} />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        Entries
      </div>

      {/* Right: Pagination controls */}
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          disabled={page.page === 1}
          onClick={() =>
            setPage((p) => ({
              ...p,
              page: Math.max(1, p.page - 1),
            }))
          }
        >
          Previous
        </Button>

        <div className='flex items-center gap-1'>
          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className='px-2 text-muted-foreground'>
                ...
              </span>
            ) : (
              <Button
                key={`page-${p}`}
                variant={p === page.page ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setPage((prev) => ({ ...prev, page: p }))}
              >
                {p}
              </Button>
            )
          )}
        </div>

        <Button
          variant='outline'
          size='sm'
          disabled={page.page === totalPages || totalPages === 0}
          onClick={() =>
            setPage((p) => ({
              ...p,
              page: Math.min(totalPages, p.page + 1),
            }))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
