// Role field mapping for form validation and filtering
import { isValidPhoneNumber,parsePhoneNumber } from 'libphonenumber-js';
export const roleFieldMapping = {
  office: [
    'name',
    'address',
    'email',
    'contact_number',
    'contact_code',
    'contact_person',
    'password',
    'parent_id',
  ],
  elderly: ['name', 'address', 'contact_number', 'contact_code', 'room_no', 'age', 'gender'],
  sales_agent: [
    'name',
    'last_name',
    'address',
    'email',
    'password',
    'contact_number',
    'contact_code',
    'parent_id',
  ],
  nursing_home: [
    'name',
    'address',
    'email',
    'password',
    'contact_person',
    'contact_number',
    'contact_code',
    'parent_id',
  ],
  monitoring_station: [
    'name',
    'address',
    'email',
    'password',
    'contact_number',
    'contact_code',
    'contact_person',
    'parent_id',
  ],
  monitoring_agency: ['name', 'address', 'email', 'password', 'contact_number', 'contact_code'],
  installer: [
    'name',
    'last_name',
    'address',
    'email',
    'password',
    'contact_number',
    'contact_code',
    'parent_id',
  ],
  supports_agent: [
    'name',
    'last_name',
    'email',
    'password',
    'contact_number',
    'contact_code',
    'address',
    'parent_id',
  ],
  nurse: [
    'name',
    'last_name',
    'email',
    'address',
    'password',
    'contact_number',
    'parent_id',
    'contact_code',
  ],
  monitoring_agent: [
    'name',
    'last_name',
    'email',
    'address',
    'password',
    'contact_number',
    'parent_id',
    'contact_code',
  ],
  end_user: [
    'name',
    'last_name',
    'email',
    'address',
    'password',
    'contact_number',
    'contact_code',
    'agent_id',
    'subscription_id',
  ],
  distributor: [
    'name',
    'address',
    'email',
    'contact_number',
    'contact_code',
    'contact_person',
    'password',
  ],
  super_admin: [
    'name',
    'last_name',
    'email',
    'contact_number',
    'contact_code',
    'address',
    'password',
    'country_id',
  ],
};

// Field to role mapping for conditional rendering
export const fieldRoleMapping = {
  firstName: ['Super Admin', 'Support Agent'],
  lastName: ['Super Admin', 'Support Agent'],
  nursingHomeId: ['Support Agent'],
  supportAgentCode: ['end_user'],
  subscriptionId: ['end_user'],
  businessName: ['Distributor'],
  businessEmail: ['Distributor'],
  businessAddress: ['Distributor'],
  contactPerson: [
    'distributor',
    'Nursing Home',
    'Elderly',
    'office',
    'nursing_home',
    'monitoring_station',
  ],
  name: [
    'distributor',
    'super_admin',
    'nursing_home',
    'End Users',
    'elderly',
    'office',
    'sales_agent',
    'monitoring_station',
    'monitoring_agency',
    'installer',
    'supports_agent',
    'nurse',
    'monitoring_agent',
    'end_user',
  ],
  last_name: [
    'super_admin',
    'sales_agent',
    'Support Agent',
    'installer',
    'supports_agent',
    'nurse',
    'monitoring_agent',
    'end_user',
  ],
  email: [
    'distributor',
    'super_admin',
    'sales_agent',
    'Super Admin',
    'Support Agent',
    'nursing_home',
    'monitoring_agency',
    'office',
    'monitoring_station',
    'installer',
    'supports_agent',
    'nurse',
    'monitoring_agent',
    'end_user',
  ],
  phoneNumber: [
    'distributor',
    'super_admin',
    'office',
    'sales_agent',
    'nursing_home',
    'monitoring_station',
    'installer',
    'supports_agent',
    'elderly',
    'nurse',
    'monitoring_agent',
    'monitoring_agency',
    'end_user',
  ],
  location: ['super_admin'],
  selectOffice: ['sales_agent'],
  age: ['elderly'],
  gender: ['elderly'],
  room_no: ['elderly'],
  address: [
    'Nursing Home',
    'office',
    'sales_agent',
    'monitoring_agency',
    'nursing_home',
    'monitoring_station',
    'installer',
    'end_user',
    'distributor',
    'elderly',
    'nurse',
    'monitoring_agent',
    'supports_agent',
    'super_admin',
  ],
  password: [
    'office',
    'sales_agent',
    'nursing_home',
    'monitoring_station',
    'installer',
    'supports_agent',
    'monitoring_agency',
    'nurse',
    'monitoring_agent',
    'end_user',
    'super_admin',
    'distributor',
  ],
  selectDistributor: ['office'],
  selectMonitoringStation: ['installer', 'supports_agent'],
  selectAgent: ['nursing_home', 'monitoring_station'],
  selectInstaller: [],
};

// Helper function to get role label for display
export const getRoleLabel = (role) => {
  switch (role) {
    case 'Distributor':
      return 'Distributor';
    case 'office':
      return 'Office';
    case 'monitoring_station':
      return 'Control Center';
    case 'monitoring_agency':
      return 'Monitoring Station';
    case 'distributor':
      return 'Distributor';
    case 'nursing_home':
      return 'Nursing Home';
    case 'elderly':
      return 'User';
    default:
      return 'First';
  }
};

// Helper function to get role message for validation
export const getRoleMessage = (role) => {
  switch (role) {
    case 'Distributor':
      return 'distributor';
    case 'office':
      return 'office';
    default:
      return 'nursing home';
  }
};

// Helper function to get modal title and button text
export const getModalConfig = (role, isEmptyObjectFn, item, isOwnEditModal) => {
  if (isOwnEditModal) {
    return {
      title: 'Edit Profile',
      okbtn: 'Save',
    };
  }

  const roleConfigs = {
    Distributor: {
      create: { title: 'Create Distributor', okbtn: 'Create Distributor' },
      edit: { title: 'Edit Distributor', okbtn: 'Save' },
    },
    nursing_home: {
      create: { title: 'Create Nursing Home', okbtn: 'Create Nursing Home' },
      edit: { title: 'Edit Nursing Home', okbtn: 'Save' },
    },
    sales_agent: {
      create: { title: 'Create Sales Agent', okbtn: 'Create Sales Agent' },
      edit: { title: 'Edit Sales Agent', okbtn: 'Save' },
    },
    'End Users': {
      create: { title: 'Create End Users', okbtn: 'Create End Users' },
      edit: { title: 'Edit End Users', okbtn: 'Save' },
    },
    'Super Admin': {
      create: { title: 'Create Super Admin', okbtn: 'Create Super Admin' },
      edit: { title: 'Edit Super Admin', okbtn: 'Save' },
    },
    supports_agent: {
      create: { title: 'Create Support Agent', okbtn: 'Create Support Agent' },
      edit: { title: 'Edit Support Agent', okbtn: 'Save' },
    },
    Elderly: {
      create: { title: 'Create Elderly', okbtn: 'Create Elderly' },
      edit: { title: 'Edit Elderly', okbtn: 'Save' },
    },
    office: {
      create: { title: 'Create Office', okbtn: 'Create Office' },
      edit: { title: 'Edit Office', okbtn: 'Save' },
    },
    nurse: {
      create: { title: 'Create Nurse', okbtn: 'Create Nurse' },
      edit: { title: 'Edit Nurse', okbtn: 'Save' },
    },
    monitoring_station: {
      create: {
        title: 'Create Control Center',
        okbtn: 'Create Control Center',
      },
      edit: { title: 'Edit Control Center', okbtn: 'Save' },
    },
    monitoring_agency: {
      create: {
        title: 'Create Monitoring Station',
        okbtn: 'Create Monitoring Station',
      },
      edit: { title: 'Edit Monitoring Station', okbtn: 'Save' },
    },
    installer: {
      create: { title: 'Create Installer', okbtn: 'Create Installer' },
      edit: { title: 'Edit Installer', okbtn: 'Save' },
    },
    end_user: {
      create: { title: 'Create End User', okbtn: 'Create End User' },
      edit: { title: 'Edit End User', okbtn: 'Save' },
    },
    super_admin: {
      create: { title: 'Create Super Admin', okbtn: 'Create Super Admin' },
      edit: { title: 'Edit Super Admin', okbtn: 'Save' },
    },
    distributor: {
      create: { title: 'Create Distributor', okbtn: 'Create Distributor' },
      edit: { title: 'Edit Distributor', okbtn: 'Save' },
    },
    elderly: {
      create: { title: 'Create User', okbtn: 'Create User' },
      edit: { title: 'Edit User Details', okbtn: 'Save' },
    },
  };

  const config = roleConfigs[role];
  if (!config) {
    return { title: 'Create User', okbtn: 'Create User' };
  }

  return isEmptyObjectFn(item) ? config.create : config.edit;
};

// Helper function to filter data based on role
export const filterDataByRole = (data, role) => {
  const allowedFields = roleFieldMapping[role] || [];
  return Object.fromEntries(Object.entries(data).filter(([key]) => allowedFields.includes(key)));
};

export const getDefaultFormValues = (item = {}) => ({
  firstName: item?.firstName,
  lastName: item?.lastName,
  businessEmail: item?.email,
  businessName: item?.businessName,
  businessAddress: item?.businessAdress,
  contactPerson: item?.contactPerson,
  contactNumber: item?.contactNumber,
  name: item?.name,
  last_name: item?.last_name,
  email: item?.email,
  country_id: item?.country_id,
  contact_number: item?.contact_number,
  contact_person: item?.contact_person,
  address: item?.address,
  office_id: item?.office_id,
  agent_id: item?.agent_id,
  distributor_id: item?.distributor_id,
  monitoring_station_id: item?.monitoring_station_id,
  installer_id: item?.installer_id,
  managerName: item?.managerName,
  parent_id: item?.parent_id,
  contact_code: item?.contact_code,
});

export const passwordValidationRules = {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
  validate: {
    hasNumber: (value) => /[0-9]/.test(value) || 'Password must contain at least one number',
    hasUpperCase: (value) =>
      /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
    hasSpecialChar: (value) =>
      /[!@#$%^&*]/.test(value) || 'Password must contain at least one special character',
  },
};

export const phoneValidationRules = (getValues) => ({
  contact_code: { required: 'Country code is required' },
  contact_number: {
    required: 'Phone number is required',
    validate: (value) => {
      const countryCode = getValues('contact_code');
      if (!value || !countryCode) {
        return 'Phone number and country code are required';
      }

      try {
        const fullNumber = `+${countryCode}${value}`;

        if (!isValidPhoneNumber(fullNumber)) {
          return 'Please enter a valid phone number';
        }

        const parsed = parsePhoneNumber(fullNumber);
        if (!parsed || !parsed.isValid()) {
          return 'Invalid phone number for selected country';
        }

        return true; // all good
      } catch {
        return 'Invalid phone number';
      }
    },
  },
});
