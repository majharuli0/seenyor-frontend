import { NavLink, useParams } from 'react-router-dom';

import { useTable } from '@/MonitoringService/Context/TableContext';
import { getResponseTime } from '@/utils/helper';

import AlarmAction from '../Components/common/actions/alarmAction';
import AlarmName from '../Components/common/alarmName';
import UserName from '../Components/common/userName';
import { Button } from '../Components/ui/button';

const fieldConfigs = {
  name: {
    header: 'Name',
    render: (value) => <span className='font-medium'>{value}</span>,
  },
  user_name: {
    header: 'Customer',
    render: (value, row) => <UserName data={row} />,
  },
  alarm: {
    header: 'Alarm',
    render: (value, row, action) => <AlarmName alert={row} subTitle={row?.elderly_name} />,
  },
  address: {
    header: 'Address',
    render: (value) => <span className='text-text/80'>{value}</span>,
  },
  monitoring_agent_role_name: {
    header: 'Role',
    render: (value, row, action) => (
      <span className='text-text/80'>{row?.monitoring_agent_role_name || 'N/A'}</span>
    ),
  },
  device_count: {
    header: 'Devices',
    render: (value, row) => (
      <span className='text-text/80'>{row?.offline_device_count + row?.online_device_count}</span>
    ),
  },
  performance: {
    header: 'Performance',
    render: (value, row) => <span className='text-text/80'>99%</span>,
  },
  medical_note: {
    header: 'Notes ',
    render: (value, row) => (
      <span className='text-text/80 '>
        {row?.comments
          ?.filter((item) => item.category === 'Custom Text' && item.comment)
          ?.map((item) => item.comment)
          .join(', ') || 'N/A'}
      </span>
    ),
  },
  note: {
    header: 'Note',
    render: (value, row) => <span className='text-text/80 '>{row?.note || 'N/A'}</span>,
  },
  shift: {
    header: 'Shift',
    render: (value, row) => {
      const formatTo12Hour = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        let h = parseInt(hours, 10);
        const m = minutes || '00';
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12; // the hour '0' should be '12'
        return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
      };

      if (row.shift_start && row.shift_end) {
        return (
          <span className='text-text/80'>
            {formatTo12Hour(row.shift_start)} - {formatTo12Hour(row.shift_end)}
          </span>
        );
      }
      return <span className='text-text/80'>N/A</span>;
    },
  },
  contact_pr_nu: {
    header: 'Contacts Person',
    render: (value, row) => (
      <span className='text-text/80 flex flex-col'>
        <h1 className='text-sm text-text'>
          {`${row?.end_user_frist_name}  ${
            row?.end_user_last_name ? row?.end_user_last_name : ''
          }` || 'N/A'}
        </h1>
        <span className='text-xs'>
          {`${row?.end_user_contact_code}  ${row?.end_user_contact_number}`}
        </span>
      </span>
    ),
  },
  last_login: {
    header: 'Last Login',
    render: (value, row) => {
      const lastSession = row?.sessions?.[row.sessions.length - 1];

      return (
        <span className='text-text/80 flex flex-col'>
          <h1
            className={`text-sm font-semibold ${
              lastSession?.loggedInAt && lastSession?.isLoggedOut !== true
                ? 'text-success'
                : 'text-destructive'
            }`}
          >
            {lastSession?.loggedInAt && lastSession?.isLoggedOut !== true ? 'Online' : 'Offline'}
          </h1>
          <span className='text-xs'>
            {lastSession?.loggedInAt
              ? new Date(lastSession.loggedInAt).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : 'Not Logged Yet'}
          </span>
        </span>
      );
    },
  },

  resolved_date: {
    header: 'Date',
    render: (value, row) => {
      const date = row?.created_at ? new Date(row?.created_at) : null;

      const formatTime = date
        ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(
            2,
            '0'
          )}:${String(date.getSeconds()).padStart(2, '0')}`
        : '--:--:--';

      const formatDate = date
        ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(
            2,
            '0'
          )}/${date.getFullYear()}`
        : '--/--/----';

      return (
        <span className='text-text/80 flex flex-col'>
          <h1 className='text-sm'>{formatTime}</h1>
          <span className='text-xs'>{formatDate}</span>
        </span>
      );
    },
  },
  reponse_time: {
    header: 'Response Time',
    render: (value, row) => (
      <span className='text-text/80'>{getResponseTime(row?.created_at, row?.closed_at)}</span>
    ),
  },
  resolved_by: {
    header: 'Resolved By',
    render: (value, row) => <span className='text-text/80'>{row?.closed_by}</span>,
  },
  alarm_status: {
    header: 'Alarm Status',
    render: (value, row) => (
      <span className='text-text/80'>{row?.status ? 'True Alarm' : 'False Alarm'}</span>
    ),
  },
  res_alarm_status: {
    header: 'Status',
    render: (value, row) => <span className='text-text/80'>{row?.status ? 'True' : 'False'}</span>,
  },
  status: {
    header: 'Status',
    render: (value, row) => (
      <span className='text-text/80'>{row?.soft_deleted ? 'Suspended' : 'Active'}</span>
    ),
  },
  priority: {
    header: 'Priority',
    render: (value, row, actions) => {
      const getPriorityClass = (priority) => {
        switch (priority) {
          case 1:
            return 'text-red-500 cursor-pointer';
          case 0:
            return 'text-orange-400 cursor-pointer';
          default:
            return 'text-green-500 cursor-pointer';
        }
      };

      return (
        <span
          onClick={() => {
            // actions?.fetchData?.();
          }}
          className={getPriorityClass(row?.highest_priority)}
        >
          {row?.highest_priority == 1 ? 'High' : row?.highest_priority == -1 ? 'Low' : 'Medium'}
        </span>
      );
    },
  },
  action: {
    header: 'Action',
    render: (value, row, actions) => (
      <ViewDetailsBtn row={row} action={actions} value={value} actionFor={'customer'} />
    ),
  },
  role_manag_action: {
    header: 'Action',
    render: (value, row, actions) => (
      <ViewDetailsBtn row={row} action={actions} value={value} actionFor={'role_managment'} />
    ),
  },
  alarm_action: {
    header: ' ',
    render: (value, row, actions) => <AlarmAction actions={actions} data={row} />,
  },
};

const entityFields = {
  customer: [
    'user_name',
    'address',
    'contact_pr_nu',
    'medical_note',
    'device_count',
    'priority',
    'action',
  ],
  role_managment: [
    'user_name',
    'monitoring_agent_role_name',
    'shift',
    'last_login',
    'note',
    'status',
    'role_manag_action',
  ],
  office: ['name', 'address', 'action'],
  distributor: ['name', 'address', 'action'],
  prev_alerts: ['alarm', 'reponse_time', 'resolved_by', 'alarm_status', 'alarm_action'],
  resolved_alerts: ['alarm', 'resolved_date', 'reponse_time', 'res_alarm_status', 'alarm_action'],
};

export function useColumns(entityName) {
  const { actions } = useTable();
  const keys = entityFields[entityName] || [];

  return keys.map((key) => {
    const field = fieldConfigs[key];

    if (!field) {
      return {
        key,
        header: key.replace(/_/g, ' ').toUpperCase(),
        render: (value, row) => <span className='text-text/80'>N/A</span>,
      };
    }

    return {
      key,
      header: field.header || key.replace(/_/g, ' ').toUpperCase(),
      render: (value, row) => {
        try {
          const result = field.render?.(value, row, actions);
          return result ?? <span className='text-text/80'>N/A</span>;
        } catch (err) {
          console.error(`Error rendering field "${key}":`, err);
          return <span className='text-text/80'>N/A</span>;
        }
      },
    };
  });
}

const ViewDetailsBtn = ({ value, row, action, actionFor = 'customer' }) => {
  const { type, id } = useParams();
  return (
    <>
      {actionFor == 'customer' && (
        <NavLink to={`/ms/customers/${type}/${row?._id}`}>
          <Button
            size='sm'
            onClick={() => {
              // action?.fetchData?.();
              // action?.deleteRow?.(row);
            }}
          >
            View Profile
          </Button>
        </NavLink>
      )}
      {actionFor == 'role_managment' && (
        <NavLink to={`/ms/role-managment/${row?._id}`}>
          <Button
            size='sm'
            onClick={() => {
              // action?.fetchData?.();
              // action?.deleteRow?.(row);
            }}
          >
            View Details
          </Button>
        </NavLink>
      )}
    </>
  );
};
