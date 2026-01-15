// Sample data for testing the report system

// Generate more visit data for pagination testing
export const generateVisitData = (count = 50) => {
  const times = [
    '02:25:56 PM',
    '03:15:22 AM',
    '11:45:33 AM',
    '09:30:15 PM',
    '07:20:45 AM',
    '04:55:12 PM',
    '01:10:38 AM',
    '08:25:50 PM',
    '10:40:25 AM',
    '06:15:18 PM',
  ];

  const rooms = ['202B', '105A', '301C', '204B', '108A', '302D', '205C', '110B', '303A', '206D'];

  return Array.from({ length: count }, (_, i) => {
    const timeIndex = i % times.length;
    const roomIndex = i % rooms.length;
    const startTime = times[timeIndex];
    const duration = `${Math.floor(Math.random() * 10) + 1}min${Math.floor(Math.random() * 60)}sec`;

    // Calculate exit time (simplified)
    const exitTime = startTime.replace(/(\d{2}):(\d{2}):(\d{2})/, (match, h, m, s) => {
      const minutes = parseInt(m) + Math.floor(Math.random() * 5) + 1;
      return `${h}:${minutes.toString().padStart(2, '0')}:${s}`;
    });

    return {
      id: i + 1,
      timeOfVisit: startTime,
      exitTime: exitTime,
      duration: duration,
      room: rooms[roomIndex],
    };
  });
};

// Generate more alarm data for pagination testing
export const generateAlarmData = (count = 25) => {
  const alarmTypes = ['Fall', 'No Activity', 'Off Bed', 'Wandering', 'Emergency Button'];
  const residents = [
    'Khamba Tarek',
    'Rsjkumar',
    'Nazrul Vai',
    'John Smith',
    'Mary Johnson',
    'Robert Brown',
    'Lisa Wilson',
  ];
  const nurses = ['Dalim Vai', 'Tarek', 'Shafiq', 'Sarah Connor', 'Mike Johnson'];
  const rooms = ['205', '54', '524', '101', '202', '303', '404', '105', '206', '307'];
  const comments = [
    'There was a pet',
    'All Good',
    'Slept on chair',
    'Patient was confused',
    'False alarm - sensor malfunction',
    'Resolved quickly',
    'Required medical attention',
    'Family notified',
    'Patient reassured',
  ];

  return Array.from({ length: count }, (_, i) => {
    const alarmIndex = i % alarmTypes.length;
    const residentIndex = i % residents.length;
    const nurseIndex = i % nurses.length;
    const roomIndex = i % rooms.length;
    const commentIndex = i % comments.length;

    const responseTime = `${Math.floor(Math.random() * 15) + 1}min`;
    const detectedTime = `8:${(30 + i).toString().padStart(2, '0')}`;
    const resolvedTime = `9:${(5 + i).toString().padStart(2, '0')}`;

    return {
      id: i + 1,
      alarm: alarmTypes[alarmIndex],
      logs: `Alarm detected at ${detectedTime} • Resolved at ${resolvedTime}`,
      resident: residents[residentIndex],
      room: rooms[roomIndex],
      responseTime: responseTime,
      resolvedBy: nurses[nurseIndex],
      comments: comments[commentIndex],
    };
  });
};

// Default sample data
export const sampleVisitData = generateVisitData(50);
export const sampleAlarmData = generateAlarmData(50);

// Calculate alarm statistics
export const calculateAlarmStats = (alarms) => {
  const totalAlarms = alarms.length;
  const avgResponse =
    totalAlarms > 0
      ? (alarms.reduce((sum, item) => sum + parseInt(item.responseTime), 0) / totalAlarms).toFixed(
          1
        )
      : 0;

  return {
    totalAlarms,
    avgResponseTime: avgResponse,
  };
};

// Filter data based on selected filters
export const filterData = (data, filters, type) => {
  let filtered = [...data];

  // Filter by residents
  if (filters.residents && filters.residents.length > 0) {
    if (type === 'alarms') {
      filtered = filtered.filter((item) =>
        filters.residents.some(
          (residentId) => item.resident.toLowerCase().replace(/\s+/g, '_') === residentId
        )
      );
    }
  }

  // Filter by nurses (only for alarms)
  if (type === 'alarms' && filters.nurses && filters.nurses.length > 0) {
    filtered = filtered.filter((item) =>
      filters.nurses.some(
        (nurseId) => item.resolvedBy.toLowerCase().replace(/\s+/g, '_') === nurseId
      )
    );
  }

  // Filter by alarm types (only for alarms)
  if (type === 'alarms' && filters.alarms && filters.alarms.length > 0) {
    filtered = filtered.filter((item) =>
      filters.alarms.some((alarmId) => item.alarm.toLowerCase().replace(/\s+/g, '_') === alarmId)
    );
  }

  return filtered;
};

// Format date range for display
export const formatDateRange = (filters) => {
  const fromDate = new Date(filters.dateRange.from).toLocaleDateString('en-GB');
  const toDate = new Date(filters.dateRange.to).toLocaleDateString('en-GB');
  const fromTime = filters.timeRange.from;
  const toTime = filters.timeRange.to;

  return `${fromTime} ${fromDate} To ${toTime} ${toDate}`;
};
