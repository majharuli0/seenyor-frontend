import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '../../ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Drawer, DrawerContent, DrawerTrigger } from '../../ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCustomerStore } from '@/MonitoringService/store/useCustomerStore';
import { useSelectedItemStore } from '@/MonitoringService/store/useSelectedItemStore';

const LABEL_MAP = {
  ms: 'Home',
  dashboard: 'Dashboard',
  customer: 'Customers',
  customers: 'Customers',
  active: 'Active Customers',
  paused: 'Paused Customers',
  settings: 'Settings',
  analytics: 'Reporting & Analytics',
  theme: 'Theme',
};

const isMongoId = (segment) => /^[a-f\d]{24}$/i.test(segment);
const ITEMS_TO_DISPLAY = 3;

export default function BreadcrumbUI({ skipPatterns = [], customLabels = {} }) {
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = useState(false);
  const { selectedItem } = useSelectedItemStore();

  const customLabelsString = JSON.stringify(customLabels);
  const skipPatternsString = JSON.stringify(skipPatterns);

  const items = React.useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);

    const mapped = segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      let label = customLabels[segment] || LABEL_MAP[segment] || segment;

      if (customLabels[segment]) {
        label = customLabels[segment];
      } else if (segment === 'ms') {
        label = 'Home';
      } else if (isMongoId(segment)) {
        label = selectedItem || '...';
      } else if (!LABEL_MAP[segment]) {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      return { href: path, label, segment };
    });

    return mapped.filter((item, idx, arr) => {
      const next = arr[idx + 1]?.segment;

      if (idx > 0 && item.label === 'Dashboard' && arr[idx - 1].label === 'Home') {
        return false;
      }

      const shouldSkip = skipPatterns.some((pattern) => {
        const [parent, child] = pattern.split('/:');

        return item.segment === parent && next;
      });

      if (shouldSkip) return false;

      return true;
    });
  }, [location.pathname, selectedItem, customLabelsString, skipPatternsString]);

  const formatBreadcrumbLabel = (label) => {
    return label.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const renderItems = () => {
    if (items.length <= ITEMS_TO_DISPLAY) {
      return items.map((item, index) => (
        <BreadcrumbItem key={index}>
          {index !== items.length - 1 ? (
            <>
              <BreadcrumbLink asChild>
                <Link to={item.href}>{formatBreadcrumbLabel(item.label)}</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </>
          ) : (
            <BreadcrumbPage>{formatBreadcrumbLabel(item.label)}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
      ));
    }

    const first = items[0];
    const middle = items.slice(1, -1);
    const last = items[items.length - 1];

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={first.href}>{formatBreadcrumbLabel(first.label)}</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>

        <BreadcrumbItem>
          {isDesktop ? (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className='flex items-center gap-1'>
                <BreadcrumbEllipsis className='size-4' />
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                {middle.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <Link to={item.href}>{formatBreadcrumbLabel(item.label)}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger>
                <BreadcrumbEllipsis className='h-4 w-4' />
              </DrawerTrigger>
              <DrawerContent>
                <div className='grid gap-1 px-4'>
                  {middle.map((item, index) => (
                    <Link key={index} to={item.href} className='py-1 text-sm'>
                      {formatBreadcrumbLabel(item.label)}
                    </Link>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{formatBreadcrumbLabel(last.label)}</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderItems()}</BreadcrumbList>
    </Breadcrumb>
  );
}
