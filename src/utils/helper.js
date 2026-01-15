import dayjs from 'dayjs';
import { AlertCircle, Bell, MessageSquare, PhoneCall } from 'lucide-react';
import { AiOutlineContacts } from 'react-icons/ai';
import { CgPinAlt } from 'react-icons/cg';
import { FaPersonFalling } from 'react-icons/fa6';
import { IoBed } from 'react-icons/io5';
import { MdOutlineDownloadDone } from 'react-icons/md';
import { RiWifiOffLine } from 'react-icons/ri';
import { SiWalletconnect } from 'react-icons/si';

import { globalIncrementVisit } from '@/Context/CustomContext';

// Import all SVGs from the 'imgs' folder
const svgs = import.meta.glob('../assets/icon/alarm/*.svg', { eager: true });
// Map the SVGs into an object for easy access by name
let icons = {};
for (const key in svgs) {
  if (Object.hasOwnProperty.call(svgs, key)) {
    const iconName = key.split('/').pop().replace('.svg', '');
    icons[iconName] = svgs[key].default;
  }
}

//help to formate any time with am or pm
export const formatTime = (timeString) => {
  if (!timeString || timeString === '--') return '--';

  try {
    // Extract only hours and minutes (ignore seconds entirely)
    const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!timeMatch) return '--';

    const hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    return `${formattedHours.toString().padStart(2, '0')}:${minutes} ${period}`;
  } catch (error) {
    return '--';
  }
};
export function formatDuration(timeString) {
  if (!timeString) return '0h 0m';

  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  const totalHours = hours || 0;
  const totalMinutes = (minutes || 0) + Math.floor((seconds || 0) / 60);

  return `${totalHours}h ${totalMinutes}m`;
}
export const formatTimeWithSuffix = (timeString) => {
  if (!timeString || timeString === '--') return '--';

  try {
    // Check for valid patterns like "08:00之后" or "After 08:00"
    const chineseSuffixMatch = timeString.match(/^(\d{1,2}:\d{2})(之后|以前|之前)?$/);
    const englishSuffixMatch = timeString.match(/^(After|Before) (\d{1,2}:\d{2})$/i);

    // Handle Chinese suffixes and translate them to English
    if (chineseSuffixMatch) {
      const time = chineseSuffixMatch[1];
      const suffix = chineseSuffixMatch[2]?.trim(); // Valid suffix: 之后, 以前, or 之前
      let translatedSuffix = '';

      // Translate Chinese suffixes to English
      if (suffix === '之后') translatedSuffix = 'After';
      else if (suffix === '以前' || suffix === '之前') translatedSuffix = 'Before';

      return translatedSuffix ? `${translatedSuffix} ${formatTime(time)}` : formatTime(time);
    }

    // Handle English suffixes
    if (englishSuffixMatch) {
      const time = englishSuffixMatch[2];
      const suffix = englishSuffixMatch[1]; // Valid suffix: After or Before
      return suffix ? `${suffix} ${formatTime(time)}` : formatTime(time);
    }

    // If no valid suffix is found, return only the formatted time
    return formatTime(timeString);
  } catch (error) {
    return '--';
  }
};

//help to formate any time to hours and minutes
export const formatTimeToHoursAndMinutes = (minutes) => {
  if (!minutes) return '--';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  return `${hours}h ${remainingMinutes}m`;
};

//transform data for daily routine
export const extractTimeAndSuffix = (time) => {
  if (!time) {
    return { time: '00:00', suffix: '' }; // Default to "00:00" if no time is provided
  }

  // Handle "After" or "之后"
  if (time.includes('之后') || time.startsWith('After')) {
    return {
      time: time.slice(time.indexOf(' ') + 1, time.indexOf(' ') + 6), // Extract time after the space
      suffix: 'After',
    };
  }

  // Handle "Before" or "之前"
  if (time.includes('之前') || time.startsWith('Before')) {
    return {
      time: time.slice(time.indexOf(' ') + 1, time.indexOf(' ') + 6), // Extract time after the space
      suffix: 'Before',
    };
  }

  // Handle valid time format without a suffix
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    return { time: time.slice(0, 5), suffix: '' };
  }

  // Fallback to "00:00" if format is unexpected
  return { time: '00:00', suffix: '' };
};

export const transformDataDailyRoutine = (data) =>
  data.map((entry) => {
    const fullDate = entry.date.split('T')[0]; // Extract the full date (YYYY-MM-DD)
    const shortDate = fullDate.slice(2); // Extract "YY-MM-DD"

    const formatTime = (timeObj) => `${timeObj.time}:00`; // Add ":00" to ensure consistency

    return [
      {
        time: `${fullDate}T${formatTime(extractTimeAndSuffix(entry.get_bed_idx))}`,
        date: shortDate,
        type: 'Went to bed',
        suffix: extractTimeAndSuffix(entry.get_bed_idx).suffix,
      },
      {
        time: `${fullDate}T${formatTime(extractTimeAndSuffix(entry.sleep_st_idx))}`,
        date: shortDate,
        type: 'Fell asleep',
        suffix: extractTimeAndSuffix(entry.sleep_st_idx).suffix,
      },
      {
        time: `${fullDate}T${formatTime(extractTimeAndSuffix(entry.sleep_ed_idx))}`,
        date: shortDate,
        type: 'Wake up',
        suffix: extractTimeAndSuffix(entry.sleep_ed_idx).suffix,
      },
      {
        time: `${fullDate}T${formatTime(extractTimeAndSuffix(entry.leave_bed_idx))}`,
        date: shortDate,
        type: 'Get up',
        suffix: extractTimeAndSuffix(entry.leave_bed_idx).suffix,
      },
    ];
  });

export const transformDataForBedExit = (data) => {
  const groupedData = data.flatMap((entry) =>
    entry.statistical_data
      .filter((stats) => stats.status === '3')
      .map((stat) => {
        const fullDate = entry._id; // Use the date directly from the entry
        const shortDate = fullDate.slice(2);

        const startTime = stat.start_time ? `${fullDate}T${stat.start_time.split(' ')[1]}` : null;
        const endTime = stat.end_time ? `${fullDate}T${stat.end_time.split(' ')[1]}` : null;

        // Return an object with proper formatting
        return {
          endTime: endTime,
          time: startTime,
          date: shortDate,
          type: 'Bed-Exit at Night',
        };
      })
  );

  // Group the transformed data by 'date' into arrays
  const groupedByDate = groupedData.reduce((acc, curr) => {
    // If the date already exists in the accumulator, push the entry to that date group
    if (!acc[curr.date]) {
      acc[curr.date] = []; // Create a new group for the date if it doesn't exist
    }
    acc[curr.date].push(curr); // Add the current entry to the date group

    return acc;
  }, {});

  // Convert the object into an array of arrays, where each array corresponds to a date's entries
  return Object.keys(groupedByDate).map((date) => groupedByDate[date]);
};

//transform time to 00:00:00 to 00:00
export const transformTime = (time) => {
  return time?.includes(':') ? time.slice(0, 5) : time;
};
//transform date and time (2024-12-07T02:22:22.825Z) to local time with am pm and if it's todat date then no need to show date
export const transformDateAndTime = (date) => {
  const today = new Date();
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return today.toDateString() === new Date(date).toDateString()
    ? formattedTime
    : `${formattedDate} ${formattedTime}`;
};
//transform date and time (2024-12-07T02:22:22.825Z) to duration from now like 1h 2m (make sure it's in local time and no minus time will be shown)
export const transformDateAndTimeToDuration = (date) => {
  const now = new Date().getTime();
  const targetDate = new Date(date).getTime();
  const diff = Math.abs(targetDate - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let result = '';

  if (days > 0) {
    result += `${days}d `;
  }
  if (hours > 0 || days > 0) {
    result += `${hours}h `;
  }
  result += `${minutes}m`;

  const direction = targetDate < now ? '' : 'from now';
  return `${result.trim()} ${direction}`;
};
export const calculateDurationBetweenTimes = (startTime, endTime) => {
  const startDate = new Date(startTime).getTime();
  const endDate = new Date(endTime).getTime();
  const diff = Math.abs(endDate - startDate);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let result = '';

  if (days > 0) {
    result += `${days}d `;
  }
  if (hours > 0 || days > 0) {
    result += `${hours}h `;
  }
  result += `${minutes}m`;
  console.log(result);

  return result.trim();
};
export const base64ToBytes = (base64) => {
  try {
    const binaryStr = atob(base64);
    return Uint8Array.from(binaryStr, (char) => char.charCodeAt(0));
  } catch (err) {
    console.error('Invalid base64:', err);
    return null;
  }
};

export const decodeMinuteSleepStats = (base64) => {
  const bytes = base64ToBytes(base64);

  if (!bytes || bytes.length !== 16) {
    console.error('Invalid minute-level sleep data');
    return null;
  }

  const statusByte = bytes[13];

  const getBits = (value, offset, length) => {
    return (value >> offset) & ((1 << length) - 1);
  };

  // Decode each 2-bit section from byte 13
  const breathingStatusBits = getBits(statusByte, 0, 2);
  const heartStatusBits = getBits(statusByte, 2, 2);
  const vitalSignsBits = getBits(statusByte, 4, 2);
  const sleepStateBits = getBits(statusByte, 6, 2);

  const breathingStatuses = ['Normal', 'Hypopnea', 'Hyperpnea', 'Apnea'];
  const heartStatuses = ['Normal', 'Low', 'High', 'Undefined'];
  const vitalSignsStatuses = ['Normal', 'Undefined', 'Undefined', 'Weak'];
  const sleepStates = ['Undefined', 'Light Sleep', 'Deep Sleep', 'Awake'];
  const sleepStateColors = ['#9e9e9e', '#42a5f5', '#7cb342', '#ffcb21'];
  const sleepStateColors2 = ['#2563EB', '#2563EB', '#2563EB', '#D89200'];
  return {
    realTimeBreathing: bytes[1],
    realTimeHeartRate: bytes[2],
    averageBreathing: bytes[5],
    averageHeartRate: bytes[6],
    statusEvents: {
      breathing: breathingStatuses[breathingStatusBits],
      heartRate: heartStatuses[heartStatusBits],
      vitalSigns: vitalSignsStatuses[vitalSignsBits],
      sleepState: {
        label: sleepStates[sleepStateBits],
        color: sleepStateColors[sleepStateBits],
        color2: sleepStateColors2[sleepStateBits],
      },
    },
  };
};

export const base64ToHex = (base64) => {
  try {
    // Decode the Base64 to binary string
    const binaryData = atob(base64);

    // Convert binary to hex
    const hex = Array.from(binaryData)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');

    return hex;
  } catch (error) {
    console.error('Invalid Base64 string:', error);
    return null;
  }
};
export const decodeHeartBreath = (base64) => {
  const hexData = base64ToHex(base64);

  if (!hexData || hexData.length !== 32) {
    console.error('Invalid heartbreath data.');
    return null;
  }

  // Extract Breathing and Heart rate values from the hex data
  const breathingValue = parseInt(hexData.substr(2, 2), 16);
  const heartRateValue = parseInt(hexData.substr(4, 2), 16);

  return {
    breathingValue,
    heartRateValue,
  };
};
function decodeSignedInt8(hexValue) {
  const unsignedValue = parseInt(hexValue, 16); // Parse as unsigned integer
  return unsignedValue >= 128 ? unsignedValue - 256 : unsignedValue; // Convert to signed integer
}

const initialColors = [
  '#34CECE', // Walking
  '#FFCB33', // Suspected Fall
  '#91B4FF', // Squatting
  '#A7E2FE', // Standing
  '#FC4A4A', // Fall Confirmation
  '#252F67', // Lying Down
];
const eventColorMap = {
  1: '#FFD700',
  2: '#ADFF2F',
  3: '#FF4500', // Enter Area
  4: '#8A2BE2', // Leave Area
};
const postureColorMap = {
  1: '#34CECE',
  2: '#FFCB33',
  3: '#91B4FF',
  4: '#A7E2FE',
  5: '#FC4A4A',
  6: '#252F67',
};
const postureColorMap2 = {
  1: '#9333EA',
  2: '#FFCB33',
  3: '#9333EA',
  4: '#9333EA',
  5: '#9333EA',
  6: '#16A34A',
};
const postureMap = {
  0: 'Initialization',
  1: 'Walking',
  2: 'Suspected Fall',
  3: 'Sitting',
  4: 'Standing',
  5: 'Fall Confirmation',
  6: 'In Bed',
  7: 'Suspected on Ground',
  8: 'On Ground',
  9: 'On Bed',
  10: 'Suspected on Bed',
  11: 'Confirmed on Bed',
};
export const decodePosition = (base64, devicecode) => {
  const hexData = base64ToHex(base64);

  if (!hexData || hexData.length % 32 !== 0) {
    console.error('Invalid position data.');
    return null;
  }

  const peopleData = [];
  for (let i = 0; i < hexData.length; i += 32) {
    const personHex = hexData.substr(i, 32);

    const targetId = parseInt(personHex.substr(0, 2), 16);
    if (targetId === 88) {
      continue; // Skip if no one is in the state
    }

    const xCoord = decodeSignedInt8(personHex.substr(2, 2));
    const yCoord = decodeSignedInt8(personHex.substr(4, 2));
    const zCoord = parseInt(personHex.substr(6, 2), 16); // Z remains unsigned

    const timeLeft = parseInt(personHex.substr(24, 2), 16);
    const posture = parseInt(personHex.substr(26, 2), 16);
    const event = parseInt(personHex.substr(28, 2), 16);
    const areaId = parseInt(personHex.substr(30, 2), 16);

    // Validate ranges
    if (zCoord < 0 || zCoord > 255) {
      console.warn(`Invalid z-coordinate: ${zCoord}`);
      continue;
    }
    if (timeLeft < 0 || timeLeft > 60) {
      console.warn(`Invalid time left: ${timeLeft}`);
      continue;
    }

    // Map posture and events to meaningful descriptions

    const eventMap = {
      0: 'No Event',
      1: 'Enter Room',
      2: 'Leave Room',
      3: 'Enter Area',
      4: 'Leave Area',
    };
    //Skip events 7–11
    if ([7, 8, 9, 10, 11].includes(posture)) {
      break;
    }
    peopleData.push({
      targetId,
      coordinates: { x: xCoord, y: yCoord, z: zCoord },
      timeLeft,
      posture: postureMap[posture] || 'Unknown',
      postureIndex: posture,
      event: eventMap[event] || 'Unknown',
      eventId: event || null,
      areaId: event === 3 || event === 4 ? areaId : null,
      color: postureColorMap[posture] || eventColorMap[event] || '#000000',
      color2: postureColorMap2[posture] || '#000000',
    });

    peopleData.forEach((p, idx) => {
      if (idx === 0) return;
      if (p.eventId === 1) {
        globalIncrementVisit?.(devicecode);
      }
    });
  }

  return peopleData;
};
export const normalizePositionDataFromObject = (data) => {
  if (!data || typeof data !== 'object') return null;

  const { ts, id: targetId, xaxis, yaxis, zaxis, posture, groupStr, debug } = data;

  return {
    timestamp: ts,
    targetId,
    groupStr,
    coordinates: {
      x: xaxis,
      y: yaxis,
      z: zaxis,
    },
    posture: postureMap[posture] || 'Unknown',
    postureIndex: posture,
    debug: debug?.split(',').map(Number) || [],
    color: postureColorMap[posture] || '#000000',
  };
};
export const getAlertType = (event) => {
  if (!event || !event.event) return 'Info';

  switch (event.event) {
    case '1':
      return 'Info';

    case '2':
      return 'Critical';

    case '3':
      switch (event.alarm_type) {
        case '14':
          return 'Critical';
        case '15':
          return 'Critical';
        case '11':
          return 'Critical';
        case '12':
          return 'Critical';
        case '16':
          return 'Critical';
        case '13':
          return 'Warning';
        case '1':
          return 'Critical';
        case '2':
          return 'Warning';
        case '3':
          return 'Critical';
        default:
          return '';
      }

    case '4':
      return 'Info';

    case '5':
      switch (event.is_online) {
        case '0':
          return 'Info';
        case '1':
          return 'Critical';
        default:
          return '';
      }

    case '6':
      switch (event.entry_2_exit) {
        case '0':
          return 'Info';
        case '1':
          return 'Info';
        default:
          return '';
      }

    case '7':
      switch (event.recovery) {
        case '0':
          return 'Warning';
        case '1':
          return 'Info';
        default:
          return '';
      }

    case '8':
      switch (event.recovery) {
        case '0':
          return 'Warning';
        case '1':
          return 'Info';
        default:
          return '';
      }

    case '9':
      switch (event.alarm_type) {
        case '1':
          return 'Critical';
        case '2':
          return 'Warning';
        default:
          return '';
      }

    case '10':
      switch (event.entry_2_exit) {
        case '1':
          return 'Critical';
        case '0':
          return 'Info';
        default:
          return '';
      }
    default:
      return 'Info';
  }
};
export function getLogDisplayInfo(log) {
  const { status, action_type, contact_name } = log || {};

  switch (status) {
    case 'called':
      switch (action_type) {
        case 'device_call':
          return {
            title: `Called room device`,
            icon: <SiWalletconnect className='w-4 h-4 text-primary' />,
          };

        case 'contact':
          return {
            title: `Called contact person`,
            icon: <AiOutlineContacts className='w-4 h-4 text-green-500' />,
          };

        case 'emergency':
          return {
            title: 'Called emergency contact',
            icon: <AlertCircle className='w-4 h-4 text-red-500' />,
          };

        default:
          return {
            title: 'Made a phone call',
            icon: <PhoneCall className='w-4 h-4 text-gray-500' />,
          };
      }

    case 'sms':
      return {
        title: 'Sent SMS notification',
        icon: <MessageSquare className='w-4 h-4 text-purple-500' />,
      };

    case 'notifications':
      return {
        title: 'Sent in-app notification',
        icon: <Bell className='w-4 h-4 text-yellow-500' />,
      };
    case 'picked':
      return {
        title: 'Alert Picked',
        icon: <CgPinAlt className='w-4 h-4 text-gray-400' />,
      };
    case 'resolved':
      return {
        title: 'Alert Resolved',
        icon: <MdOutlineDownloadDone className='w-4 h-4 text-green-500' />,
      };

    default:
      return {
        title: 'Performed an action',
        icon: <AlertCircle className='w-4 h-4 text-gray-400' />,
      };
  }
}
export const getSignalStrength = (type, value) => {
  if (type === 'wifi') {
    if (value <= -100) return { label: 'No signal', color: '#c42626' };
    if (value <= -88) return { label: 'Very Low', color: '#ff9f0d' };
    if (value <= -66) return { label: 'Low', color: '#facc15' };
    if (value <= -55) return { label: 'Not bad', color: '#00c42e' };
    return { label: 'Strong', color: '#00c42e' };
  }

  if (type === '4g') {
    if (value >= 23 && value <= 31) return { label: 'Strong', color: '#00c42e' };
    if (value >= 15 && value <= 22) return { label: 'Medium', color: '#facc15' };
    if (value >= 0 && value <= 1) return { label: 'Weak', color: '#c42626' };
    return { label: 'Unknown', color: '#9ca3af' };
  }

  return { label: '--', color: '#9ca3af' };
};

export const getAlertInfoViaEventDetails = (event) => {
  if (!event || !event.event) return '--';

  switch (event?.event) {
    case '1':
      return {
        icon: icons['icon_room-enter'],
        title: `[x time] occupant`,
        status: 1,
        label: 'Info',
      };

    case '2':
      return {
        icon: icons['icon_fall'],
        icon2: FaPersonFalling,
        title: `Fall detected`,
        status: 3,
        label: 'Critical',
        tag: 'fall',
      };

    case '3':
      switch (event?.alarm_type) {
        case '14':
          return {
            icon: icons['icon_heart-high'],
            title: `Elevated pulse detected `,
            status: 3,
            label: 'Critical',
          };
        case '15':
          return {
            icon: icons['icon_heart-low'],
            title: `Low pulse detected`,
            status: 3,
            label: 'Critical',
          };
        case '11':
          return {
            icon: icons['icon_breathe-high'],
            title: `Increased breathing rate detected `,
            status: 3,
            label: 'Critical',
          };
        case '12':
          return {
            icon: icons['icon_breathe-low'],
            title: `Slow breathing rate detected`,
            status: 3,
            label: 'Critical',
          };
        case '13':
          return {
            icon: icons['icon_apnea'],
            title: `Sleep disruption detected `,
            status: 2,
            label: 'Warning',
          };
        case '16':
          return {
            icon: icons['icon_weak-vital-signals'],
            title: `Low signal strength detected `,
            status: 3,
            label: 'Critical',
          };
      }
      break;

    case '4':
      switch (event?.entry_2_exit) {
        case '0':
          return {
            icon: icons['icon_room-enter'],
            title: `Entry detected`,
            status: 1,
            label: 'Info',
          };
        case '1':
          return {
            icon: icons['icon_room-exit'],
            title: `Exit detected `,
            status: 1,
            label: 'Info',
          };
      }
      break;

    case '5':
      switch (event?.is_online) {
        case '0':
          return {
            icon: icons['icon_device-online'],
            title: `Device reconnected`,
            status: 1,
            label: 'Info',
          };
        case '1':
          return {
            icon: icons['icon_device-offline'],
            icon2: RiWifiOffLine,
            title: `Device disconnected`,
            status: 3,
            label: 'Critical',
          };
      }
      break;

    case '6':
      switch (event?.entry_2_exit) {
        case '0':
          return {
            icon: icons['icon_bed-enter'],
            title: `Bed occupancy detected`,
            status: 1,
            label: 'Info',
          };
        case '1':
          return {
            icon: icons['icon_bed-exit'],
            title: `Bed vacancy detected`,
            status: 2,
            label: 'Info',
          };
      }
      break;

    case '7':
      switch (event?.recovery) {
        case '0':
          return {
            icon: icons['icon_signal-poor'],
            title: `Weak internet signal detected`,
            status: 2,
            label: 'Warning',
          };
        case '1':
          return {
            icon: icons['icon_signal-recovered'],
            title: `Internet signal restored `,
            status: 1,
            label: 'Info',
          };
      }
      break;

    case '8':
      switch (event?.recovery) {
        case '0':
          return {
            icon: icons['icon_tilt-abnormal'],
            title: `Device angle adjustment detected`,
            status: 2,
            label: 'Warning',
          };
        case '1':
          return {
            icon: icons['icon_tilt-recovered'],
            title: `Device angle restored`,
            status: 1,
            label: 'Info',
          };
      }
      break;

    case '9':
      switch (event?.alarm_type) {
        case '1':
          return {
            icon: icons['icon_not-leaved-bed'],
            icon2: IoBed,
            title: 'Nighttime Wandering',
            status: 3,
            label: 'Critical',
          };
        case '2':
          return {
            icon: icons['icon_long-in-toilet'],
            title: `Extended stay detected `,
            status: 2,
            label: 'Warning',
          };
        case '3':
          return {
            icon: icons['icon_no-activity'],
            title: `No activity detected`,
            status: 2,
            label: 'Warning',
          };
        case '4':
          return {
            icon: icons['icon_no-activity'],
            title: `Sitting on Ground`,
            status: 2,
            label: 'Warning',
          };
      }
      break;
    case '10':
      switch (event?.entry_2_exit) {
        case '1':
          return {
            icon: icons['icon_not-leaved-bed'],
            title: 'User has not returned to the bed',
            status: 2,
            label: 'Warning',
          };
        case '0':
          return {
            icon: icons['icon_bed-enter'],
            title: `User has returned to the bed.`,
            status: 1,
            label: 'Info',
          };
      }
      break;

    default:
      return null;
  }
};

export function formatMilliseconds(ms) {
  if (typeof ms !== 'number' || ms < 0) {
    return 'Invalid input';
  }

  // Convert to seconds (divide by 1000)
  const totalSeconds = Math.floor(ms / 1000);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Build the formatted string
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}hr`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(' ');
}
export function convertUnixToReadableDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-GB', options);
}
export const getAlertInfoViaEvent = (event) => {
  if (!event || !event.event) return '--';

  switch (event?.event) {
    case '1':
      return {
        icon: icons['icon_room-enter'],
        title: `${event?.count} occupant in the ${event?.room_name}`,
        message: `${event?.count} in ${event?.elderly_name}'s ${event?.room_name}.`,
        status: 1,
        label: 'Info',
      };

    case '2':
      return {
        icon: icons['icon_fall'],
        title: `Fall detected in the ${event?.room_name}`,
        message: `Fall in ${event?.elderly_name}'s ${event?.room_name}.`,
        message2: `Fall detected for ${event?.elderly_name} in Room ${event?.room_no}.`,
        status: 3,
        label: 'Critical',
        tag: 'fall',
      };

    case '3':
      switch (event?.alarm_type) {
        case '14':
          return {
            icon: icons['icon_heart-high'],
            title: `Elevated pulse detected in the ${event?.room_name}`,
            message: `High pulse in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 3,
            label: 'Critical',
          };
        case '15':
          return {
            icon: icons['icon_heart-low'],
            title: `Low pulse detected in the ${event?.room_name}`,
            message: `Low pulse in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 3,
            label: 'Critical',
          };
        case '11':
          return {
            icon: icons['icon_breathe-high'],
            title: `Increased breathing rate detected in the ${event?.room_name}`,
            message: `Rapid breathing in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 3,
            label: 'Critical',
          };
        case '12':
          return {
            icon: icons['icon_breathe-low'],
            title: `Slow breathing rate detected in the ${event?.room_name}`,
            message: `Shallow breathing in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 3,
            label: 'Critical',
          };
        case '13':
          return {
            icon: icons['icon_apnea'],
            title: `Sleep disruption detected in the ${event?.room_name}`,
            message: `Sleep interrupted in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 2,
            label: 'Warning',
          };
        case '16':
          return {
            icon: icons['icon_weak-vital-signals'],
            title: `Low signal strength detected in the ${event?.room_name}`,
            message: `Weak vitals in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 3,
            label: 'Critical',
          };
      }
      break;

    case '4':
      switch (event?.entry_2_exit) {
        case '0':
          return {
            icon: icons['icon_room-enter'],
            title: `Entry detected in the ${event?.room_name}`,
            message: `Entry in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 1,
            label: 'Info',
          };
        case '1':
          return {
            icon: icons['icon_room-exit'],
            title: `Exit detected in the ${event?.room_name}`,
            message: `Exit from ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 1,
            label: 'Info',
          };
      }
      break;

    case '5':
      switch (event?.is_online) {
        case '0':
          return {
            icon: icons['icon_device-online'],
            title: `Device reconnected in the ${event?.room_name}`,
            message: `Device online in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 1,
            label: 'Info',
          };
        case '1':
          return {
            icon: icons['icon_device-offline'],
            title: `Device disconnected in the ${event?.room_name}`,
            message: `Device offline in ${event?.elderly_name}'s ${event?.room_name}.`,
            message2: `Device offline for ${event?.elderly_name} in Room ${event?.room_no}.`,

            status: 3,
            label: 'Critical',
          };
      }
      break;

    case '6':
      switch (event?.entry_2_exit) {
        case '0':
          return {
            icon: icons['icon_bed-enter'],
            title: `Bed occupancy detected in the ${event?.room_name}`,
            message: `Bed occupied in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 1,
            label: 'Info',
          };
        case '1':
          return {
            icon: icons['icon_bed-exit'],
            title: `Bed vacancy detected in the ${event?.room_name}`,
            message: `Bed empty in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 2,
            label: 'Info',
          };
      }
      break;

    case '7':
      switch (event?.recovery) {
        case '0':
          return {
            icon: icons['icon_signal-poor'],
            title: `Weak internet signal detected in the ${event?.room_name}`,
            message: `Weak Wi-Fi in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 2,
            label: 'Warning',
          };
        case '1':
          return {
            icon: icons['icon_signal-recovered'],
            title: `Internet signal restored in the ${event?.room_name}`,
            message: `Wi-Fi restored in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 1,
            label: 'Info',
          };
      }
      break;

    case '8':
      switch (event?.recovery) {
        case '0':
          return {
            icon: icons['icon_tilt-abnormal'],
            title: `Device angle adjustment detected in the ${event?.room_name}`,
            message: `Angle adjusted in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 2,
            label: 'Warning',
          };
        case '1':
          return {
            icon: icons['icon_tilt-recovered'],
            title: `Device angle restored in the ${event?.room_name}`,
            message: `Angle reset in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 1,
            label: 'Info',
          };
      }
      break;

    case '9':
      switch (event?.alarm_type) {
        case '1':
          return {
            icon: icons['icon_not-leaved-bed'],
            title: `${event?.elderly_name} has not returned to bed within the expected time.`,
            message: `${event?.elderly_name} not back in bed.`,
            status: 3,
            label: 'Critical',
          };
        case '2':
          return {
            icon: icons['icon_long-in-toilet'],
            title: `Extended stay detected in the ${event?.room_name}`,
            message: `Long stay in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 2,
            label: 'Warning',
          };
        case '3':
          return {
            icon: icons['icon_no-activity'],
            title: `No activity detected in the ${event?.room_name} for an extended period`,
            message: `No activity in ${event?.elderly_name}'s ${event?.room_name}.`,
            status: 2,
            label: 'Warning',
          };
      }
      break;
    case '10':
      switch (event?.entry_2_exit) {
        case '1':
          return {
            icon: icons['icon_not-leaved-bed'],
            title: 'User has not returned to the bed',
            message: `${event?.elderly_name} not back in bed.`,
            status: 3,
            label: 'Critical',
          };
        case '0':
          return {
            icon: icons['icon_bed-enter'],
            title: `User has returned to the bed.`,
            message: `${event?.elderly_name} back in bed.`,
            status: 1,
            label: 'Info',
          };
      }
      break;
    default:
      return null;
  }
};
export const getEventFilter = (eventKey) => {
  const filters = {
    occupant_in_room: { event: '1' },
    fall_detected: { event: '2' },
    elevated_pulse: { event: '3', alarm_type: '14' },
    low_pulse: { event: '3', alarm_type: '15' },
    increased_breathing: { event: '3', alarm_type: '11' },
    slow_breathing: { event: '3', alarm_type: '12' },
    sleep_disruption: { event: '3', alarm_type: '13' },
    low_signal_strength: { event: '3', alarm_type: '16' },
    entry_detected: { event: '4', entry_2_exit: '0' },
    exit_detected: { event: '4', entry_2_exit: '1' },
    device_reconnected: { event: '5', is_online: '0' },
    device_disconnected: { event: '5', is_online: '1' },
    bed_occupancy: { event: '6', entry_2_exit: '0' },
    bed_vacancy: { event: '6', entry_2_exit: '1' },
    weak_internet: { event: '7', recovery: '0' },
    internet_restored: { event: '7', recovery: '1' },
    device_angle_adjustment: { event: '8', recovery: '0' },
    device_angle_restored: { event: '8', recovery: '1' },
    off_bed: { event: '9', alarm_type: '1' },
    extended_stay: { event: '9', alarm_type: '2' },
    no_activity: { event: '9', alarm_type: '3' },
  };
  return filters[eventKey] || {};
};
export const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    console.log('Text-to-speech not supported');
  }
};
export function formatSmartDate(datetime) {
  if (!datetime) return '';

  const date = dayjs(datetime);
  const now = dayjs();

  // Check if the date is today
  if (date.isSame(now, 'day')) {
    return date.format('hh:mm A');
  }

  // Otherwise show time + date
  return date.format('hh:mm A, DD MMM');
}
// utils/helper.js
export function getResponseTime(startDate, endDate) {
  if (!startDate || !endDate) return '';

  // Convert to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Difference in milliseconds
  let diff = end - start;
  if (diff < 0) diff = 0; // avoid negative

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Build string dynamically
  let parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

export function formatCreatedAt(dateString, alert) {
  if (alert?.is_resolved) {
    const start = dayjs(dateString);
    const end = dayjs(alert.closed_at || alert.updated_at);
    const diffMs = end.diff(start);
    const durationMin = Math.floor(diffMs / 60000);
    const durationSec = Math.floor((diffMs % 60000) / 1000);

    if (durationMin === 0) {
      return `Response: ${durationSec}s`;
    }
    return `Response: ${durationMin}m ${durationSec}s`;
  }
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
}
export function formatToTime12Hour(isoString) {
  // Convert to Date object
  const date = new Date(isoString);

  // Get hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // convert 0 or 12 to 12-hour format

  // Pad hours and minutes
  const strHours = String(hours).padStart(2, '0');
  const strMinutes = String(minutes).padStart(2, '0');

  return `${strHours}:${strMinutes} ${ampm}`;
}

//rednder alerts type and event type and othrs type for grouping alert type as critical warning and info
export function getAlertsGroup(groupName) {
  switch (groupName) {
    case 'Critical':
      return {
        event: [2, 3, 5, 10, 9].join(','),
        alarm_type: [11, 12, 14, 15, 16, 1, 3].join(','),
        entry_2_exit: 1,
        is_online: 1,
      };
    case 'Warning':
      return {
        event: [3, 9, 8].join(','),
        alarm_type: [13, 2].join(','),
        recovery: 0,
      };
    case 'Info':
      return {
        event: [4, 6, 5, 1, 10].join(','),
        recovery: 1,
        is_online: 0,
        entry_2_exit: 0,
      };
    default:
      return null;
  }
}

//for data analysis
export const calculateProportion = (xaxis, data = ['10']) => {
  if (!Array.isArray(xaxis) || !Array.isArray(data)) {
    console.error('Invalid input: xaxis and data should be arrays');
    return 0;
  }

  // Convert data to numbers
  const numericData = data.map(Number);

  const efficiencyRange = ['60-70', '70-80', '80-90', '90-100'];
  const efficiencyInRangeSum = xaxis.reduce((sum, range, index) => {
    if (efficiencyRange.includes(range)) {
      sum += numericData[index]; // Use numericData here
    }
    return sum;
  }, 0);

  const totalOccurrences = numericData.reduce((sum, value) => sum + value, 0);
  return totalOccurrences > 0 ? (efficiencyInRangeSum / totalOccurrences) * 100 : 0;
};
export function calculateProportions(dataObj, threshold = 50) {
  if (
    !dataObj ||
    !Array.isArray(dataObj.xaxis) ||
    !Array.isArray(dataObj.data) ||
    dataObj.xaxis.length !== dataObj.data.length
  ) {
    throw new Error('Invalid input data structure');
  }

  // Convert data array to numbers
  const data = dataObj.data.map(Number);

  // Calculate total count
  const total = data.reduce((acc, val) => acc + val, 0);

  // Calculate proportion below the threshold
  let proportionBelowThreshold = 0;
  dataObj.xaxis.forEach((xValue, index) => {
    if (Number(xValue) < threshold) {
      proportionBelowThreshold += data[index];
    }
  });

  const percentageBelowThreshold = (proportionBelowThreshold / total) * 100;

  // Classification based on percentage
  const classification = percentageBelowThreshold < 50 ? 'Normal' : 'Insufficient';

  return {
    percentage: percentageBelowThreshold.toFixed(2),
    classification,
  };
}
export function averageVariance(data, thresholds) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Input data must be a non-empty array');
  }

  const rescaledData = data.map((val) => val / (thresholds.isDuration ? 60 : 1));
  const mean = rescaledData.reduce((acc, val) => acc + val, 0) / rescaledData.length;

  const variance =
    rescaledData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (rescaledData.length - 1);

  const standardDeviation = Math.sqrt(variance);

  let classification = '';
  if (standardDeviation <= thresholds.normal) {
    classification = 'Normal';
  } else if (standardDeviation <= thresholds.slightlyUnstable) {
    classification = 'Slightly Unstable';
  } else {
    classification = 'Unstable';
  }

  return {
    mean: mean.toFixed(2),
    standardDeviation: standardDeviation.toFixed(2),
    classification,
  };
}
export function getAlarmCount(alarmsData, criteria) {
  // Find the matching alarm group
  const matchedGroup = alarmsData.find((group) => {
    // Check if all criteria keys match the group's _id
    return Object.keys(criteria).every((key) => group._id[key] === criteria[key]);
  });

  // Return the count if found, otherwise 0
  return matchedGroup ? matchedGroup.count : 0;
}
const SleepStatus = {
  BAD: { typeId: 0, title: 'Attention', color: '#ff5d5d' },
  GENERALLY: { typeId: 1, title: 'Generally', color: '#ffcb33' },
  GOOD: { typeId: 2, title: 'Good', color: '#34cece' },
  EXCELLENT: { typeId: 3, title: 'Excellent', color: '#34cece' },
  CRITICAL: { typeId: 4, title: 'Critical', color: '#ff5d5d' },
};

export function getStatus(eventName, value) {
  switch (eventName) {
    case 'sleepScore':
      if (value >= 90) {
        return SleepStatus.EXCELLENT;
      } else if (value >= 80) {
        return SleepStatus.GOOD;
      } else if (value >= 55) {
        return SleepStatus.GENERALLY;
      } else {
        return SleepStatus.BAD;
      }
    case 'ahiIndex':
      if (value <= 5.0) {
        return SleepStatus.EXCELLENT;
      } else if (value <= 15.0 && value > 5.0) {
        return SleepStatus.GOOD;
      } else {
        return SleepStatus.BAD;
      }
    case 'deepSleep':
      if (value >= 20) {
        return SleepStatus.EXCELLENT;
      } else if (value >= 15) {
        return SleepStatus.GOOD;
      } else if (value >= 10) {
        return SleepStatus.GENERALLY;
      } else {
        return SleepStatus.BAD;
      }
    case 'outOfBed':
      if (value > 5) {
        return SleepStatus.BAD;
      } else {
        return SleepStatus.GOOD;
      }
    case 'respiratoryRate':
      if (value > 32 || value < 5) {
        return SleepStatus.CRITICAL;
      } else if (value >= 12 && value <= 24) {
        return SleepStatus.GOOD;
      } else {
        return SleepStatus.BAD;
      }
    case 'heartRate':
      if (value > 100 || value < 50) {
        return SleepStatus.CRITICAL;
      } else if (value >= 60 && value <= 80) {
        return SleepStatus.GOOD;
      } else {
        return SleepStatus.BAD;
      }
    default:
      return SleepStatus.BAD;
  }
}
export const countryCodeToTimzone = {
  '+1': 'America/New_York',
  '+7': 'Europe/Moscow',
  '+20': 'Africa/Cairo',
  '+27': 'Africa/Johannesburg',
  '+30': 'Europe/Athens',
  '+31': 'Europe/Amsterdam',
  '+32': 'Europe/Brussels',
  '+33': 'Europe/Paris',
  '+34': 'Europe/Madrid',
  '+36': 'Europe/Budapest',
  '+39': 'Europe/Rome',
  '+40': 'Europe/Bucharest',
  '+41': 'Europe/Zurich',
  '+43': 'Europe/Vienna',
  '+44': 'Europe/London',
  '+45': 'Europe/Copenhagen',
  '+46': 'Europe/Stockholm',
  '+47': 'Europe/Oslo',
  '+48': 'Europe/Warsaw',
  '+49': 'Europe/Berlin',
  '+52': 'America/Mexico_City',
  '+53': 'America/Havana',
  '+54': 'America/Argentina/Buenos_Aires',
  '+55': 'America/Sao_Paulo',
  '+56': 'America/Santiago',
  '+57': 'America/Bogota',
  '+58': 'America/Caracas',
  '+60': 'Asia/Kuala_Lumpur',
  '+61': 'Australia/Sydney',
  '+62': 'Asia/Jakarta',
  '+63': 'Asia/Manila',
  '+64': 'Pacific/Auckland',
  '+65': 'Asia/Singapore',
  '+66': 'Asia/Bangkok',
  '+81': 'Asia/Tokyo',
  '+82': 'Asia/Seoul',
  '+86': 'Asia/Shanghai',
  '+91': 'Asia/Kolkata',
  '+92': 'Asia/Karachi',
  '+93': 'Asia/Kabul',
  '+94': 'Asia/Colombo',
  '+95': 'Asia/Yangon',
  '+98': 'Asia/Tehran',
  '+351': 'Europe/Lisbon',
  '+352': 'Europe/Luxembourg',
  '+353': 'Europe/Dublin',
  '+354': 'Atlantic/Reykjavik',
  '+355': 'Europe/Tirana',
  '+356': 'Europe/Malta',
  '+357': 'Asia/Nicosia',
  '+358': 'Europe/Helsinki',
  '+359': 'Europe/Sofia',
  '+376': 'Europe/Andorra',
  '+377': 'Europe/Monaco',
  '+378': 'Europe/San_Marino',
  '+379': 'Europe/Vatican',
  '+380': 'Europe/Kyiv',
  '+381': 'Europe/Belgrade',
  '+382': 'Europe/Podgorica',
  '+383': 'Europe/Pristina',
  '+385': 'Europe/Zagreb',
  '+386': 'Europe/Ljubljana',
  '+387': 'Europe/Sarajevo',
  '+389': 'Europe/Skopje',
  '+420': 'Europe/Prague',
  '+421': 'Europe/Bratislava',
  '+880': 'Asia/Dhaka',
  '+971': 'Asia/Dubai',
  '+972': 'Asia/Jerusalem',
  '+973': 'Asia/Bahrain',
  '+974': 'Asia/Qatar',
  '+975': 'Asia/Thimphu',
  '+976': 'Asia/Ulaanbaatar',
  '+503': 'America/El_Salvador',
  '+504': 'America/Tegucigalpa',
  '+505': 'America/Managua',
  '+506': 'America/Costa_Rica',
  '+507': 'America/Panama',
};
export const countryCodeToISOCode = {
  '+1': 'US', // United States
  '+7': 'RU', // Russia
  '+20': 'EG', // Egypt
  '+27': 'ZA', // South Africa
  '+30': 'GR', // Greece
  '+31': 'NL', // Netherlands
  '+32': 'BE', // Belgium
  '+33': 'FR', // France
  '+34': 'ES', // Spain
  '+36': 'HU', // Hungary
  '+39': 'IT', // Italy
  '+40': 'RO', // Romania
  '+41': 'CH', // Switzerland
  '+43': 'AT', // Austria
  '+44': 'GB', // United Kingdom
  '+45': 'DK', // Denmark
  '+46': 'SE', // Sweden
  '+47': 'NO', // Norway
  '+48': 'PL', // Poland
  '+49': 'DE', // Germany
  '+52': 'MX', // Mexico
  '+53': 'CU', // Cuba
  '+54': 'AR', // Argentina
  '+55': 'BR', // Brazil
  '+56': 'CL', // Chile
  '+57': 'CO', // Colombia
  '+58': 'VE', // Venezuela
  '+60': 'MY', // Malaysia
  '+61': 'AU', // Australia
  '+62': 'ID', // Indonesia
  '+63': 'PH', // Philippines
  '+64': 'NZ', // New Zealand
  '+65': 'SG', // Singapore
  '+66': 'TH', // Thailand
  '+81': 'JP', // Japan
  '+82': 'KR', // South Korea
  '+86': 'CN', // China
  '+91': 'IN', // India
  '+92': 'PK', // Pakistan
  '+93': 'AF', // Afghanistan
  '+94': 'LK', // Sri Lanka
  '+95': 'MM', // Myanmar
  '+98': 'IR', // Iran
  '+351': 'PT', // Portugal
  '+352': 'LU', // Luxembourg
  '+353': 'IE', // Ireland
  '+354': 'IS', // Iceland
  '+355': 'AL', // Albania
  '+356': 'MT', // Malta
  '+357': 'CY', // Cyprus
  '+358': 'FI', // Finland
  '+359': 'BG', // Bulgaria
  '+376': 'AD', // Andorra
  '+377': 'MC', // Monaco
  '+378': 'SM', // San Marino
  '+379': 'VA', // Vatican City
  '+380': 'UA', // Ukraine
  '+381': 'RS', // Serbia
  '+382': 'ME', // Montenegro
  '+383': 'XK', // Kosovo
  '+385': 'HR', // Croatia
  '+386': 'SI', // Slovenia
  '+387': 'BA', // Bosnia and Herzegovina
  '+389': 'MK', // North Macedonia
  '+420': 'CZ', // Czech Republic
  '+421': 'SK', // Slovakia
  '+880': 'BD', // Bangladesh
  '+971': 'AE', // United Arab Emirates
  '+972': 'IL', // Israel
  '+973': 'BH', // Bahrain
  '+974': 'QA', // Qatar
  '+975': 'BT', // Bhutan
  '+976': 'MN', // Mongolia
  '+503': 'SV', // El Salvador
  '+504': 'HN', // Honduras
  '+505': 'NI', // Nicaragua
  '+506': 'CR', // Costa Rica
  '+507': 'PA', // Panama
};
export const objectTemplates = {
  2: [
    {
      type: 2,
      label: ' Bed',
      object_type: 5,
    },
    {
      type: 2,
      label: 'Bed',
      object_type: 6,
    },
    {
      type: 5,
      label: 'Monitoring Bed',
      object_type: 7,
    },
    {
      type: 4,
      label: 'Door',
      object_type: 4,
    },
    {
      type: 1,
      label: 'Others',
      object_type: 12,
    },
  ],
  1: [
    {
      type: 5,
      object_type: 8,
    },
    {
      type: 6,
      label: 'Table',
      object_type: 9,
    },
    {
      type: 4,
      label: 'Door',
      object_type: 4,
    },
    {
      type: 1,
      label: 'Others',
      object_type: 13,
    },
  ],
  3: [
    {
      type: 7,
      label: 'Tub',
      object_type: 10,
    },
    {
      type: 8,
      label: 'Toilet',
      object_type: 11,
    },
    {
      type: 4,
      label: 'Door',
      object_type: 4,
    },
    {
      type: 1,
      label: 'Others',
      object_type: 14,
    },
  ],
};
export function calculateDimensions(area) {
  const parseCoord = (coord) => {
    const [x, y] = coord && coord.split(',').map(Number);
    return { x, y };
  };

  const upLeft = parseCoord(area.up_left);
  const lowLeft = parseCoord(area.low_left);
  const upRight = parseCoord(area.up_right);
  const lowRight = parseCoord(area.low_right);

  const width = Math.abs(upRight.x - upLeft.x) * 10;

  const length = Math.abs(upLeft.y - lowLeft.y) * 10;

  return { width, length };
}
export const clearLocalStorageKeys = (keys = []) => {
  keys.forEach((key) => localStorage.removeItem(key));
};
