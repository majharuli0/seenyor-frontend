import React from 'react';
import clsx from 'clsx';

export default function CardUI({
  variant = 'default', // "default" | "shine" | "noborder"
  bg = 'bg-card',
  title, // string | JSX | null
  actions, // JSX (buttons, dropdowns etc.)
  header = true, // show/hide header entirely
  headerPadding = 'p-4', // allow dynamic padding: "p-4", "px-2 py-1", "p-0"
  children,
  className = '',
}) {
  const variantClasses = {
    default: 'border border-border rounded-xl',
    shine: 'border-borderL rounded-xl', // left border highlight
    noborder: 'rounded-xl', // no border
  };

  return (
    <div className={clsx('w-full h-full overflow-hidden', variantClasses[variant], bg, className)}>
      <div className='bg-card'>
        {/* Header (only if enabled and has content) */}
        {header && (title || actions) && (
          <div
            className={clsx(
              'flex items-center justify-between border-b border-border/60',
              headerPadding
            )}
          >
            {title && (
              <div className='text-sm font-medium text-text'>
                {typeof title === 'string' ? <h3>{title}</h3> : title}
              </div>
            )}
            {actions && <div className='flex items-center gap-2'>{actions}</div>}
          </div>
        )}

        {/* Content */}
        <div className='p-0 w-fill !h-full'>{children}</div>
      </div>
    </div>
  );
}
