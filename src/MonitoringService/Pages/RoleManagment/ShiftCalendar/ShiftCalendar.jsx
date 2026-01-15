import { useState, useMemo, useEffect } from 'react';
import BreadcrumbUI from '@/MonitoringService/Components/common/breadcrumb';
import ShiftTimeline from './ShiftTimeline/ShiftTimeline';
import { useUsers } from '@/MonitoringService/hooks/UseUser';
import { useDemoMode } from '@/MonitoringService/Context/DemoModeContext';

// Generate shift from agent datum
const generateShiftFromAgent = (agent) => {
  if (!agent.shift_start || !agent.shift_end) return null;

  const [startH, startM] = agent.shift_start.split(':').map(Number);
  const [endH, endM] = agent.shift_end.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  if (endMinutes < startMinutes) endMinutes += 24 * 60; // Handle overnight

  return {
    id: `shift_${agent._id}`,
    agentId: agent._id,
    startMinutes: startMinutes,
    durationMinutes: endMinutes - startMinutes,
    type: agent.role || 'Monitoring Agent',
  };
};

import { toast } from '@/MonitoringService/Components/common/toast';

// ... (existing imports)

export default function ShiftCalendar() {
  const [shifts, setShifts] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { isDemoMode } = useDemoMode();

  // Fetch real agents
  const { data: agentsData, isSuccess } = useUsers({ role: 'monitoring_agent', isDemoMode });
  const agents = useMemo(() => agentsData?.data || [], [agentsData]);

  // Generate shifts once agents are loaded
  useEffect(() => {
    if (isSuccess && agents.length > 0) {
      const newShifts = agents.map(generateShiftFromAgent).filter(Boolean);
      setShifts(newShifts);
    }
  }, [isSuccess, agents]);

  const handleShiftUpdate = (updatedShift) => {
    setShifts((prev) => prev.map((s) => (s.id === updatedShift.id ? updatedShift : s)));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    // Here we would normally make an API call to update the users.
    // For Demo Mode, we just simulate success.
    toast.success('Shift changes saved successfully');
    setHasUnsavedChanges(false);
  };

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div className='flex flex-col items-start gap-2 mb-6 shrink-0'>
        <h1 className='text-text sm:text-xl text-lg'>Shift Calendar</h1>
        <div className='opacity-95'>
          <BreadcrumbUI />
        </div>
      </div>

      <div className='flex-1 w-full overflow-hidden'>
        <ShiftTimeline
          agents={agents}
          shifts={shifts}
          onShiftUpdate={handleShiftUpdate}
          onSave={handleSaveChanges}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>
    </div>
  );
}
