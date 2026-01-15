import ShiftBlock from './ShiftBlock';

const AgentRow = ({ agent, shifts, onShiftUpdate }) => {
  // Grid Lines for background
  const gridLines = Array.from({ length: 24 }, (_, i) => i);

  // Format MM:SS for display
  const formatTime = (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const ampm = hours >= 12 && hours < 24 ? 'PM' : 'AM'; // simplistic check, assuming normalized < 24h usually, but totalMinutes can be > 24h

    // Normalize hours for AM/PM
    const displayHours = hours % 12;
    const formattedHours = displayHours === 0 ? 12 : displayHours;

    return `${formattedHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  const shiftTimeDisplay =
    shifts.length > 0
      ? shifts
          .map(
            (s) =>
              `${formatTime(s.startMinutes)} - ${formatTime(s.startMinutes + s.durationMinutes)}`
          )
          .join(', ')
      : 'No Shift';

  return (
    <div className='flex h-16 border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group bg-white dark:bg-transparent'>
      {/* Left Sidebar: Agent Info */}
      <div className='w-64 shrink-0 flex items-center px-4 gap-3 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/50 sticky left-0 z-20 backdrop-blur-sm transition-colors duration-300'>
        <div className='relative'>
          <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm border border-blue-200 dark:border-blue-500/30'>
            {agent.name?.[0]}
            {agent.last_name?.[0]}
          </div>
          <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full' />
        </div>
        <div className='flex flex-col min-w-0'>
          <span className='text-sm font-medium text-gray-900 dark:text-white truncate'>
            {agent.name} {agent.last_name}
          </span>
          <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
            {shiftTimeDisplay}
          </span>
        </div>
      </div>

      {/* Right Content: Timeline Track */}
      <div className='flex-1 relative bg-gray-50/50 dark:bg-slate-900/20'>
        {/* Background Grid */}
        <div className='absolute inset-0 flex pointer-events-none'>
          {gridLines.map((hour) => (
            <div key={hour} className='flex-1 border-r border-gray-200 dark:border-white/[0.03]' />
          ))}
        </div>

        {/* Shift Blocks */}
        <div className='absolute inset-0 top-2 bottom-2'>
          {shifts.map((shift) => (
            <ShiftBlock key={shift.id} shift={shift} agent={agent} onUpdate={onShiftUpdate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentRow;
/* eslint-disable react/prop-types */
