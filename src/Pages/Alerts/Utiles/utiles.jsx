import { useEffect, useState } from 'react';
import Elderly from '@/Components/NameCol/Elderly';
import LargeTextViewerModal from '@/Components/LargeTextViewerModal/LargeTextViewerModal';
import { LuNavigation } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
export default function useElderlyTableColumns(role) {
  const navigate = useNavigate(); // Initialize the navigate function

  const randomId = Math.floor(Math.random() * 1000000);
  const handleViewClick = (row) => {
    window.scrollTo(0, 0);
    navigate(`/supporter/elderlies/elderly-profile/${randomId}?tab=overview`); // Navigate to the profile page with the ID
  };
  const elderlyTableColsMapping = {
    support_agent: [
      'elderlyName',
      'activeAlert',
      'allergies',
      'diseases',
      'medications',
      'viewOnMap',
    ],
    nurse: ['elderlyName', 'activeAlert', 'allergies', 'diseases', 'medications', 'viewOnMap'],
    end_user: ['elderlyName', 'activeAlert', 'allergies', 'diseases', 'medications', 'viewOnMap'],
  };
  const elderlyTableColumns = {
    elderlyName: {
      title: 'Elderly Name',
      render: (row) => <Elderly onClick={() => handleViewClick(row)} data={row} />,
    },
    roomName: {
      title: 'Room Name',
      dataIndex: 'roomName',
      render: (text) => <span>{text}</span>,
    },
    activeAlert: {
      title: 'Active Alert',
      dataIndex: 'activeAlert',
      render: (text) => <span>{text}</span>,
    },
    address: {
      title: 'Address',
      width: '230px',
      render: (row) => <span className='!w-[230px] text-nowrap'>{row.address}</span>,
    },
    allergies: {
      title: 'Allergies',
      dataIndex: 'allergies',
      render: (text) => <span>{text}</span>,
    },
    diseases: {
      title: 'Diseases',
      dataIndex: 'diseases',
      render: (text) => <span>{text}</span>,
    },
    medications: {
      title: 'Medications',
      dataIndex: 'medications',
      render: (text) => <span>{text}</span>,
    },
    viewOnMap: {
      title: 'View On Map',
      render: (row) => (
        <span className='flex items-center transition-all duration-300 justify-start gap-2 text-sm font-medium text-text-primary hover:text-primary cursor-pointer p-2 rounded-md w-fit text-center hover:bg-slate-100'>
          <div className='flex items-center gap-2'>
            <a
              href={`https://www.google.com/maps?q=${row.lat},${row.lng}`}
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
