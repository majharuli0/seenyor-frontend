import React from 'react';
import { Button } from '../../ui/button';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

export default function AlarmAction({ actions = {}, data }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='rounded-full' size='icon' variant='secondary'>
            <BsThreeDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setTimeout(() => actions?.showFallPlayBack?.(data), 0);
              }}
            >
              Fall Playback
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTimeout(() => actions?.showAlarmNote?.(data), 0);
              }}
            >
              View Alarm Note
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTimeout(() => actions?.showAlarmLog?.(data), 0);
              }}
            >
              View Alarm Logs
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
