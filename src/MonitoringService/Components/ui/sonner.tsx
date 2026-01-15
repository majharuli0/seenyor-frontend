'use client';

import React from 'react';
import { Toaster as Sonner } from 'sonner';
import { useTheme } from '../../Components/ThemeProvider';
const Toaster = (props) => {
  const { theme = 'light' } = useTheme();

  return (
    <Sonner
      theme={theme} // "light" | "dark" | "system"
      className='toaster group'
      style={{
        '--normal-bg': 'rgb(var(--ms-card-color))',
        '--normal-text': 'rgb(var(--ms-popover-foreground-color))',
        '--normal-border': 'rgb(var(--ms-border-color))',
      }}
      {...props}
    />
  );
};

export { Toaster };
