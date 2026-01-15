import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const ShiftBlock = ({ shift, agent, onUpdate }) => {
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Colors based on role
  const getColors = (role) => {
    switch (role?.toLowerCase()) {
      case 'supervisor':
        return 'from-green-500 to-green-600 border-green-400/50';
      case 'admin':
        return 'from-purple-500 to-purple-600 border-purple-400/50';
      default:
        return 'from-blue-500 to-blue-600 border-blue-400/50';
    }
  };

  // Convert minutes (0-1440) to percentage (0-100)
  const toPercent = (mins) => Math.max(0, Math.min(100, (mins / 1440) * 100));

  // Format MM:SS for display as HH:MM AM/PM
  const formatTime = (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const ampm = hours >= 12 && hours < 24 ? 'PM' : 'AM';

    // Normalize hours
    const displayHours = hours % 12;
    const formattedHours = displayHours === 0 ? 12 : displayHours;

    return `${formattedHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  // --- Interaction Handlers ---

  const handleMouseDown = (e, type) => {
    // Determine context: standard dragging or resizing
    // type can be 'drag', 'resize-left', 'resize-right'
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const initialStartMinutes = shift.startMinutes;
    const initialDuration = shift.durationMinutes;

    // We need the parent width to calculate pixels -> minutes
    // Finding the closest "Timeline Track" (parent's parent or known container)
    // A robust way: find the AgentRow container width.
    // The ShiftBlock is inside a relative div (the track).
    const trackWidth = containerRef.current?.parentElement?.offsetWidth || 1000;

    const handleMouseMove = (moveEvent) => {
      const deltaPixels = moveEvent.clientX - startX;
      const deltaPercent = (deltaPixels / trackWidth) * 100;
      const deltaMinutes = Math.round((deltaPercent / 100) * 1440);

      // Snap to 15m
      const snappedDelta = Math.round(deltaMinutes / 15) * 15;

      if (type === 'drag') {
        setIsDragging(true);
        const newStart = Math.min(
          1440 - initialDuration,
          Math.max(0, initialStartMinutes + snappedDelta)
        );
        onUpdate({ ...shift, startMinutes: newStart });
      } else if (type === 'resize-right') {
        setIsResizing(true);
        const newDuration = Math.max(
          30,
          Math.min(1440 - initialStartMinutes, initialDuration + snappedDelta)
        );
        onUpdate({ ...shift, durationMinutes: newDuration });
      } else if (type === 'resize-left') {
        setIsResizing(true);
        // Left resize is tricky: start time moves, duration shrinks/grows
        // newStart + newDuration must equal oldStart + oldDuration + diff?
        // Actually: End Time stays fixed = initialStart + initialDuration
        const originalEndTime = initialStartMinutes + initialDuration;

        let newStart = initialStartMinutes + snappedDelta;
        newStart = Math.max(0, Math.min(newStart, originalEndTime - 30)); // Min 30m duration

        const newDuration = originalEndTime - newStart;
        onUpdate({ ...shift, startMinutes: newStart, durationMinutes: newDuration });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute h-10 top-1 rounded-full bg-gradient-to-r border shadow-lg flex items-center px-1 overflow-hidden transition-colors duration-200 hover:brightness-110 !select-none group z-10',
        isDragging ? 'cursor-grabbing z-20 brightness-110 scale-[1.01]' : 'cursor-grab',
        isResizing ? 'cursor-col-resize z-20' : '',
        getColors(shift.type || agent.role)
      )}
      style={{
        left: `${toPercent(shift.startMinutes)}%`,
        width: `${toPercent(Math.min(shift.durationMinutes, 1440 - shift.startMinutes))}%`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
      }}
      onMouseDown={(e) => handleMouseDown(e, 'drag')}
      title={`${agent.name} (${formatTime(shift.startMinutes)} - ${formatTime(shift.startMinutes + shift.durationMinutes)})`}
    >
      {/* Avatar Container */}
      <div className='relative shrink-0 mr-2 pointer-events-none'>
        <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px] text-white overflow-hidden border border-white/20'>
          {agent.name?.[0]}
          {agent.last_name?.[0]}
        </div>
        <div className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-green-800 rounded-full' />
      </div>

      {/* Text Info */}
      {shift.durationMinutes > 60 && (
        <div className='flex flex-col leading-none text-white whitespace-nowrap overflow-hidden pointer-events-none'>
          <span className='font-semibold text-xs truncate drop-shadow-sm'>{agent.name}</span>
          <span className='text-[10px] opacity-90 truncate drop-shadow-sm'>
            {formatTime(shift.startMinutes)} -{' '}
            {formatTime(shift.startMinutes + shift.durationMinutes)}
          </span>
        </div>
      )}

      {/* Resize Handles */}
      <div
        className='absolute inset-y-0 left-0 w-3 cursor-e-resize opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity z-20'
        onMouseDown={(e) => handleMouseDown(e, 'resize-left')}
      />
      <div
        className='absolute inset-y-0 right-0 w-3 cursor-w-resize opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity z-20'
        onMouseDown={(e) => handleMouseDown(e, 'resize-right')}
      />
    </div>
  );
};

export default ShiftBlock;
/* eslint-disable react/prop-types */
