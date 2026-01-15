import BreadcrumbUI from '@/MonitoringService/Components/common/breadcrumb';
import CardUI from '@/MonitoringService/Components/common/card';
import TableUI from '@/MonitoringService/Components/common/table';
import { toast } from '@/MonitoringService/Components/common/toast';
import CustomerTable from '@/MonitoringService/Components/CustomerTable';
import { Button } from '@/MonitoringService/Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/MonitoringService/Components/ui/dropdown-menu';
import { Input } from '@/MonitoringService/Components/ui/input';
import { Switch } from '@/MonitoringService/Components/ui/switch';
import { ThemeToggleSwitch } from '@/MonitoringService/Components/ui/ThemeToggleSwitch';
import { TableProvider, useTable } from '@/MonitoringService/Context/TableContext';
import { ChevronRightIcon, GitBranch, Loader2Icon } from 'lucide-react';
import React from 'react';
const Component = () => {
  function onClick() {
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        onClick: () => console.log('Undo'),
      },
    });
    toast.error('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        onClick: () => console.log('Undo'),
      },
    });
    toast.warning('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        onClick: () => console.log('Undo'),
      },
    });
  }

  return (
    <div>
      <h2 className='text-3xl font-bold text-ms-primary mb-4'>Components</h2>
      <div className='flex gap-2 flex-wrap'>
        <Button onClick={onClick} size='lg'>
          Primary
        </Button>
        <Button onClick={onClick}>Primary</Button>
        <Button onClick={onClick} size='sm'>
          Primary
        </Button>
        <div className='flex'>
          <Button onClick={onClick} size='lg' className='rounded-r-none'>
            Primary
          </Button>
          <Button onClick={onClick} variant='secondary' size='lg' className='rounded-l-none'>
            Primary
          </Button>
        </div>
        <Button onClick={onClick} size='lg' variant='destructive'>
          Danger
        </Button>
        <Button onClick={onClick} size='lg' variant='outline'>
          Outline
        </Button>
        <Button onClick={onClick} size='lg' variant='ghost'>
          Ghost
        </Button>
        <Button onClick={onClick} size='lg' variant='secondary'>
          Secondary
        </Button>
        <Button variant='secondary' size='icon'>
          <ChevronRightIcon />
        </Button>
        <Button variant='outline' size='lg'>
          <GitBranch /> New Branch
        </Button>
        <Button size='lg' disabled>
          <Loader2Icon className='animate-spin' />
          Please wait
        </Button>
      </div>
      <div className='py-2'>
        <hr />
      </div>
      {/* <div className="flex flex-col gap-3">
        <Input placeholder="Default input" />
        <Input size="sm" variant="filled" placeholder="Small input" />
        <Input variant="outline" placeholder="Outline input" />
        <Input variant="filled" placeholder="Filled input" />
        <Input type="password" variant="filled" placeholder="Filled input" />
      </div> */}
      <div className='py-2'>
        <hr />
      </div>
      <BreadcrumbUI />
      <div className='py-2'>
        <hr />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='secondary' size='lg'>
            Open
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='start'>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>Status Bar</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem disabled>Activity Bar</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Panel</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className='py-2'>
        <hr />
      </div>

      <TableProvider onAction={(event) => console.log('Table Action:', event)}>
        <CustomerTable />
      </TableProvider>
      <div className='py-2'>
        <hr />
      </div>
      <ThemeToggleSwitch />
      <div className='py-2'>
        <hr />
      </div>
      <Switch id='airplane-mode' />
      <div className='py-2'>
        <hr />
      </div>
      <div className='flex flex-col gap-4 max-w-[600px]'>
        <CardUI title='Alert Overview'>
          <div className='p-4'>This is the content</div>
        </CardUI>
        <CardUI
          title='Users'
          actions={
            <Button variant='tertiary'>
              {' '}
              <GitBranch /> See all
            </Button>
          }
        >
          <div className='p-4'>Table or list goes here</div>
        </CardUI>
        <CardUI variant='shine' title='Important Alerts'>
          <div className=''>Content goes here</div>
        </CardUI>
        <CardUI variant='noborder' title={<div className='text-xl font-bold'>Hi there</div>}>
          <div className='p-6'>Content goes here</div>
        </CardUI>
        <CardUI variant='noborder'>
          <div className='p-6'>Content goes here</div>
        </CardUI>
      </div>

      <div className='py-2'>
        <hr />
      </div>
      <div className='bg-destructive text-destructive-foreground size-44'>D</div>
      <div className='bg-confirm text-confirm-foreground size-44'>G</div>
    </div>
  );
};

export default Component;
