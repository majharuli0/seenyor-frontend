import React, { useEffect, useCallback, useMemo, useState } from 'react';
import CardUI from '../common/card';
import TableUI from '../common/table';
import { Button } from '../ui/button';
import { TableProvider, useTable } from '@/MonitoringService/Context/TableContext';
import { useColumns } from '@/MonitoringService/Utiles/columnsUtil';
import { useParams } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { BiSort } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/input';
import { useCustomers } from '@/MonitoringService/hooks/useCustomer';
import debounce from 'lodash/debounce';
import { useCustomerStore } from '@/MonitoringService/store/useCustomerStore';

export default function CustomerTable() {
  const { page, setPage, actions, setActions } = useTable();
  const { setCustomers } = useCustomerStore();
  const { type } = useParams();
  const [isAsc, setIsAsc] = useState(null);
  const columns = useColumns('customer');
  const [total, setTotal] = useState(0);
  const [quary, setQuay] = useState({});
  const {
    data: customer,
    isLoading,
    isSuccess,
    refetch,
  } = useCustomers({
    ...page,
    ...quary,
    monitoring_agency_status: type === 'deactivated' ? 'deactivate' : 'active',
    priority: isAsc ? -1 : 1,
  });
  useEffect(() => {
    if (isSuccess && customer) setCustomers(customer?.data || []);
    setTotal(customer?.total || 0);
  }, [customer, isSuccess]);

  const handleToggle = () => setIsAsc((prev) => !prev);
  const handleSearchChnage = useCallback(
    debounce((value) => {
      setQuay((prev) => ({ ...prev, search: value?.trim() }));
      setPage((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      handleSearchChnage.cancel();
    };
  }, []);
  return (
    <CardUI
      variant='noborder'
      title={
        <div className='text-xl font-normal capitalize flex items-center gap-2'>
          {type} Customers{' '}
          <Badge
            className={`text-sm ${
              type !== 'active' ? (type == 'paused' ? 'bg-yellow-600' : 'bg-red-500') : ''
            }`}
          >
            {total}
          </Badge>
        </div>
      }
      className='mb-7'
      actions={
        <div className='flex items-center gap-2'>
          <Input
            className=''
            size='bt'
            variant='outline'
            placeholder='Search Customer'
            onChange={(e) => {
              if (total > 0) {
                handleSearchChnage(e.target.value);
              }
            }}
          />
          <Button
            variant='tertiary'
            onClick={handleToggle}
            className='flex items-center gap-2 select-none'
          >
            <motion.span
              animate={{ rotate: isAsc ? 0 : 180 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className='inline-block'
            >
              <BiSort className='w-5 h-5' />
            </motion.span>
            <span>Priority</span>
          </Button>
        </div>
      }
    >
      <div className='bg-background/50'>
        <TableUI
          columns={columns}
          data={customer?.data || []}
          isPagination
          total={total}
          limit={15}
          headerClassName='bg-background/60'
          headerTextClassName='text-text/60'
          isLoading={isLoading}
          rowClassName=''
          //   cellClassName="text-gray-200"
        />
      </div>
    </CardUI>
  );
}
