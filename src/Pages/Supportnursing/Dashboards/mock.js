export const generateRandomAlerts = (count) => {
  const alertTypes = ['Critical', 'Info', 'Warning'];
  const rooms = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom'];
  const names = [
    'John Doe',
    'Jane Doe',
    'Alice Smith',
    'Bob Johnson',
    'Emma Brown',
    'Michael Wilson',
    'Sarah Davis',
    'David Miller',
    'Lisa Garcia',
    'James Rodriguez',
  ];
  const alertNames = [
    'Fall Detected',
    'Fire Detected',
    'Inactivity Alert',
    'Medication Reminder',
    'Unusual Behavior',
    'High Temperature',
    'Low Temperature',
    'Water Leak',
    'Door Left Open',
    'Window Broken',
  ];
  const eventNames = ['Medication Taken', 'Medication Not Taken', 'Medication Reminder'];
  const disabilityTypes = ['Wheelchair', 'Crutches', 'Cane', 'None'];
  const allergies = ['Yes', 'No'];
  const diseases = ['Yes', 'No'];
  const medications = ['Yes', 'No'];
  const activeAlert = ['1', '4', '2', 'No'];
  const isAlert = ['True', 'False'];
  return Array.from({ length: count }, (_, index) => ({
    _id: index + 1,
    alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)],
    elderlyName: names[Math.floor(Math.random() * names.length)],
    alertName: alertNames[Math.floor(Math.random() * alertNames.length)],
    roomId: String(index + 1),
    roomName: rooms[Math.floor(Math.random() * rooms.length)],
    alertLifetime: `${Math.floor(Math.random() * 10)}m ${Math.floor(Math.random() * 60)}s`,
    time: new Date().toLocaleString(),
    alertDescription: `${
      alertNames[Math.floor(Math.random() * alertNames.length)]
    } in the ${rooms[Math.floor(Math.random() * rooms.length)]}`,
    status: 'Active',
    isAlert: isAlert[Math.floor(Math.random() * isAlert.length)],
    address: '123 Main St, Anytown, USA',
    coordinates: {
      latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
      longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
    },
    //for close alert
    closedAt: new Date().toLocaleString(),
    closedBy: names[Math.floor(Math.random() * names.length)],
    //for event
    eventName: eventNames[Math.floor(Math.random() * eventNames.length)],
    disabilityType: disabilityTypes[Math.floor(Math.random() * disabilityTypes.length)],
    additionalInfo: 'This is additional info for event',
    hospital: {
      name: 'Hospital For Special Surgery',
      phone: '1234567890',
      latitude: -33.8743612,
      longitude: 151.2261153,
    },
    allergies: allergies[Math.floor(Math.random() * allergies.length)],
    diseases: diseases[Math.floor(Math.random() * diseases.length)],
    medications: medications[Math.floor(Math.random() * medications.length)],
    activeAlert: activeAlert[Math.floor(Math.random() * activeAlert.length)],
    alertComments: 'This is alert comments',
    alertLifespan: [
      {
        dateTime: '24-01-2024 10:00 AM',
        description: 'At 10:00 AM, the alert was created',
      },
      {
        dateTime: '24-01-2024 10:30 AM',
        description: 'Agent (petar) clicked on the incident in 10:30 (30mins later)',
      },
      {
        dateTime: '24-01-2024 10:32 AM',
        description: 'Agent (petar) clicked on “Call Elderly” in 10:32 (2mins later)',
      },
      {
        dateTime: '24-01-2024 10:34 AM',
        description: 'Agent (petar) clicked on “Call 911” in 10:34 (2mins later)',
      },
      {
        dateTime: '24-01-2024 10:36 AM',
        description: 'Agent (petar) clicked on “Close Alert” in 10:36 (2mins later)',
      },
    ],
  }));
};
export const alerts = generateRandomAlerts(14);
export const activeAlertsTableData = generateRandomAlerts(20);
export const recentlyClosedAlertsTableData = generateRandomAlerts(20);
export const eventsTableData = generateRandomAlerts(20);
export const elderlyListTableData = generateRandomAlerts(20);
