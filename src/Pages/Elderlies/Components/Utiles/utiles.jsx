import { HiMoon } from 'react-icons/hi';
import { RiMoonClearFill } from 'react-icons/ri';
import { FaLungs } from 'react-icons/fa';
import { MdBedtimeOff } from 'react-icons/md';
import { BiSolidBed } from 'react-icons/bi';
import { FaHeartbeat } from 'react-icons/fa';
import { FaLungsVirus } from 'react-icons/fa6';
import { FaWalking } from 'react-icons/fa';
import { IoFootsteps } from 'react-icons/io5';
import { GiDuration } from 'react-icons/gi';
import { GiExitDoor } from 'react-icons/gi';
import ls from 'store2';
//all API endpoints
import {
  getBreathRate,
  getHeartRate,
  getSleepDurationStatistics,
  getSleepDurationDistribution,
  getSleepEfficiencyStatistics,
  getSleepEfficiencyDistribution,
  getDailyRoutine,
  getBreathRateDistribution,
  getHeartRateDistribution,
  getWalkSpeedStatistics,
  getApneaIndexStatistic,
  getDeepSleedPercentageStatistics,
  getBedExitDurationStatistic,
  getNumberOfBedExist,
  getSleepSummary,
  getNumberOfRoomEntriesExitTimes,
  getFallAsleepStatistics,
  getSleepEvents,
  getWalkStepsStatistics,
} from '@/api/deviceReports';
import { CustomContext } from '@/Context/UseCustomContext';
import { useContext } from 'react';
import { calculateProportion, calculateProportions, averageVariance } from '@/utils/helper';

export const getTemplateData = (type) => {
  const dataAnsValueForEffDistribution = ls.get('efficiencyDistribution')
    ? calculateProportion(
        ls.get('efficiencyDistribution').xaxis,
        ls.get('efficiencyDistribution').data
      )
    : null;
  const sleepDurationData = [
    286, 68, 265, 228, 336, 58, 376, 167, 311, 0, 167, 215, 170, 196, 322, 96, 127, 42, 231,
  ];

  const sleepEfficiencyData = [
    51, 13, 64, 47, 63, 15, 57, 40, 47, 0, 27, 36, 27, 37, 52, 15, 24, 9, 43, 37,
  ];
  const deepSleepPercentageData = [
    10, 0, 11, 9, 12, 0, 21, 30, 13, 0, 6, 0, 12, 10, 12, 0, 0, 0, 0, 5,
  ];
  const sleepData = {
    xaxis: [
      '0-10',
      '10-20',
      '20-30',
      '30-40',
      '40-50',
      '50-60',
      '60-70',
      '70-80',
      '80-90',
      '90-100',
    ],
    data: ['55', '35', '5', '5', '0', '0', '0', '0', '0', '0'],
  };

  const sleepDurationThresholds = {
    normal: 1,
    slightlyUnstable: 2,
    isDuration: true,
  };
  const sleepEfficiencyThresholds = {
    normal: 5,
    slightlyUnstable: 15,
    isDuration: false,
  };

  const durationResult = averageVariance(sleepDurationData, sleepDurationThresholds);
  const efficiencyResult = averageVariance(sleepEfficiencyData, sleepEfficiencyThresholds);
  const deepSleepPercentage = averageVariance(deepSleepPercentageData, sleepEfficiencyThresholds);
  const deplproportion = calculateProportions(sleepData, 50);
  // console.log("Sleep Duration Result:", durationResult);
  // console.log("Sleep Efficiency Result:", efficiencyResult);
  // console.log("Deep Sleep Percentage Result:", deepSleepPercentage);
  // console.log("Propertion of deep sleep:", deplproportion);
  // console.log(
  //   "Sleep Quality Trends Result:",
  //   dataAnsValueForEffDistribution
  // );

  // const elderlyDetails = ls.get("elderly_details");
  const { elderlyDetails } = useContext(CustomContext);

  if (type === 'Duration')
    return {
      title: 'Daily Sleep Duration',
      description: 'Shows the total hours of sleep recorded each day.',
      color: '#FF9800',
      icon: <HiMoon />,
      summaryProps: {
        title: 'Daily Sleep Duration Summary',
        chartFor: 'sleedDurationStatistic',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'duration',
        isFromToDate: true,
        apisProps: {
          endpoint: getSleepDurationStatistics,
          query: {
            uids: elderlyDetails?.bedRoomIds,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Duration Distribution')
    return {
      title: 'Sleep Duration Distribution',
      description:
        'Shows how often the elderly sleeps for different durations (e.g., 6 hours, 7 hours).',
      color: '#7AB2D3',
      icon: <HiMoon />,
      summaryProps: {
        title: 'Sleep Duration Trends Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'percentage',
        xUnit: 'hour',
        isFromToDate: false,
        apisProps: {
          endpoint: getSleepDurationDistribution,
          query: {
            uids: elderlyDetails?.bedRoomIds,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Efficiency')
    return {
      title: 'Daily Sleep Quality',
      description: 'Shows the sleep efficiency score (0-100%) for each day.',
      color: '#88C273',
      icon: <HiMoon />,
      summaryProps: {
        title: 'Daily Sleep Quality Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'percentage',
        isFromToDate: true,
        apisProps: {
          endpoint: getSleepEfficiencyStatistics,
          query: {
            uids: elderlyDetails?.bedRoomIds,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Efficiency Distribution')
    return {
      title: 'Sleep Quality Distribution',
      description: 'Shows the frequency of different sleep quality scores.',
      color: '#024CAA',
      icon: <HiMoon />,
      summaryProps: {
        title: 'Sleep Quality Trends Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'percentage',
        isFromToDate: false,
        xUnit: 'percentage',
        apisProps: {
          endpoint: getSleepEfficiencyDistribution,
          query: {
            uids: elderlyDetails?.bedRoomIds,
          },
        },
      },
      dataAnalysis: '',
      // dataAnalysis:
      //   dataAnsValueForEffDistribution && dataAnsValueForEffDistribution > 50
      //     ? ""
      //     : "The sleep efficiency concentration is less than 50%, should try not to play mobile phones after going to bed, and listening to music before going to bed can help sleep",
    };
  if (type === 'Deep Sleep Percentage')
    return {
      title: 'Daily Deep Sleep %',
      description: 'Shows the percentage of deep sleep for each night.',
      color: '#7E60BF',
      icon: <RiMoonClearFill />,
      summaryProps: {
        title: 'Daily Deep Sleep % Summary',
        chartFor: 'deepSleepPercentageStatistic',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'percentage',
        isFromToDate: true,
        xUnit: 'date',
        apisProps: {
          endpoint: getDeepSleedPercentageStatistics,
          query: {
            uids: elderlyDetails?.bedRoomIds,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Deep Sleep Percentage Distribution')
    return {
      title: 'Deep Sleep Distribution',
      description: 'Shows the distribution of deep sleep percentages over time.',
      color: '#795757',
      icon: <RiMoonClearFill />,
      dataAnalysis: '',
    };
  if (type === 'Apnea Index')
    return {
      title: 'Daily Sleep Disturbances',
      description: 'Shows the number of disturbances (Apnea Index) recorded each day.',
      color: '#3C3D37',
      icon: <FaLungs />,
      summaryProps: {
        title: 'Daily Sleep Disturbances Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'number',
        isFromToDate: true,
        apisProps: {
          endpoint: getApneaIndexStatistic,
          query: {
            uids: elderlyDetails?.bedRoomIds,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Apnea Index Distribution')
    return {
      title: 'Sleep Disturbances Distribution',
      description: 'Shows the frequency of different disturbance levels.',
      color: '#6A9C89',
      icon: <FaLungs />,
      dataAnalysis: '',
    };
  if (type === 'Distribution of Bed Exit Frequency')
    return {
      title: 'Bed Exit Frequency Distribution',
      description: 'Shows how often different numbers of bed exits occur.',
      color: '#7695FF',
      icon: <BiSolidBed />,
      dataAnalysis: '',
    };
  if (type === 'Bed Exit Duration')
    return {
      title: 'Time Spent Out of Bed',
      description: 'Shows the duration spent out of bed during sleep hours for each day.',
      color: '#7A1CAC',
      icon: <BiSolidBed />,
      summaryProps: {
        title: 'Time Spent Out of Bed Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'duration',
        isFromToDate: true,
        apisProps: {
          endpoint: getBedExitDurationStatistic,
          query: {
            uids: elderlyDetails?.bedRoomIds,
            status: 3,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Number of Bed Exit')
    return {
      title: 'Nightly Bed Exits',
      description:
        'Shows the number of times the elderly exited the bed during sleep hours each night.',
      color: '#86AB89',
      icon: <BiSolidBed />,
      summaryProps: {
        title: 'Number of Bed Exits Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        chartFor: 'numberOfBedExitTime',
        dataType: 'number',
        isFromToDate: true,
        apisProps: {
          endpoint: getNumberOfBedExist,
          query: {
            uids: elderlyDetails?.bedRoomIds,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Distribution of Bed Exit Times')
    return {
      title: 'Bed Exit Time Trends',
      description:
        'Shows the specific times when bed exits occurred during the night (sleep hours).',
      color: '#508C9B',
      icon: <BiSolidBed />,
      summaryProps: {
        title: 'Bed Exit Time Trends Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'scatter',
        isFromToDate: true,
        apisProps: {
          endpoint: getSleepSummary,
          query: {
            uids: elderlyDetails?.deviceId,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Distribution of Time to Fall Asleep')
    return {
      title: 'Time to Fall Asleep Distribution',
      description: 'Shows the distribution of how long it takes to fall asleep.',
      color: '#987D9A',
      icon: <MdBedtimeOff />,
      dataAnalysis: '',
    };
  if (type === 'Time to Fall Asleep')
    return {
      title: 'Daily Time to Fall Asleep',
      description: 'Shows how long it took to fall asleep each night.',
      color: '#F44336',
      icon: <MdBedtimeOff />,
      summaryProps: {
        title: 'Time to Fall Asleep Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'duration',
        isFromToDate: true,
        apisProps: {
          endpoint: getFallAsleepStatistics,
          query: {
            uids: elderlyDetails?.bedRoomIds,
            status: '5',
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Respiratory Rate')
    return {
      title: 'Daily Breathing Rate',
      description: 'Shows the average breathing rate (breaths/min) for each day.',
      color: '#FF9D3D',
      icon: <FaLungsVirus />,
      dataAnalysis: '',
      summaryProps: {
        title: 'Daily Breathing Rate Summary',
        pickerTypes: ['day', 'range'],
        chartType: 'rate',
        dataType: 'breathRate',
        color: '#FF9D3D',
        apisProps: {
          endpoint: getBreathRate,
          query: {
            uids: elderlyDetails?.bedRoomIds,
          },
        },
      },
    };
  if (type === 'Heart Rate')
    return {
      title: 'Daily Heart Rate',
      description: 'Shows the average heart rate (bpm) for each day.',
      color: '#DB3465',
      icon: <FaHeartbeat />,
      dataAnalysis: '',
      summaryProps: {
        title: 'Daily Heart Rate Summary',
        pickerTypes: ['day', 'range'],
        chartType: 'rate',
        dataType: 'heartRate',
        color: '#DB3465',
        apisProps: {
          endpoint: getHeartRate,
          query: {
            uids: elderlyDetails?.bedRoomIds,
          },
        },
      },
    };
  if (type === 'Breath Rate Distribution')
    return {
      title: 'Breathing Rate Distribution',
      description: 'Shows the distribution of breathing rates over the period.',
      color: '#789DBC',
      icon: <FaLungsVirus />,
      summaryProps: {
        title: 'Breathing Rate Trends Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'percentage',
        isFromToDate: true,
        xUnit: 'number',
        numberLimit: 40,
        apisProps: {
          endpoint: getBreathRateDistribution,
          query: {
            uids: elderlyDetails?.deviceId,
          },
        },
      },
      dataAnalysis: '',
    };

  if (type === 'Heart Rate Anomaly Statistic')
    return {
      title: 'Heart Rate Variability',
      description: 'Shows the variation in heart rate for each day.',
      color: '#A5B68D',
      icon: <FaHeartbeat />,
      summaryProps: {
        title: 'Heart Rate Variation Overview Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'number',
        isFromToDate: true,
        chartFor: 'heartRateAnomaly',
        apisProps: {
          endpoint: getSleepEvents,
          query: {
            uids: elderlyDetails?.deviceId,
          },
        },
      },
      dataAnalysis: '',
    };

  if (type === 'Heart Rate Distribution')
    return {
      title: 'Heart Rate Distribution',
      description: 'Shows the distribution of heart rate values over the period.',
      color: '#798645',
      icon: <FaHeartbeat />,
      summaryProps: {
        title: 'Heart Rate Trends Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'percentage',
        isFromToDate: true,
        xUnit: 'number',
        numberLimit: 100,
        apisProps: {
          endpoint: getHeartRateDistribution,
          query: {
            uids: elderlyDetails?.deviceId,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Distribution of Daily Routine')
    return {
      title: 'Daily Routine Timeline',
      description: 'Shows the timeline of daily activities (In Bed, Out of Bed, etc.).',
      color: '#A5B68D',
      icon: <BiSolidBed />,
      summaryProps: {
        title: 'Daily Routine Trends Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'scatter',
        apisProps: {
          endpoint: getDailyRoutine,
          query: {
            uids: elderlyDetails?.deviceId,
          },
        },
      },
      dataAnalysis: '',
    };

  if (type === 'Body Movement Index Statistic')
    return {
      title: 'Daily Movement Activity',
      description: 'Shows the level of physical movement recorded each day.',
      color: '#A5B68D',
      icon: <FaWalking />,
      dataAnalysis: '',
    };
  if (type === 'Walk Steps Statistic')
    return {
      title: 'Daily Walking Steps',
      description: 'Shows the total number of steps taken each day.',
      color: '#987D9A',
      icon: <IoFootsteps />,
      summaryProps: {
        title: 'Walking Steps Overview Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'number',
        isFromToDate: true,
        chartFor: 'walkingStepsStatistix',
        apisProps: {
          endpoint: getWalkStepsStatistics,
          query: {
            uids: elderlyDetails?.deviceId,
          },
        },
      },
      dataAnalysis: '',
    };

  if (type === 'Duration Spent In Room')
    return {
      title: 'Time Spent in Room',
      description: 'Shows the total time spent inside the room each day.',
      color: '#808080',
      icon: <GiDuration />,
      summaryProps: {
        title: 'Room Occupancy Duration Overview Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'multibar',
        isFromToDate: true,
        apisProps: {
          endpoint: getWalkStepsStatistics,
          query: {
            uids: elderlyDetails?.deviceId,
          },
        },
      },
      dataAnalysis: '',
    };
  if (type === 'Body Movement Index Distribution')
    return {
      title: 'Movement Activity Distribution',
      description: 'Shows the distribution of movement activity levels.',
      color: '#7A1CAC',
      icon: <FaWalking />,
      dataAnalysis: '',
    };

  if (type === 'Walk Speed Statistic')
    return {
      title: 'Daily Walking Speed',
      description: 'Shows the average walking speed for each day.',
      color: '#3C3D37',
      icon: <FaWalking />,
      summaryProps: {
        title: 'Walking Speed Overview Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'number',
        isFromToDate: true,
        chartFor: 'walkingSpeedStatistic',
        dataUnit: ' meter/min',
        apisProps: {
          endpoint: getWalkStepsStatistics,
          query: {
            uids: elderlyDetails?.deviceId,
          },
        },
      },
      dataAnalysis: '',
    };

  if (type === 'Number of Room Entries and Exits')
    return {
      title: 'Room Entries & Exits',
      description: 'Shows the number of times the elderly entered or left the room each day.',
      color: '#7AB2D3',
      icon: <GiExitDoor />,
      summaryProps: {
        title: 'Room Entry and Exit Frequency Summary',
        pickerTypes: ['weeklyMonthly', 'range'],
        chartType: 'bar',
        dataType: 'number',
        chartFor: 'roomInOut',
        isFromToDate: true,
        dataUnit: ' times',
        apisProps: {
          endpoint: getWalkStepsStatistics,
          query: {
            uids: elderlyDetails?.deviceId,
          },
        },
      },
      dataAnalysis: '',
    };
};
