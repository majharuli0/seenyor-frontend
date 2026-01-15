import React, { useContext, useEffect } from 'react';
import { SidebarContext } from '@/Context/CustomContext';

export default function VisitCount({ deviceCode, visit_count = 0, onClick }) {
  const { visitCountMap, setInitialCount } = useContext(SidebarContext);

  useEffect(() => {
    setInitialCount(deviceCode, visit_count);
  }, [deviceCode, visit_count]);

  return (
    <div
      onClick={onClick}
      className='text-[12px] text-[#6B7280] font-medium cursor-pointer hover:text-slate-800'
    >
      {visitCountMap[deviceCode] || 0} Visits
    </div>
  );
}
