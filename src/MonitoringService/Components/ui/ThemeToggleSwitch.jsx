'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Sun, Moon } from 'lucide-react';

import { cn } from '@/lib/utils';

const ThemeToggleSwitch = React.forwardRef(({ className, checked, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    checked={checked}
    {...props}
    className={cn(
      'peer relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-none bg-card transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
  >
    {/* Background inactive icons */}
    <div className='absolute inset-0 flex items-center justify-between px-2 pointer-events-none'>
      <Moon className='h-4 w-4 text-muted-foreground opacity-60' />
      <Sun className='h-4 w-4 text-muted-foreground opacity-60' />
    </div>

    {/* Thumb with active icon */}
    <SwitchPrimitive.Thumb
      className={cn(
        'flex items-center justify-center h-7 w-7 rounded-full bg-white shadow-md ring-0 transition-transform',
        'data-[state=unchecked]:translate-x-1 data-[state=checked]:translate-x-8'
      )}
    >
      {!checked ? (
        <Moon className='h-4 w-4 text-indigo-900' />
      ) : (
        <Sun className='h-4 w-4 text-yellow-500' />
      )}
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
));
ThemeToggleSwitch.displayName = SwitchPrimitive.Root.displayName;

export { ThemeToggleSwitch };
