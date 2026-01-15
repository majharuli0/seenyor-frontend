import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

export default function UserName({ data = {} }) {
  return (
    <div className='flex items-center gap-3'>
      <Avatar className='size-10 !rounded-md'>
        {/* <AvatarImage src="https://github.com/shadcn.png" alt="" /> */}
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <div className='font-medium'>
          {data.name} {data.last_name}
        </div>
        <span className='text-muted-foreground mt-0.5 text-xs'>
          {!data?.role && <>{data.age} yrs old</>}
          {data.email || 'No Email'}
        </span>
      </div>
    </div>
  );
}
