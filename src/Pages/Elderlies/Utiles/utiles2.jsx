import { useEffect, useState } from 'react';
import Elderly from '@/Components/NameCol/Elderly';
import { LuNavigation } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import ls from 'store2';
import { AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';
import { Button, Space } from 'antd';
import ElderlyAction from '@/Components/ActionManu/ElderlyAction';
export default function useElderlyTableColumns(role) {
  const navigate = useNavigate();
  const user_role = JSON.parse(localStorage.getItem('user'))?.role;

  const randomId = Math.floor(Math.random() * 1000000);
  const handleViewClick = (row) => {
    window.scrollTo(0, 0);
    navigate(`/supporter/elderlies/elderly-profile/${row?._id}`);
  };
  const elderlyTableColsMapping = {
    support_agent: ['elderlyName', 'activeAlert', 'allergies', 'diseases', 'viewProfile'],
    nurse: [
      'elderlyName',
      'activeAlert',
      'allergies',
      'diseases',
      'medications',
      // "viewOnMap",
      'viewProfile',
    ],
    end_user: ['elderlyName', 'activeAlert', 'allergies', 'diseases', 'medications', 'viewProfile'],
  };
  const elderlyTableColumns = {
    elderlyName: {
      title: () => {
        switch (user_role) {
          case 'nurse':
            return 'Resident Name';
          default:
            return 'User Name';
        }
      },
      render: (row) => <Elderly onClick={() => handleViewClick(row)} data={row} />,
    },
    roomName: {
      title: 'Room Name',
      dataIndex: 'roomName',
      render: (text) => <span>{text}</span>,
    },
    activeAlert: {
      title: 'Active Fall Alerts',
      dataIndex: 'unresolved_alarm_count',
      render: (text) => <span>{text}</span>,
    },
    address: {
      title: 'Address',
      width: '230px',
      render: (row) => <span className='!w-[230px] text-nowrap'>{row.address}</span>,
    },
    allergies: {
      title: 'Comments',
      render: (row) => (
        <span>{row?.comments?.map((comment) => comment.comment).join(', ') || 'N/A'}</span>
      ),
    },

    diseases: {
      title: 'Conditions',
      render: (row) => <span>{row?.diseases?.map((d) => d).join(', ') || 'N/A'}</span>,
    },
    medications: {
      title: 'Daily Routine',
      render: (row) => <span>{row.medications?.map((d) => d.name).join(', ')}</span>,
    },
    viewOnMap: {
      title: 'View On Map',
      render: (row) => (
        <span className='flex items-center transition-all duration-300 justify-start gap-2 text-sm font-medium text-text-primary hover:text-primary cursor-pointer p-2 rounded-md w-fit text-center hover:bg-slate-100'>
          <div className='flex items-center gap-2'>
            <a
              href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-base font-medium !text-blue-500'
            >
              View on Map
            </a>
            <LuNavigation size={18} className='text-blue-500' />
          </div>
        </span>
      ),
    },
    viewProfile: {
      title: 'Actions',
      render: (row) => <ElderlyAction row={row} />,
    },
  };

  const [elderlyTableColumn, setElderlyTableColumns] = useState([]);
  useEffect(() => {
    console.log('Current role:');
    console.log('Available roles:', Object.keys(elderlyTableColsMapping));
    if (role === 'support_agent') {
      const cols = elderlyTableColsMapping.support_agent.map((col) => {
        return elderlyTableColumns[col];
      });
      setElderlyTableColumns(cols);
    } else if (role === 'nurse') {
      const cols = elderlyTableColsMapping.nurse.map((col) => {
        return elderlyTableColumns[col];
      });
      setElderlyTableColumns(cols);
    } else if (role === 'end_user') {
      const cols = elderlyTableColsMapping.end_user.map((col) => {
        return elderlyTableColumns[col];
      });
      setElderlyTableColumns(cols);
    } else {
      setElderlyTableColumns([]);
    }
  }, []);
  return elderlyTableColumn;
}

export { useElderlyTableColumns };
