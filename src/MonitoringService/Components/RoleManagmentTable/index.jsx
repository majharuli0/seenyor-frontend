import React, { useEffect, useCallback, useMemo, useState } from 'react';
import CardUI from '../common/card';
import TableUI from '../common/table';
import { Button } from '../ui/button';
import { TableProvider, useTable } from '@/MonitoringService/Context/TableContext';
import { useColumns } from '@/MonitoringService/Utiles/columnsUtil';
import { useParams } from 'react-router-dom';
import { useDemoMode } from '@/MonitoringService/Context/DemoModeContext';
import { Badge } from '../ui/badge';
import { BiSort } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/input';
import debounce from 'lodash/debounce';
import { useCustomerStore } from '@/MonitoringService/store/useCustomerStore';
import CreateAndEditModal from '@/Components/CreateAndEditModal/CreateAndEditModal';
import CreateModal from '../common/CreateAndEditModal';
import { useCreateNewRole, useUsers } from '@/MonitoringService/hooks/UseUser';
import { useAgentStore } from '@/MonitoringService/store/useAgentStore';
import { usePermission } from '@/MonitoringService/store/usePermission';

export default function RoleManagmentTable() {
  const { page, setPage, actions, setActions } = useTable();
  const { can } = usePermission();
  const { isDemoMode } = useDemoMode();

  const { setAgents } = useAgentStore();
  const { type } = useParams();
  const [isAsc, setIsAsc] = useState(null);
  const columns = useColumns('role_managment');
  const [total, setTotal] = useState(0);
  const [quary, setQuay] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: createRole, isPending, isSuccess: isRoleCreated } = useCreateNewRole();

  const handleSubmit = async (formData) => {
    delete formData.role_name;
    createRole(formData);
    if (isRoleCreated) {
      setIsModalOpen(false);
    }
  };
  useEffect(() => {
    if (isRoleCreated) {
      setIsModalOpen(false);
    }
  }, [isRoleCreated]);
  const {
    data: agents,
    isLoading,
    isSuccess,
    refetch,
  } = useUsers({
    ...page,
    ...quary,
    role: 'monitoring_agent',
    soft_deleted: isAsc,
    isDemoMode: isDemoMode,
  });

  useEffect(() => {
    if (isSuccess && agents) setAgents(agents?.data || []);
    setTotal(agents?.total || 0);
  }, [agents, isSuccess]);

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
          {type} Total User <Badge className={`text-sm bg-primary`}>{total}</Badge>
        </div>
      }
      className='mb-7'
      actions={
        <div className='flex items-center gap-2'>
          <Input
            className=''
            size='bt'
            variant='outline'
            placeholder='Search User'
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
            <span>Status</span>
          </Button>
          {can('agent_role_creation') && (
            <Button
              className='flex items-center gap-2 select-none'
              onClick={() => setIsModalOpen(true)}
            >
              Create New Role
            </Button>
          )}
        </div>
      }
    >
      <div className='bg-background/50'>
        <TableUI
          columns={columns}
          data={agents?.data || []}
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
      <CreateModal
        isVisible={isModalOpen}
        setVisible={setIsModalOpen}
        isLoading={isPending}
        mode='create'
        isHeader={false}
        onSubmit={handleSubmit}
      />
    </CardUI>
  );
}
