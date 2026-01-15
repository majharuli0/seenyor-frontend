import BreadcrumbUI from '@/MonitoringService/Components/common/breadcrumb';
import RoleManagmentTable from '@/MonitoringService/Components/RoleManagmentTable';
import { Button } from '@/MonitoringService/Components/ui/button';
import { TableProvider } from '@/MonitoringService/Context/TableContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function RoleManagment() {
  const navigate = useNavigate();
  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <Navigation />
        <div className='flex gap-2'>
          <Button
            size='lg'
            onClick={() => navigate('/ms/role-managment/performance-matrics')}
            variant={'tertiary'}
          >
            Performance Metrics
          </Button>
          <Button
            size='lg'
            onClick={() => navigate('/ms/role-managment/shift-calendar')}
            variant={'tertiary'}
          >
            Shift Calendar
          </Button>
        </div>
      </div>
      <div className='h-fit'>
        <TableProvider onAction={(event) => console.log('Table Action:', event)}>
          <RoleManagmentTable />
        </TableProvider>
      </div>
    </>
  );
}
const Navigation = () => {
  return (
    <>
      <div className='flex flex-col items-start gap-2'>
        <h1 className='text-text sm:text-xl text-lg'>Role Managment</h1>
        <div className='opacity-95'>
          <BreadcrumbUI skipPatterns={['customers/:type']} />
        </div>
      </div>
    </>
  );
};
