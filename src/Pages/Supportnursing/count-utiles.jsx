import { FiUser } from 'react-icons/fi';
import { MdOutlineRealEstateAgent } from 'react-icons/md';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { RiPhoneFindLine } from 'react-icons/ri';
import { MdOutlineAddHome } from 'react-icons/md';
import { IoLogoAppleAr } from 'react-icons/io5';
import { MdOutlineElderly } from 'react-icons/md';
import { PiBuildingOffice } from 'react-icons/pi';
import { BiDevices } from 'react-icons/bi';

export const CountMapping = [
  {
    role: 'monitoring_station',
    label: 'Control Center',
    color: '#EA5A92',
    icon: RiPhoneFindLine,
    rolesAllowed: ['sales_agent', 'distributor', 'office'],
  },
  {
    role: 'supports_agent',
    label: 'Support Agent',
    color: '#17C3A5',
    icon: MdOutlineSupportAgent,
    rolesAllowed: ['sales_agent', 'supports_agent', 'monitoring_station'],
  },
  {
    role: 'nursing_home',
    label: 'Nursing Home',
    color: '#5096F6',
    icon: MdOutlineAddHome,
    rolesAllowed: ['sales_agent', 'distributor', 'office'],
  },
  {
    role: 'distributor',
    label: 'Distributor',
    color: '#FA8035',
    icon: IoLogoAppleAr,
    rolesAllowed: [],
  },
  {
    role: 'sales_agent',
    label: 'Sales Agent',
    color: '#D188E1',
    icon: MdOutlineRealEstateAgent,
    rolesAllowed: ['distributor', 'office'],
  },
  {
    role: 'end_user',
    label: 'End User',
    color: '#7DBBE2',
    icon: FiUser,
    rolesAllowed: ['sales_agent', 'distributor', 'office'],
  },
  {
    role: 'installer',
    label: 'Installer',
    color: '#7695FF',
    icon: FiUser,
    rolesAllowed: ['monitoring_station', 'office', 'sales_agent'],
  },
  {
    role: 'elderly',
    label: 'Elderly',
    color: '#FF885B',
    icon: MdOutlineElderly,
    rolesAllowed: ['monitoring_station'],
  },
  {
    role: 'office',
    label: 'Office',
    color: '#FF885B',
    icon: PiBuildingOffice,
    rolesAllowed: [''],
  },
  {
    role: 'device',
    label: 'Device',
    color: '#FF885B',
    icon: BiDevices,
    rolesAllowed: [],
  },
];
