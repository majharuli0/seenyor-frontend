import { useEffect, useState, useContext } from 'react';
import AlertName from '@/Components/NameCol/AlertName';
import { LuEye } from 'react-icons/lu';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import ActionManu from '@/Components/ActionManu/ActionManu';
import LargeTextViewerModal from '@/Components/LargeTextViewerModal/LargeTextViewerModal';
import {
  transformDateAndTime,
  transformDateAndTimeToDuration,
  getAlertType,
  calculateDurationBetweenTimes,
} from '@/utils/helper';
import { SidebarContext } from '@/Context/CustomContext';
import AutoUpdatingDuration from '@/Components/AutoUpdatingDuration/AutoUpdatingDuration';
import InlineActionManu from '../../../Components/ActionManu/InlineActionManu';

export default function useAlertTableColumns(type) {
  const { rolesFormatter } = useContext(SidebarContext);

  const navigate = useNavigate(); // Initialize the navigate function

  const randomId = Math.floor(Math.random() * 1000000);
  const handleViewClick = (row) => {
    window.scrollTo(0, 0);
    navigate(`/supporter/elderlies/elderly-profile/${randomId}?tab=overview`); // Navigate to the profile page with the ID
  };
  const alertColsMapping = {
    activeAlertsTableData: [
      'alertName',
      'alertType',
      'elderlyName',
      'roomName',
      'incidentTime',
      'alertLife',
      'address',
      'viewElderly',
    ],
    recentlyClosedAlertsTableData: [
      'alertName',
      'alertType',
      'elderlyName',
      'roomName',
      'incidentTime',
      'alertLifetime',
      'alertStatus',
      'closedAt',
      'closedBy',
      'largeText',
      'address',
    ],

    recentlyAlerts: ['alertName2'],

    eventsTableData: [
      'eventName',
      'elderlyName',
      'eventTime',
      'eventTimeline',
      'hospital',
      'expandColumn',
      'largeText',
      'disabilityType',
      'action',
    ],
  };
  const AlertsTableColumns = {
    alertName: {
      title: 'Notification Name',
      render: (row) => <AlertName data={row} />,
    },
    alertName2: {
      title: 'Notification Name',
      render: (row) => <AlertName data={row} type={3} />,
    },
    alertType: {
      title: 'Notification Type',
      render: (row) => <span>{getAlertType(row)}</span>,
    },
    elderlyName: {
      title: 'User Name',
      dataIndex: 'elderly_name',
      render: (text) => <span>{text}</span>,
    },
    roomName: {
      title: 'Room Name',
      dataIndex: 'room_name',
      render: (text) => <span>{text}</span>,
    },

    incidentTime: {
      title: 'Observation Time',
      dataIndex: 'created_at',
      render: (text) => <span className='text-nowrap'>{transformDateAndTime(text)}</span>,
    },
    alertLifetime: {
      title: 'Notification Duration',
      render: (row) => (
        <span className='text-nowrap'>
          {calculateDurationBetweenTimes(row?.created_at, row?.closed_at)}
        </span>
      ),
    },
    alertLife: {
      title: 'Notification Duration',
      dataIndex: 'created_at',
      render: (text) => (
        <span className='text-nowrap'>
          {/* {transformDateAndTimeToDuration(text)} */}
          <AutoUpdatingDuration date={text} />
        </span>
      ),
    },
    alertStatus: {
      title: 'Notification Status',
      dataIndex: 'status',
      render: (text) => <span className='text-nowrap'>{text ? 'True Alert' : 'False Alert'}</span>,
    },
    address: {
      title: 'Address',
      width: '230px',
      render: (row) => <span className='!w-[230px] text-nowrap'>{row.address}</span>,
    },
    //for recently closed alerts table
    closedAt: {
      title: 'Closed At',
      dataIndex: 'closed_at',
      render: (text) => (
        <span className='text-nowrap'>{text ? transformDateAndTime(text) : '--'}</span>
      ),
    },
    closedBy: {
      title: 'Closed By',
      render: (row) => (
        <span className='text-nowrap'>
          {row?.closed_by ? `${row.closed_by} (${rolesFormatter[row.closed_by_role]})` : 'N/A'}
        </span>
      ),
    },
    //for events table
    eventName: {
      title: 'Event Name',
      dataIndex: 'eventName',
      render: (text) => <span>{text}</span>,
    },
    eventTime: {
      title: 'Event Time',
      dataIndex: 'time',
      render: (text) => <span className='text-nowrap'>{text}</span>,
    },
    eventTimeline: {
      title: 'Event Timeline',
      dataIndex: 'alertLifetime',
      render: (text) => <span className='text-nowrap'>{text}</span>,
    },
    disabilityType: {
      title: 'Disability Type',
      dataIndex: 'disabilityType',
      render: (text) => <span className='text-nowrap'>{text}</span>,
    },
    hospital: {
      title: 'Hospital',
      dataIndex: 'hospital',
      render: (row) => (
        <span className='text-nowrap'>
          {row.name.length > 20 ? `${row.name.substring(0, 20)}...` : row.name}
        </span>
      ),
    },
    largeText: {
      title: () => {
        switch (type) {
          case 'events':
            return 'Additional Info';
          case 'recentlyClosedAlert':
            return 'Comments';
          default:
            return '';
        }
      },
      render: (row) =>
        row?.closed_at ? (
          <LargeTextViewerModal
            data={
              type === 'recentlyClosedAlert'
                ? row?.comment
                : type === 'events'
                  ? row?.additionalInfo
                  : ''
            }
            title={
              type === 'recentlyClosedAlert'
                ? 'Comment'
                : type === 'events'
                  ? 'Additional Info'
                  : ''
            }
          />
        ) : (
          '--'
        ),
    },
    expandColumn: Table.EXPAND_COLUMN,
    viewElderly: {
      // title: "View Elderly",
      render: (row) => (
        <span
          onClick={() => handleViewClick(row)}
          className='flex items-center transition-all duration-300 justify-center gap-2 text-sm font-medium text-text-primary hover:text-primary cursor-pointer p-2 rounded-md  text-center hover:bg-slate-100'
        >
          View <LuEye />
        </span>
      ),
    },
    action: {
      title: 'Action',
      render: (row) => <ActionManu row={row} />,
    },
    action2: {
      align: 'right',
      fixed: 'right',
      width: '50px',
      render: (row) => <InlineActionManu row={row} onlyFall={true} />,
    },
  };
  const [alertTableColumns, setAlertTableColumns] = useState(undefined);
  useEffect(() => {
    if (type == 'activeAlert') {
      const cols = alertColsMapping.activeAlertsTableData.map((col) => {
        return AlertsTableColumns[col];
      });
      setAlertTableColumns(cols);
    } else if (type == 'recentlyClosedAlert') {
      const cols = alertColsMapping.recentlyClosedAlertsTableData.map((col) => {
        return AlertsTableColumns[col];
      });
      setAlertTableColumns(cols);
    } else if (type == 'recentlyAlerts') {
      const cols = alertColsMapping.recentlyAlerts.map((col) => {
        return AlertsTableColumns[col];
      });
      setAlertTableColumns(cols);
    } else if (type == 'events') {
      const cols = alertColsMapping.eventsTableData.map((col) => {
        return AlertsTableColumns[col];
      });
      setAlertTableColumns(cols);
    } else {
      setAlertTableColumns([]);
    }
  }, []);
  return alertTableColumns;
}

export { useAlertTableColumns };
