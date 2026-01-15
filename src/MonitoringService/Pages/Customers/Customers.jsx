import BreadcrumbUI from '@/MonitoringService/Components/common/breadcrumb';
import CustomerTable from '@/MonitoringService/Components/CustomerTable';
import { Button } from '@/MonitoringService/Components/ui/button';
import { ButtonGroup } from '@/MonitoringService/Components/ui/button-group';
import { TableProvider } from '@/MonitoringService/Context/TableContext';
import { useCustomers } from '@/MonitoringService/hooks/useCustomer';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Customers() {
  const navigate = useNavigate();
  const { type } = useParams();

  return (
    <>
      <div id='customer_heading' className='flex justify-between items-center mb-6'>
        <Navigation />
        <ButtonGroup>
          <Button
            size='lg'
            variant={type === 'active' ? '' : 'tertiary'}
            onClick={() => type !== 'active' && navigate('/ms/customers/active')}
          >
            Active
          </Button>
          {/* <Button
            size="lg"
            variant={type == "paused" ? "" : "tertiary"}
            className={
              type == "paused" ? "bg-yellow-600 hover:bg-yellow-600/90" : ""
            }
            onClick={() =>
              type !== "paused" && navigate("/ms/customers/paused")
            }
          >
            Paused
          </Button> */}
          <Button
            size='lg'
            variant={type == 'deactivated' ? 'destructive' : 'tertiary'}
            onClick={() => type !== 'deactivated' && navigate('/ms/customers/deactivated')}
          >
            Deactivated
          </Button>
        </ButtonGroup>
      </div>
      <div className='h-fit'>
        <TableProvider onAction={(event) => console.log('Table Action:', event)}>
          <CustomerTable />
        </TableProvider>
      </div>
    </>
  );
}
const Navigation = () => {
  return (
    <>
      <div className='flex flex-col items-start gap-2'>
        <h1 className='text-text sm:text-xl text-lg'>Customers</h1>
        <div className='opacity-95'>
          <BreadcrumbUI skipPatterns={['customers/:type']} />
        </div>
      </div>
    </>
  );
};
