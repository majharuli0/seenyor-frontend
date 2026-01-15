import { Suspense } from 'react';
import { Skeleton } from 'antd';

export function CenteredSkeleton() {
  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='grid grid-cols-2 grid-rows-2 gap-3'>
        <Skeleton.Avatar active size={32} shape='circle' />
        <Skeleton.Avatar active size={32} shape='square' />
        <Skeleton.Avatar active size={32} shape='square' />
        <Skeleton.Avatar active size={32} shape='circle' />
      </div>
    </div>
  );
}
