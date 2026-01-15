import dayjs from 'dayjs';

// Helper to wrap data in standard react-query success structure
export const getDemoQueryResult = (data) => ({
  data,
  isLoading: false,
  isFetching: false,
  isSuccess: true,
  status: 'success',
  error: null,
  refetch: () => {},
});

// Helper for paginated results (infinite query)
export const getDemoPaginatedResult = (data) => ({
  data: {
    pages: [{ data: data, total: data.length, totalPages: 1 }],
    pageParams: [1],
  },
  isLoading: false,
  isFetching: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  refetch: () => {},
  status: 'success',
  isSuccess: true,
  error: null,
});

export const generateBlock = (startTs, durationSec, posture, groupPrefix) => {
  return Array.from({ length: durationSec }).map((_, i) => ({
    ts: new Date(startTs + i * 1000).toISOString(),
    id: 1,
    groupStr: `${groupPrefix}_${posture}_${i}`,
    posture: posture,
    debug: '',
    xaxis: -15 + Math.sin(i * 0.5) * 5, // Oscillate between -20 and -10
    yaxis: 15 + Math.cos(i * 0.5) * 5, // Oscillate between 10 and 20
    zaxis: 0,
  }));
};

export const getDemoFallPlaybackData = (alertCreationTime) => {
  // Use provided time or fallback to now if not provided
  const now = alertCreationTime ? dayjs(alertCreationTime).valueOf() : dayjs().valueOf();

  // PRE-FRAMES (3 Minutes = 180 seconds)
  // Pattern: 5 blocks of random 3/4, then 2 -> 5 -> 4
  const preDuration = 180;
  const preFrames = [];
  let currentPreTime = now - preDuration * 1000;

  // 5 Stable blocks of random 3 or 4 (approx 25s each to leave room for sequence)
  // Total time to cover before sequence: 180s - (10s+10s+20s sequence) = 140s. 140/5 = 28s per block.
  const configs = [3, 4, 3, 4, 3]; // Alternating 3 and 4

  configs.forEach((p, idx) => {
    const duration = 28;
    const block = generateBlock(currentPreTime, duration, p, `pre_b${idx}`);
    preFrames.push(...block);
    currentPreTime += duration * 1000;
  });

  // Specific Sequence: 2 -> 4 -> 2 (End with 2 as requested)
  // Total sequence duration target: ~40s to keep total pre duration ~180s
  const seqConfigs = [
    { p: 2, d: 15 },
    { p: 4, d: 15 },
    { p: 2, d: 10 },
  ];

  seqConfigs.forEach((cfg, idx) => {
    const block = generateBlock(currentPreTime, cfg.d, cfg.p, `pre_seq${idx}`);
    preFrames.push(...block);
    currentPreTime += cfg.d * 1000;
  });

  // POST-FRAMES (2 Minutes = 120 seconds)
  // 1 Minute (60s) of Posture 5, then Posture 3
  const postFrames = [];
  let currentPostTime = now;

  const postBlock1 = generateBlock(currentPostTime, 60, 5, 'post_p5');
  postFrames.push(...postBlock1);
  currentPostTime += 60 * 1000;

  const postBlock2 = generateBlock(currentPostTime, 60, 3, 'post_p3');
  postFrames.push(...postBlock2);

  return {
    msg: '操作成功',
    code: 200,
    data: {
      pre_frames: JSON.stringify(preFrames.map((f) => [f])),
      post_frames: JSON.stringify(postFrames.map((f) => [f])),
    },
  };
};

export const getDemoRoomInfoData = (alertId, uid) => {
  // 1. Prepare Base Config (Deep Copy)
  let data = JSON.parse(JSON.stringify(demoRoomInfoData));

  // 2. Determine Room Type & Config based on UID (Device ID)
  const wallMountUids = ['882300050122', 'A1B2C3D4E5F6', 'CC3344556677', 'FF6677889900'];

  const isWallMount = uid && wallMountUids.includes(uid);

  // Wall Mount Objects Mock
  const wallMountObjects = [
    {
      type: 5, // Sofa
      coordKey: '1',
      up_left: '-20,5',
      low_left: '-20,0',
      up_right: '0,5',
      low_right: '0,0',
      width: 20,
      length: 5,
      object_type: 5,
      _id: 'wall_obj_1',
    },
    {
      type: 6, // Table (Shifted slightly left to 12-22 to be well within bounds)
      coordKey: '2',
      up_left: '12,5',
      low_left: '12,0',
      up_right: '22,5',
      low_right: '22,0',
      width: 10,
      length: 5,
      object_type: 6,
      _id: 'wall_obj_2',
    },
    {
      type: 4, // Door
      coordKey: '3',
      up_left: '25,10',
      low_left: '25,0',
      up_right: '28,10',
      low_right: '28,0',
      width: 3,
      length: 10,
      object_type: 4,
      _id: 'wall_obj_3',
    },
  ];

  const wallMountBoundaries = {
    up_left: '-30,20',
    low_left: '-30,0',
    up_right: '30,20',
    low_right: '30,0',
  };

  if (isWallMount) {
    data.data.name = 'Living Room';
    data.data.room_type = 1; // Wall Mount
    data.data.mount_type = 1;
    data.data.device_areas = wallMountObjects; // Swap objects
    data.data.device_boundaries = wallMountBoundaries; // Set correct boundaries
  } else {
    data.data.name = 'Bedroom';
    data.data.room_type = 2; // Top Mount
    data.data.mount_type = 2;
    // Keep default Top Mount objects from deep copy
  }

  // 3. Handle Offline Status logic
  if (alertId === 'demo_offline_1' || alertId === 'demo_offline_2') {
    data.data.is_device_bind = false;
  }

  // 4. Set Specific UID (Device ID) and ensure _id is consistent if possible (or ignore _id)
  if (uid) {
    data.data.device_no = uid;
    // In demo mode for map, we use device_no as room_id often or need consistent matching.
    // But map also relies on _id match.
    // If we don't have the real _id, the map loop `r._id === roomInfo._id` might fail
    // because `demoRoomInfoData._id` is static "68d1...".
    // HOWEVER, CustomerDetailsLiveMap calls it with `device_no`.
    // And the map loop uses `r._id`.
    // If we return a room object, correct usage implies the component will update the room with matching `_id`.
    // The component has: `r._id === roomInfo._id`.
    // OUR demo room _id is `68d17221ccacb0d3e0cc2d47`.
    // The customer `rooms` list (which we mock) has IDs like `room_1`.
    // WE MUST MATCH THE ID!
    // But we only have `device_no` (uid).
    // WE NEED TO FIND THE ROOM ID FROM THE DEVICE ID!
    // We can do a reverse lookup in `demoCustomersList`? No, that's circular/expensive.
    // HACK: We can set `_id` to `roomId` (if we had it). But we don't.
    // WAIT. If `r._id === roomInfo._id` fails, the map state won't update.
    // This is WHY I passed `room_id` before.
    // If the user forbids passing `room_id` (the _id), I am stuck unless I can lookup the room by device ID.
    // Fortunately, I defined `demoCustomersList` in this very file!
    // I can import/use it (it's in scope).

    // Find room by device_no
    let foundRoom = null;
    for (const customer of demoCustomersList) {
      const r = customer.rooms?.find((r) => r.device_no === uid);
      if (r) {
        foundRoom = r;
        break;
      }
    }

    if (foundRoom) {
      data.data._id = foundRoom._id;
      // Also ensure name matches just in case
      data.data.name = foundRoom.name;
    }

    if (data.data.settings) {
      data.data.settings.uid = uid;
    }
  }

  // 5. Unwrap data to match expected component structure
  return data;
};

export const demoRoomInfoData = {
  statusCode: 200,
  status: true,
  message: 'Device configurations fetch successfully',
  data: {
    _id: '68d17221ccacb0d3e0cc2d47',
    name: 'Bedroom',
    room_type: 2,
    scene: '1',
    height: 25,
    width: 600,
    length: 400,
    unit: 'meters',
    is_device_bind: true,
    is_mount_type_set: true,
    is_area_set: true,
    is_object_added: true,
    is_notification_configured: false,
    device_areas: [
      {
        type: 5,
        coordKey: '1',
        up_left: '-14,20',
        low_left: '-14,4',
        up_right: '4,20',
        low_right: '4,4',
        width: 18,
        length: 16,
        _id: '6960c71e043647ec57e060b5',
        object_type: 2,
      },
      {
        type: 4,
        coordKey: '2',
        up_left: '-31,10',
        low_left: '-31,0',
        up_right: '-29,10',
        low_right: '-29,0',
        width: 2,
        length: 10,
        object_type: 4,
        _id: '6960c72a043647ec57e062bc',
      },
    ],
    review_log: [],
    review_status: 'completed',
    review_files: {
      front_image: '1759135603338-front_image.jpg',
      back_image: '1759135604718-back_image.jpg',
      left_image: '1759135605522-left_image.jpg',
      right_image: '1759135606179-right_image.jpg',
      room_view: 'video/1759135606773-room-view.mp4',
      created_at: '2025-09-29T08:46:47.479Z',
      _id: '68da4777e39b9c06c5b902c6',
    },
    created_at: '2025-09-22T15:58:25.984Z',
    device_no: '3525E3DD5D9B',
    settings: {
      upper_breath: 24,
      lower_breath: 8,
      upper_heartbeat: 100,
      lower_heartbeat: 50,
      intensive_care: 0,
      sensitivity: 5,
      time: 2,
      leave_detection_time: 60,
      leave_detection_range: '20:00-08:00',
      entry_detection_time: 160,
      _id: '6960c6d44054c04b5ac07ac0',
      detention_alarm_switch: '0',
      leave_alarm_switch: '0',
      long_away_switch: '0',
    },
    device_boundaries: {
      up_left: '-30,25',
      low_left: '-30,0',
      up_right: '6,25',
      low_right: '6,0',
      _id: '6960c7074054c04b5ac07ee0',
    },
    mount_type: 2,
    eventStatus: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
      10: true,
    },
  },
};

// Base Alert Template
const baseAlert = {
  _id: '6959d7b6a7d6ac2f5f5f2d8e',
  status: true,
  soft_deleted: false,
  cmd: 'DEVICE_EVENT',
  event_name: 'Reaz检测出跌倒异常',
  event: '2',
  uid: '3525E3DD5D9B',
  is_read: false,
  is_resolved: false,
  elderly_id: '6905b7ae38d595dd0a55d417',
  room_name: 'Bedroom',
  address: '321 Maple Drive, Chicago, IL 60611',
  elderly_name: 'Reed Johnson',
  created_at: '', // Will be dynamic
  updated_at: '', // Will be dynamic
  emergency_contacts: [
    {
      contact_person: 'Sarah Johnson',
      contact_number: '+1 555-0123',
      relationship: 'Daughter',
      coverage_area: '5',
    },
    {
      contact_person: 'Michael Reed',
      contact_number: '+1 555-0124',
      relationship: 'Son',
      coverage_area: '10',
    },
  ],
};

const elderlyContacts = baseAlert.emergency_contacts;

export const generateDemoAlerts = () => {
  const now = dayjs();

  // Alert 1: Active (Just now) - Real ID, Active Device
  const alert1 = {
    ...baseAlert,
    _id: '6959d7b6a7d6ac2f5f5f2d8e', // The specific ID requested
    uid: '414D7418808B', // Real Device 1
    room_name: 'Bedroom',
    elderly_name: 'Martha Stewart',
    address: '123 Pine Ln, Chicago, IL 60611',
    emergency_contacts: [
      {
        contact_person: 'David Stewart',
        contact_number: '+1 555-0101',
        relationship: 'Son',
        coverage_area: '5',
      },
    ],
    created_at: now.subtract(10, 'second').toISOString(),
    updated_at: now.subtract(10, 'second').toISOString(),
    is_resolved: false,
    picked_by: null,
    latitude: 41.8781,
    longitude: -87.6298,
  };

  // Alert 2: Older alert
  const alert2 = {
    ...baseAlert,
    _id: 'demo_alert_2',
    uid: '594B3CD2988B', // Real Device 2
    room_name: 'Living Room',
    event_name: 'Fall Detected (Demo)',
    elderly_name: 'Robert Smith',
    address: '789 Oak Ave, New York, NY 10001',
    emergency_contacts: [
      {
        contact_person: 'Alice Smith',
        contact_number: '+1 555-0202',
        relationship: 'Wife',
        coverage_area: '10',
      },
    ],
    created_at: now.subtract(15, 'minute').toISOString(),
    updated_at: now.subtract(15, 'minute').toISOString(),
    is_resolved: false,
    picked_by: null,
    latitude: 41.882,
    longitude: -87.625,
    elderly_id: '68ab22611eb32bc517125694',
  };

  // Alert 3: Picked by YOU
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const alert3 = {
    ...baseAlert,
    _id: 'demo_alert_3',
    uid: 'E598A2CB35DF', // Real Device 3
    room_name: 'Bedroom',
    event_name: 'SOS Alert (Demo)',
    elderly_name: 'Betty Cooper',
    address: '456 Birch Rd, Austin, TX 78701',
    emergency_contacts: [
      {
        contact_person: 'Alice Cooper',
        contact_number: '+1 555-0303',
        relationship: 'Daughter',
        coverage_area: '15',
      },
      {
        contact_person: 'Hal Cooper',
        contact_number: '+1 555-0304',
        relationship: 'Father',
        coverage_area: '15',
      },
    ],
    created_at: now.subtract(30, 'minute').toISOString(),
    updated_at: now.subtract(10, 'minute').toISOString(),
    is_resolved: false,
    picked_by: user?._id
      ? {
          _id: user._id,
          name: user.name,
          last_name: user.last_name,
          role: user.role,
        }
      : null,
    latitude: 41.875,
    longitude: -87.635,
    elderly_id: '689b05b7f5ad28f0cd96e551',
  };

  // Alert 4 (Device Offline 1)
  const alert4 = {
    ...baseAlert,
    _id: 'demo_offline_1', // Triggers OFFLINE logic
    cmd: 'DEVICE_EVENT',
    event_name: 'Device Offline',
    event: '5',
    uid: '992300030422', // Random UID
    is_read: false,
    is_resolved: false,
    elderly_id: 'demo_elderly_4',
    room_name: 'Bedroom',
    address: 'Genesis HealthCare | 101 East State Street, Kennett Square, Pennsylvania 19348',
    elderly_name: 'Molly Carter',
    is_online: '1',
    created_at: now.subtract(45, 'minute').toISOString(), // Recent
    updated_at: now.subtract(45, 'minute').toISOString(),
    status: true,
    latitude: 39.8468,
    longitude: -75.7116,
  };

  // Alert 5 (Device Offline 2)
  const alert5 = {
    ...baseAlert,
    _id: 'demo_offline_2', // Triggers OFFLINE logic
    cmd: 'DEVICE_EVENT',
    event_name: 'Device Offline',
    event: '5',
    uid: '882300050122',
    is_read: false,
    is_resolved: false,
    elderly_id: 'demo_elderly_5',
    room_name: 'Living Room',
    address: 'Sunrise Senior Living | 200 W Lancaster Ave, Wayne, PA 19087',
    elderly_name: 'James Wilson',
    is_online: '1',
    created_at: now.subtract(2, 'hour').toISOString(), // A bit older
    updated_at: now.subtract(2, 'hour').toISOString(),
    status: true,
    latitude: 40.044,
    longitude: -75.3877,
  };

  return [alert1, alert2, alert3, alert4, alert5];
};

export const generateDemoResolvedAlerts = () => {
  const now = dayjs();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const alert1 = {
    ...baseAlert,
    _id: 'demo_resolved_1',
    room_name: 'Living Room',
    event_name: 'Fall Detected (Demo)',
    created_at: now.subtract(1, 'day').toISOString(),
    updated_at: now.subtract(1, 'day').add(185, 'second').toISOString(), // + ~3 min
    is_resolved: true,
    comment: 'False alarm, user tripped.',
    picked_by: null,
    closed_at: now.subtract(1, 'day').add(185, 'second').toISOString(),
    closed_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
    closed_by_id: user?._id || 'demo_user',
    closed_by_role: user?.role || 'monitoring_agent',
    status: true, // False alarm -> status true
  };
  // Alert 2
  const alert2 = {
    ...baseAlert,
    _id: 'demo_resolved_2',
    room_name: 'Kitchen',
    event_name: 'SOS Alert (Demo)',
    created_at: now.subtract(2, 'day').toISOString(),
    updated_at: now.subtract(2, 'day').add(45, 'second').toISOString(), // + 45 sec
    is_resolved: true,
    comment: 'Accidental press resolved.',
    picked_by: null,
    closed_at: now.subtract(2, 'day').add(45, 'second').toISOString(),
    closed_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
    closed_by_id: user?._id || 'demo_user',
    closed_by_role: user?.role || 'monitoring_agent',
    status: true,
  };

  // Alert 3
  const alert3 = {
    ...baseAlert,
    _id: 'demo_resolved_3',
    room_name: 'Bathroom',
    event_name: 'Fall Detected (Demo)',
    created_at: now.subtract(3, 'day').toISOString(),
    updated_at: now.subtract(3, 'day').add(4, 'minute').toISOString(), // + 4 min
    is_resolved: true,
    comment: 'Confirmed fall, assistance provided.',
    picked_by: null,
    closed_at: now.subtract(3, 'day').add(4, 'minute').toISOString(),
    closed_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
    closed_by_id: user?._id || 'demo_user',
    closed_by_role: user?.role || 'monitoring_agent',
    status: false,
  };

  // Alert 4
  const alert4 = {
    ...baseAlert,
    _id: 'demo_resolved_4',
    room_name: 'Bedroom',
    uid: 'demo_active_device', // Active device -> Map shows
    event_name: 'Long Lie (Demo)',
    created_at: now.subtract(5, 'day').toISOString(),
    updated_at: now.subtract(5, 'day').add(210, 'second').toISOString(), // + 3.5 min
    is_resolved: true,
    comment: 'Device testing.',
    picked_by: null,
    closed_at: now.subtract(5, 'day').add(210, 'second').toISOString(),
    closed_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
    closed_by_id: user?._id || 'demo_user',
    closed_by_role: user?.role || 'monitoring_agent',
    status: true,
  };

  // Alert 5
  const alert5 = {
    ...baseAlert,
    _id: 'demo_offline_1', // Triggers offline logic in getDemoRoomInfoData
    room_name: 'Hallway',
    uid: 'demo_offline_device',
    event_name: 'Device Offline (Demo)',
    created_at: now.subtract(1, 'week').toISOString(),
    updated_at: now.subtract(1, 'week').add(35, 'second').toISOString(), // + 35 sec
    is_resolved: true,
    comment: 'False alarm.',
    picked_by: null,
    closed_at: now.subtract(1, 'week').add(35, 'second').toISOString(),
    closed_by: `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`,
    closed_by_id: user?._id || 'demo_user',
    closed_by_role: user?.role || 'monitoring_agent',
    status: true,
  };

  return [alert1, alert2, alert3, alert4, alert5];
};

export const generateMockLogsForAlert = (alertId, startTime) => {
  const logs = [];
  let currentTime = dayjs(startTime);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const agentName = `${user.name || 'Monitoring'} ${user.last_name || 'Agent'}`;

  // 1. Picked
  logs.push({
    _id: `log_${alertId}_1`,
    status: 'picked',
    title: 'Alert Picked',
    action_by: agentName,
    type: 'picked',
    created_at: currentTime.toISOString(),
  });

  // 2. Call Contact 1
  currentTime = currentTime.add(2, 'minute');
  logs.push({
    _id: `log_${alertId}_2`,
    status: 'called',
    title: 'Called contact person',
    contact_name: elderlyContacts[0].contact_person,
    contact_number: elderlyContacts[0].contact_number,
    action_type: 'contact',
    action_note: 'No answer',
    action_by: agentName,
    created_at: currentTime.toISOString(),
  });

  // 3. Call Contact 2
  currentTime = currentTime.add(3, 'minute');
  logs.push({
    _id: `log_${alertId}_3`,
    status: 'called',
    title: 'Called contact person',
    contact_name: elderlyContacts[1].contact_person,
    contact_number: elderlyContacts[1].contact_number,
    action_type: 'contact',
    action_note: 'Voicemail left',
    action_by: agentName,
    created_at: currentTime.toISOString(),
  });

  // 4. Call Device
  currentTime = currentTime.add(2, 'minute');
  logs.push({
    _id: `log_${alertId}_4`,
    status: 'called',
    title: 'Called room device',
    contact_name: 'Bedroom Device',
    contact_number: '3525E3DD5D9B',
    action_type: 'device_call',
    action_note: 'Device unreachable',
    action_by: agentName,
    created_at: currentTime.toISOString(),
  });

  // 5. Emergency Call
  currentTime = currentTime.add(5, 'minute');
  logs.push({
    _id: `log_${alertId}_5`,
    status: 'called',
    title: 'Called emergency contact',
    contact_name: '911 Dispatch',
    contact_number: '911',
    action_type: 'emergency',
    action_note: 'Dispatched ambulance',
    action_by: agentName,
    created_at: currentTime.toISOString(),
  });

  // 6. Resolved
  currentTime = currentTime.add(10, 'minute');
  logs.push({
    _id: `log_${alertId}_6`,
    status: 'resolved',
    title: 'Alert Resolved',
    action_note: 'False alarm, user tripped.',
    action_by: agentName,
    type: 'resolved',
    created_at: currentTime.toISOString(),
  });
  return logs;
};

export const getDemoPerformanceScore = (resolvedAlerts = [], activeAlerts = []) => {
  const allAlerts = [...resolvedAlerts, ...activeAlerts];
  const totalResolved = resolvedAlerts.length;
  const totalActive = activeAlerts.length;

  // Count events by type
  const eventCounts = {};
  allAlerts.forEach((alert) => {
    const eventType = alert.event;
    if (eventType) {
      eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
    }
  });

  const countByEvents = Object.keys(eventCounts).map((type) => ({
    _id: type,
    count: eventCounts[type],
  }));

  return {
    status: true,
    statusCode: 200,
    message: 'Performance score fetched successfully',
    data: {
      count_less_sla: 45, // Keep static or make dynamic later
      count_more_sla: 5, // Keep static
      avg_res_time: 143000,
      min_res_time: 35000,
      max_res_time: 240000,

      // New fields for AlertOverview
      total_resolved: totalResolved,
      total_alert: allAlerts.length,
      count_by_events: countByEvents,
    },
  };
};

// Enriched Demo Customers List for Details Page & List View
const demoCustomersList = [
  // 1. Martha Stewart (Active Alert 1) - 2 Rooms
  {
    _id: '6905b7ae38d595dd0a55d417', // Matches alert 1
    status: true,
    soft_deleted: false,
    name: 'Martha Stewart',
    contact_code: '+1',
    contact_number: '555-0100',
    age: 81,
    gender: 'female',
    height: 168,
    priority: 0,
    bed: 0,
    height_type: 'cm',
    end_user_id: 'demo_end_user_1',
    monitoring_agency_status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    comments: [{ category: 'Custom Text', comment: 'Energetic but frail' }],
    diseases: ['Osteoporosis'],
    emergency_contacts: [
      {
        contact_person: 'David Stewart',
        contact_number: '555-0101',
        contact_number_code: '+1',
        relationship: 'Son',
        coverage_area: '5',
      },
    ],
    rooms: [
      {
        _id: '6905b7ae38d595dd0a55d41a',
        name: 'Bedroom',
        device_no: '414D7418808B',
        room_type: 2,
        is_device_bind: true,
      },
      {
        _id: 'room_1b',
        name: 'Kitchen',
        device_no: 'FAKE_DEV_002',
        room_type: 1,
        is_device_bind: true,
      },
    ],
    __v: 0,
    address: '123 Pine Ln, Chicago, IL 60611, USA',
    latitude: 41.8781,
    longitude: -87.6298,
    room_no: 2, // Has 2 rooms
    highest_priority: 2, // Fall
    online_device_count: 2,
    offline_device_count: 0,
    end_user_frist_name: 'David',
    end_user_last_name: 'Stewart',
    end_user_contact_number: '5550101',
    end_user_contact_code: '+1',
  },
  // 2. Robert Smith (Active Alert 2) - 1 Room
  {
    _id: '68ab22611eb32bc517125694', // Matches alert 2
    status: true,
    soft_deleted: false,
    name: 'Robert Smith',
    contact_code: '+1',
    contact_number: '555-0200',
    age: 75,
    gender: 'male',
    height: 180,
    priority: 0,
    bed: 0,
    height_type: 'cm',
    end_user_id: 'demo_end_user_2',
    monitoring_agency_status: 'active',
    created_at: '2024-02-10T12:00:00Z',
    updated_at: '2024-02-10T12:00:00Z',
    comments: [{ category: 'Custom Text', comment: 'Diabetes' }],
    diseases: ['Diabetes'],
    emergency_contacts: [
      {
        contact_person: 'Alice Smith',
        contact_number: '555-0202',
        contact_number_code: '+1',
        relationship: 'Wife',
        coverage_area: '10',
      },
    ],
    rooms: [
      {
        _id: '68ab226b1eb32bc5171256a1',
        name: 'Living Room',
        device_no: '594B3CD2988B',
        room_type: 1,
        is_device_bind: true,
      },
    ],
    __v: 0,
    address: '789 Oak Ave, New York, NY 10001, USA',
    latitude: 41.882,
    longitude: -87.625,
    room_no: 1,
    highest_priority: 2,
    online_device_count: 1,
    offline_device_count: 0,
    end_user_frist_name: 'Alice',
    end_user_last_name: 'Smith',
    end_user_contact_number: '5550202',
    end_user_contact_code: '+1',
  },
  // 3. Betty Cooper (Active Alert 3) - 1 Room
  {
    _id: '689b05b7f5ad28f0cd96e551', // Matches alert 3
    status: true,
    soft_deleted: false,
    name: 'Betty Cooper',
    contact_code: '+1',
    contact_number: '555-0300',
    age: 82,
    gender: 'female',
    height: 162,
    priority: 0,
    bed: 0,
    height_type: 'cm',
    end_user_id: 'demo_end_user_3',
    monitoring_agency_status: 'active',
    created_at: '2024-03-05T09:00:00Z',
    updated_at: '2024-03-05T09:00:00Z',
    comments: [{ category: 'Custom Text', comment: 'Low blood pressure' }],
    diseases: ['Hypotension'],
    emergency_contacts: [
      {
        contact_person: 'Alice Cooper',
        contact_number: '555-0303',
        contact_number_code: '+1',
        relationship: 'Daughter',
        coverage_area: '15',
      },
    ],
    rooms: [
      {
        _id: '689b05c3f5ad28f0cd96e559',
        name: 'Bedroom',
        device_no: 'E598A2CB35DF',
        room_type: 2,
        is_device_bind: true,
      },
    ],
    __v: 0,
    address: '456 Birch Rd, Austin, TX 78701, USA',
    latitude: 41.875,
    longitude: -87.635,
    room_no: 1,
    highest_priority: 2,
    online_device_count: 1,
    offline_device_count: 0,
    end_user_frist_name: 'Alice',
    end_user_last_name: 'Cooper',
    end_user_contact_number: '5550303',
    end_user_contact_code: '+1',
  },
  // 4. Molly Carter (Device Offline 1) - 1 Room
  {
    _id: 'demo_elderly_4',
    status: true,
    soft_deleted: false,
    name: 'Molly Carter',
    contact_code: '+1',
    contact_number: '555-0199',
    age: 82,
    gender: 'female',
    height: 165,
    priority: 0,
    bed: 0,
    height_type: 'cm',
    end_user_id: 'demo_end_user_4',
    monitoring_agency_status: 'active',
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-02-20T14:31:00Z',
    comments: [{ category: 'Custom Text', comment: 'Mobility issues' }],
    diseases: ['Arthritis'],
    emergency_contacts: [
      {
        contact_person: 'Maj Le',
        contact_number: '555-0199',
        contact_number_code: '+1',
        relationship: 'Carer',
        coverage_area: '5',
      },
    ],
    rooms: [
      {
        _id: 'room_bedroom_molly',
        name: 'Bedroom',
        device_no: '992300030422',
        room_type: 2,
        is_device_bind: false,
      }, // Offline
    ],
    __v: 0,
    address: '101 East State Street, Kennett Square, PA 19348, USA',
    latitude: 39.8468,
    longitude: -75.7116,
    room_no: 1,
    highest_priority: 5,
    online_device_count: 0,
    offline_device_count: 1,
    end_user_frist_name: 'Admin',
    end_user_last_name: 'Staff',
    end_user_contact_number: '5550199',
    end_user_contact_code: '+1',
  },
  // 5. James Wilson (Device Offline 2) - 1 Room
  {
    _id: 'demo_elderly_5',
    status: true,
    soft_deleted: false,
    name: 'James Wilson',
    contact_code: '+1',
    contact_number: '555-0177',
    age: 75,
    gender: 'male',
    height: 180,
    priority: 0,
    bed: 0,
    height_type: 'cm',
    end_user_id: 'demo_end_user_5',
    monitoring_agency_status: 'active',
    created_at: '2024-03-10T09:15:00Z',
    updated_at: '2024-03-10T09:15:00Z',
    comments: [{ category: 'Custom Text', comment: 'Heart condition recovery' }],
    diseases: ['Cardiovascular'],
    emergency_contacts: [
      {
        contact_person: 'Devid Redjon',
        contact_number: '555-0177',
        contact_number_code: '+1',
        relationship: 'Nurse',
        coverage_area: '5',
      },
    ],
    rooms: [
      {
        _id: 'room_living_james',
        name: 'Living Room',
        device_no: '882300050122',
        room_type: 1,
        is_device_bind: false,
      }, // Offline
    ],
    __v: 0,
    address: '200 W Lancaster Ave, Wayne, PA 19087, USA',
    latitude: 40.044,
    longitude: -75.3877,
    room_no: 1,
    highest_priority: 5, // Offline
    online_device_count: 0,
    offline_device_count: 1,
    end_user_frist_name: 'Care',
    end_user_last_name: 'Team',
    end_user_contact_number: '5550177',
    end_user_contact_code: '+1',
  },
  {
    _id: 'demo_c_uk_1',
    status: true,
    soft_deleted: false,
    name: 'Arthur Dent',
    contact_code: '+44',
    contact_number: '20-7946-0123',
    age: 42,
    gender: 'male',
    height: 183,
    priority: 0,
    bed: 0,
    height_type: 'cm',
    end_user_id: 'demo_end_user_uk1',
    monitoring_agency_status: 'active',
    created_at: '2023-11-05T11:00:00Z',
    updated_at: '2023-11-05T11:00:00Z',
    comments: [{ category: 'Custom Text', comment: 'Mild anxiety' }],
    emergency_contacts: [
      {
        contact_person: 'Lisa Moni',
        contact_number: '7700900123',
        contact_number_code: '+44',
        relationship: 'Friend',
        coverage_area: '5',
      },
    ],
    rooms: [
      {
        _id: 'room_uk_1',
        name: 'Bedroom',
        device_no: 'BB2233445566',
        room_type: 2,
        is_device_bind: true,
      },
      {
        _id: 'room_uk_2',
        name: 'Lounge',
        device_no: 'CC3344556677',
        room_type: 1,
        is_device_bind: true,
      },
    ],
    __v: 0,
    address: '155 Bishopsgate, London EC2M 3YD, UK',
    latitude: 51.5173,
    longitude: -0.0792,
    room_no: 2,
    highest_priority: 0,
    online_device_count: 2,
    offline_device_count: 0,
    end_user_frist_name: 'Ford',
    end_user_last_name: 'Prefect',
    end_user_contact_number: '7700900123',
    end_user_contact_code: '+44',
  },
  // Random 2 - Canada
  {
    _id: 'demo_c_ca_1',
    status: true,
    soft_deleted: false,
    name: 'Emily Chen',
    contact_code: '+1',
    contact_number: '416-555-0198',
    age: 68,
    gender: 'female',
    height: 160,
    priority: 0,
    bed: 0,
    height_type: 'cm',
    end_user_id: 'demo_end_user_ca1',
    monitoring_agency_status: 'active',
    created_at: '2023-10-12T08:30:00Z',
    updated_at: '2023-10-12T08:30:00Z',
    comments: [],
    rooms: [
      {
        _id: 'room_ca_1',
        name: 'Bedroom',
        device_no: 'DD4455667788',
        room_type: 2,
        is_device_bind: true,
      },
    ],
    emergency_contacts: [],
    __v: 0,
    address: '300 Front St W, Toronto, ON M5V 2T6, Canada',
    latitude: 43.6445,
    longitude: -79.3871,
    room_no: 1,
    highest_priority: 0,
    online_device_count: 1,
    offline_device_count: 0,
    end_user_frist_name: 'David',
    end_user_last_name: 'Chen',
    end_user_contact_number: '6475550198',
    end_user_contact_code: '+1',
  },
  // Random 3 - Deactivated
  {
    _id: 'demo_c_deact_1',
    status: true, // API might keep status true but use monitoring_agency_status
    soft_deleted: false,
    name: 'Gary Oldman',
    contact_code: '+1',
    contact_number: '310-555-0100',
    age: 85,
    gender: 'male',
    height: 175,
    priority: 0,
    bed: 0,
    height_type: 'cm',
    end_user_id: 'demo_end_user_d1',
    monitoring_agency_status: 'deactivate',
    created_at: '2023-01-01T09:00:00Z',
    updated_at: '2023-06-01T09:00:00Z',
    comments: [],
    emergency_contacts: [],
    __v: 0,
    address: 'Deactivated User Address, USA',
    latitude: 34.0522,
    longitude: -118.2437,
    room_no: 0,
    highest_priority: 0,
    online_device_count: 0,
    offline_device_count: 0,
    end_user_frist_name: 'System',
    end_user_last_name: 'Admin',
    end_user_contact_number: '0000000000',
    end_user_contact_code: '+1',
  },
  // Random 4 - UK High Priority (Warning)
  {
    _id: 'demo_c_uk_2',
    status: true,
    soft_deleted: false,
    name: 'Margaret Thatcher',
    contact_code: '+44',
    contact_number: '20-7946-0999',
    age: 87,
    gender: 'female',
    height: 162,
    priority: 1, // High priority
    bed: 0,
    height_type: 'cm',
    end_user_id: 'demo_end_user_uk2',
    monitoring_agency_status: 'active',
    created_at: '2024-03-01T12:00:00Z',
    updated_at: '2024-03-01T12:00:00Z',
    comments: [{ category: 'Custom Text', comment: 'Severe dementia' }],
    rooms: [
      {
        _id: 'room_uk_3',
        name: 'Bedroom',
        device_no: 'EE5566778899',
        room_type: 2,
        is_device_bind: true,
      },
      {
        _id: 'room_uk_4',
        name: 'Lounge',
        device_no: 'FF6677889900',
        room_type: 1,
        is_device_bind: true,
      },
      {
        _id: 'room_uk_5',
        name: 'Hall',
        device_no: '11AA22BB33CC',
        room_type: 3,
        is_device_bind: true,
      },
    ],
    emergency_contacts: [],
    __v: 0,
    address: '10 Downing Street, London SW1A 2AA, UK',
    latitude: 51.5034,
    longitude: -0.1276,
    room_no: 3,
    highest_priority: 1,
    online_device_count: 3,
    offline_device_count: 0,
    end_user_frist_name: 'Denis',
    end_user_last_name: 'Thatcher',
    end_user_contact_number: '7700900999',
    end_user_contact_code: '+44',
  },
];

export const getDemoCustomerDetails = (id) => {
  // Basic fallback if ID not found, use Reed Johnson
  const defaultUser = demoCustomersList[0];
  const customer = demoCustomersList.find((c) => c._id === id) || defaultUser;

  return {
    data: {
      data: customer,
    },
    isLoading: false,
    isSuccess: true,
    refetch: () => {},
  };
};

export const getDemoCustomers = (params = {}) => {
  let filtered = [...demoCustomersList];

  // Filter by status
  if (params.monitoring_agency_status) {
    filtered = filtered.filter(
      (c) => c.monitoring_agency_status === params.monitoring_agency_status
    );
  }

  // Filter by search (name or address)
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(searchLower)) ||
        (c.address && c.address.toLowerCase().includes(searchLower))
    );
  }

  // Sort by priority or date
  const priority = Number(params.priority) || 1;

  filtered.sort((a, b) => {
    // Primary Sort: Highest Priority (Numerical)
    if (a.highest_priority !== b.highest_priority) {
      return priority === 1
        ? b.highest_priority - a.highest_priority
        : a.highest_priority - b.highest_priority;
    }
    // Secondary Sort: Date (Recent First)
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA;
  });

  // Pagination
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = filtered.slice(startIndex, endIndex);

  return {
    status: true,
    statusCode: 200,
    total: filtered.length,
    data: paginated,
    page: page,
    limit: limit,
  };
};

// ==========================================
// ANALYTICS DEMO DATA
// ==========================================

export const getDemoCountStatistics = () => {
  return {
    statusCode: 200,
    status: true,
    message: 'Count statistics fetched successfully',
    data: {
      device_uptime: 450,
      device_downtime: 12,
      avg_res_time: 45000, // 45 seconds
    },
  };
};

export const getDemoTotalAlertCount = () => {
  return {
    statusCode: 200,
    status: true,
    message: 'Total alert count fetched successfully',
    data: [
      { _id: 2, count: 45 }, // Fall Alerts
      { _id: 5, count: 12 }, // Device Offline
    ],
  };
};

export const getDemoAlertTrends = () => {
  // Generate trends for the last 30 days
  const trends = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Random counts
    const fallCount = Math.floor(Math.random() * 5);
    const offlineCount = Math.floor(Math.random() * 2);

    if (fallCount > 0) {
      trends.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        count: fallCount,
        event: '2', // Fall
      });
    }

    if (offlineCount > 0) {
      trends.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        count: offlineCount,
        event: '5', // Offline
      });
    }
  }

  return {
    statusCode: 200,
    status: true,
    message: 'Alert trends fetched successfully',
    data: trends,
  };
};

export const getDemoAgentPerformance = () => {
  return {
    statusCode: 200,
    status: true,
    message: 'Agent performance fetched successfully',
    data: [
      {
        closed_by: 'Sean',
        countLessThan2Min: 25,
        countGreaterThan2Min: 2,
      },
      {
        closed_by: 'Demo Agent',
        countLessThan2Min: 40,
        countGreaterThan2Min: 5,
      },
      {
        closed_by: 'Support Team',
        countLessThan2Min: 15,
        countGreaterThan2Min: 1,
      },
    ],
  };
};

export const getDemoSLAReport = () => {
  // Generate ~50 records with 90% true status distributed over the last 30 days
  const data = [];
  const today = new Date();

  for (let i = 0; i < 50; i++) {
    // Random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(today.getDate() - daysAgo);

    data.push({
      _id: `demo_sla_${i}`,
      sla_status: Math.random() > 0.1, // 90% compliance
      alert_id: `demo_sla_alert_${i}`,
      created_at: date.toISOString(),
      event: Math.random() > 0.7 ? '5' : '2', // Mostly falls (2), some offline (5)
    });
  }

  return {
    statusCode: 200,
    status: true,
    message: 'SLA report fetched successfully',

    data: data,
  };
};

export const demoAgentsList = [
  {
    _id: 'agent_1',
    name: 'David',
    last_name: 'Johnson',
    email: 'david.j@seenyor.com',
    role: 'Supervisor',
    monitoring_agent_role_name: 'Supervisor',
    avatar: 'https://i.pravatar.cc/150?u=agent_1',
    status: true,
    soft_deleted: false,
    created_at: '2024-01-01T00:00:00Z',
    sessions: [{ loggedInAt: '2024-01-15T08:30:00Z', isLoggedOut: false }],
    shift_start: '07:00',
    shift_end: '16:00',
  },
  {
    _id: 'agent_2',
    name: 'Mahinal',
    last_name: 'Hlarpot',
    email: 'mahinal.h@seenyor.com',
    role: 'Monitoring Agent',
    monitoring_agent_role_name: 'Monitoring Agent',
    avatar: 'https://i.pravatar.cc/150?u=agent_2',
    status: true,
    soft_deleted: false,
    created_at: '2024-01-02T00:00:00Z',
    sessions: [{ loggedInAt: '2024-01-14T17:45:00Z', isLoggedOut: true }],
    shift_start: '09:00',
    shift_end: '18:00',
  },
  {
    _id: 'agent_3',
    name: 'Sarah',
    last_name: 'Connors',
    email: 'sarah.c@seenyor.com',
    role: 'Admin',
    monitoring_agent_role_name: 'Admin',
    avatar: 'https://i.pravatar.cc/150?u=agent_3',
    status: true,
    soft_deleted: false,
    created_at: '2024-01-03T00:00:00Z',
    sessions: [{ loggedInAt: '2024-01-15T09:15:00Z', isLoggedOut: false }],
    shift_start: '14:00',
    shift_end: '23:00',
  },
  {
    _id: 'agent_4',
    name: 'Bruce',
    last_name: 'Wayne',
    email: 'bruce.w@seenyor.com',
    role: 'Monitoring Agent',
    monitoring_agent_role_name: 'Monitoring Agent',
    avatar: 'https://i.pravatar.cc/150?u=agent_4',
    status: true,
    soft_deleted: false,
    created_at: '2024-01-04T00:00:00Z',
    sessions: [{ loggedInAt: '2024-01-15T22:05:00Z', isLoggedOut: false }],
    shift_start: '22:00',
    shift_end: '06:00',
  },
  {
    _id: 'agent_5',
    name: 'Clark',
    last_name: 'Kent',
    email: 'clark.k@seenyor.com',
    role: 'Supervisor',
    monitoring_agent_role_name: 'Supervisor',
    avatar: 'https://i.pravatar.cc/150?u=agent_5',
    status: true,
    soft_deleted: false,
    created_at: '2024-01-05T00:00:00Z',
    sessions: [{ loggedInAt: '2024-01-15T07:55:00Z', isLoggedOut: false }],
    shift_start: '08:00',
    shift_end: '17:00',
  },
  {
    _id: 'agent_6',
    name: 'Diana',
    last_name: 'Prince',
    email: 'diana.p@seenyor.com',
    role: 'Monitoring Agent',
    monitoring_agent_role_name: 'Monitoring Agent',
    avatar: 'https://i.pravatar.cc/150?u=agent_6',
    status: true,
    soft_deleted: false,
    created_at: '2024-01-06T00:00:00Z',
    sessions: [{ loggedInAt: '2024-01-15T10:30:00Z', isLoggedOut: false }],
    shift_start: '10:00',
    shift_end: '19:00',
  },
];

export const getDemoUserDetails = (id) => {
  // Find the agent in the demo list
  const agent = demoAgentsList.find((a) => a._id === id) || demoAgentsList[0];

  // Enrich with permissions content needed for the details page
  const enrichedAgent = {
    ...agent,
    contact_number: '555-0123',
    contact_code: '+1',
    monitoring_agency_access: {
      manage_agent: true,
      agent_role_creation: true,
      delete_agent: false,
      sla_setting_access: true,
      edit_customer: true,
      branding_setting_access: false,
      pause_resume_customer: true,
      api_and_webhook_access: false,
      deactive_customers: true,
      billing_and_usage_access: false,
    },
  };

  return {
    data: enrichedAgent,
    message: 'User details fetched successfully',
    status: true,
    statusCode: 200,
  };
};

export const getDemoAgentCountStatistics = (params) => {
  // Return static stats for the agent details page
  return {
    statusCode: 200,
    status: true,
    message: 'Agent statistics fetched successfully',
    data: {
      count_less_sla: 42,
      count_more_sla: 3,
      avg_res_time: 45000,
      total_true: 40,
      total_false: 5,
    },
  };
};
