import { FiUser, FiUsers } from 'react-icons/fi';
import {
  MdOutlineRealEstateAgent,
  MdOutlineSupportAgent,
  MdOutlineAddHome,
  MdOutlineElderly,
  MdOutlineHomeRepairService,
} from 'react-icons/md';
import { RiPhoneFindLine, RiHospitalLine } from 'react-icons/ri';
import { IoLogoAppleAr } from 'react-icons/io5';
import { LuMonitorDot } from 'react-icons/lu';
export const CountMapping = [
  {
    role: 'monitoring_agency',
    labelKey: 'roles.monitoring_stations',
    tab: 'Monitoring Stations',
    color: '#5096F6',
    icon: LuMonitorDot,
  },
  {
    role: 'distributor',
    labelKey: 'roles.distributors',
    tab: 'Distributors',
    color: '#FA8035',
    icon: IoLogoAppleAr,
  },
  {
    role: 'office',
    labelKey: 'roles.offices',
    tab: 'Offices',
    color: '#D188E1',
    icon: MdOutlineRealEstateAgent,
  },
  {
    role: 'sales_agent',
    labelKey: 'roles.sales_agents',
    tab: 'Sales Agents',
    color: '#9C27B0',
    icon: MdOutlineHomeRepairService,
  },
  {
    role: 'nursing_home',
    labelKey: 'roles.nursing_homes',
    tab: 'Nursing Homes',
    color: '#3F51B5',
    icon: RiHospitalLine,
  },
  {
    role: 'nurse',
    labelKey: 'roles.nurses',
    tab: 'Nurses',
    color: '#F3C623',
    icon: MdOutlineElderly,
  },
  {
    role: 'monitoring_station',
    labelKey: 'roles.control_centers',
    tab: 'Control Centers',
    color: '#EA5A92',
    icon: RiPhoneFindLine,
  },
  {
    role: 'installer',
    labelKey: 'roles.installers',
    tab: 'Installers',
    color: '#4CAF50',
    icon: MdOutlineAddHome,
  },
  {
    role: 'supports_agent',
    labelKey: 'roles.support_agents',
    tab: 'Support Agents',
    color: '#17C3A5',
    icon: MdOutlineSupportAgent,
  },
  {
    role: 'end_user',
    labelKey: 'roles.end_users',
    tab: 'End Users',
    color: '#7DBBE2',
    icon: FiUser,
  },
  {
    role: 'elderly',
    labelKey: 'roles.users',
    tab: 'Users',
    color: '#E91E63',
    icon: FiUsers,
  },
];
