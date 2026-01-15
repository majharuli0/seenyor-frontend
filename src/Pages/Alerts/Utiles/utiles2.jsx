import { useEffect, useState, useContext } from 'react';
import LargeTextViewerModal from '@/Components/LargeTextViewerModal/LargeTextViewerModal';
import AlertName from '@/Components/NameCol/AlertName';
import LifespanTimeline from '@/Components/LifespanTimeline/LifespanTimeline';
import {
  transformDateAndTime,
  transformDateAndTimeToDuration,
  getAlertType,
  getAlertInfoViaEventDetails,
} from '@/utils/helper';
import { SidebarContext } from '@/Context/CustomContext';
import { LuEye } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

export default function useAlertHistoryColumns(type) {
  const { rolesFormatter } = useContext(SidebarContext);
  const [alertTableColumns, setAlertTableColumns] = useState(undefined);
  const navigate = useNavigate(); // Initialize the navigate function
  const handleViewClick = (row) => {
    window.scrollTo(0, 0);
    navigate(`/supporter/elderlies/elderly-profile/${row.elderly_id}?tab=overview`);
  };
  const alertColsMapping = {
    alertHistory: [
      'alertName',
      'alertType',
      'elderlyName',
      'roomName',
      'incidentTime',
      // "alertLifetime",
      'alertStatus',
      'comment',
      'closedAt',
      'closedBy',
      'address',
      'viewElderly',
    ],
  };
  const AlertsTableColumns = {
    alertName: {
      title: 'Title',
      render: (row) => <AlertName data={row} />,
    },
    alertType: {
      title: 'Type',
      render: (event) => <span>{getAlertInfoViaEventDetails(event)?.label}</span>,
    },
    elderlyName: {
      title: 'User Name',
      dataIndex: 'elderly_name',
      render: (text) => <span className='text-nowrap'>{text}</span>,
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
      title: 'Duration',
      dataIndex: 'closed_at',
      render: (text) => <span className='text-nowrap'>{transformDateAndTimeToDuration(text)}</span>,
    },
    alertStatus: {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => (
        <span className='text-nowrap'>{text ? 'True Alert ' : 'False Alert '}</span>
      ),
    },
    comment: {
      title: 'Comments',
      render: (row) => <LargeTextViewerModal data={row.comment} title='Alert Comments' />,
    },
    // alertLifeSpan: {
    //   title: "Alert Lifespan",
    //   dataIndex: "alertLifespan",
    //   render: (data) => <LifespanTimeline data={data} />,
    // },
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
          default:
            return '';
        }
      },
      render: (row) => <LargeTextViewerModal data={row.additionalInfo} title='Additional Info' />,
    },
    viewElderly: {
      title: 'View Elderly',
      render: (row) => (
        <span
          onClick={() => handleViewClick(row)}
          className='flex items-center transition-all duration-300 justify-center gap-2 text-sm font-medium text-text-primary hover:text-primary cursor-pointer p-2 rounded-md  text-center hover:bg-slate-100'
        >
          View <LuEye />
        </span>
      ),
    },
  };
  useEffect(() => {
    if (type === 'alertHistory') {
      const cols = alertColsMapping.alertHistory.map((col) => {
        return Object.prototype.hasOwnProperty.call(AlertsTableColumns, col)
          ? AlertsTableColumns[col]
          : null;
      });
      setAlertTableColumns(cols);
    } else {
      setAlertTableColumns([]);
    }
  }, []);
  return alertTableColumns;
}
export { useAlertHistoryColumns };

// export const alertHistoryColumns = [
//   {
//     title: "Alert Name",
//     render: (row) => <AlertName data={row} />,
//   },
//   {
//     title: "Alert Type",
//     dataIndex: "event",
//     render: (event) => <span>{getAlertType(event)}</span>,
//   },
//   {
//     title: "Elderly Name",
//     dataIndex: "elderly_name",
//     render: (text) => <span className="text-nowrap">{text}</span>,
//   },
//   {
//     title: "Incident Time",
//     dataIndex: "created_at",
//     render: (text) => (
//       <span className="text-nowrap">{transformDateAndTime(text)}</span>
//     ),
//   },
//   {
//     title: "Closed At",
//     dataIndex: "closed_at",
//     render: (text) => (
//       <span className="text-nowrap">{transformDateAndTime(text)}</span>
//     ),
//   },
//   {
//     title: "Alert Life",
//     dataIndex: "closed_at",
//     render: (text) => (
//       <span className="text-nowrap">
//         {transformDateAndTimeToDuration(text)}
//       </span>
//     ),
//   },
//   {
//     title: "Alert Status",
//     dataIndex: "status",
//     render: (text) => (
//       <span className="text-nowrap">
//         {text == 0 ? "True Alert" : "False Alert"}
//       </span>
//     ),
//   },
//   {
//     title: "Closed By",
//     render: (row) => {
//       switch (row.closed_by_role) {
//         case "super_admin":
//           return (
//             <span className="text-nowrap">{row.closed_by} (Super Admin)</span>
//           );
//         case "end_user":
//           return (
//             <span className="text-nowrap">{row.closed_by} (End User)</span>
//           );
//         case "supports_agent":
//           return (
//             <span className="text-nowrap">
//               {row.closed_by} (Supports Agent)
//             </span>
//           );
//         case "nurse":
//           return <span className="text-nowrap">{row.closed_by} (Nurse)</span>;
//         case "nursing_home":
//           return (
//             <span className="text-nowrap">{row.closed_by} (Nursing Home)</span>
//           );
//         default:
//           return (
//             <span className="text-nowrap">
//               {row.closed_by} ({row.closed_by_role} )
//             </span>
//           );
//       }
//     },
//   },
//   {
//     title: "Alert Comments",
//     render: (row) => (
//       <LargeTextViewerModal data={row.comment} title="Alert Comments" />
//     ),
//   },
//   {
//     title: "Address",
//     width: "230px",
//     render: (row) => (
//       <span className="!w-[230px] text-nowrap">{row.address}</span>
//     ),
//   },
//   // {
//   //   title: "Alert Lifespan",
//   //   dataIndex: "alertLifespan",
//   //   render: (data) => <LifespanTimeline data={data} />,
//   // },
// ];
