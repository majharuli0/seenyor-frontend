import { useEffect, useState, useContext } from 'react';
import AlertName from '@/Components/NameCol/AlertName';
import { LuEye } from 'react-icons/lu';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import ActionManu from '@/Components/ActionManu/ActionManu';
import LargeTextViewerModal from '@/Components/LargeTextViewerModal/LargeTextViewerModal';
import AutoUpdatingDuration from '@/Components/AutoUpdatingDuration/AutoUpdatingDuration';

import {
  transformDateAndTime,
  transformDateAndTimeToDuration,
  getAlertType,
  calculateDurationBetweenTimes,
  getAlertInfoViaEvent,
} from '@/utils/helper';
import { SidebarContext } from '@/Context/CustomContext';
import InlineActionManu from '@/Components/ActionManu/InlineActionManu';

export default function useAlertTableColumns(type) {
  const { rolesFormatter } = useContext(SidebarContext);
  const navigate = useNavigate(); // Initialize the navigate function
  const handleViewClick = (row) => {
    window.scrollTo(0, 0);
    navigate(`/supporter/elderlies/elderly-profile/${row.elderly_id}?tab=overview`);
  };
  const alertColsMapping = {
    activeAlertsTableData: [
      'alertName',
      'alertType',
      'elderlyName',
      'roomName',
      'incidentTime',
      'alertLifetime',
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
      'address',
      'viewElderly',
    ],
    eventsTableData: [
      'eventName',
      'elderlyName',
      'eventTime',
      // "eventTimeline",
      'place',
      // "expandColumn",
      'largeText',
      'status',
      // "disabilityType",
      'action',
    ],
    recentAlarms: ['alertName2', 'action2'],
  };
  const AlertsTableColumns = {
    alertName: {
      title: 'Ttile',
      render: (row) => <AlertName data={row} />,
    },
    alertName2: {
      title: 'Title',
      render: (row) => <AlertName data={row} type={2} />,
    },
    alertType: {
      title: 'Type',
      render: (row) => <span>{getAlertInfoViaEvent(row)?.label}</span>,
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
      title: 'Response Time',
      render: (row) => (
        <span className='text-nowrap'>
          {calculateDurationBetweenTimes(row?.created_at, row?.closed_at)}
        </span>
      ),
    },
    alertLife: {
      title: 'Duration',
      dataIndex: 'created_at',
      render: (text) => (
        <span className='text-nowrap'>
          {/* {transformDateAndTimeToDuration(text)} */}
          <AutoUpdatingDuration date={text} />
        </span>
      ),
    },
    alertStatus: {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => (
        <span className='text-nowrap'>{text ? 'True Notification' : 'False Notification'}</span>
      ),
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
      render: (text) => <span className='text-nowrap'>{transformDateAndTime(text)}</span>,
    },
    closedBy: {
      title: 'Closed By',
      render: (row) => (
        <span className='text-nowrap'>
          {row.closed_by} ({rolesFormatter[row.closed_by_role]} )
        </span>
      ),
    },
    //for events table
    eventName: {
      title: 'Event Name',
      dataIndex: 'event_name',
      render: (text) => <span>{text}</span>,
    },
    eventTime: {
      title: 'Event Time',
      dataIndex: 'date_time',
      render: (text) => <span className='text-nowrap'>{transformDateAndTime(text)}</span>,
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
    place: {
      title: 'Place',
      dataIndex: 'place',
      render: (text) => <span className='text-nowrap'>{text}</span>,
    },
    status: {
      title: 'Status',
      dataIndex: 'event_status',
      render: (text) => (
        <span className='text-nowrap capitalize'>{text !== 'open' ? text : 'Done'}</span>
      ),
    },
    largeText: {
      title: () => {
        switch (type) {
          case 'events':
            return 'Note';
          default:
            return '';
        }
      },
      render: (row) => <LargeTextViewerModal data={row.note} title='Additional Info' />,
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
      title: 'Action',
      align: 'right',
      render: (row) => <InlineActionManu row={row} />,
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
    } else if (type == 'recentAlarms') {
      const cols = alertColsMapping.recentAlarms.map((col) => {
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
