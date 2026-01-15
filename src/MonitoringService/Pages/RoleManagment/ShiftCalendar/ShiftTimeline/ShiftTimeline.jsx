import TimelineHeader from './TimelineHeader';
import AgentRow from './AgentRow';

const ShiftTimeline = ({ agents, shifts, onShiftUpdate, onSave, hasUnsavedChanges }) => {
  return (
    <div className='w-full bg-white dark:bg-[#151921] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px] select-none text-gray-900 dark:text-white transition-colors duration-300'>
      {' '}
      {/* Fixed height for now */}
      {/* Header / Controls */}
      <div className='h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1A1F29]'>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Shift Coverage</h2>
        <div className='flex gap-2'>
          {hasUnsavedChanges && (
            <button
              onClick={onSave}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm'
            >
              Save Changes
            </button>
          )}
          {/* <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/5">
                        Export
                    </Button> */}
        </div>
      </div>
      {/* Timeline Area (Scrollable) */}
      <div className='flex-1 overflow-auto flex flex-col relative custom-scrollbar'>
        {/* Fixed Header */}
        <div className='sticky top-0 z-30 bg-white dark:bg-[#151921] shadow-sm'>
          <TimelineHeader />
        </div>

        {/* Rows Area */}
        <div className='relative min-w-[1000px]'>
          {' '}
          {/* Ensure min width for 24h visibility */}
          {agents.map((agent) => (
            <AgentRow
              key={agent._id} // Use _id for real users
              agent={agent}
              shifts={shifts.filter((s) => s.agentId === agent._id)}
              onShiftUpdate={onShiftUpdate}
            />
          ))}
          {/* Add empty rows to fill space if needed */}
          {Array.from({ length: Math.max(0, 8 - agents.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className='h-16 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-900/10'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShiftTimeline;
